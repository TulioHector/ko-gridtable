<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$result = null;
$jsonData = json_decode (stripslashes($_GET['grid']), true);

for($i = 0; $i < 100; $i++){
    $result[] = array(
        'Id' => $i,
        'Nombre' => 'Nombre_'. $i,
        'Apellido' => 'Apellido_'. $i,
        'Email' => 'Email_'. $i,
    );
}

$a = array_slice($result, $jsonData['$skip'], $jsonData['pageSize']);

$data = array(
    'TotalRows' => $i,
    'Rows' => $a
);

echo json_encode($data);