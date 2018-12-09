<html>
    <head></head>
    <body>

        <?php

            $dbconn = pg_connect("host=localhost port=5432 dbname=progetto user=postgres password=biar") or die('Could not connect: ' . pg_last_error());
            if(!(isset($_POST['registrationButton']))){
                
                header("Location: ../index.html");
            }
            else{
                $email = $_POST['email'];
                $q1="select * from utente where email= $1";
                $result=pg_query_params($dbconn, $q1, array($email));
                if($line=pg_fetch_array($result,null,PGSQL_ASSOC)){
                    //header("Location: alreadyRegistered.html");
                    echo "<h1> Sorry, you are already a registered user</h1>
                    <a href=../paginaLogin/login.html> Click here to login
                    </a>";
                }
                else{
                    $password = md5($_POST['password']);
                    $username = $_POST['username'];
                    $nome = $_POST['nome'];
                    $cognome = $_POST['cognome'];
                    $sesso = $_POST['sesso'];
                    $dataNascita = $_POST['dataNascita'];
                    $q2 = "insert into Utente(email,password) values ($1,$2)";
                    $q3 = "insert into Persona(email,username,nome,cognome,sesso,dataNascita)
                            values($1,$2,$3,$4,$5,$6)";
                    $data1 = pg_query_params($dbconn,$q2,array($email,$password));
                    $data2 = pg_query_params($dbconn,$q3,array($email,$username,$nome,$cognome,$sesso,$dataNascita));
                    if($data1 && $data2){
                        alert("Registrazione effettuata con successo. Si prega di loggarsi");
                        header("Location: login.html");
                        //echo "<h1> Registration is completed. Start using the website <br/></h1>";
                    }
                }
            }

        ?>

    </body>
</html>