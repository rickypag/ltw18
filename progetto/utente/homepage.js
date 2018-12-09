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
        alert("no");
    });

}

//---------------------------------------------------------------------------------------------------------------------------------------

/*************************************************************************************** 
 * EVENT HANDLERS                                                                      *
 ***************************************************************************************/

$(document).ready(function(){
    localStorage.squadraId = "5";

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

    //Scroll del body
    $(document).scroll(function(){
        if((window.innerHeight + window.scrollY) >= document.body.offsetHeight){
            loadNuoveOfferte();
        }
    });
});