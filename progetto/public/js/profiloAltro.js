//Carico le informazioni dell'utente
function scegliPersonaAltra(nome, cognome, squadra, numOfferte, numVolteOspitato, mediaRec){
    document.getElementById("nomeProfiloAltro").innerHTML = nome;
    document.getElementById("cognomeProfiloAltro").innerHTML = cognome;
    document.getElementById("squadraProfiloAltro").innerHTML = squadra;
    document.getElementById("numOfferteProfiloAltro").innerHTML = numOfferte;
    document.getElementById("numVolteOspitatoProfiloAltro").innerHTML = numVolteOspitato;

    $("#mediaRecensioniProfiloAltro").children("span").remove();
    $("#mediaRecensioniProfiloAltro").children("br").remove();

    $(creaStelle(mediaRec)).appendTo("#mediaRecensioniProfiloAltro");
}


//Carico dal database le offerte dell'utente e le metto in offerteUtente
function getRecensioni(username,utente) {

    var request = $.ajax({
        url: '/myOfferte',
        dataType: 'json',
        type: 'GET',
        data: {"username": username}
    });

    request.done(function(msg){
        console.log(JSON.stringify(utente));
        offerteUtente = [username];
        for(var i=0;i < msg.rows.length;i++){
            offerteUtente.push(msg.rows[i].value);
        }
        $("#profiloAltro")[0].click();
        $(".tabcontent").empty();
        button = document.getElementsByClassName("btn-profilo");
        for (i = 0; i < button.length; i++) {
            button[i].className = button[i].className.replace(" active", "");
        }
        var recensioni = getInfoRecensioniPerProfilo(username, offerteUtente);
        scegliPersonaAltra(utente.nome, utente.cognome, utente.squadra, recensioni[0], recensioni[1], recensioni[2]);
        console.log("Offerte utente caricate");
    });

    request.fail(function(err){
       console.log(err);
       aggiungiNotifica(nuovaNotificaMessaggio("Caricamento profilo fallito"),"errore");
    });
}