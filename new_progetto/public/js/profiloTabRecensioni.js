//funzione invovata dal click sui buttons 'Ospitato' e 'Ospitante'
function selectEventi(evt, tipoRecensione) {
    var i, tabcontent, button;

    // Prendo tutti gli elementi con class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Prendo tutti gli elementi con class="button" e rimuovo la class "active"
    button = document.getElementsByClassName("button");
    for (i = 0; i < button.length; i++) {
        button[i].className = button[i].className.replace(" active", "");
    }

    // Mostro la tab corrente e aggiungo un "active" class al bottone che ha aperto tab
    document.getElementById(tipoRecensione).style.display = "block";
    evt.currentTarget.className += " active";

    var recensione1 ={"titolo":"MIIIIIIIIIINCHIAAAA!!!!", "valStelle":1, "autore":"", "link":"https://www.google.com/", "tipo":"ospitante"};
    var recensione2 ={"titolo":"Il mio falegname con 30.000 lire la faceva megio!!!", "valStelle":2, "autore":"", "link":"https://www.google.com/", "tipo":"ospitato"};
    var recensione3 ={"titolo":"Paradiso della brugola!!!", "valStelle":4, "autore":"", "link":"https://www.google.com/", "tipo":"ospitante"};
    var recensione4 ={"titolo":"Ma vieniiiiii! Ma chi sonoooo!", "valStelle":5, "autore":"", "link":"https://www.google.com/", "tipo":"ospitato"};
    var recensione5 ={"titolo":"Peperonata alle 8:30 del mattino?", "valStelle":2, "autore":"", "link":"https://www.google.com/", "tipo":"ospitato"};
    var recensione6 ={"titolo":"Mi hanno fatto l'inganno della cadrega!", "valStelle":1, "autore":"", "link":"https://www.google.com/", "tipo":"ospitante"};

    var lista =[recensione2, recensione3, recensione1, recensione4, recensione5, recensione6];

    if(tipoRecensione=='Ospitato'){
        $("#Ospitato").empty(); //svuoto la tab
        appendRecensioni('Ospitato', lista);
    }
    
    else if(tipoRecensione=='Ospitante'){
        $("#Ospitante").empty();//svuoto la tab
        appendRecensioni('Ospitante', lista);
    }
}

//Scrive nelle giuste tab le recensioni
function appendRecensioni(tipe, lis){  
    if(tipe == 'Ospitato'){
        for(var i=0; i<lis.length; i++){
            if(lis[i].tipo == "ospitato"){
                $(creaRecensione(lis[i])).appendTo('#Ospitato');
            }
        }
    }
    else if(tipe == 'Ospitante'){
        for(var i=0; i<lis.length; i++){
            if(lis[i].tipo == "ospitante"){
                $(creaRecensione(lis[i])).appendTo('#Ospitante');
            }
        }
    }
}

//Crea una recensione dall'oggetto recensione in input
function creaRecensione(recensione){
    var newRecensione='<a class="titoloRec" href='+recensione.link+' >'+recensione.titolo+' '+'</a>'+creaStelle(recensione.valStelle);
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

//Date le informazioni su una persona, popolo il suo profilo
function scegliPersona(nome, cognome, squadra, numOfferte, numVolteOspitato, imgProf){
    document.getElementById("nome").innerHTML = nome;
    document.getElementById("cognome").innerHTML = cognome;
    document.getElementById("squadra").innerHTML = squadra;
    document.getElementById("numOfferte").innerHTML = numOfferte;
    document.getElementById("numVolteOspitato").innerHTML = numVolteOspitato;
    document.getElementById("imgProf").src = imgProf;
}

scegliPersona("Giovanni", "Storti", "Inter", "3", "123", "giovanni.jpg");

