<?php
    header("Content-Type: application/json");
    $str_json = file_get_contents('php://input');
    $param = json_decode($str_json, false);
    $link = new mysqli($param->host, $param->user, $param->pass, $param->baza);
    $dane = $link->query($param->sql);
    $outp = $dane->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
    $link->close();
?>