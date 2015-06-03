<?php
/**
 * Tic Tac Toe - SERVER CODE
 * -----------------------------------------
 * @Author : Ionut Airinei <ionut.n.airinei@gmail.com>
 * Copyright (c) 2015 Ionut Airinei
 */

require "PHP-Websockets/websockets.php";
require "Message.php";
require "TicTT.php";

class Server extends WebSocketServer
{
    private $_serverMessage;
    private $_startGame;
    private $_TicTacToe;

    public function __construct($addr, $port)
    {
        parent::__construct($addr, $port);
        $this->_serverMessage = new Message();
        $this->_TicTacToe = new TicTT();
        $this->_serverMessage->action = 'init';
        $this->_startGame     = false;
    }

    // @override
    protected function connected($user)
    {
        $countUsers = count($this->users);
       
        // Only 2 users can play
        if($countUsers > 2) {
            // TODO: send message: Board is full;
			// TODO: create server side user socket disconnect
            $this->closed($user);
            return false;
        }
        
        $mark = 'X';
        if($countUsers == 2) {
			// TODO: fix bug: mark set wrong when user is disconnected
			$this->_startGame = true;
			$mark = 'O';
        }
      
        $user->mark = $mark;

        $this->_serverMessage->mark = $mark;
        $this->_serverMessage->message = 'Connected to server';
        $this->send($user, $this->_serverMessage->serialize());

        if(!$this->_startGame) {
            $this->_serverMessage->message = "Searching for players...";
            $this->send($user, $this->_serverMessage->serialize());
        } else {
            $this->_serverMessage->message = "Start Game";
            $this->_serverMessage->startGame = $this->_startGame;
            $this->_serverMessage->action = 'startGame';
            $this->sendAll($this->_serverMessage);

            $this->_TicTacToe->newGame();
        }
    }

    // @override
    protected function process($user, $message)
    {
        // Send back message to everyone
		// TODO: find a new way to send actions to client side
        if( !$this->_startGame) {
           $message = new Message();
           $message->action  = 'init';
           $message->message = "Searching for players...";
           $this->send($user, $message->serialize());
        } else {
            $message = (new Message())->unserialize($message, $user->mark);
  
            if(isset($message->message['action']) && $message->message['action'] == 'newGame') {
                $this->_TicTacToe->newGame();
                $message->action = 'startGame';
                $this->sendAll($message);
                return;
            }

            $gameEnd = $this->_TicTacToe->move($message);
            if($gameEnd == -1) {
                return; // Not his turn
            }
            
            if($gameEnd) {
                $this->sendAll($message); // Send last move
                // Send end game winner
                $newMessage = new Message();
                $newMessage->message = $gameEnd;
                $newMessage->action = 'endGame';
                $this->sendAll($newMessage);
            } else {
                $this->sendAll($message);
            }
        }
    }

    // @override
    protected function closed($user)
    {
        if(count($this->users) < 2) {
           $this->_serverMessage->message = "Searching for players...";
           $this->_serverMessage->action = 'init';
           $this->sendAll($this->_serverMessage);
           $this->_startGame = false;
        }

        // Alert on server
        echo "User $user->id  closed connection".PHP_EOL;
        
        unset($user);
    }

    /**
     * Send Message to ALl Users
     */
    protected function sendAll(Message $message)
    {
        if (!empty($this->users)) {
            foreach ($this->users as $user) {
              $this->send($user, $message->serialize());
            }
        }
    }

    public function __destruct()
    {
        echo "Server destroyed!".PHP_EOL;
    }
}


$addr = 'localhost';
$port = '2000';

$server = new Server($addr, $port);
$server->run();
