
//Le squadre caricate dal localStorage le inserisco nel menu a tendina
function setMatches(){
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
/*function printOfferta(offerte) {    
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

}*/

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
/*function aggiungiSelezioneOspiti(offerta){
    if(offerta.ospitante === "pippo" && !offerta.ospitato){
        ospitiDaAccettare[offerta._id] = offerta.codaRichieste;
        var toAppend = '<div id="' + offerta._id + '" class="box-offerta div-offerta-da-accettare">' + stringPartita(offerta.homeTeam,offerta.awayTeam);
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
}*/

//Mette in #recensioni-da-fare le richieste fatte all'ospitante
/*function creaAggiungiRecensione(offerta){
    if(offerta.ospitante === "pippo" && !offerta.recensioneFattaDaOspitante && offerta.ospitato && !recensioniDaFare.includes[offerta._id]){
        recensioniDaFare.push(offerta._id); 
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
    else if(offerta.ospitato === "pippo" && !offerta.recensioneFattaDaOspitato && !recensioniDaFare.includes[offerta._id]){
        recensioniDaFare.push(offerta._id); 
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
}*/


//---------------------------------------------------------------------------------------------------------------------------------------

//FUNZIONI CHE GENERANO HTML DINAMICO

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
        if(!offerteAccettate[offerta.id]){
            if(offerta.ospitato === JSON.parse(localStorage.utente).username){
                //Notifico l'aggiornamento
                var n = nuovaNotifica(stringPartita(offerta.homeTeam,offerta.awayTeam),offerta.ospitante,"ha accettato di ospitarti");
                aggiungiNotifica(n);

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
 * GESTIONE NOTIFICHE                                              *
 *******************************************************************/



//---------------------------------------------------------------------------------------------------------------------------------------

/*************************************************************************************** 
 * EVENT HANDLERS                                                                      *
 ***************************************************************************************/

$(document).ready(function(){
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

    setMatches();
    
    //--------------------------------------------------------------------------------------------

    //Crea offerta
    $("#creaOfferta").click(function(){

        var homeTeam = $("#nuova-offerta input[name=homeTeam]").val();
        var awayTeam = $("#nuova-offerta input[name=awayTeam]").val();

        var offerta = {
            "homeTeam": homeTeam,
            "awayTeam": awayTeam
        };

        var c = $.ajax({
           type: "POST",
           url: "http://127.0.0.1:8888/aggiungiOfferta",
           dataType: "json",
           data: offerta
        });

        c.done(function(msg) {
            if(msg.ok === true){
                alert("Inserimento riuscito");
                var offerta = [{
                    "id": msg.id,
                    "value": {
                        "_id": msg.id,
                        "homeTeam": homeTeam,
                        "awayTeam": awayTeam,
                        "codaRichieste": []
                    }
                }];
                inserisciOspitiDaAccettare(offerta);
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

    //All'inizio carico tutte le offerte da accettare,recensioni,ecc. e faccio partire il polling

    var mo = $.ajax({
        url: 'http://127.0.0.1:8888/myOfferte',
        dataType: 'json',
        type: 'GET',
    });

    mo.done(function(msg){
        inserisciOspitiDaAccettare(msg.rows);
        inserisciRecensioneDaFare(msg.rows);
        inserisciOfferteAccettate(msg.rows);
        polling();
        popolaSideBar();
    });

    polling();

    mo.fail(function(err){
        alert(JSON.stringify(err));
        alert("no debug");
    });

    //--------------------------------------------------------------------------------------------

    //Confermo la richiesta di un utente
    $("#ospiti-da-accettare").on("click",".bt-ospita",function(){
        var t = this;
        var id = $(t).parent().parent().siblings(".offerta-da-accettare-id").val();
        var ospitato = $(t).siblings("label").text();

        var r = $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8888/confermaRichiesta",
            dataType: "json",
            data: {"id":id,"ospitato":ospitato} //localStorage.utente.username
        });
    
        r.done(function(msg){
            alert(JSON.stringify(msg));
            $(t).parent().parent().parent().remove();
            creaBoxOffertaAccettata(msg.id,offerteInCuiUtentePresente[msg.id],"Ospitante");
            creaBoxRecensioneDaFare(msg.id,offerteInCuiUtentePresente[msg.id],"Ospitante");
        });
    
        r.fail(function(err){
            alert(JSON.stringify(err));
        });
    });

    //--------------------------------------------------------------------------------------------

    //Invio una recensione
    $("#recensioni-da-fare").on("click","#button-inserisci-recensione",function(){
        var t = this;
        var id = $(t).siblings("input[type=hidden]").val();

        var persona = $(t).siblings(".recensione-da-fare-altro").text();
        var titolo = $(t).siblings("#recensione-da-fare-testo").val();
        var stelle = $(t).siblings("#recensione-da-fare-stelle").val();
        var params = {"id":id,"recensione": {"titolo":titolo,"numStelle":stelle}};
        if($(t).siblings("#ifOspitante").val() === "Eri Ospitato"){
            params.ruolo = "ospitato";
        }
        else{
            params.ruolo = "ospitante";
        }


        var r = $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8888/inviaRecensione",
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

    //Scroll del body
    /*$(document).scroll(function(){
        if((window.innerHeight + window.scrollY) >= document.body.offsetHeight){
            loadNuoveOfferte();
        }
    });*/
});