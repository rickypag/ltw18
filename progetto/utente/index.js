//Conterrà tutti gli oggetti team così come arrivano dalle API
var teams = [];

//Conterrà oggetti il cui nome è lo shortName e il valore è la coppia (nomeCompleto,id).
//In questo modo a partire dallo shortName che viene inserito nella barra della ricerca posso ottenere
//velocemente l'id, che mi serve per le API delle partite, e il nome, che verrà usato per
//l'autocompletamento
var teamsIdByShortName = [];



/*************************************************************************************** 
 * FUNZIONI CHE MI SERVONO PER GENERARE NUOVO CODICE HTML DATE LE RICHIESTE            *
 ***************************************************************************************/

//Inserisce un suggerimento dati i primi caratteri di input
function setSuggestion() {
    var inizio = $("#front-search").val();
    if(inizio === ""){
        $("#back-search").val("");
        return;
    }
    var newValue = inizio;
    for(var i=0;i < teams.length; i++){
        var team = teams[i];
        if(team.shortName.substring(0,inizio.length).toLowerCase() === inizio.toLowerCase()){
            newValue = inizio + team.shortName.substring(inizio.length,team.shortName.length);
            break;
        }
    }
    $("#back-search").val(newValue);
}

//Funzione chiamata all'inizio. Ottiene tutte le squadre e ne salva gli attributi che mi servono:
//                                         -id
//                                         -name
//                                         -shortName
//                                         -clubColors
function getTeams(t) {
    teams = t;
    for(var i=0;i < teams.length; i++){
        teamsIdByShortName[teams[i].shortName.toLowerCase()] = {
            "id": teams[i].id,
            "name": teams[i].name,
            "shortName": teams[i].shortName,
            "clubColors": teams[i].clubColors
        };
    }
}

//Genera in #squadre i box relativi alle partite 
function getMatchesByTeam(matches) {
    for(var i=0;i < matches.length; i++){
        if(matches[i].competition.id === 2001){//} && matches[i].status === "SCHEDULED"){
            var s = '<form class="box-offerta">\
                        <div class="nome-partita">' + matches[i].homeTeam.name + ' - ' + matches[i].awayTeam.name + '</div>\
                        <a id="chiediPersone" class="button link-offerta" href="#persone">Vedi offerte</a>\
                    </form>';
            $(s).appendTo("#squadre");
        }
    }
}

//Genera la form che chiede le persone
function chiediPersone(partita) {
    var s = '<label>Hai scelto la partita: <label class="partita">' + partita + '</label></label><br>\
            <label>In quanti siete?</label>\
             <div>\
                Adulti:\
                <select size="1" cols="5" id="adulti">\
                    <option selected value=1>1\
                    <option value=2>2\
                    <option value=3>3\
                    <option value=4>4\
                    <option value=5>5\
                </select>\
                Bambini:\
                <select size="1" cols="4" id="bambini">\
                    <option selected value=0>0\
                    <option value=1>1\
                    <option value=2>2\
                    <option value=3>3\
                </select>\
            </div>\
            <a id="confermaPersone" href="#offerte" class="button search">Conferma</a>';
    $(s).appendTo("#persone");
}

//Crea un messaggio di errore se la ricerca della squadra ha portato ad un errore
function searchError(err){
    var messaggio = '<div class="nome-partita">' + err + '</div>';
    $(messaggio).appendTo("#squadre");
}

//Cerca le offerte nel database e le inserisce in #offerte
function creaOfferta(offerte) {
    $("#offerte").empty();

    for(var i=0;i < offerte.length;i++){
        var o = offerte[i];
        var wrapper = '<form class="box-offerta">\
                            <img src="" />\
                            <div class="info-offerta">\
                                <a href="#nome">' + o.nome + " " + o.cognome + '</a>\
                                <label>' + o.partita + '</label>\
                                <label>' + o.citta + '</label>\
                            </div>\
                        </form>';
    
        $(wrapper).appendTo("#offerte");
    }

}

//---------------------------------------------------------------------------------------------------------------------------------------

/*************************************************************************************** 
 * EVENT HANDLERS                                                                      *
 ***************************************************************************************/

$(document).ready(function(){

    //All'inizio carico tutte le squadre
    var request = $.ajax({
        headers: { 'X-Auth-Token': '9d86980a76af481d8388321e25ab6dd0' },
        url: 'https://api.football-data.org/v2/competitions/CL/teams',
        dataType: 'json',
        type: 'GET',
    });

    request.done(function(msg) {
        getTeams(msg.teams);
    });

    //--------------------------------------------------------------------------------------------

    //Event handler del bottone cerca
    $("#cerca").click(function(){
        $("#squadre").empty();

        var squadra = $("#front-search").val().toLowerCase();

        //Se l'utente ha digitato una squadra giusta
        if(Object.keys(teamsIdByShortName).includes(squadra)){
            var squadraId = teamsIdByShortName[squadra].id;

            var request = $.ajax({
                headers: { 'X-Auth-Token': '9d86980a76af481d8388321e25ab6dd0' },
                url: 'https://api.football-data.org/v2/teams/' + squadraId + '/matches',
                dataType: 'json',
                type: 'GET',
            });

            request.done(function(msg) {
                getMatchesByTeam(msg.matches);
            });

            request.fail(function(msg) {
                searchError("Ops! Sembra che ci sia un errore con il server");
            });
        }
        //Altrimenti genero un messaggio d'errore
        else{
            searchError("La squadra cercata non esiste");
        }
    });

    //--------------------------------------------------------------------------------------------

    //Barra di ricerca
    $('#front-search').on({

        //Cambiando il valore dell'input suggerisco un valore
        'input propertychange': function() {
            setSuggestion();
        },

        'keyup': function(event){
            //Invio (eseguo la stessa funzione del pulsante cerca)
            if (event.keyCode === 13) {
                $("#cerca").click();
            }
        },

        'keydown': function(event){
            //Freccia destra (completo il suggerimento)
            if(event.keyCode === 39){
                var newValue = $("#back-search").val().toLowerCase();
                newValue = teamsIdByShortName[newValue].shortName;
                $("#front-search").val(newValue);
                $("#back-search").val(newValue);
            }
        },
    });

    //--------------------------------------------------------------------------------------------

    //Dico a #squadre di generare un event handler a #cercaOfferta quando viene creata 
    $("#squadre").on('click', '#chiediPersone', function(){
        chiediPersone($(this).siblings(".nome-partita").text());
    });

    //--------------------------------------------------------------------------------------------

    //Bottone conferma persone
    $("#persone").on('click', '#confermaPersone', function(){
        var adulti = $("#adulti").val();
        var bambini = $("#bambini").val();
        var o1 = {"nome":"Giovanni","cognome":"Storti","immagine":"","partita":$("#persone .partita").text(),"citta":"Milano"};
        creaOfferta([o1,o1,o1]);
    });
});