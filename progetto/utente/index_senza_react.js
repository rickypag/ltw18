//Conterrà tutti gli oggetti team così come arrivano dalle API
var teams = [];

//Conterrà oggetti il cui nome è lo shortName e il valore è la coppia (nomeCompleto,id).
//In questo modo a partire dallo shortName che viene inserito nella barra della ricerca posso ottenere
//velocemente l'id, che mi serve per le API delle partite, e il nome, che verrà usato per
//l'autocompletamento
var teamsIdByShortName = [];

function setSuggestion(letter) {
    var inizio = $("#front-search").val() + letter;
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

/*
$( function() {
    $( "#front-search" ).autocomplete({
      source: teamsNames
    });
  } );
*/

function getTeams(response) {
    teams = response.teams;
    for(var i=0;i < teams.length; i++){
        teamsIdByShortName[teams[i].shortName.toLowerCase()] = {
            "id": teams[i].id,
            "name": teams[i].name,
            "shortName": teams[i].shortName,
            "clubColors": teams[i].clubColors
        };
    }
}

function getMatchesByTeam(response) {
    var matches = response.matches;
    for(var i=0;i < matches.length; i++){
        if(matches[i].competition.id === 2001){//} && matches[i].status === "SCHEDULED"){
            var s = '<form class="box-offerta">\
                        <div class="nome-partita">' + matches[i].homeTeam.name + ' - ' + matches[i].awayTeam.name + '</div>\
                        <a class="button link-offerta" href="offerte.html">Vedi offerte</a>\
                    </form>';
            $(s).appendTo("#squadre");
        }
    }
}

$(document).ready(function(){

    var request = $.ajax({
        headers: { 'X-Auth-Token': '9d86980a76af481d8388321e25ab6dd0' },
        url: 'https://api.football-data.org/v2/competitions/CL/teams',
        dataType: 'json',
        type: 'GET',
    });

    request.done(function(msg) {
        getTeams(msg);
    });

    //Event handler del bottone cerca
    $("#cerca").click(function(){
        $("#squadre").empty();

        var squadraId = teamsIdByShortName[$("#front-search").val().toLowerCase()].id;

        var request = $.ajax({
            headers: { 'X-Auth-Token': '9d86980a76af481d8388321e25ab6dd0' },
            url: 'https://api.football-data.org/v2/teams/' + squadraId + '/matches',
            dataType: 'json',
            type: 'GET',
        });

        request.done(function(msg) {
            getMatchesByTeam(msg);
        });

        request.fail(function(msg) {
            alert("Richiesta fallita");
        });
    });

    $("#front-search").keyup(function(event) {
        //Invio
        if (event.keyCode === 13) {
            $("#cerca").click();
        }
    });

    /*$("#front-search").on("cut copy paste",function(e) {
        e.preventDefault();
     });

     $("#back-search").on("cut copy paste",function(e) {
        e.preventDefault();
     });*/

    $("#front-search").keydown(function(event) {
        //Freccia destra
        if(event.keyCode === 39){
            var newValue = $("#back-search").val().toLowerCase();
            newValue = teamsIdByShortName[newValue].shortName;
            $("#front-search").val(newValue);
            $("#back-search").val(newValue);
        }
        //Lettere
        else if(65 <= event.keyCode && event.keyCode <= 90 && event.keyCode !== 32){
            if(event.shiftKey){
                setSuggestion(String.fromCharCode(event.keyCode));
            }else{
                setSuggestion(String.fromCharCode(event.keyCode + 32));
            }
        }
        //Numeri e spazio
        else if(48 <= event.keyCode && event.keyCode <= 57 || event.keyCode === 32){
            setSuggestion(String.fromCharCode(event.keyCode));
        }
        //Backspace
        else if(event.keyCode === 8){
            var newValue = $("#front-search").val();
            $("#back-search").val("");//newValue.substring(0,newValue.length-1));
        }
    });
});