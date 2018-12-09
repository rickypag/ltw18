<?php
    if(isset($_GET['last'])){
        $result_json = array("nome" => "Giovanni","cognome" => "Storti","immagine" => "","partita" => "Inter - Barcellona","citta" => "Milano");
        header('Content-type: application/json');
        echo json_encode(array($result_json,$result_json,$result_json,$result_json,$result_json,$result_json,$result_json,$result_json,$result_json,$result_json));
    }
    else{
        header("Location: ../index.html");
    }
?>