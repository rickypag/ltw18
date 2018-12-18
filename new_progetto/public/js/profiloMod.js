localStorage.listaSquadre = '["Inter","Napoli", "Roma", "Juventus"]';

//Date le squadre della Champions, le metto nel menu a tendina
function insertSquadre() {
    var lista = JSON.parse(localStorage.teamsIdByShortName);
    alert(1);
    var x = document.getElementById("squadra");
    alert(2);
    for(var i=0; i < lista.length; i++){
        var option = document.createElement("option");
        option.text = lista[i];
        option.value = lista[i];
        x.add(option);
    }
}

$(document).ready(function(){
    insertSquadre();
});