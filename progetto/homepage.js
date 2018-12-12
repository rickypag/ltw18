//Le squadre caricate dal localStorage le inserisco nel menu a tendina
function setMatches(){
    alert("aaa");
    var matches = JSON.parse(localStorage.matches);
    for(var i=0;i< matches.length;i++){
        $(".nuova-offerta .homeTeam-nuova-offerta").append('<option value=' + matches[i].homeTeam + 
                '>' + matches[i].homeTeam + '</option>')
    }
}

//Carico in #next-match la prossima partita della squadra dell'utente
function setNextMatch(match){
    $("#next-match .nome-partita").text(match.homeTeam.name + ' - ' + match.awayTeam.name);
}

//Crea un messaggio di errore se la ricerca della squadra ha portato ad un errore
function setError(elemento,err){
    $(elemento).text(err);
}

//Ottenuta una lista di offerte dal server le metto nell'homepage
function printOfferta(offerte) {    
    for(var i=0;i < offerte.length;i++){
        var o = offerte[i];
        var wrapper = '<form class="box-offerta">\
                            <img src="" />\
                            <div class="info-offerta">\
                                <a href="#nome">' + o.nome + " " + o.cognome + '</a>\
                                <label>' + o.partita + '</label>\
                                <label>' + o.citta + '</label><br>\
                                <label>' + o.citta + '</label><br>\
                                <label>' + o.citta + '</label><br>\
                                <label>' + o.citta + '</label><br>\
                                <label>' + o.citta + '</label><br>\
                            </div>\
                        </form>';
    
        $(wrapper).appendTo("#newsfeed");
    }

}

//Ogni volta che l'utente scrolla verso il basso si caricano nuove offerte
//Tale funzione viene attivata quando si scrolla
function loadNuoveOfferte() {

    var r = $.ajax({
        url: 'offerte.php',
        type: 'GET',
        data: {"last":0},
        dataType: 'json',
    });

    r.done(function(msg) {
        printOfferta(msg);
    });

    r.fail(function(msg){
        alert("nope");
    });

}

//Mette in #ospiti-da-accettare le richieste fatte all'ospitante
function creaSelezioneOspiti(rows){
    for(var i=0;i < rows.length;i++){
        var offerta = rows[i].value;
        if(offerta.ospitante === "pippo" && !offerta.ospitato){
            var toAppend = '<div class="box-offerta div-offerta-da-accettare">' + stringPartita(offerta.homeTeam,offerta.awayTeam);
            toAppend += '<input id="offerta-da-accettare-id" type="hidden" value="' + offerta._id + '" >';
            if(offerta.codaRichieste.length === 0){
                toAppend += '<div>Nessuna richiesta fatta per questa offerta</div>';
            }
            else{
                for(var j=0;j < offerta.codaRichieste.length;j++){
                    toAppend += '<div class="offerta-da-accettare-ospite">' + offerta.codaRichieste[j] + '</div>';
                    toAppend += '<a class="button" id="button-offerta-da-accettare">Accetta</a>';
                }
            }
            toAppend += '</div>';
            $(toAppend).appendTo("#ospiti-da-accettare");
        }
    }
}

//Mette in #recensioni-da-fare le richieste fatte all'ospitante
function creaAggiungiRecensione(rows){
    for(var i=0;i < rows.length;i++){
        var offerta = rows[i].value;
        if(offerta.ospitante === "pippo" && !offerta.recensioneFattaDaOspitante && offerta.ospitato){
            var toAppend = '<div class="box-offerta div-offerta-da-accettare">' + stringPartita(offerta.homeTeam,offerta.awayTeam);
            toAppend += '<input id="offerta-da-accettare-id" type="hidden" value="' + offerta._id + '" >';
            toAppend += '<div class="ifOspitante">Eri ospitante!</div>';
            toAppend += '<div class="recensione-da-fare-altro">' + offerta.ospitato + '</div>';
            toAppend += '<input id="recensione-da-fare-testo" type="text">';
            toAppend += '<input id="recensione-da-fare-stelle" type="numeric">';
            toAppend += '<a class="button" id="button-inserisci-recensione">Invia</a>';
            toAppend += '</div>';
            $(toAppend).appendTo("#recensioni-da-fare");
        }
        else if(offerta.ospitato === "pippo" && !offerta.recensioneFattaDaOspitato){
            var toAppend = '<div class="box-offerta div-offerta-da-accettare">' + stringPartita(offerta.homeTeam,offerta.awayTeam);
            toAppend += '<input id="recensione-da-fare-id" type="hidden" value="' + offerta._id + '" >';
            toAppend += '<div class="ifOspitante">Eri ospite!</div>';
            toAppend += '<div class="recensione-da-fare-altro">' + offerta.ospitante + '</div>';
            toAppend += '<input id="recensione-da-fare-testo" type="text">';
            toAppend += '<input id="recensione-da-fare-stelle" type="numeric">';
            toAppend += '<a class="button" id="button-inserisci-recensione">Invia</a>';
            toAppend += '</div>';
            $(toAppend).appendTo("#recensioni-da-fare");
        }
    }
}

//Funzione ausiliara che data le squadre mi ritorna la stringa della partita
function stringPartita(ht,at){
    return ht + " - " + at;
}

//---------------------------------------------------------------------------------------------------------------------------------------

/*************************************************************************************** 
 * EVENT HANDLERS                                                                      *
 ***************************************************************************************/

$(document).ready(function(){
    localStorage.squadraId = "5";
    localStorage.utente = JSON.stringify({"username": "pippo"});

    //Appena il documento si carica carico la prossima partita della squadra preferita dell'utente
    //e seleziono 10 offerte dal database
    var squadraId = localStorage.squadraId;

    var request = $.ajax({
        headers: { 'X-Auth-Token': '9d86980a76af481d8388321e25ab6dd0' },
        url: 'https://api.football-data.org/v2/teams/' + squadraId + '/matches?status=SCHEDULED&limit=1',
        dataType: 'json',
        type: 'GET',
    });

    request.done(function(msg) {
        setNextMatch(msg.matches[0]);
    });

    request.fail(function(msg){
        setError("#next-match .nome-partita","Errore nel caricamento partita");
    });

    var r = $.ajax({
        url: 'offerte.php',
        type: 'GET',
        data: {"last":0},
        dataType: 'json',
    });

    r.done(function(msg) {
        printOfferta(msg);
    });

    r.fail(function(msg){
        alert("no");
    });

    setMatches();
    
    //--------------------------------------------------------------------------------------------

    //Crea offerta
    $("#creaOfferta").click(function(){

        var offerta = {
            "homeTeam": $("#nuova-offerta input[name=homeTeam]").val(),
            "awayTeam": $("#nuova-offerta input[name=awayTeam]").val(),
            "ospitante": JSON.parse(localStorage.utente).username
        };
        alert(JSON.stringify(offerta));

        var c = $.ajax({
           type: "POST",
           url: "http://localhost:8888/utente/nuovaOfferta",
           dataType: "json",
           data: offerta
        });

        c.done(function(msg) {
            if(msg.message === "ok"){
                alert("Inserimento riuscito");
            }
            else{
                alert("Errore nell'inserimento!");
            }
        });
    
        c.fail(function(err){
            alert("Errore nell'inserimento dell'offerta " + JSON.stringify(err));
        });

    });

    //--------------------------------------------------------------------------------------------

    //All'inizio carico tutte le offerte da accettare,recensioni,ecc.

    var r = $.ajax({
        type: "POST",
        url: "http://localhost:8888/utente/loadOfferte",
        dataType: "json",
        data: {"username":"pippo"} //localStorage.utente.username
    });

    r.done(function(msg){
        creaSelezioneOspiti(msg);
        creaAggiungiRecensione(msg);
    });

    r.fail(function(err){
        alert(JSON.stringify(err));
    });

    //--------------------------------------------------------------------------------------------

    //Accetto la richiesta di un utente
    $("#ospiti-da-accettare").on("click","#button-offerta-da-accettare",function(){
        var t = this;
        var id = $(t).siblings("#offerta-da-accettare-id").val();
        var ospite = $(t).siblings(".offerta-da-accettare-ospite").text();
        var r = $.ajax({
            type: "POST",
            url: "http://localhost:8888/utente/accettaRichiesta",
            dataType: "json",
            data: {"id":id,"ospitato":ospite} //localStorage.utente.username
        });
    
        r.done(function(msg){
            alert(JSON.stringify(msg));
            $(t).closest("div").remove();
        });
    
        r.fail(function(err){
            alert(JSON.stringify(err));
        });
    });

    //--------------------------------------------------------------------------------------------

    //Invio una recensione
    $("#recensioni-da-fare").on("click","#button-inserisci-recensione",function(){
        var t = this;
        var id = $(t).siblings("#offerta-da-accettare-id").val();
        var persona = $(t).siblings(".recensione-da-fare-altro").text();
        var recensione = $(t).siblings("#recensione-da-fare-testo").val();
        var stelle = $(t).siblings("#recensione-da-fare-stelle").val();
        var params = {"id":id,"recensione": recensione,"numStelle":stelle};
        if($(t).siblings("#ifOspitante").val() === "Eri Ospitato"){
            params.ospitato = "pippo";
        }
        else{
            params.ospitante = "pippo";
        }
        
        alert(JSON.stringify(params));


        var r = $.ajax({
            type: "POST",
            url: "http://localhost:8888/utente/inviaRecensione",
            dataType: "json",
            data: params
        });
    
        r.done(function(msg){
            alert(JSON.stringify(msg));
            $(t).closest("div").remove();
        });
    
        r.fail(function(err){
            alert(JSON.stringify(err));
        });
    });

    //--------------------------------------------------------------------------------------------

    //Eseguo polling per vedere se ci sono aggiornamenti del database


    //Scroll del body
    /*$(document).scroll(function(){
        if((window.innerHeight + window.scrollY) >= document.body.offsetHeight){
            loadNuoveOfferte();
        }
    });*/
});