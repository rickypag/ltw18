function popolaSelectProfiloMod() {
    var lista = Object.keys(teamsIdByShortName);
    console.log(lista.length);
    var x = document.getElementById("squadraProfilo");
    for(var i=0; i < lista.length; i++){
        var option = document.createElement("option");
        option.text = lista[i];
        option.value = lista[i];
        x.add(option);
    }
}
 
function scegliPersona(nome, cognome, squadra, numOfferte, numVolteOspitato, mediaRec){
    document.getElementById("nomeProfilo").value = nome;
    document.getElementById("cognomeProfilo").value = cognome;
    document.getElementById("squadraProfilo").value = squadra;
    document.getElementById("numOfferteProfilo").innerHTML = numOfferte;
    document.getElementById("numVolteOspitatoProfilo").innerHTML = numVolteOspitato;
    
    $("#mediaRecensioniProfilo").children("span").remove();
    $(creaStelle(mediaRec)).appendTo("#mediaRecensioniProfilo");
}
 
//Quando seleziono il mio profilo metto le mie offerte in offerteUtente
function caricaOfferte(){
    offerteUtente = [JSON.parse(localStorage.utente).username];
    for(var key in offerteInCuiUtentePresente){
        offerteUtente.push(offerteInCuiUtentePresente[key]);
    }
}

$(document).ready(function(){
    popolaSelectProfiloMod();
    caricaOfferte();
    var utente = JSON.parse(localStorage.utente);
    console.log(localStorage.utente);
    var recensioni = getInfoRecensioniPerProfilo(utente.username, offerteUtente);
    scegliPersona(utente.nome, utente.cognome, utente.squadra, recensioni[0], recensioni[1], recensioni[2]);
});