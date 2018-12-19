var idChatSelected = null;
/*
var ws = new WebSocket('ws://127.0.0.1:8888/messaggi');

// event emmited when connected
ws.onopen = function () {
    console.log('websocket is connected ...');
}

// event emmited when receiving message 
ws.onmessage = function (ev) {
    console.log(ev);
}
*/

//--------------------------------------------------------------------------------------------

//Cambio la chat
function changeChat(id){
    $(".box-messaggi").css('display','none');
    $(".sidenav-entry").css('background-color','yellow');
    $("#" + id + "-chat").css('display','block');
    $("input[value=" + id + "]").parent().css('background-color','white');
    idChatSelected = id;
    var box = document.getElementById(id + "-chat");
    box.scrollTop = box.scrollHeight;
}



/*************************************************************************************** 
 * HTML DINAMICO                                                                       *
 ***************************************************************************************/

//All'inizio carico la sidebar con tutte le offerte a cui partecipo
function popolaSideBar(){
    for(var key in offerteInCuiUtentePresente){
        var offerta = offerteInCuiUtentePresente[key];
        if(offerta.ospitato){
            $(creaSidebarEntry(offerta)).appendTo(".sidenav");
        }
    }

}

//Crea una entry della sidebar
function creaSidebarEntry(offerta){
    var wrapper = '<a class="sidenav-entry" href="#">\
                        <input type="hidden" value="' + offerta._id + '" />\
                        <div class="ruolo">' + mioRuolo(offerta) + '</div>\
                        <div class="partita">' + stringPartita(offerta.homeTeam,offerta.awayTeam) + '</div>\
                        <div class="username">' + altroUtente(offerta) +'</div>\
                    </a>';
    return wrapper;
}

//Crea box messaggi
function creaBoxMessaggi(id){
    var box = '<div class="box-messaggi" id="' + id + '-chat"></div>';
    return box;
}

//Inserisce un messaggio nel box corripondente
function inserisciMessaggio(id,messaggio,ruolo){
    var classe = (ruolo === messaggio.mittente)?"mio":"altro";
    var mex = '<div class="' + classe + '">\
                 <label>' + messaggio.testo + '</label>\
               </div>';
    $(mex).appendTo("#" + id + "-chat");
    var box = document.getElementById(id + "-chat");
    box.scrollTop = box.scrollHeight;
}


/*************************************************************************************** 
 * AJAX                                                                                *
 ***************************************************************************************/

function getMessaggiById(id,ruolo){

    var params = {
        "id":id,
        "min":0,
        "max":0,
    };

    var request = $.ajax({
        url: '/getMessaggi',
        dataType: 'json',
        type: 'POST',
        data: params,
    });

    request.done(function(msg) {
        for(var i=0;i < msg.length;i++){
            inserisciMessaggio(id,msg[i],ruolo);
        }
        changeChat(id);
    });

    request.fail(function(err){
        console.log("Errore in getMessaggi: " + err);
    });
}

/*************************************************************************************** 
 * EVENT HANDLER                                                                       *
 ***************************************************************************************/

popolaSideBar();
var socket = io();

$(".invia-messaggio a").click(function(){
    var testo = $(".invia-messaggio [name=messaggio]").val();
    if(testo != ""){
        var id = idChatSelected;
        var ruolo = $("input [value=" + id + "]").siblings(".ruolo").text();
        var partita = $("input [value=" + id + "]").siblings(".partita").text();
        var messaggio = {"mittente":ruolo,"testo":testo}
        $(".invia-messaggio [name=messaggio]").val("");
        //Invio il messaggio sul socket
        console.log(id);
        socket.emit('messaggio', {"id":id,"testo":testo,"ruolo":ruolo,"partita":partita});
        //E lo stampo a video
        inserisciMessaggio(id,messaggio,ruolo);
    }
});

$(".invia-messaggio [name=messaggio]").on({

    'keyup': function(event){
        //Invio (eseguo la stessa funzione del pulsante cerca)
        if (event.keyCode === 13) {
            $(".invia-messaggio a")[0].click();
        }
    },

});

$(".sidenav").on("click",".sidenav-entry",function(){
    var id = $(this).children("[type=hidden]").val();
    var ruolo = $(this).children(".ruolo").text();
    if(!$("#" + id + "-chat").length){
        $(creaBoxMessaggi(id)).appendTo(".div-box-messaggi");
        getMessaggiById(id,ruolo);
    }
    else{
        changeChat(id);
    }
});


/*socket.on('messaggio', function(msg){
    var id = msg.id;
    var ruolo = $("input[value=" + id + "]").siblings(".ruolo").text();
    var username = $("input[value=" + id + "]").siblings(".username").text();
    var partita = $("input[value=" + id + "]").siblings(".partita").text();
    if($("#" + id + "-chat").length === 0 || $("#" + id + "-chat").css("display") === "none"){
        inserisciMessaggio(id,msg.messaggio,ruolo);
        var not = nuovaNotifica(partita,username);
        aggiungiNotifica(not);
    }
    else if($("#" + id + "-chat").length === 0){
        inserisciMessaggio(id,msg.messaggio,ruolo);
    }
});*/