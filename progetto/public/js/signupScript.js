function validaForm(){
    return checkPassword() && checkAge();
}

function checkAge(){
    var dataNascita = document.myForm.dataNascita.value.split("-"); 
    var annoNascita = parseInt(dataNascita[0]);
    var meseNascita = parseInt(dataNascita[1]);
    var giornoNascita = parseInt(dataNascita[2]);
    n =  new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    
    var isOk = false;
    var anno = y - annoNascita;
    if(anno == 18){
        var mese = m - meseNascita;
        if(mese == 0 ){
            if(d - giornoNascita < 0) isOk = false;
            else isOk = true;
        }
        else if(mese > 0) isOk = true;
        else isOk = false;
    }
    else if(anno > 18) isOk = true;
    else isOk = false;

    if(isOk === false){
        document.myForm.dataNascita.setCustomValidity("Devi essere maggiorenne per registrarti");
        document.myForm.dataNascita.backgroundColor = "#f27f83";
    }
    else{
        document.myForm.dataNascita.setCustomValidity("");
        document.myForm.dataNascita.backgroundColor = "#ffffff";
    }
    return isOk;
}

function checkPassword(){
    if(document.myForm.password.value != document.myForm.repeatPassword.value) {
        document.myForm.repeatPassword.setCustomValidity("Le password non combaciano");
        //Fare sfondo rosso
        //document.myForm.repeatPassword.background = "red";
        document.myForm.repeatPassword.style.backgroundColor = "#f27f83";
        return false;
    } else {
        document.myForm.repeatPassword.setCustomValidity('');
        document.myForm.repeatPassword.style.backgroundColor = "#ffffff";
        return true;
    }
}

