//Conterrà oggetti il cui nome è lo shortName e il valore è la coppia (nomeCompleto,id).
//In questo modo a partire dallo shortName che viene inserito nella barra della ricerca posso ottenere
//velocemente l'id, che mi serve per le API delle partite, e il nome, che verrà usato per
//l'autocompletamento
var teamsIdByShortName = {};
var teamsIdByName = {};

var countCaricamento = 3;

var listaNotifiche = [];
var countNotifiche = 0;

//Contiene i documenti/offerte in cui l'utente è presente (documento come è presente nel database)
var offerteInCuiUtentePresente = {};

var recensioniDaFare = {};

var offerteAccettate = {};



var matches = [];

//Funzione ausiliaria che data un'offerta mi ritorna l'username del'altro utente
function altroUtente(offerta){
    return (offerta.ospitato === JSON.parse(localStorage.utente).username)?offerta.ospitante:offerta.ospitato;
}

//Funzione ausiliaria che data un'offerta mi dice se ero Ospitante o Ospitato
function mioRuolo(offerta){
    return (offerta.ospitato === JSON.parse(localStorage.utente).username)?"Ospitato":"Ospitante";
}

//Funzione ausiliaria che data le squadre mi ritorna la stringa della partita
function stringPartita(ht,at){
    return ht + " - " + at;
}


//Aggiunge html alle pagine
function addPage(page){
    var t = '<div class="page" id="'+ page + 'Page" style="display: none;"></div>';
    $(t).appendTo("body");
    $("#" + page + "Page").load(page + ".html");
}


//Gestisce la nav bar
function changePage(page){
    if($('#' + page + 'Page').length === 0){
        console.log("Pagina " + page + " caricata");
        addPage(page);
    }
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
 * GESTIONE NOTIFICHE                                              *
 *******************************************************************/

//Creo gli stili delle notifiche che mi servono
/*function aggiungiStili(){
    //STILE NOTIFICHE NORMALI-AGGIORNAMENTI
    $.notify.addStyle('aggiornamento', {
        html: 
          "<div>" +
            "<div class='notify-aggiornamento'>" +
              "<div class='partita' data-notify-text='partita'/>" +
              "<div class='descrizione'>" +
                "<label class='utente' data-notify-text='username' /> " +
                "<label class='descrizione' data-notify-text='descrizione' />" +
              "</div>" +
            "</div>" +
          "</div>"
    });
}*/

function nuovaNotifica(partita,username,descrizione){
    var t = "<div class='notification'>" +
                "<div/>" + 
                    "<label class='partita'>" + partita + "</label>" +
                "<div>" +
                    "<label class='username' />" + username + "</label> " +
                    "<label class='descrizione' />" + descrizione + "</label>" +
                "</div>" +
            "</div>";
    return t;
}

function nuovaNotificaMessaggio(msg,stato){
    console.log("stato: " + stato);
    var t = "<div class='notification " + stato + "'>" + msg + "</div>";
    return t;
}

function aggiungiNotifica(notifica){
    if(listaNotifiche.length === 0){
        countNotifiche = 0;
    }
    $(notifica).appendTo("#notifications");
    var t = $(".notification:last");
    t.css("top",55 + (100+2)*countNotifiche + "px");
    t.slideDown();
    listaNotifiche.push(t);
    countNotifiche += 1;
    setTimeout(function(){
        t.slideUp();
        listaNotifiche.shift();
    },3000);
    
}

/*******************************************************************
 * CARICAMENTO AMBIENTE                                            *
 *******************************************************************/

//Quando l'utente si connette carico tutto quello che gli serve.
//Non appena tutto è stato caricato mostro la dashboard

//Ogni volta che un caricamento è completato chiamo questa funzione.
//Solo quando il contatore è 0 posso procedere con il programma
function iniziaProgramma(){
    countCaricamento--;
    if(countCaricamento === 0){
        //Una volta che ho caricato tutti gli elementi gli associo i gestori di eventi
        eventsHandler();
        $("#schermata-caricamento").css("display","none");
        console.log("Tutto a posto");
    }
}

//Carico le squadre e le metto in variabili globali
function getSquadre(){
    var request = $.ajax({
        url: '/teams',
        dataType: 'json',
        type: 'GET',
    });

    request.done(function(msg) {
        setSquadre(msg.teams);
        getSquadreHome();
        iniziaProgramma();
    });

    request.fail(function(msg) {
        console.log(msg);
    });
}

//Funzione chiamata all'inizio. Ottiene tutte le squadre e ne salva gli attributi che mi servono:
//                                         -id
//                                         -name
//                                         -shortName
function setSquadre(t) {
    teams = t;
    for(var i=0;i < teams.length; i++){
        teamsIdByShortName[teams[i].shortName.toLowerCase()] = {
            "id": teams[i].id,
            "name": teams[i].name,
            "shortName": teams[i].shortName
        };

        teamsIdByName[teams[i].name] = {
            "id": teams[i].id,
            "name": teams[i].name,
            "shortName": teams[i].shortName.toLowerCase()
        };
    }
    console.log("Squadre caricate (" + Object.keys(teamsIdByShortName).length + "," + Object.keys(teamsIdByShortName).length + ")");
}

//-------------------------------------------------------------------------------------

//Carico le partite e le metto in variabili globali
function getPartite(){
    var request = $.ajax({
        url: '/matches',
        dataType: 'json',
        type: 'GET',
    });

    request.done(function(msg) {
        setPartite(msg.matches);
        iniziaProgramma();
    });

    request.fail(function(msg) {
        console.log(msg);
    });
}

function setPartite(r) {
    for(var j=0;j < r.length;j++){
        if(r[j].status === "SCHEDULED"){
            matches.push({
                "homeTeam": teamsIdByName[r[j].homeTeam.name].shortName,
                "awayTeam": teamsIdByName[r[j].awayTeam.name].shortName
            });
        }
    }
    console.log("Partite caricate (" + matches.length + ")");
}

//-------------------------------------------------------------------------------------

//Carico le offerte dell'utente, le metto nel main e faccio partire il polling
function caricaMain(){

    var request = $.ajax({
        url: '/myOfferte',
        dataType: 'json',
        type: 'GET',
    });

    request.done(function(msg){
        console.log("Msg: " + JSON.stringify(msg.rows));
        inserisciOspitiDaAccettare(msg.rows);
        inserisciRecensioneDaFare(msg.rows);
        inserisciOfferteAccettate(msg.rows);
        polling();
        //popolaSideBar();
        iniziaProgramma();
    });

    request.fail(function(err){
       console.log(err);
    });
}

//---------------------------------------------------------------------------------------------------------------------------------------

/*******************************************************************
 * HTML DINAMICO                                                   *
 *******************************************************************/

//Dopo aver caricato le squadre le metto nel menu a tendina
function getSquadreHome(){
    var lista = Object.keys(teamsIdByShortName);
    console.log("len: " + lista.length);
    var x = document.getElementById("selPartitaHome");
    for(var i=0; i < lista.length; i++){
        var option = document.createElement("option");
        option.text = lista[i];
        option.value = lista[i];
        x.add(option);
    }
    console.log("SquadreHome caricate");
}

//E la squadra in trasferta la metto a seconda della partita
function getSquadreAway(sq){
    var lista = matches;
    console.log(JSON.stringify(matches));
    var x = document.getElementById("selPartitaAway");
    var optionNull = document.createElement("option");
            optionNull.text = "---";
            optionNull.value = "null";
            x.add(optionNull);
    for(var i=0; i < lista.length; i++){
        console.log(sq);
        if(lista[i].homeTeam == sq){
            var option = document.createElement("option");
            option.text = lista[i].awayTeam;
            option.value = lista[i].awayTeam;
            x.add(option);
        }
    }
}

//Cambia il colore delle stelle quando le clicchi
function stellaCliccata_A(list, value){
    var num = value;
    for(var i=0; i<5; i++){
        if(i<num){
            list[i].className="fa fa-star checked stella" + i;
        }
        else{
            list[i].className="fa fa-star stella" + i;
        }
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------

//FUNZIONE CHIAMATA ALL'INIZIO
//Prendo la lista delle offerte dell'utente e le metto in #ospiti-da-accettare
function inserisciOspitiDaAccettare(listaOfferte){
    //nascondo gli esempi
    $("#div-offerta-da-accettare-esempio").css('display','none');
    for(var i=0;i < listaOfferte.length;i++){
        var docId = listaOfferte[i].id;

        //Se l'ospite ancora non esiste e se l'offerta non è stata caricata la carico
        if(!listaOfferte[i].value.ospitato && !offerteInCuiUtentePresente[docId]){
            offerteInCuiUtentePresente[docId] = listaOfferte[i].value;
            creaWrapperPerOfferta(listaOfferte[i].value);
        }

        //Altrimenti carico le eventuali nuove richieste
        /*else{
            for(var j=0;j < listaOfferte[i].value.codaRichieste.length;j++){
                var usernameRichiedente = listaOfferte[i].value.codaRichieste[j];
                if(!(offerteInCuiUtentePresente[docId].codaRichieste).includes(usernameRichiedente)){
                    toAppend = creaBoxRichiesta(docId,[usernameRichiedente]);
                    $(toAppend).appendTo("#" + docId);
                }
            }
        }*/
    }
}

//Data un'offerta di cui l'utente è ospitante creo il box che contiene i form con le richieste di altri utenti
//Nel caso in cui non ci siano richieste il wrapper contiene un messaggio "Non ci sono richieste per questa offerta"
function creaWrapperPerOfferta(offerta){
    /*var toAppend = '<div id="' + offerta._id + '" class="box-offerta div-offerta-da-accettare">' + stringPartita(offerta.homeTeam,offerta.awayTeam);
    toAppend += '<input id="offerta-da-accettare-id" type="hidden" value="' + offerta._id + '" >';
    toAppend += creaBoxRichiesta(offerta._id,offerta.codaRichieste);
    toAppend += '</div>';*/
    var nuovaOfferta = $(".div-offerta-da-accettare:first").clone();
    nuovaOfferta.children(".offerta-da-accettare-partita").text(stringPartita(offerta.homeTeam,offerta.awayTeam));
    nuovaOfferta.children(".offerta-da-accettare-id").val(offerta._id);
    //nuovaOfferta.children(".offerta-da-accettare-ospiti").text("Non ci sono richieste");
    creaBoxRichiesta(nuovaOfferta,offerta._id,offerta.codaRichieste);
    $(nuovaOfferta).appendTo("#ospiti-da-accettare");
}

//Data una coda di richieste per un offerta mette nell'offerta i box con le richieste
function creaBoxRichiesta(boxOfferta,id,codaRichieste){
    if(codaRichieste.length !== 0){
        //boxOfferta.children(".offerta-da-accettare-ospiti").empty();
        
        var boxRichieste = boxOfferta.children(".offerta-da-accettare-ospiti");
        boxRichieste.empty();
        var len = codaRichieste.length;
        for(var j=0;j < len;j++){
            inserisciRichiesta(boxRichieste,id,codaRichieste[j]);
        }
    }
}

//Data una singola richiesta la aggiunge al box corrispondente
function inserisciRichiesta(boxRichieste,id,username){
    var nuovaRichiesta = $(".offerta-da-accettare-ospite:first").clone();
    nuovaRichiesta.children("label").text(username);
    $(nuovaRichiesta).appendTo(boxRichieste);
}

//FUNZIONE CHIAMATA ALL'INIZIO PER LE RECENSIONI
//Data la lista delle recensioni le metto nel box recensioni da fare (se non sono già presenti)
//ifOspitato vale "Ospitante" o "Ospitato"
function inserisciRecensioneDaFare(listaOfferte){
    //nascondo gli esempi
    $("#div-recensione-esempio").css('display','none');

    for(var i=0;i < listaOfferte.length;i++){
        var doc = listaOfferte[i];
        //Se la recensioneDaFare non è presente nella pagina e se l'ospite esiste la metto
        if(doc.value.ospitato && !recensioniDaFare[doc.id]){
            if(doc.value.ospitato === JSON.parse(localStorage.utente).username && !doc.value.recensioneFattaDaOspitato){
                creaBoxRecensioneDaFare(doc.id,doc.value,"Ospitato");
            } 
            else if(doc.value.ospitante === JSON.parse(localStorage.utente).username && !doc.value.recensioneFattaDaOspitante){
                creaBoxRecensioneDaFare(doc.id,doc.value,"Ospitante");
            }
        }
    }
}

//Data una recensioneDaFare la metto nel box recensioni da fare
function creaBoxRecensioneDaFare(id,recensione,ifOspitato){
    recensioniDaFare[id] = recensione;

    var altroUtente;
    if(ifOspitato === "Ospitato") altroUtente = recensione.ospitante;
    else altroUtente = recensione.ospitato;

    /*var toAppend = '<div class="box-offerta div-offerta-da-accettare">' + stringPartita(recensione.homeTeam,recensione.awayTeam);
    toAppend += '<input id="recensione-da-fare-id" type="hidden" value="' + recensione._id + '" >';
    toAppend += '<div class="tipologia">' + ifOspitato + '</div>';
    toAppend += '<div class="recensione-da-fare-altro-utente">' + altroUtente + '</div>';
    toAppend += '<input id="recensione-da-fare-testo" type="text">';
    toAppend += '<input id="recensione-da-fare-stelle" type="numeric">';
    toAppend += '<a class="button" id="button-inserisci-recensione">Invia</a>';
    toAppend += '</div>';*/

    var nuovaRecensione = $(".div-recensione:first").clone();
    nuovaRecensione.children(".recensione-da-fare-partita").text(stringPartita(recensione.homeTeam,recensione.awayTeam));
    nuovaRecensione.children(".recensione-da-fare-id").val(recensione._id);
    nuovaRecensione.children(".recensione-da-fare-tipologia").text(ifOspitato);
    nuovaRecensione.children(".recensione-da-fare-altro").text(altroUtente);
    nuovaRecensione.children(".recensione-da-fare-tipologia").children("a").addClass("if" + ifOspitato + "img");

    $(nuovaRecensione).appendTo("#recensioni-da-fare");
}

//FUNZIONE CHIAMATA ALL'INIZIO PER LE OFFERTE ACCETTATE
function inserisciOfferteAccettate(listaOfferte){
    //nascondo gli esempi
    $("#div-offerte-accettate-esempio").css('display','none');

    for(var i=0;i < listaOfferte.length;i++){
        var doc = listaOfferte[i];
        //Se l'offerta accettata non è presente la inserisco
        if(doc.value.ospitato && !offerteAccettate[doc.id]){
            offerteInCuiUtentePresente[doc.id] = doc.value;
            if(doc.value.ospitato === JSON.parse(localStorage.utente).username){
                creaBoxOffertaAccettata(doc.id,doc.value,"Ospitato");
            }
            else if(doc.value.ospitante === JSON.parse(localStorage.utente).username){
                creaBoxOffertaAccettata(doc.id,doc.value,"Ospitante");
            }
        }
    }
}

//Data un'offerta accettate la metto in #offerte-accettate
function creaBoxOffertaAccettata(id,offerta,ifOspitato){
    offerteAccettate[id] = offerta;
    console.log("Offerta accettata: " + id);
    
    var altroUtente;
    if(ifOspitato === "Ospitato") altroUtente = offerta.ospitante;
    else altroUtente = offerta.ospitato;

    var nuovaOffertaAccettata = $(".div-offerta-accettata:first").clone();
    nuovaOffertaAccettata.children(".offerta-accettata-partita").text(stringPartita(offerta.homeTeam,offerta.awayTeam));
    nuovaOffertaAccettata.children(".offerta-accettata-id").val(offerta._id);
    nuovaOffertaAccettata.children(".offerta-accettata-tipologia").text(ifOspitato);
    nuovaOffertaAccettata.children(".offerta-accettata-altro").text(altroUtente);

    $(nuovaOffertaAccettata).appendTo("#offerte-accettate");
}

//---------------------------------------------------------------------------------------------------------------------------------------

//POLLING
function polling(){
    var r = $.ajax({
        url: '/myOfferte',
        dataType: 'json',
        type: 'GET',
    });
    
    r.done(function(msg){
        setTimeout(function(){
            controllaCambiamenti(msg.rows);
            polling();
        }, 3000);
    });

    r.fail(function(err){
        alert(JSON.stringify(err) + "   fermo il polling");
        return null;
    });
}


//Vedo se qualche offerta è cambiata
function controllaCambiamenti(listaOfferte){
    for(var i=0;i < listaOfferte.length;i++){
        var offerta = listaOfferte[i].value;

        //Per prima cosa controllo se l'id dell'offerta è già presente tra le mie offerte.
        //Le uniche modifiche che potrebbero essere avvenute sono in #offerte-accettate e #recensioni-da-fare
        //ma solo se sono ospitato. Altrimenti il cambiamento verrebbe generato non appena creo un'offerta
        //o accetto una richiesta
        if(!offerteAccettate[offerta._id]){
            if(offerta.ospitato === JSON.parse(localStorage.utente).username){
                //Notifico l'aggiornamento
                var n = nuovaNotifica(stringPartita(offerta.homeTeam,offerta.awayTeam),offerta.ospitante,"ha accettato di ospitarti");
                aggiungiNotifica(n);
                console.log("Notifica: " + offerta._id);

                creaBoxOffertaAccettata(offerta.id,offerta,"Ospitato");
                creaBoxRecensioneDaFare(offerta.id,offerta,"Ospitato");
            }
        }
        //Altrimenti controllo se altri utenti hanno fatto rischiesta per un'offerta.
        //In questo caso gli unici cambiamenti possibili sono solo quelli in cui un utente
        //fa richiesta alla mia offerta
        var oldLen = offerteInCuiUtentePresente[offerta._id].codaRichieste.length;
        var newLen = offerta.codaRichieste.length;
        if(oldLen < newLen){
            for(var j=oldLen;j < newLen;j++){
                offerteInCuiUtentePresente[offerta._id].codaRichieste.push(offerta.codaRichieste[j]);
                var boxRichieste = $("input[value=" + offerta._id + "]").siblings(".offerta-da-accettare-ospiti");
                inserisciRichiesta(boxRichieste,offerta._id,offerta.codaRichieste[j]);
                //Notifico l'aggiornamento
                var n = nuovaNotifica(stringPartita(offerta.homeTeam,offerta.awayTeam),offerta.codaRichieste[j],"ha fatto una richiesta");
                aggiungiNotifica(n);                
            }
        }
    }
}


/*******************************************************************
* EVENT HANDLER                                                    *
*******************************************************************/

function eventsHandler(){
    //Quando seleziono una squadra dal menu a tendina automaticamente mi aggiorna le squadreAway
    $("#selPartitaHome").change(function() {
        $("#selPartitaAway").children().remove();
        var squadraHome = $("#selPartitaHome").val();
        getSquadreAway(squadraHome);
    });

    //--------------------------------------------------------------------------------------------
    
    //Quando clicco una stella evidenzio le stelle per quella recensione
    $(".div-recensione").on("click","span",function() {
        console.log("stella cliccata");
        var list = $(this).parent().children("span");
        var c = $(this).attr("class");
        var value = parseInt(c[c.length-1]) + 1;
        stellaCliccata_A(list, value);
        //Aggiorno il valore
        $(this).siblings("input[type=hidden]").val(value);
    });
    
    //--------------------------------------------------------------------------------------------

    //Confermo la richiesta di un utente
    $("#ospiti-da-accettare").on("click",".bt-ospita",function(){
        var t = this;
        var id = $(t).parent().parent().siblings(".offerta-da-accettare-id").val();
        var ospitato = $(t).siblings("label").text();

        var r = $.ajax({
            type: "POST",
            url: "/confermaRichiesta",
            dataType: "json",
            data: {"id":id,"ospitato":ospitato} //localStorage.utente.username
        });
    
        r.done(function(msg){
            alert(JSON.stringify(msg));
            $(t).parent().parent().parent().remove();
            aggiungiNotifica(nuovaNotificaMessaggio("L'offerta è stata confermata"),"successo");
            creaBoxOffertaAccettata(msg.id,offerteInCuiUtentePresente[msg.id],"Ospitante");
            creaBoxRecensioneDaFare(msg.id,offerteInCuiUtentePresente[msg.id],"Ospitante");
        });
    
        r.fail(function(err){
            console.log(JSON.stringify(err));
            aggiungiNotifica(nuovaNotificaMessaggio("C'è stato un errore nella conferma della richiesta"),"errore");
        });
    });

    //--------------------------------------------------------------------------------------------

    //Invio una recensione
    $("#recensioni-da-fare").on("click","#button-inserisci-recensione",function(){
        var t = this;
        var id = $(t).siblings("input[type=hidden]").val();

        //var persona = $(t).siblings(".recensione-da-fare-altro").text();
        var titolo = $(t).siblings(".recensione-da-fare-testo").children("input[type=text]").val();
        var stelle = $(t).siblings(".contenitore-stelle").children("input[type=hidden]").val();
        var params = {"id":id,"recensione": {"titolo":titolo,"numStelle":stelle}};
        if($(t).siblings("#ifOspitante").val() === "Eri Ospitato"){
            params.ruolo = "ospitato";
        }
        else{
            params.ruolo = "ospitante";
        }

        console.log(JSON.stringify(params));

        var r = $.ajax({
            type: "POST",
            url: "/inviaRecensione",
            dataType: "json",
            data: params
        });
    
        r.done(function(msg){
            console.log("Recensione inviata con successo: " + JSON.stringify(msg));
            aggiungiNotifica(nuovaNotificaMessaggio("La recensione è stata inviata con successo"),"successo");
            $(t).closest("div").remove();
        });
    
        r.fail(function(err){
            aggiungiNotifica(nuovaNotificaMessaggio("Errore nell'invio delle recensione"),"errore");
        });
    });

    //--------------------------------------------------------------------------------------------


    //Crea offerta
    $("#creaOfferta").click(function(){

        var homeTeam = $("#nuova-offerta select[name=selPartitaHome]").val();
        var awayTeam = $("#nuova-offerta select[name=selPartitaAway]").val();
        console.log(stringPartita(homeTeam,awayTeam));
        if(homeTeam === "null"){
            aggiungiNotifica(nuovaNotificaMessaggio("La squadra di casa deve essere selezionata","errore"));
            return;
        }
        else if(awayTeam === "null"){
            aggiungiNotifica(nuovaNotificaMessaggio("La squadra in trasferta deve essere selzionata","errore"));
            return;
        }

        var offerta = {
            "homeTeam": homeTeam,
            "awayTeam": awayTeam
        };

        var c = $.ajax({
           type: "POST",
           url: "/aggiungiOfferta",
           dataType: "json",
           data: offerta
        });

        c.done(function(msg) {
            if(msg.ok === true){
                console.log("Offerta inserita");
                var offerta = [{
                    "id": msg.id,
                    "value": {
                        "_id": msg.id,
                        "homeTeam": homeTeam,
                        "awayTeam": awayTeam,
                        "codaRichieste": []
                    }
                }];
                aggiungiNotifica(nuovaNotificaMessaggio("L'offerta è stata inserita con successo","successo"));
                inserisciOspitiDaAccettare(offerta);
            }
            else{
                aggiungiNotifica(nuovaNotificaMessaggio("Errore nell'inserimento dell'offerta","errore"));
                console.log("Errore nell'inserimento dell'offerta");
            }
        });
    
        c.fail(function(err){
            alert("Errore nell'inserimento dell'offerta " + JSON.stringify(err));
        });
    
    });


    //All'inizio carico tutti i documenti

    //home
    /*$("#homePage").load("homepage.html", function(){
        console.log("main caricato");
    });*/
    /*var request = $.ajax({
        url: "http://127.0.0.1:8888/utente/homepage.html",
        dataType: "html",
        type: "GET"
    });

    request.done(function(msg) {
        $("#homePage").html(msg);
    });

    request.fail(function(err) {
        alert("no home");
    });

    //cerca
    $("#cercaPage").load("index.html"); 
    /*request = $.ajax({
        url: "http://127.0.0.1:8888/utente/index.html",
        dataType: "html",
        type: "GET"
    });

    request.done(function(msg) {
        $("#cercaPage").html(msg);
    });

    request.fail(function(msg) {
        alert("no cerca");
    });

    //mio profilo
    $("#profiloPage").load("profilo.html");

    //profilo di altri utenti
    $("#utentePage").load("utente.html");

    //messaggi
    $("#messaggiPage").load("messaggi.html"); 

    //-------------------------------------------------------------------------------------

    //Carico tutte le offerte dell'utente nel localStorage
    var r = $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8888/utente/loadOfferte",
        dataType: "json",
        data: {"username":"pippo"} //localStorage.utente.username
    });

    r.done(function(msg){
        for(var i=0;i < msg.length;i++){
            aggiungiSelezioneOspiti(msg[i].value);
            creaAggiungiRecensione(msg[i].value);
        }
        polling();
    });

    r.fail(function(err){
        alert(JSON.stringify(err));
    });*/

    //-------------------------------------------------------------------------------------

    //Gestione della navbar
    $(".nav-bar-top a").click(function(){
        //aggiungiNotifica(nuovaNotifica("inter - napoli","pinco pallino","ha fatto una richiesta"));
        changePage(this.id);
    });

}



/*******************************************************************
 * MAIN                                                            *
 *******************************************************************/

$(document).ready(function(){
    getSquadre();
    getPartite();
    caricaMain();

    /*******************************************************************
     * GESTIONE WEBSOCKET                                              *
     *******************************************************************/

    var socket = io();

    socket.on('messaggio', function(msg){
        console.log("Hai ricevuto un messaggio");
        var id = msg.id;
        var ruolo = msg.ruolo;
        var username = msg.mittente;
        var partita = msg.partita;
        //var ruolo = $("input[value=" + id + "]").siblings(".ruolo").text();
        //var username = $("input[value=" + id + "]").siblings(".username").text();
        //var partita = $("input[value=" + id + "]").siblings(".partita").text();
        if(username !== JSON.parse(localStorage.utente).username){
            if($("#" + id + "-chat").length === 0){
                var not = nuovaNotifica(partita,username,"ti ha inviato un messaggio");
                aggiungiNotifica(not);
            }
            else if($("#" + id + "-chat").css("display") === "none"){
                inserisciMessaggio(id,msg.messaggio,ruolo);
                var not = nuovaNotifica(partita,username);
                aggiungiNotifica(not);
            }
            else if($("#" + id + "-chat").length !== 0){
                inserisciMessaggio(id,msg.messaggio,ruolo);
            }
        }
    });

 });
