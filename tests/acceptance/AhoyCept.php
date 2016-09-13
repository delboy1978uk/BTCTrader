<?php

$I = new AcceptanceTester($scenario);
$I->wantTo("Make sure home page displays correctly");
$I->amOnPage('/');
$I->see('BTCTrader');
