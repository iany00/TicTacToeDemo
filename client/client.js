  // Client here
    var socket   = null;
    var uri      = "ws://localhost:2000";
    var username = $.now();
    var mark     = 'X';


    /***/
    function parseMessage(data){
        var jsonObj = JSON.parse(data);
        return jsonObj;
    }


    /***/
    function serializeMessage(message){
        var obj = {
            'username' : username,
            'message' : message
        }
        console.log(obj);
        return JSON.stringify(obj);
    }
    

    /***/
    function connect()
    {
        socket = new WebSocket(uri);
        if(!socket || socket == undefined) return false;
        socket.onopen = function(){
            $(window).bind('beforeunload',function(){
                closeConn();
            });
        }
        socket.onerror = function(){
            showInfo('Error!!!', true);
        }
        socket.onclose = function(){
            $('#close').prop('disabled', true);
            $('#connect').prop('disabled', false);
            $('#username').prop('disabled', false);
           
            showInfo('Socket closed!', true);
        }
        socket.onmessage = function(e){
            var msg = parseMessage(e.data);
            switch(msg['action']) {
                case 'init':
                    initGame(e.data);
                    showInfo(e.data, false);
                break;
                case 'startGame':
                    startGame();
                    break;
                case 'newGame':
                     clearBoard(false);
                break;
                default:
                    drawAction(e.data);
            }
        }
        // Init user data
        username = $('#username').val();
        
        // Enable send and close button
        $('#close').prop('disabled', false);
        $('#connect').prop('disabled', true);
        $('#username').prop('disabled', true);            
    }

    /***/
    function closeConn(){
        console.log('Connection Closed');
        closeGame();
        socket.close();
    }


     /***/
    function sendMessage(mess)
    {
        if(!socket || socket == undefined) return false;
        if(mess == '') return;
        socket.send(serializeMessage(mess));            
    }


    function initGame(data) 
    {
        closeGame();
        var parsedMsg = parseMessage(data);
        if(typeof  parsedMsg['mark'] !== "undefined") {
            mark = parsedMsg['mark'];    
        }
    }

    function startGame ()
    {
        showInfo('You play with ' + mark, true);
        visibleBoard(true);
    }

    function closeGame ()
    {
        clearBoard(true);
        visibleBoard(false);
        clearInfo();
    }


    /**/
    function showInfo(msg, text) {
        var screen = $('#screen');
        screen.append('</br>');
        
        if(text) {
            screen.append(msg);
        } else {
            msg = parseMessage(msg);
            screen.append(msg['message']);    
        }
    }

    /**/
     function clearInfo()
     {
        $('#screen').empty();
     }

    /***/
    function drawAction(msg)
    {
        console.log(msg);
        
        var parsedMsg = parseMessage(msg);
        if(typeof  parsedMsg['mark'] !== "undefined") {
            mark = parsedMsg['mark'];    
        }
        
        checkCell(parsedMsg['message']);
    }


    /***/
    function clearBoard(call){
        $('#board').find('.cell').empty();
        showInfo('New game has started!', true);
        if(call) {
            var action = {'action': 'newGame'};
            sendMessage(action);
        }
    }

    /**/
    function visibleBoard(visible) {
        clearBoard(false);
        if(visible) {
             $('#board').show();
        } else {
            $('#board').hide();
        }
    }

    /**/
    function checkCell(data) {
        if(data == '') return false;
        $('[data-col="'+data['col']+'"][data-row="'+data['row']+'"]')
                .empty()
                .append('<h1>'+mark+'</h1>');
    }
