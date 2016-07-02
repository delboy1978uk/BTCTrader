<?php

/**
 *  We be feckin' around with t'configuration
 */
return [
    'routes' => [
        '/' => [
            'controller' => 'index',
            'action' => 'index',
            'params' => [],
        ],
        '/trade/:exchange' => [
            'controller' => 'index',
            'action' => 'trade',
            'params' => [],
        ],
    ],
    'db' => [
            'host' => '127.0.0.1',
            'database' => '',
            'user' => '',
            'pass' => ''
    ],
    'templates' => [
        'layout'
    ],
    'apis' => [
        'btce' => [
            'key' => 'RVM5ZT9O-NHT6HDM7-WRFNX7PA-MCK3ANWR-7GOSEW1S',
            'secret' => 'c2b110f94ed670f3948fbd05232000284478f6eb95e98aa624f91aab1052f883',
        ],
        'kraken' => [],
        'bitstamp' => [],
        'bitfinex' => [],
    ]
];