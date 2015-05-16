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
    
    public function versus($player1,$player2)
    {
        $pipeline = array(
            array( '$match' => array( '_id' => '5557cc655eeb6b7c1b000035' )),
//            array( '$match' => array( 'matches.players.name' => array('$all' => array('my','dem'))))
        );

        $c = $this->db->selectCollection('events');
        $result = $c->aggregate(
            array(
                array(
                    '$project' => array(
                        'matches' => 1
                    )
                ),
                array( '$match' => array( 'matches.players.name' => array('$all' => array($player1,$player2)))),
                array(
                    '$project' => array(
                        'matches.players' => 1
                    )
                ),
                array( '$match' => array( 'matches.players.name' => array('$all' => array($player1,$player2))))

            )
        );
        var_dump($result);
    }
}