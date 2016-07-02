<?php

namespace App\Controller;

use Bone\Mvc\Controller;
use Del\Cdn;


class IndexController extends Controller
{
    public function init()
    {
        // HTML Head variables
        $this->view->css = Cdn::delCssLink();
        $this->view->bscss = Cdn::bootstrapCssLink();
        $this->view->uicss = Cdn::jQueryUiCssLink();
        $this->view->jquery = Cdn::jQueryJavascript();
        $this->view->jqueryui = Cdn::jQueryUIJavascript();
        $this->view->bootstrap = Cdn::bootstrapJavascript();
        $this->view->title = 'BTCTrader';
    }

    public function indexAction()
    {

    }

    public function tradeAction()
    {
        $this->view->exchange = $this->getParam('exchange');
    }

    public function getInfoAction()
    {
        // example of a Json page
        $this->disableLayout();
        $this->disableView();
        $array = array(
          'Rum',
          'Grog'
        );
        $this->getHeaders()->setJsonResponse();
        $this->setBody(json_encode($array));
    }
}