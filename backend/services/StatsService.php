<?php

class StatsService {

    /**
     * @var MongoDB
     */
    private $db = null;
    public function __construct($db)
    {
        $this->db = $db;
    }
    
    public function versus($player1,$player2,$game = null)
    {
        $c = $this->db->selectCollection('events');

        $compare = [
            'matches.players.name' => array('$in' => array($player1,$player2))
        ];
        if(!is_null($game))
            $compare['matches.game'] = array('$eq' => $game);
        $result = $c->aggregate(
            array(
                array(
                    '$project' => array(
                        'matches' => 1
                    )
                ),
                array( '$match' => $compare),
            )
        );
        $matches = [];
        foreach ($result['result'] as $event) {
            foreach ($event['matches'] as $match) {
                $p1Found = false;
                $p2Found = false;
                $p1Obj = null;
                $p2Obj = null;
                foreach ($match['players'] as $player) {
                    if($player['name'] == $player1)
                        $p1Found = true;
                    if($player['name'] == $player2)
                        $p2Found = true;
                }
                if($p1Found && $p2Found) {
                    $matches[] = $match;
                }
            }
        }
        return $matches;
    }
}