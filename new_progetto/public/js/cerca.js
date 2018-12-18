
/*************************************************************************************** 
 * FUNZIONI CHE MI SERVONO PER GENERARE NUOVO CODICE HTML DATE LE RICHIESTE            *
 ***************************************************************************************/

//Inserisce un suggerimento dati i primi caratteri di input
function setSuggestion() {
    var inizio = $("#front-search").val();
    var oldValue = $("#back-search").val();
    if(inizio === ""){
        $("#back-search").val("");
        $("#squadre").empty();
        $("#divOfferte").empty();
        $("#scrittaOfferte").empty();
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
    //Se il valore calcolato è diverso cambio le ricerche
    if(newValue !== oldValue){
        $("#back-search").val(newValue);
        cercaSquadra();
    }
}

    //--------------------------------------------------------------------------------------------

    //Cerca le partite data una squadra
    function cercaSquadra(){
        $("#squadre").empty();
        $("#divOfferte").empty();
        $("#scrittaOfferte").empty();

        var squadra = $("#back-search").val().toLowerCase();

        //Se l'utente ha digitato una squadra giusta
        if(Object.keys(teamsIdByShortName).includes(squadra)){

            getMatchesByTeam(squadra);

            /*var request = $.ajax({
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
            });*/
        }
        //Altrimenti genero un messaggio d'errore
        else{
            searchError("La squadra cercata non esiste");
        }
    }

//Funzione chiamata all'inizio. Ottiene tutte le squadre e ne salva gli attributi che mi servono:
//                                         -id
//                                         -name
//                                         -shortName
//                                         -clubColors
function getTeams(t) {
    teams = t;
    for(var i=0;i < teams.length; i++){
        teamsIdByName[teams[i].shortName.toLowerCase()] = {
            "id": teams[i].id,
            "name": teams[i].name,
            "shortName": teams[i].shortName,
            "clubColors": teams[i].clubColors
        };
    }
}

//Genera in #squadre i box relativi alle partite 
function getMatchesByTeam(squadra) {
    var added = false;
    for(var i=0;i < matches.length; i++){
        if(matches[i].homeTeam === squadra || matches[i].awayTeam === squadra){
            added = true;
            var s = '<form class="box-offerta">\
                        <div class="match-box">\
                            <label class="homeTeam">' + matches[i].homeTeam + '</label> - <label class="awayTeam">' + matches[i].awayTeam + '</label>\
                        </div>\
                        <a id="cercaOfferte" class="button link-offerta" href="#persone">Vedi offerte</a>\
                    </form>';
            $(s).appendTo("#squadre");
        }
    }
    if(!added){
        searchError("Nessuna partita della squadra cercata");
    }
}

//Crea un messaggio di errore se la ricerca della squadra ha portato ad un errore
function searchError(err){
    var messaggio = '<div class="nome-partita">' + err + '</div>';
    $(messaggio).appendTo("#squadre");
}

//Cerca le offerte nel database e le inserisce in #offerte
function creaOfferta(homeTeam,awayTeam,offerenti) {
    $("#divOfferte").empty();
    $("#scrittaOfferte").text("OFFERTE:");

    for(var i=0;i < offerenti.length;i++){
        var o = offerenti[i].value;
        if(o.ospitante !== JSON.parse(localStorage.utente).username && !o.codaRichieste.includes(JSON.parse(localStorage.utente).username)){
            var wrapper = '<form class="box-offerta">\
                                <div class="info-offerta">\
                                    <div>\
                                        <a class="link-profilo">' + o.ospitante + '</a>\
                                    </div>\
                                    <label>' + homeTeam + ' - ' + awayTeam + '</label>\
                                    <a class="button upload-offerta offerta-cerca">Richiedi</a>\
                                    <input type="hidden" value="'+ o._id + '" />\
                                </div>\
                            </form>';
    
            $(wrapper).appendTo("#divOfferte");
        }
    }

}

//---------------------------------------------------------------------------------------------------------------------------------------

/*************************************************************************************** 
 * EVENT HANDLERS                                                                      *
 ***************************************************************************************/

$(document).ready(function(){

    //All'inizio carico tutte le squadre
    /*var request = $.ajax({
        headers: { 'X-Auth-Token': '9d86980a76af481d8388321e25ab6dd0' },
        url: 'https://api.football-data.org/v2/competitions/CL/teams',
        dataType: 'json',
        type: 'GET',
    });

    request.done(function(msg) {
        getTeams(msg.teams);
    });

    request.fail(function(msg) {
        alert(msg);
    });*/

    //--------------------------------------------------------------------------------------------


    //Event handler del bottone cerca
    $("#cercaSquadra").click(function(){
        cercaSquadra();
    });


    //--------------------------------------------------------------------------------------------

    //Barra di ricerca di dietro, quando cambia il valore carico offerte diverse
    $('#back-search').change(function() {
            console.log("ok");
            if($(this).val() !== ""){
                cercaSquadra();
            }
            else{
                $("#squadre").empty();
                $("#divOfferte").empty();
                $("#scrittaOfferte").empty();
            }
    });

    //Barra di ricerca di davanti
    $('#front-search').on({

        //Cambiando il valore dell'input suggerisco un valore e carico le partite della squadra suggerita
        'input propertychange': function() {
            setSuggestion();
        },

        'keyup': function(event){
            //Invio (eseguo la stessa funzione del pulsante cerca)
            if (event.keyCode === 13) {
                $("#cercaSquadra")[0].click();
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
    /*$("#squadre").on('click', '#chiediPersone', function(){
        chiediPersone($(this).siblings(".nome-partita").text());
    });*/

    //--------------------------------------------------------------------------------------------

    //Bottone cerca Offerte
    $("#squadre").on('click', '#cercaOfferte', function(){
        //var adulti = $("#adulti").val();
        //var bambini = $("#bambini").val();

        var homeTeam = $(this).siblings(".match-box").children(".homeTeam").text();
        var awayTeam = $(this).siblings(".match-box").children(".awayTeam").text();

        var parametri = {
            "homeTeam": homeTeam,
            "awayTeam": awayTeam,
        };

        var c = $.ajax({
            type: "GET",
            url: "/caricaOfferte",
            dataType: "json",
            data: parametri
        });

        c.done(function(msg) {
            creaOfferta(homeTeam,awayTeam,msg.rows);
        });
    
        c.fail(function(err){
            alert("Errore nella ricerca delle offerte " + JSON.stringify(err));
        });

    });

    //--------------------------------------------------------------------------------------------

    //Bottone metti in coda offerta
    $("#divOfferte").on("click",".upload-offerta", function(){
        var t = this;
        var parametri = {
            "id": $(t).siblings("input[type=hidden]").val(),
        };

        var c = $.ajax({
            type: "POST",
            url: "/inviaRichiesta",
            dataType: "json",
            data: parametri
        });

        c.done(function(msg) {
            alert(JSON.stringify(msg));
            $(t).parent().parent().remove();
            window.location.replace("/utente/main.html");
        });
    
        c.fail(function(err){
            alert("Errore nella richiesta dell'offerta " + JSON.stringify(err));
        });

    });
});