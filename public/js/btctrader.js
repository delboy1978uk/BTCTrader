$(document).ready(function(){


    initialiseTradingPanel(true);

    /**
     * resets stuff for starting again
     */
    function initialiseTradingPanel(boxes){
        //set prices from btc-e
        $.get('api/get-info.php',{},function(ev){
            setBTCBalance(ev.return.funds.btc);
            setUSDBalance(ev.return.funds.usd);
            $.get('api/ticker.php',{},function(ev){
                setCurrentPrice(ev.ticker.last);

                //get balances
                var btc_balance = getBTCBalance();
                var usd_balance = getUSDBalance();
                var current_price = getCurrentPrice();

                //set sell boxes
                if(boxes == true)
                {
                    setBTCSellAmount(btc_balance);
                    setBTCSellPrice(current_price);
                }


                //set sell sliders and top/bottom values
                setTopBTCSliderPrice(btc_balance);
                setTopUSDSliderPrice((current_price + 10));
                setBottomUSDSliderPrice((current_price - 10));

                //set sell slider values
                setBTCSlider(btc_balance);
                setUSDSlider(current_price);

                //set buy slider top bottom values
                setTopBuyBTCSliderPrice(current_price + 10);
                setBottomBuyBTCSliderPrice(current_price - 10);

                setBuyBTCPriceSlider(current_price);

                //do the magic!
                updateSellDisplay();

                // get Active Orders
                updateActiveOrders();
            });
        });
    }



    function updateSellDisplay()
    {
        var dollarprofit = calculateDollarProfit();
        setDollarProfit(dollarprofit);
        setBuyBtcAmount(dollarprofit);
        updateBuyDisplay();
    }

    function updateBuyDisplay()
    {
        var min_profit_price = calculateMinProfitPrice();
        setBuyBtcPrice(min_profit_price);
        setBitcoinProfit(calculateBitcoinProfit());
    }







    $(document).on('click', 'a.ttb-cancel-order', function(e) {
        $(this).closest('li').remove();
        e.preventDefault();
        var order_id = $(this).prop('id');
        $.get('api/trade.php',{type: 'cancel',order_id: order_id},function(e){
            updateActiveOrders();
        });
    });


    $('#ttb-buy-button').click(function(){
        var price = getBuyBtcPrice();
        var num_bitcoin = getBuyBtcAmount() / price;
        num_bitcoin = (Math.round(num_bitcoin*100000000)/100000000);
        $.get('api/trade.php',{type: 'buy',price: price,amt: num_bitcoin},function(e){
            console.log(e);
            console.log('buying '+num_bitcoin+' at '+price);
            updateActiveOrders();
        });
    });

    $('#ttb-sell-button').click(function(){
        var amt = getBTCSellAmount();
        var price = getBTCSellPrice();
        $.get('api/trade.php',{type: 'sell',price: price,amt: amt},function(e){
            updateActiveOrders();
        });
    });


    $('#ttb-fill-sell-box').click(function(){
        setBTCSellAmount(getBTCBalance());
        setBTCSellPrice(getCurrentPrice());
        setBTCSlider(getBTCBalance());
        setUSDSlider(getCurrentPrice());
        updateSellDisplay();
    });

    $('#ttb-fill-buy-box').click(function(){
        setBuyBtcAmount(getUSDBalance());
        setBuyBtcPrice(getCurrentPrice());
    });

    function getCurrentPrice()
    {
        return parseFloat($('#ttb-current-price').html());
    }

    function setCurrentPrice(price)
    {
        $('#ttb-current-price').html(price);
    }

    function getBTCBalance()
    {
        return parseFloat($('#ttb-btc-balance').html());
    }

    function setBTCBalance(balance)
    {
        $('#ttb-btc-balance').html(balance);
    }

    function getUSDBalance()
    {
        return parseFloat($('#ttb-usd-balance').html());
    }

    function setUSDBalance(balance)
    {
        $('#ttb-usd-balance').html(balance);
    }









    $('#ttb-usd-slider')
        .slider()
        .on('slideStop', function(ev){
            var x = getUSDSlider();
            setBTCSellPrice(x);
            updateSellDisplay();
        })
        .on('slide', function(ev){
            var x = getUSDSlider();
            setBTCSellPrice(x);
            updateSellDisplay();
        })
        .on('slideStart', function(ev){
            var x = getUSDSlider();
            setBTCSellPrice(x);
            updateSellDisplay();
        });

    $('#ttb-btc-slider')
        .slider()
        .on('slideStop', function(ev){
            var x = getBTCSlider();
            setBTCSellAmount(x);
            updateSellDisplay()})
        .on('slide',function(){
            var x = getBTCSlider();
            setBTCSellAmount(x);
            updateSellDisplay();
        })
        .on('slideStart',function(){
            var x = getBTCSlider();
            setBTCSellAmount(x);
            updateSellDisplay();
        });

    $('#ttb-profit-slider')
        .slider()
        .on('slideStop', function(ev){
            var x = ($('#ttb-profit-slider').slider('getValue')).val();
            setMinProfit(x);
            updateBuyDisplay();
        })
        .on('slide', function(ev){
            var x = ($('#ttb-profit-slider').slider('getValue')).val();
            setMinProfit(x);
            updateBuyDisplay();
        })
        .on('slideStart', function(ev){
            var x = ($('#ttb-profit-slider').slider('getValue')).val();
            setMinProfit(x);
            updateBuyDisplay();
        });






    function deductCommission(value)
    {
        return (value - ((value/1000)*2));
    }




    /**
     * sets the value of the BTC slider
     * @param value
     */
    function setBTCSlider(value)
    {
        var min = getBottomBTCSliderPrice();
        var max = getTopBTCSliderPrice();
        var slider_value = convertToSliderValue(min,max,value);
        $('#ttb-btc-slider').slider('setValue',(1000 - slider_value));
    }

    /**
     * sets the value of the BTC slider
     * @param value
     */
    function setBuyBTCPriceSlider(value)
    {
        var min = getBottomBuyBTCSliderPrice();
        var max = getTopBuyBTCSliderPrice();
        var slider_value = convertToSliderValue(min,max,value);
        $('#ttb-buy-btc-price-slider-price').slider('setValue',(1000 - slider_value));
    }


    /**
     * sets the value of the BTC slider
     * @param value
     */
    function setBuyBTCAmountSlider(value)
    {
        var min = getBottomBuyBTCDollarAmount();
        var max = getTopBuyBTCDollarAmount();
        var slider_value = convertToSliderValue(min,max,value);
        $('#ttb-buy-btc-slider-amount').slider('setValue',(1000 - slider_value));
    }



    /**
     * sets the value of the BTC slider
     * @param value
     */
    function setUSDSlider(value)
    {
        var min = getBottomUSDSliderPrice();
        var max = getTopUSDSliderPrice();
        var slider_value = convertToSliderValue(min,max,value);
        $('#ttb-usd-slider').slider('setValue',(1000 - slider_value));
    }



    /**
     * gets the value of the BTC slider
     * @returns {number}
     */
    function getBTCSlider()
    {
        var reversed_slideval = $('#ttb-btc-slider').slider('getValue').val();
        var slideval = 1000 - reversed_slideval;
        var min = getBottomBTCSliderPrice();
        var max = getTopBTCSliderPrice();
        return getTrueSliderValue(min,max,slideval);
    }

    /**
     * gets the value of the USD slider
     * @returns {number}
     */
    function getUSDSlider()
    {
        var reversed_slideval =  $('#ttb-usd-slider').slider('getValue').val();
        var slideval = 1000 - reversed_slideval;
        var min = getBottomUSDSliderPrice();
        var max = getTopUSDSliderPrice();
        return getTrueSliderValue(min,max,slideval);
    }



    function getBuyBTCSliderPrice()
    {
        var reversed_slideval =  $('#ttb-buy-btc-price-slider').slider('getValue').val();
        var slideval = 1000 - reversed_slideval;
        var min = getBottomBuyBTCSliderPrice();
        var max = getTopBuyBTCSliderPrice();
        return getTrueSliderValue(min,max,slideval);
    }



    function getProfitSlider()
    {
        return $('#ttb-profit-slider').slider('getValue').val();
    }


    /**
     * sets the top btc slider label
     * @param value
     */
    function setTopBTCSliderPrice(value)
    {
        value = value + '';
        var rounded = value.substr(0,4);
        $('#ttb-top-btc-slider-price').html(rounded+'<span class="hide">'+value+'</span>');
    }


    /**
     *  gets the top btc slider price
     * @returns {*|jQuery}
     */
    function getTopBTCSliderPrice()
    {
        return $('#ttb-top-btc-slider-price').find('span.hide').html();
    }






    /**
     * gets the top usd slider price
     * @param value
     */
    function setTopUSDSliderPrice(value)
    {
        value = value + '';
        var rounded = value.substr(0,4);
        $('#ttb-top-usd-slider-price').html(rounded+'<span class="hide">'+value+'</span>');
    }


    /**
     * gets the top usd slider price
     * @returns {*|jQuery}
     */
    function getTopUSDSliderPrice()
    {
        return $('#ttb-top-usd-slider-price').find('span.hide').html();
    }




    function setBottomBTCSliderPrice(value)
    {
        value = value + '';
        var rounded = value.substr(0,4);
        $('#ttb-bottom-btc-slider-price').html(rounded+'<span class="hide">'+value+'</span>');
    }




    function setBTCSellAmount(amount)
    {
        $('#ttb-sell-btc-amt').val(amount);
    }

    function getBTCSellAmount()
    {
        return parseFloat($('#ttb-sell-btc-amt').val());
    }

    function setBTCSellPrice(price)
    {
        $('#ttb-sell-btc-price').val(price);
    }

    function getBTCSellPrice()
    {
        return parseFloat($('#ttb-sell-btc-price').val());
    }

    function setDollarProfit(profit)
    {
        var formatted = profit.toFixed(8).replace(/(\.[0-9]*?)0+$/, "$1");
        $('#ttb-makes-usd').html(formatted);
    }

    function getDollarProfit()
    {
        return parseFloat($('#ttb-makes-usd').html()).toFixed(8).replace(/(\.[0-9]*?)0+$/, "$1");
    }



    function setMinProfit(profit)
    {
        var val = parseFloat(profit).toFixed(8).replace(/(\.[0-9]*?)0+$/, "$1");
        $('#ttb-makes-btc').html(val);
    }

    function getMinProfit()
    {
        return parseFloat($('#ttb-makes-btc').html());
    }



    function setBuyBtcAmount(dollarsworth)
    {
        var val = Math.floor(100000000 * dollarsworth) / 100000000;
        $('#ttb-buy-btc-amt').val(val.toFixed(8).replace(/(\.[0-9]*?)0+$/, "$1"));
    }

    function getBuyBtcAmount()
    {
        return parseFloat($('#ttb-buy-btc-amt').val());
    }

    function setBuyBtcPrice(pricePerCoin)
    {
        price = parseFloat(pricePerCoin).toFixed(8).replace(/(\.[0-9]*?)0+$/, "$1");
        $('#ttb-buy-btc-price').val(price);
    }

    function getBuyBtcPrice()
    {
        return parseFloat($('#ttb-buy-btc-price').val());
    }

    function setBitcoinProfit(pricePerCoin)
    {
        var val = parseFloat(pricePerCoin).toFixed(8).replace(/(\.[0-9]*?)0+$/, "$1");
        $('#ttb-makes').html(val);
    }

    function getBitcoinProfit()
    {
        return parseFloat($('#ttb-makes').html());
    }


    function getBottomBTCSliderPrice()
    {
        return parseFloat($('#ttb-bottom-btc-slider-price').find('span.hide').html());
    }


    /**
     * sets the bottom usd slider price
     * @param value
     */
    function setBottomUSDSliderPrice(value)
    {
        value = value + '';
        var rounded = value.substr(0,4);
        $('#ttb-bottom-usd-slider-price').html(rounded+'<span class="hide">'+value+'</span>');
    }


    /**
     * gets the bottom usd slider price
     * @returns {*|jQuery}
     */
    function getBottomUSDSliderPrice()
    {
        return $('#ttb-bottom-usd-slider-price').find('span.hide').html();
    }


    /**
     * sets the bottom usd slider price
     * @param value
     */
    function setBottomBuyBTCSliderPrice(value)
    {
        value = value + '';
        var rounded = value.substr(0,4);
        $('#ttb-bottom-buy-btc-slider-price').html(rounded+'<span class="hide">'+value+'</span>');
    }


    /**
     * gets the bottom usd slider price
     * @returns {*|jQuery}
     */
    function getBottomBuyBTCSliderPrice()
    {
        return $('#ttb-bottom-buy-btc-slider-price').find('span.hide').html();
    }

    /**
     * sets the bottom usd slider price
     * @param value
     */
    function setTopBuyBTCSliderPrice(value)
    {
        value = value + '';
        var rounded = value.substr(0,4);
        $('#ttb-top-buy-btc-slider-price').html(rounded+'<span class="hide">'+value+'</span>');
    }


    /**
     * gets the bottom usd slider price
     * @returns {*|jQuery}
     */
    function getTopBuyBTCSliderPrice()
    {
        return $('#ttb-top-buy-btc-slider-price').find('span.hide').html();
    }




    /**
     * gets the real value you have set on the slider
     * @param min
     * @param max
     * @param value
     * @returns {number}
     */
    function getTrueSliderValue(min,max,value)
    {
        //cast everything as a float
        var min = parseFloat(min);
        var max = parseFloat(max);
        var value = parseFloat(value);
        // 1000 increments between min and max
        var increment = (max - min) / 1000;
        return (parseFloat(value) * parseFloat(increment)) + parseFloat(min);
    }


    /**
     * gets the sliders value between 0 and 1000
     * based on the current min and max
     * @param min
     * @param max
     * @param value
     * @returns {number}
     */
    function convertToSliderValue(min,max,value)
    {
        var min = parseFloat(min);
        var max = parseFloat(max);
        var value = parseFloat(value);
        //min should be zero, so max is offset back by min
        var newmax = max - min;
        var newvalue = value - min;
        var inc = 1000 / newmax;
        return inc * newvalue;
    }


    function calculateDollarProfit()
    {
        var amt = getBTCSellAmount();
        var price = getBTCSellPrice();
        return deductCommission(amt * price);
    }

    function calculateBitcoinProfit()
    {
        return deductCommission(getBuyBtcAmount()) / getBuyBtcPrice();
    }


    function updateDisplay()
    {
        var dollarprofit = calculateDollarProfit();
        var min_profit_price = calculateMinProfitPrice();
        var bitcoin_profit = calculateBitcoinProfit();
//        setDollarProfit(dollarprofit);
//        setBuyBtcAmount(dollarprofit);
//        setBuyBtcPrice(min_profit_price);
//        setBitcoinProfit(bitcoin_profit);
    }

    function calculateMinProfitPrice()
    {
        var buy_amount = deductCommission(getBuyBtcAmount());
        var min_profit = getMinProfit();
        var sold_amount = parseFloat(getBTCSellAmount());
        var price =  buy_amount / (sold_amount + min_profit);
        return (Math.floor(price * 1000)/1000);
    }




    function updateActiveOrders()
    {
        $('ol#ttb-orders').html('');
        $.getJSON('api/trade.php',{type:'orders'},function(ev){
            var li = '';
            var lookup = {
                'sell' : 'danger',
                'buy' : 'success'
            };
            if(ev.success)
            {
                $.each(ev.return, function(k,v){
                    li = li + '<li><div class="overflow alert alert-';
                    li = li + lookup[v.type];
                    li = li + ' p5"><small>';
                    li = li +
                        v.amount.toFixed(4) +' @ ' +
                        v.rate.toFixed(4) +
                        '</small>' +
                        '<a href="#" id="'+k+'" class="pull-right ttb-cancel-order btn btn-mini btn-danger"><i class="fa fa-times icon-white"></i></a>' +
                        '</div>' +
                        '</li>';

                });
            }
            else
            {
                li = '<li>' +
                    '   <div class="alert alert-info p5 pl10 overflow">' +
                    '<small>You have no active orders.</small>' +
                    '</div></li>';
            }
            $('ol#ttb-orders').html($(li));
            $.get('api/get-info.php',{},function(ev){
                setBTCBalance(ev.return.funds.btc);
                setUSDBalance(ev.return.funds.usd);
            });
            $.get('api/ticker.php',{},function(ev){
                setCurrentPrice(ev.ticker.last);
            });
        });
    }




    /**
     * clicking button resets prices and orders
     */
    $('#ttb-reset-prices').click(function(){
        initialiseTradingPanel(false);
    });

    /**
     * clicking button resets to defaults
     */
    $('#ttb-update-orders').click(function(){
        updateActiveOrders();
    });


    /**
     *  sell amount changing will trigger calculation
     */
    $('#ttb-sell-btc-amt').change(function(){
        updateSellDisplay();
    });

    /**
     *  sell price changing will trigger calculation
     */
    $('#ttb-sell-btc-price').change(function(){
        updateSellDisplay();
    });


    /**
     *  buy amount changing will trigger calculation
     */
    $('#ttb-buy-btc-amt').change(function(){
        setDollarProfit(calculateDollarProfit());
        setBuyBtcPrice(calculateMinProfitPrice());
        setBitcoinProfit(calculateBitcoinProfit());
    });

    /**
     *  buy price changing will trigger calculation
     */
    $('#ttb-buy-btc-price').change(function(){
        setDollarProfit(calculateDollarProfit());
        setBuyBtcAmount(getDollarProfit());
        setBitcoinProfit(calculateBitcoinProfit());
    });




    $('#reset-usd-slider').click(function(){
        var price = $('#ttb-current-price').html();
        setUSDSlider(price);
        setBTCSellPrice(price);
        updateDisplay();
    });


    $('#reset-btc-slider').click(function(){
        var btc = $('#ttb-btc-balance').html();
        setBTCSellAmount(btc);
        setBTCSlider(btc);
    });




});