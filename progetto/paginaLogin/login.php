<html>
    <head></head>
    <body>
        <?php

            $dbconn = pg_connect("host=localhost port=5432 dbname=progetto user=postgres password=biar") or die('Could not connect: ' . pg_last_error());
            if(isset($_POST['email']) && isset($_POST['password'])){
                $email = $_POST['email'];
                $password = $_POST['password'];
                $q1="select email from Utente where email=$1 and password=$2";
                $result=pg_query_params($dbconn,$q1,array($email,md5($password)));
                if($line=pg_fetch_array($result,null,PGSQL_ASSOC)){
                    //Potrei memorizzare tutte le informazioni dell'utente nel local storage...
                    //Mi sarebbero utili per generare le pagine...
                    $email = $line['email'];
                    echo "<script>localStorage.user = '$email'</script>";
                    echo "<script>window.location.replace('../utente/homepage.html');</script>";
                    //header("Location: profilo.html");
                }
                else{
                    header("Location: login.html");
                } 
            }
            else{
                header("Location: ../index.html");
            }
        ?>
    </body>
</html>