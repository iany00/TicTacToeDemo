/**
 * Tic Tac Toe - SERVER CODE
 * -----------------------------------------
 * Author : Ionut Airinei <ionut.n.airinei@gmail.com>
 * Copyright (c) 2015 Ionut Airinei
 */
function parseMessage(data){
    var jsonObj = JSON.parse(data);
    return jsonObj;
}


/***/
function serializeMessage(message){
    var obj = {
        'username' : Client.username,
        'message' : message
    };

    return JSON.stringify(obj);
}


var Client = {
    socket   : null,
    uri      : "ws://localhost:2000",
    mark     : 'X',
    $close   : $('#close'),
    $connect : $('#connect'),
    $username: $('#username'),
    $board   : $('#board'),
    $overlay : $('#overlay'),
    $endGameMsg : $('#endGameMsg'),
    $screen  : $('#screen'),
    username : $('#username').val() || $.now()
};

Client.Connect = function() {
    var _self = Client;

    // Enable send and close button
    _self.$close.prop('disabled', false);
    _self.$connect.prop('disabled', true);
    _self.$username.prop('disabled', true);

    _self.socket = new WebSocket(_self.uri);


    if (!_self.socket || _self.socket == undefined)
    {
        return;
    }

    _self.socket.onopen = function ()
    {
        $(window).bind('beforeunload', function ()
        {
            _self.Action.closeConn();
        });
    };
    _self.socket.onerror = function ()
    {
        showInfo('Error!!!', true);
    };
    _self.socket.onclose = function ()
    {
        _self.Game.closeGame();
        showInfo('Socket closed!', true);
    };
    _self.socket.onmessage = function (e)
    {
        _self.Game._do(e.data);
    };
};

Client.Action = {
    closeConn : function() {
        console.log('Connection Closed');
        Client.socket.close();
    },

    sendMessage : function(mess)
    {
        if (!Client.socket || Client.socket == undefined)
        {
            return false;
        }
        if (mess == '')
        {
            return;
        }
        Client.socket.send(serializeMessage(mess));
    }
};


Client.Game = {
   _do : function (data) {
        var _self = this;
        var msg = parseMessage(data);
        switch (msg['action'])
        {
            case 'init':
                _self.initGame(data);
                _self.showInfo(data, false);
                break;

            case 'startGame':
                _self.startGame();
                break;

            case 'newGame':
                _self.showInfo('New game has started!', true);
                _self.clearBoard(false);
                break;

            case 'endGame':
                _self.endGame(data);
            break;

            default:
                _self.move(data);
        }
    },

    initGame : function(data)
    {
        this.clearBoard(false);
        this.clearInfo();
        this.visibleBoard(false);
        var parsedMsg = parseMessage(data);
        if(typeof  parsedMsg['mark'] !== "undefined")
        {
            Client.mark = parsedMsg['mark'];
        }
    },

    startGame : function()
    {
        this.clearBoard(false);
        this.clearInfo();
        this.visibleBoard(true);

        this.showInfo('You play with ' + Client.mark, true);
        this.showInfo('Player with `X` starts first!', true);
    },

    move : function  (msg)
    {
        var parsedMsg = parseMessage(msg);
        if(typeof  parsedMsg['mark'] !== "undefined")
        {
            Client.mark = parsedMsg['mark'];
        }

        this.markMove(parsedMsg['message']);
    },

    markMove: function (data)
    {
        if (data == '')
        {
            return false;
        }
        $('[data-col="' + data['col'] + '"][data-row="' + data['row'] + '"]')
            .addClass('marked')
            .empty()
            .append('<h1>' + Client.mark + '</h1>');
    },

    clearBoard : function(call) {
        Client.$board.find('.cell').removeClass('marked').empty();
        Client.$overlay.hide();
        Client.$endGameMsg.hide();

        if(call === true) {
            var action = {'action': 'newGame'};
            Client.Action.sendMessage(action);
        }
    },


    visibleBoard : function(visible) {
        this.clearBoard(false);
        if(visible) {
            Client.$board.show();
        } else {
            Client.$board.hide();
        }
    },

    closeGame : function()
    {
        Client.$close.prop('disabled', true);
        Client.$connect.prop('disabled', false);
        Client.$username.prop('disabled', false);

        this.clearBoard(false);
        this.visibleBoard(false);
        this.clearInfo();

        Client.$overlay.hide();
        Client.$endGameMsg.hide();
    },

    endGame : function(data)
    {
        data = parseMessage(data);
        Client.$overlay.show();
        Client.$endGameMsg.empty().append(data['message']).show();
    },

    showInfo : function (msg, text) {
        Client.$screen.append('</br>');

        if(text) {
            Client.$screen.append(msg);
        } else {
            msg = parseMessage(msg);
            Client.$screen.append(msg['message']);
        }
    },

    clearInfo : function ()
    {
        Client.$screen.empty();
    }

};


