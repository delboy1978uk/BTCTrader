#BTCTrader
[![Build Status](https://travis-ci.org/delboy1978uk/BTCTrader.png?branch=master)](https://travis-ci.org/delboy1978uk/BTCTrader) [![Code Coverage](https://scrutinizer-ci.com/g/delboy1978uk/btctrader/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/delboy1978uk/btctrader/?branch=master) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/delboy1978uk/btctrader/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/delboy1978uk/btctrader/?branch=master) master<br />
[![Build Status](https://travis-ci.org/delboy1978uk/BTCTrader.png?branch=dev-master)](https://travis-ci.org/delboy1978uk/BTCTrader) [![Code Coverage](https://scrutinizer-ci.com/g/delboy1978uk/btctrader/badges/coverage.png?b=dev-master)](https://scrutinizer-ci.com/g/delboy1978uk/btctrader/?branch=dev-master) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/delboy1978uk/btctrader/badges/quality-score.png?b=dev-master)](https://scrutinizer-ci.com/g/delboy1978uk/btctrader/?branch=dev-master) dev-master

A Bitcoin trading platform for various exchanges written in PHP and Javascript.

##Requirements
You must have a trading account with a Bitcoin exchange, and a PHP environment on your computer. If you don't have a
PHP environment, download and install VirtualBox and Vagrant.

##Installation
If you already have a PHP environment, add a vhost for your/path/public, and install using composer:
```
composer create-project delboy1978uk/btctrader your/path/here dev-master<br />
```
Next set up your config/config.php with your Connection details for each exchange you want to use. <br />
Finally head to http://your-vhost.whatever/ to run.
If you don't have a PHP environment, install Vagrant, install VirtualBox, then do the following:
```
git clone https://github.com/delboy1978uk/btctrader /your/path/here
cd /your/path/here
vagrant up
```
Edit /etc/hosts (or C:\windows\system32\drivers\etc\hosts) and add
```
192.168.56.101 btctrader
```
Finally, open a browser and head to http://btctrader to start trading!

##How to use the trading panel
More instructions as I add stuff


