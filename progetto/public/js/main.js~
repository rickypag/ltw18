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

//Contiene le offerte dell'utente che si sta visualizzando in quel momento
var offerteUtente = [];

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
    $("#" + page + "Page").remove();
    var t = '<div class="page" id="'+ page + 'Page" style="display: none;"></div>';
    $(t).appendTo("body");
    $("#" + page + "Page").load(page + ".html");
}


//Gestisce la nav bar
function changePage(page){
    if($('#' + page + 'Page').length === 0 || page === "profilo"){
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


function nuovaNotifica(classe,partita,descrizione){
    var t = "<div class='notification " + classe + "'>" +
                "<div/>" +
                    "<label class='partita'>" + partita + "</label>" +
                "<div>"  +
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

/***************************************************************************************
 * Gestione Recensioni Profilo                                                         *
 ***************************************************************************************/

//funzione invocata dal click sui buttons 'Ospitato' e 'Ospitante'
function selectEventi(evt, tipoRecensione, tipoProfilo) {
    var i, tabcontent, button;

    // Prendo tutti gli elementi con class="tabcontent" and li nascondo
    tabcontent = document.getElementsByClassName("tabcontent" + tipoProfilo);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Prendo tutti gli elementi con class="button" e rimuovo la classe "active"
    button = document.getElementsByClassName("btn-profilo");
    for (i = 0; i < button.length; i++) {
        button[i].className = button[i].className.replace(" active", "");
    }

    // Mostro la tab corrente e aggiungo un "active" class al bottone che ha aperto tab
    $("." + tipoRecensione + tipoProfilo).css("display","block");
    evt.currentTarget.className += " active";

    if(tipoRecensione=='OspitatoProfilo'){
        $(".OspitatoProfilo" + tipoProfilo).empty(); //svuoto la tab
        appendRecensioni('Ospitato',tipoProfilo);
    }

    else if(tipoRecensione=='OspitanteProfilo'){
        $(".OspitanteProfilo" + tipoProfilo).empty();//svuoto la tab
        appendRecensioni('Ospitante',tipoProfilo);
    }
}

//Scrive nelle giuste tab le recensioni
function appendRecensioni(type, tipoProfilo){
    var lis = offerteUtente;
    var username = JSON.parse(localStorage.utente).username;
    if(tipoProfilo === 'Altro'){
        username = offerteUtente[0];
    }
    if(type === 'Ospitato'){
        for(var i=1; i<lis.length; i++){
            if(lis[i].recensioneFattaDaOspitante && lis[i].ospitato == username){
                console.log(tipoProfilo);
                $(creaRecensione(lis[i].recensioneFattaDaOspitante, lis[i].ospitante)).appendTo('.OspitatoProfilo' + tipoProfilo);
            }
        }
    }
    else if(type === 'Ospitante'){
        for(var i=1; i<lis.length; i++){
            if(lis[i].recensioneFattaDaOspitato && lis[i].ospitante == username){
                console.log(tipoProfilo);
                $(creaRecensione(lis[i].recensioneFattaDaOspitato, lis[i].ospitato)).appendTo('.OspitanteProfilo' + tipoProfilo);
            }
        }
    }
}

//Crea una recensione dall'oggetto recensione in input
function creaRecensione(recensione, autore){
    var newRecensione='<div class="box-rec"><a class="titoloRec" >'+recensione.titolo+' '+'</a>'+'       Autore: <label class="utente-info utente-rec">'+autore+'</label>  '+creaStelle(recensione.numstelle) + '</div';
    return newRecensione;
}

//Crea stelle per la recensione con "val" stelle piene
function creaStelle(val){
    var stelle='';
    for(var i=1; i<=5; i++){
    if(i <= val) stelle+='<span class="fa fa-star checked"></span>'
    else stelle+='<span class="fa fa-star"></span>'
    }
    return stelle+='<br>';
}

//Mette quante offerte hai fatto e la media delle recensioni nel tuo profilo
function getInfoRecensioniPerProfilo(id,li){
    var listaContatori= [0,0,0]; //[numOfferte, numVolteOspitato, mediaRecensioni]
    var listaEventi = li;
    var contatore = 0;
    var somma = 0;
    for(var i=0; i < listaEventi.length; i++){
        if(listaEventi[i].ospitante == id && listaEventi[i].recensioneFattaDaOspitato){
            listaContatori[0]+=1;
            contatore++;
            somma+=parseInt(listaEventi[i].recensioneFattaDaOspitato.numstelle);
        }
        if(listaEventi[i].ospitato == id && listaEventi[i].recensioneFattaDaOspitante){
            listaContatori[1]+=1;
            contatore++;
            somma+= parseInt(listaEventi[i].recensioneFattaDaOspitante.numstelle);
        }
    }
    if(contatore !== 0){
        listaContatori[2]= (parseInt(somma/contatore + 0.5));
    }
    return listaContatori;
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
        $("#schermata-caricamento").remove();
        $("body").css("overflow-y","scroll");
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
        if(msg.errore){
            $("#schermata-caricamento").empty();
            var toAppend = "<div>Non è possibile scaricare i dati delle partite</div>";
            $(toAppend).appendTo("#schermata-caricamento");
        }
        else{
            setSquadre(msg.teams);
            getSquadreHome();
            iniziaProgramma();
        }
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
        if(msg.errore){
            $("#schermata-caricamento").empty();
            var toAppend = "<div>Non è possibile scaricare i dati delle partite</div>";
            $(toAppend).appendTo("#schermata-caricamento");
        }
        else{
            setPartite(msg.matches);
            iniziaProgramma();
        }
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
        addPage("profiloAltro");
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

    }
}

//Data un'offerta di cui l'utente è ospitante creo il box che contiene i form con le richieste di altri utenti
//Nel caso in cui non ci siano richieste il wrapper contiene un messaggio "Non ci sono richieste per questa offerta"
function creaWrapperPerOfferta(offerta){
    var nuovaOfferta = $(".div-offerta-da-accettare:first").clone();
    nuovaOfferta.children(".offerta-da-accettare-partita").text(stringPartita(offerta.homeTeam,offerta.awayTeam));
    nuovaOfferta.children(".offerta-da-accettare-id").val(offerta._id + "-offerta-da-accettare");
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

    console.log(altroUtente);

    var nuovaRecensione = $(".div-recensione:first").clone();
    nuovaRecensione.children(".recensione-da-fare-partita").text(stringPartita(recensione.homeTeam,recensione.awayTeam));
    nuovaRecensione.children(".recensione-da-fare-id").val(recensione._id + "-recensione-da-fare");
    if(ifOspitato === "Ospitante"){
        nuovaRecensione.children(".recensione-da-fare-tipologia").text("Hai ospitato:");
    }
    else{
        nuovaRecensione.children(".recensione-da-fare-tipologia").text("Sei stato ospitato da:");
    }
    nuovaRecensione.children(".recensione-da-fare-altro").text(altroUtente);
    nuovaRecensione.children(".recensione-da-fare-tipologia").children("a").addClass("if" + ifOspitato + "img");
    console.log(nuovaRecensione.html());
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
    nuovaOffertaAccettata.children(".offerta-accettata-id").val(offerta._id + "-offerta-accettata");
    if(ifOspitato === "Ospitante"){
        nuovaOffertaAccettata.children(".offerta-accettata-tipologia").text("Hai ospitato:");
    }
    else{
        nuovaOffertaAccettata.children(".offerta-accettata-tipologia").text("Sei stato ospitato da:");
    }
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
        }, 2000);
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
        var mioUsername = JSON.parse(localStorage.utente).username;

        //Per prima cosa controllo se l'id dell'offerta è già presente tra le mie offerte.
        //Le uniche modifiche che potrebbero essere avvenute sono in #offerte-accettate e #recensioni-da-fare
        //ma solo se sono ospitato. Altrimenti il cambiamento verrebbe generato non appena creo un'offerta
        //o accetto una richiesta
        if(!offerteAccettate[offerta._id]){
            if(offerta.ospitato === mioUsername){
                //Notifico l'aggiornamento
                var n = nuovaNotifica("",stringPartita(offerta.homeTeam,offerta.awayTeam),offerta.ospitante + " ha accettato di ospitarti");
                aggiungiNotifica(n);

                n = nuovaNotifica("recensione-not",stringPartita(offerta.homeTeam,offerta.awayTeam),"Scrivi una recensione su " + offerta.ospitante + " per sapere agli altri come ti sei trovato");
                aggiungiNotifica(n);
                console.log("Notifica: " + offerta._id);

                creaBoxOffertaAccettata(offerta.id,offerta,"Ospitato");
                creaBoxRecensioneDaFare(offerta.id,offerta,"Ospitato");
            }
        }
        //Oppure qualcuno potrebbe aver scritto una recensione su di me
        else{
            if(offerteAccettate[offerta._id].ospitato === mioUsername && !offerteAccettate[offerta._id].recensioneFattaDaOspitante && offerta.recensioneFattaDaOspitante){
                offerteAccettate[offerta._id].recensioneFattaDaOspitante = offerta.recensioneFattaDaOspitante;
                var n = nuovaNotifica("",stringPartita(offerta.homeTeam,offerta.awayTeam),offerta.ospitante + " ha appena scritto una recensione su di te");
                aggiungiNotifica(n);
            }
            else if(offerteAccettate[offerta._id].ospitante === mioUsername && !offerteAccettate[offerta._id].recensioneFattaDaOspitato && offerta.recensioneFattaDaOspitato){
                offerteAccettate[offerta._id].recensioneFattaDaOspitato = offerta.recensioneFattaDaOspitato;
                var n = nuovaNotifica("",stringPartita(offerta.homeTeam,offerta.awayTeam),offerta.ospitato + " ha appena scritto una recensione su di te");
                aggiungiNotifica(n);
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
                if(oldLen === 0){
                    $("input[value=" + offerta._id + "-offerta-da-accettare]").siblings(".offerta-da-accettare-ospiti").empty();
                }
                var boxRichieste = $("input[value=" + offerta._id + "-offerta-da-accettare]").siblings(".offerta-da-accettare-ospiti");
                inserisciRichiesta(boxRichieste,offerta._id,offerta.codaRichieste[j]);
                //Notifico l'aggiornamento
                var n = nuovaNotifica("",stringPartita(offerta.homeTeam,offerta.awayTeam),offerta.codaRichieste[j] + " ha fatto una richiesta");
                aggiungiNotifica(n);
            }
        }

        //Infine qualcuno potrebbe aver scritto una recensione su di me

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
    $("#recensioni-da-fare").on("click","span",function() {
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
        id = id.substring(0,id.length - "-offerta-da-accettare".length);
        console.log("id: " + id);
        var ospitato = $(t).siblings("label").text();

        var r = $.ajax({
            type: "POST",
            url: "/confermaRichiesta",
            dataType: "json",
            data: {"id":id,"ospitato":ospitato}
        });

        r.done(function(msg){
            $(t).parent().parent().parent().remove();
            offerteInCuiUtentePresente[msg.id].ospitato = ospitato;
            aggiungiNotifica(nuovaNotificaMessaggio("L'offerta è stata confermata"),"successo");
            creaBoxOffertaAccettata(msg.id,offerteInCuiUtentePresente[msg.id],"Ospitante");
            creaBoxRecensioneDaFare(msg.id,offerteInCuiUtentePresente[msg.id],"Ospitante");
            console.log($("#messaggiPage").length);
            if($("#messaggiPage").length){
                console.log("Inserisco il box");
                $(creaSidebarEntry(offerteInCuiUtentePresente[msg.id])).appendTo(".sidenav");

            }
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
        console.log(id);
        id = id.substring(0,id.length - "-recensioni-da-fare".length);
        console.log("id: " + id);

        //var persona = $(t).siblings(".recensione-da-fare-altro").text();
        var titolo = $(t).siblings(".recensione-da-fare-testo").children("input[type=text]").val();
        var stelle = $(t).siblings(".contenitore-stelle").children("input[type=hidden]").val();
        var params = {"id":id,"recensione": {"titolo":titolo,"numstelle":stelle}};
        if($(t).siblings(".recensione-da-fare-tipologia").text() === "Hai ospitato:"){
            params.ruolo = "ospitatante";
        }
        else{
            params.ruolo = "ospitato";
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
            aggiungiNotifica(nuovaNotificaMessaggio("La squadra in trasferta deve essere selezionata","errore"));
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
                if(msg.errore === "esiste"){
                    aggiungiNotifica(nuovaNotificaMessaggio("Hai già fatto un offerta per questa partita","errore"));
                    console.log("Hai già fatto un offerta per questa partita");
                }
                else if(msg.errore === "db"){
                    aggiungiNotifica(nuovaNotificaMessaggio("Errore nell'inserimento dell'offerta","errore"));
                    console.log("Errore nell'inserimento dell'offerta");
                }
            }
        });

        c.fail(function(err){
            aggiungiNotifica(nuovaNotificaMessaggio("Errore nell'inserimento dell'offerta","errore"));
            console.log("Errore nell'inserimento dell'offerta");
        });

    });

    //--------------------------------------------------------------------------------------------

    //Quando clicco su un utente mi appaiono le informazioni
    $("body").on("click",".utente-info", function(){
        var username = $(this).text();
        console.log(username);

        var c = $.ajax({
            type: "GET",
            url: "/utente",
            dataType: "json",
            data: {"username": username}
         });

        c.done(function(msg) {
            var utente = msg.rows[0].value;
            //Carico le recensioni dell'utente
            getRecensioni(username,utente);
        });

         c.fail(function(msg){
            aggiungiNotifica(nuovaNotificaMessaggio("Caricamento profilo fallito"),"errore");
            console.log("Non è possibile caricare l'utente");

         })

    })

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
                var not = nuovaNotifica("",partita,username + " ti ha inviato un messaggio");
                aggiungiNotifica(not);
            }
            else if($("#" + id + "-chat").css("display") === "none" || $("#messaggiPage").css("display") === "none"){
                inserisciMessaggio(id,msg.messaggio,ruolo);
                var not = nuovaNotifica("",partita,username + " ti ha inviato un messaggio");
                aggiungiNotifica(not);
                var box = document.getElementById(id + "-chat");
                box.scrollTop = box.scrollHeight;

            }
            else if($("#" + id + "-chat").length !== 0){
                inserisciMessaggio(id,msg.messaggio,ruolo);
                var box = document.getElementById(id + "-chat");
                console.log(box.innerHTML);
                box.scrollTop = box.scrollHeight;
            }
        }
    });

 });
