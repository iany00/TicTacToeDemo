<?php
/**
 * Class Message hold the message send from user 
 * and serialize message send back to user
 */
class Message
{
    public $username;
    public $mark;
    public $message;
    public $action;
    public $startGame;
    public function __construct($username = '!', $mark = 'X', $message = 'message', $action = '', $start = false)
    {
        if (empty($mark)) {
            $mark = 'X';
        }
        $this->username  = $username;
        $this->mark      = $mark;
        $this->message   = $message;
        $this->action    = $action;
        $this->startGame = $start;
    }

    public function serialize()
    {
        return json_encode(array(
            'startGame'=> $this->startGame,
            'action'   => $this->action,
            'username' => $this->username, 
            'mark'     => $this->mark,
            'message'  => $this->message
        ));
    }

    public function unserialize($json_str, $userMark)
    {
        $data = json_decode($json_str, true);
        $this->username = $data['username'];
        $this->mark     = $userMark;
        $this->action   = $this->action;
        $this->startGame= true;
        $this->message  = $data['message'];
        return $this;
    }
}
