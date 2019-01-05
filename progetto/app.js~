/********************************************************************************************************************
 * Il server è un semplice servizio che fornisce delle API per connettersi al database
 * -OSS
 *  Solo gli utenti registrati possono accedere al database
 *
 * -API
 * 1)Ogni utente può vedere tutte le informazioni degli altri utenti (eccetto la password):
 *    GET /utente con data = {"username":"X"} ritorna le informazioni di quell'utente
 *
 * 2) GET /caricaOfferte con data = {"homeTeam":"X","awayTeam":"Y"} ritorna tutte le offerte fatte
 *                       da qualsiasi utente per la partita 'homeTeam - awayTeam'
 *
 * 3) GET /myOfferte ritorna tutte le offerte fatte dall'utente che le richiede (si vede dalla connessione/cookie)
 *                   e quelle in cui è ospitato, oppure dell'utente della query se è presente
 *
 * 4) POST /aggiungiOfferta con data = {"homeTeam":"X","awayTeam":"Y"} crea una nuova offerta dell'utente che
 *                        la fa e ritorna l'id della nuova offerta
 *
 * 5) POST /inviaRichiesta con data = {"id": "X"} aggiunge l'utente che ha fatto richiesta alla codaRichieste
 *                         dell'offerta con id "X"
 *
 * 6) POST /confermaRichiesta con data = {"id": "X","ospite":"Y"} mette come ospite dell'offerta "X"
 *                            l'utente "Y"
 *
 * 7) POST /inviaRecensione con data = {"id": "X","recensione":"Y","ruolo":"Z"} inserisce nell'offerta "X"
 *                          la recensione "Y" nel ruolo di "Z"
 *
 * 8) POST /getMessaggi con data = {"id": "X","min":Y,"max":Z} ritorna i messaggi relativi a un'offerta Y
 *                        dal numero min al numero max
 *
 * 9) POST /aggiornaProfilo con data = {"nome": "X","cognome":Y,"squadra":Z} aggiorna il profilo dell'utente
 *
 *********************************************************************************************************************/

var express = require('express');
var session = require('express-session');
var bodyParser = require("body-parser");
//var nano = require('nano')('http://127.0.0.1:5986');
var nano = require('nano')('http://couchdb:5984');
var request = require('request');

var myHeader =  { 'X-Auth-Token': '9d86980a76af481d8388321e25ab6dd0' };

var utenti = nano.db.use('utenti');
var offerte = nano.db.use('offerte');

var app = express();
//var expressWs = require('express-ws')(app);

var http = require('http').Server(app);
var io = require('socket.io')(http);

var _dir = '/home/node';
express.static(_dir);
var sessionMiddleware = session({
    key: 'user_sid',
    secret: 'ssshhhhh'
});

app.use(express.static('public'));

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.urlencoded());



io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);



var sess;

/***************************************************************************************
 * WEB SOCKET                                                                          *
 ***************************************************************************************/

io.on('connection', function(socket){
    var username = socket.request.session.username;
    console.log(socket.request.session.username + ' connected');

    //Appena un utente si connette lo metto nel socket con tutti gli altri
    offerte.view("offerteView", "myOfferte", {keys: [username]}).then((response) => {
        console.log(JSON.stringify(response));
        for(var i=0;i < response.rows.length;i++){
            var offerta = response.rows[i].value;
            //Se l'offerta è stata accettata creo una chat tra i due utenti
            if(offerta.ospitato){
                socket.join(JSON.stringify(offerta._id));
                console.log("[*] Join su offerta " + offerta._id);
            }
        }

        socket.on("messaggio",function(msg) {
            console.log("[*] Messaggio: " + JSON.stringify(msg));
            var id = msg.id;
            var testo = msg.testo;
            var ruolo = msg.ruolo;
            var mittente = socket.request.session.username;
            var partita = msg.partita;

            var toSend = {
                "id":id,
                "messaggio": {
                    "testo": testo
                },
                "mittente": mittente,
                "ruolo": ruolo,
                "partita": partita
            };

            //Quando ricevo un messaggio faccio broadcast
            socket.broadcast.to(JSON.stringify(id)).emit('messaggio',toSend);
            console.log("[*] Messaggio inviato");

            //E poi lo metto nella coda
            offerte.view('offerteView', 'getDocById', {keys: [id]}).then((response) => {
                console.log("response: " + JSON.stringify(response.rows[0].value));

                var oldDoc = response.rows[0].value;

                var toInsert = {
                    "mittente": (mittente === oldDoc.ospitato)?"Ospitato":"Ospitante",
                    "testo": testo
                };

                console.log("oldDoc: " + JSON.stringify(oldDoc));

                oldDoc.messaggi.push(toInsert);

                console.log("newDoc: " + JSON.stringify(oldDoc));

                offerte.insert(oldDoc).then((response) => {
                    console.log(response);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
                res.send("Errore Database!");
            });

        });
    }).catch((err) => {
        console.log(err);
    });

});


//--------------------------------------------------------------------------------------------

//FILE
app.get('/utente/*', function(req,res){
    sess = req.session;
    console.log(req.url);
    //debug
    if(sess.username) {
        console.log(_dir + req.url);
        res.sendFile(_dir + req.url);
    }
    else {
        res.status(403);
        res.redirect('/login');
    }
});

app.get('/login', function(req,res){
    sess = req.session;
    if(!sess.username){
        res.sendFile(_dir + '/login.html');
    }
    else{
        res.redirect("/utente/main.html");
    }
});

app.get('/signup', function(req,res){
    sess = req.session;
    if(!sess.username){
        res.sendFile(_dir + '/signup.html');
    }
    else{
        res.redirect("/utente/main.html");
    }
});

app.get('/', function(req,res){
    res.redirect("/login");
});

//AUTENTICAZIONE
app.post('/login', function(req,res){
    console.log("[*] Utente cerca di loggarsi con i dati:\n\t" + JSON.stringify(req.body));
    if(req.body.username && req.body.password){
        var username = req.body.username;
        var password = req.body.password;
        utenti.view('tmp', 'login', {keys: [[username, password]]}).then((response) => {
            console.log(response);
            if(response.rows.length > 0){
                console.log("[*] L'autenticazione è andata a buon fine");
                sess = req.session;
                sess.username = username;
                res.send('<html><script>var u = {\
                    "username": "' +  response.rows[0].value.username + '",\
                    "nome": "' +  response.rows[0].value.nome + '",\
                    "cognome": "' +  response.rows[0].value.cognome + '",\
                    "squadra": "' + response.rows[0].value.squadra + '",\
                    "sesso": "' +  response.rows[0].value.sesso + '",\
                    "dataNascita": "' +  response.rows[0].value.dataNascita + '"\
                };\
                localStorage.utente = JSON.stringify(u);\
                window.location.replace("/utente/main.html");</script></html>');
            }
            else{
                console.log("[*] Un utente non si è autenticato");
                res.sendfile(_dir + "/loginfailed.html");
            }
        }).catch((err) => {
            console.log(err);
            res.sendfile(_dir + "/loginfailed.html");
        });
    }
    else{
        res.redirect("/login");
    }
});

//REGISTRAZIONE
app.post('/signup', function(req,res){
    var username = req.body.username;
    var email = req.body.email;

    utenti.view('tmp', 'check_email', {keys: [email]}).then((response) => {
        if(response.rows.length == 0){
            utenti.view('tmp', 'check_username', {keys: [username]}).then((response) => {
                if(response.rows.length == 0){
                    var data = {
                        username: req.body.username,
                        nome: req.body.nome,
                        cognome: req.body.cognome,
                        email: req.body.email,
                        password: req.body.password,
                        dataNascita: req.body.dataNascita,
                        squadra: ""
                    };

                    if(req.body.sesso){
                        data.sesso = req.body.sesso;
                    }

                    utenti.insert(data).then((response) => {
                        console.log("[*]" + req.body.username + " si è registrato");
                        res.redirect("/login");
                    }).catch((err) => {
                        console.log(err);
                        res.send("Errore Database!");
                    });
                }
                else{
                    res.sendfile(_dir + '/usernameexists.html');
                }
            }).catch((err) => {
                console.log(err);
                res.send("Errore Database!");
            });
        }
        else{
            res.sendfile(_dir + '/emailexists.html');
        }
    }).catch((err) => {
        console.log(err);
        res.send("Errore Database!");
    });
});

//LOG OUT
app.get("/logout",function(req,res){
    sess = req.session;
    if(sess.username){
        res.clearCookie('user_sid');
    }
    res.redirect("/login");
});

//1) Ogni utente può vedere tutte le informazioni degli altri utenti (eccetto la password):
//     GET /utente con data = {"username":"X"} ritorna le informazioni di quell'utente
app.get("/utente", function(req,res){
    sess = req.session;
    if(sess.username){

        var username = req.query.username;

        console.log("[*] L'utente " + sess.username + " sta ricercando");

        utenti.view("tmp", "utente", {keys: [username]}).then((response) => {
            console.log(response);
            console.log("[*] Invio la risposta a " + sess.username);
            res.send(response);
        }).catch((err) => {
            console.log(err);
            res.send({"ok":false});
        });
    }
    else{
        res.send({"msg":"no"});
    }

})

//2) GET /caricaOfferte con data = {"homeTeam":"X","awayTeam":"Y"} ritorna tutte le offerte fatte
//                      da qualsiasi utente per la partita 'homeTeam - awayTeam'
app.get("/caricaOfferte", function(req,res){
    sess = req.session;
    if(sess.username){

        var homeTeam = req.query.homeTeam;
        var awayTeam = req.query.awayTeam;

        console.log("[*] L'utente " + sess.username + " sta cercando offerte della partita " + homeTeam + " - " + awayTeam);

        offerte.view("offerteView", "caricaOfferte", {keys: [[homeTeam,awayTeam]]}).then((response) => {
            console.log(response);
            console.log("[*] Invio la risposta a " + sess.username);
            res.send(response);
        }).catch((err) => {
            console.log(err);
            res.send({"ok":false});
        });
    }
    else{
        res.send({"msg":"no"});
    }

})

//3) GET /myOfferte ritorna tutte le offerte fatte dall'utente che le richiede (si vede dalla connessione/cookie)
app.get("/myOfferte", function(req,res){
    sess = req.session;
    if(sess.username){
        //var r = view(offerte,"offerteView","myOfferte",["pippo"]);
        var username = sess.username;
        if(req.query.username !== undefined){
            username = req.query.username;
        }
        offerte.view("offerteView", "myOfferte", {keys: [username]}).then((response) => {
            res.send(response);
        }).catch((err) => {
            console.log(err);
            res.send("Errore Database!");
        });
    }
    else{
        res.send({"msg":"no"});
    }

})

//4) POST /aggiungiOfferta con data = {"homeTeam":"X","awayTeam":"Y"} crea una nuova offerta dell'utente che
//                         la fa e ritorna l'id della nuova offerta
app.post("/aggiungiOfferta", function(req,res){
    sess = req.session;
    if(sess.username){
        console.log("[*] L'utente " + "pippo" + " sta inserendo " + req.body.homeTeam + " - " + req.body.awayTeam);
        //var r = view(offerte,"offerteView","myOfferte",["pippo"]);

        var homeTeam = req.body.homeTeam;
        var awayTeam = req.body.awayTeam;
        var username = sess.username;

        var data = {
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            ospitante: username,
            codaRichieste: []
        };

        offerte.view("offerteView", "checkOfferta", {keys: [[username,homeTeam,awayTeam]]}).then((response) => {
            console.log(response);
            if(response.rows.length === 0){
                offerte.insert(data).then((response) => {
                    console.log(JSON.stringify(response));
                    res.send(response);
                }).catch((err) => {
                    console.log(err);
                    res.send({"ok": false, "errore": "db"});
                });
            }
            else{
                res.send({"ok": false, "errore": "esiste"});
            }
        }).catch((err) => {
            console.log(err);
            res.send({"ok": false, "errore": "db"});
        });
    }
    else{
        res.redirect("/login");
    }
});

//5) POST /inviaRichiesta con data = {"id": "X"} aggiunge l'utente che ha fatto richiesta alla codaRichieste
//                        dell'offerta con id "X"
app.post("/inviaRichiesta", function(req,res){
    sess = req.session;
    if(sess.username){
        console.log("[*] L'utente " + sess.username + " sta facendo richiesta");

        var ospite = sess.username;
        var id = req.body.id;

        offerte.view('offerteView', 'getDocById', {keys: [id]}).then((response) => {
            console.log("response: " + JSON.stringify(response));

            var oldDoc = response.rows[0].value;
            console.log("oldDoc: " + JSON.stringify(oldDoc));

            oldDoc.codaRichieste.push(ospite);

            offerte.insert(oldDoc).then((response) => {
                console.log(response);
                //res.sendFile('C:/Users/HP/Desktop/Terzo anno/linguaggi e tecnologie per il web/progetto/utente/main.html');
                res.send(response);
            }).catch((err) => {
                console.log(err);
                res.send({"ok":false});
            });
        }).catch((err) => {
            console.log(err);
            res.send("Errore Database!");
        });
    }
    else{
        res.send({"msg":"no"});
    }
});

//6) POST /confermaRichiesta con data = {"id": "X","ospite":"Y"} mette come ospite dell'offerta "X"
//                           l'utente "Y"
app.post("/confermaRichiesta", function(req,res){
    sess = req.session;
    if(sess.username){
        console.log("[*] L'utente " + sess.username + " sta confermando la richiesta di " + req.body.ospitato);

        var ospitante = sess.username;
        var ospitato = req.body.ospitato;
        var id = req.body.id;


        offerte.view('offerteView', 'getDocById', {keys: [id]}).then((response) => {
            console.log("response: " + JSON.stringify(response));

            var oldDoc = response.rows[0].value;
            console.log("oldDoc: " + JSON.stringify(oldDoc));

            oldDoc.codaRichieste = [];
            oldDoc.messaggi = [];
            oldDoc.ospitato = ospitato;

            offerte.insert(oldDoc).then((response) => {
                console.log(response);
                res.send(response);
            }).catch((err) => {
                console.log(err);
                res.send({"ok":false});
            });
        }).catch((err) => {
            console.log(err);
            res.send("Errore Database!");
        });
    }
    else{
        res.send({"msg":"no"});
    }
});

//7) POST /inviaRecensione con data = {"id": "X","recensione":"Y","ruolo":"Z"} inserisce nell'offerta "X"
//                         la recensione "Y" nel ruolo di "Z"
app.post("/inviaRecensione", function(req,res){
    sess = req.session;
    if(sess.username){
        console.log("[*] L'utente " + sess.username + " sta inviando una recensione " + JSON.stringify(req.body));

        var ospitante = sess.username;
        var ruolo = req.body.ruolo;
        var id = req.body.id;
        var recensione = req.body.recensione;


        offerte.view('offerteView', 'getDocById', {keys: [id]}).then((response) => {
            console.log("response: " + JSON.stringify(response.rows[0].value));

            var oldDoc = response.rows[0].value;
            console.log("oldDoc: " + JSON.stringify(oldDoc));

            if(ruolo === "ospitato") oldDoc["recensioneFattaDaOspitato"] = recensione;//{"titolo":recensione,"numStelle":numStelle};
            else oldDoc["recensioneFattaDaOspitante"] = recensione;//{"titolo":recensione,"numStelle":numStelle};

            console.log("newDoc: " + JSON.stringify(oldDoc));

            offerte.insert(oldDoc).then((response) => {
                console.log(response);
                res.send({"message":"ok"});
            }).catch((err) => {
                console.log(err);
                res.send({"message":"error"});
            });
        }).catch((err) => {
            console.log(err);
            res.send("Errore Database!");
        });
    }
    else{
        res.send({"msg":"no"});
    }
});

//8) POST /getMessaggi con data = {"id": "X","min":Y,"max":Z} ritorna i messaggi relativi a un'offerta Y
//                     dal numero min al numero max
app.post("/getMessaggi",function(req,res) {
    sess = req.session;
    if(sess.username){
        console.log("[*] L'utente " + sess.username + " sta richiedendo messaggi");

        var ospitante = sess.username;
        var id = req.body.id;
        var min = req.body.min;
        var max = req.body.max;


        offerte.view('offerteView', 'getDocById', {keys: [id]}).then((response) => {
            console.log("response: " + JSON.stringify(response.rows[0].value));
            var doc = response.rows[0].value;
            if(doc.messaggi){
                res.send(doc.messaggi);
            }
            else{
                res.send({});
            }
        }).catch((err) => {
            console.log(err);
            res.send("Errore Database!");
        });
    }
    else{
        res.send({"msg":"no"});
    }
});

//9) POST /aggiornaProfilo con data = {"nome": "X","cognome":Y,"squadra":Z} aggiorna il profilo dell'utente
app.post("/aggiornaProfilo", function(req,res){
    sess = req.session;
    if(sess.username){
        console.log("[*] L'utente " + sess.username + " sta aggiornando il suo profilo");

        var username = sess.username;
        var nome = req.body.nome;
        var cognome = req.body.cognome;
        var squadra = req.body.squadra;

        var errore = '<html><script>window.location.replace("/utente/main.html");</script></html>'


        utenti.view("tmp", "utente", {keys: [username]}).then((response) => {
            console.log("response: " + JSON.stringify(response.rows[0].value));

            var oldDoc = response.rows[0].value;
            console.log("oldDoc: " + JSON.stringify(oldDoc));

            oldDoc.nome = nome;
            oldDoc.cognome = cognome;
            oldDoc.squadra = squadra;

            console.log("newDoc: " + JSON.stringify(oldDoc));

            utenti.insert(oldDoc).then((response) => {
                console.log(response);
                res.send('<html><script>var u = JSON.parse(localStorage.utente);\
                u.squadra = "' + squadra + '";\
                u.nome = "' + nome + '";\
                u.cognome = "' + cognome + '";\
                localStorage.setItem("utente",JSON.stringify(u));\
                window.location.replace("/utente/main.html");</script></html>');
            }).catch((err) => {
                console.log(err);
                res.send(errore);
            });
        }).catch((err) => {
            console.log(err);
            res.send(errore);
        });

    }
    else{
        res.redirect("/login");
    }
});


/*******************************************************************
 * API FOOTBALL                                                    *
 *******************************************************************/

//Ritorno le partite della champsion
app.get('/teams', function(req, res){
    request({headers: myHeader,uri:'https://api.football-data.org/v2/competitions/CL/teams',method:'GET'}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        res.send(info);
      }
      else{
        console.log(error);
         res.send({"errore":"err"});
      }
    })
  });

//Ritorno le squadre partecipanti
app.get('/matches', function(req, res){
    request({headers: myHeader,uri:'https://api.football-data.org/v2/competitions/CL/matches',method:'GET'}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        res.send(info);
      }
      else{
        console.log(error);
        res.send({"errore":"errs"});
      }
    })
  });



http.listen(8888, function(){
    console.log("[*] Server in ascolto sulla porta 8888");
});
