<?php

class TicTT
{
	public $player = "X";			
	public $board = array();		
	public $totalMoves = 0;		

 	public function __construct()
    {      
    }

    function newGame()
	{	
		//reset the player
		$this->player = "X";
		$this->totalMoves = 0;
        $this->newBoard();
	}

	function newBoard() 
	{
        //clear out the board
		$this->board = array();
        
        //create the board
        for ($x = 0; $x <= 2; $x++)
        {
            for ($y = 0; $y <= 2; $y++)
            {
                $this->board[$x][$y] = null;
            }
        }
    }


	function move($gamedata)
	{			
		if ($this->isOver())
			return;

		$move = $gamedata->message;	
					
		if ($this->player == $gamedata->mark) {
			//update the board in that position with the player's X or O 
			$this->board[$move['row']][$move['col']] = $gamedata->mark;

			$this->totalMoves++;

			if ($this->isOver() && $this->isOver() != "Tie") {
				return "Congratulations, '{$this->player}' won the game!";
			} else if ($this->isOver() == "Tie") {
					return "Tie game. Try again!";
			}

			if ($gamedata->mark == "X") {
				$this->player = "O";
			}
			else {
				$this->player = "X";
			}
			
		} else {
			return -1; //not his tur
		}

		return false;
	}
	

	function isOver()
	{
		
		//top row
		if ($this->board[0][0] && $this->board[0][0] == $this->board[0][1] && $this->board[0][1] == $this->board[0][2])
			return $this->board[0][0];
			
		//middle row
		if ($this->board[1][0] && $this->board[1][0] == $this->board[1][1] && $this->board[1][1] == $this->board[1][2])
			return $this->board[1][0];
			
		//bottom row
		if ($this->board[2][0] && $this->board[2][0] == $this->board[2][1] && $this->board[2][1] == $this->board[2][2])
			return $this->board[2][0];
			
		//first column
		if ($this->board[0][0] && $this->board[0][0] == $this->board[1][0] && $this->board[1][0] == $this->board[2][0])
			return $this->board[0][0];
			
		//second column
		if ($this->board[0][1] && $this->board[0][1] == $this->board[1][1] && $this->board[1][1] == $this->board[2][1])
			return $this->board[0][1];
			
		//third column
		if ($this->board[0][2] && $this->board[0][2] == $this->board[1][2] && $this->board[1][2] == $this->board[2][2])
			return $this->board[0][2];
			
		//diagonal 1
		if ($this->board[0][0] && $this->board[0][0] == $this->board[1][1] && $this->board[1][1] == $this->board[2][2])
			return $this->board[0][0];
			
		//diagonal 2
		if ($this->board[0][2] && $this->board[0][2] == $this->board[1][1] && $this->board[1][1] == $this->board[2][0])
			return $this->board[0][2];
			
		if ($this->totalMoves >= 9)
			return "Tie";
	}
}