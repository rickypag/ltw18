function creaOfferta(nome,cognome,imgsrc,partita,città){
    var wrapper = "<table>\
                    <tr>\
                        <td>img</td>\
                        <td>\
                            <table>\
                                <tr>\
                                    <td>Giovanni Storti</td>\
                                    <td>Inter - Barcellona</td>\
                                    <td>Milano</td>\
                                </tr>\
                                <tr>\
                                    <td><a href=''>Clicca qui per avere altre informazioni</a></td>\
                                </tr>\
                            </table>\
                        </td>\
                    </tr>\
                  </table>";
    
    $(wrapper).appendTo("#body");

}

function creaInformazioni(){
    
}

$(document).ready(function() {
    creaOfferta("Giovanni","Storti","","Inter - Barcellona","Milano");
    creaOfferta("Giovanni","Storti","","Inter - Barcellona","Milano");
    creaOfferta("Giovanni","Storti","","Inter - Barcellona","Milano");
});