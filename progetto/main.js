//Conterrà tutti gli oggetti team così come arrivano dalle API
var teams = [];

//Conterrà oggetti il cui nome è lo shortName e il valore è la coppia (nomeCompleto,id).
//In questo modo a partire dallo shortName che viene inserito nella barra della ricerca posso ottenere
//velocemente l'id, che mi serve per le API delle partite, e il nome, che verrà usato per
//l'autocompletamento
var teamsIdByShortName = [];
var matches = [];

function getMatches(r) {
    alert("prima");
    for(var i=0;i < r.length;i++){
        matches.push({"homeTeam": r[i].homeTeam.name,"awayTeam":r[i].awayTeam.name});
    }
    localStorage.matches = JSON.stringify(matches);
    alert("partite inserite");
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
    localStorage.teamsIdByShortName = JSON.stringify(teamsIdByShortName);
}

//Gestisce la nav bar
function changePage(page){
    $(".page").css('display','none');
    $("#" + page + "Page").css('display','block');
}

function tmp(page) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("page");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("buttonNavBar");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(page + "Page").style.display = "block";
    evt.currentTarget.className += " active";
  }



/*******************************************************************
 * EVENT HANDLERS                                                  *
 *******************************************************************/

 $(document).ready(function(){
    alert("main caricato");

    //Popolo il localStorage
    var request = $.ajax({
        headers: { 'X-Auth-Token': '9d86980a76af481d8388321e25ab6dd0' },
        url: 'https://api.football-data.org/v2/competitions/CL/matches',
        dataType: 'json',
        type: 'GET',
    });

    request.done(function(msg) {
        getMatches(msg.matches);
    });

    request.fail(function(msg) {
        searchError("Ops! Sembra che ci sia un errore con il server");
    });

    //All'inizio carico tutti i documenti

    //home
    var request = $.ajax({
        url: "http://localhost:8888/utente/homepage.html",
        dataType: "html",
        type: "GET"
    });

    request.done(function(msg) {
        $("#homePage").html(msg);
    });

    request.fail(function(msg) {
        alert("no home");
    });

    //cerca
    request = $.ajax({
        url: "http://localhost:8888/utente/index.html",
        dataType: "html",
        type: "GET"
    });

    request.done(function(msg) {
        $("#cercaPage").html(msg);
    });

    request.fail(function(msg) {
        alert("no cerca");
    });

    //Profilo
    //to do

    //-------------------------------------------------------------------------------------

    //Gestione della navbar
    $(".buttonNavBar").click(function(){
        changePage(this.id);
    });

 });