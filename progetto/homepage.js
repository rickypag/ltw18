localStorage.listaSquadre = '["Inter","Napoli", "Roma", "Juventus"]';

function getSquadreHome(){
    var lista = JSON.parse(localStorage.listaSquadre);
    var x = document.getElementById("selPartitaHome");
    for(var i=0; i < lista.length; i++){
        var option = document.createElement("option");
        option.text = lista[i];
        option.value = lista[i];
        x.add(option);
    }
}

getSquadreHome();