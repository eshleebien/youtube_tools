<?php

date_default_timezone_set('UTC');
$current_date = date('d/m/Y == H:i:s');


$folder = $_COOKIE['chId'];
if(file_exists("../uploads/".$folder))
{}
else mkdir("../uploads/".$folder);


$index=0;
foreach($_FILES['upload']['name'] as $file)
{
    $fileName = $file;
    $fileTmpLoc = $_FILES["upload"]["tmp_name"][$index];
    
    
    $pathAndName = "../uploads/".$folder."/".$fileName;

    $moveResult = move_uploaded_file($fileTmpLoc, $pathAndName);
    // Evaluate the value returned from the function if needed
    if ($moveResult == true) 
    {
        $srcsize = getimagesize($pathAndName);
    
        $arr = Array();
        $arr['filename'] = $fileName;
        $arr['width'] = $srcsize[0];
        $arr['height'] = $srcsize[1];
        
        echo json_encode($arr);
    }
    else
    {
          echo "ERROR: File not moved correctly";
    }
    $index++;
}







function clean($string) {
   $string = str_replace('', '-', $string); // Replaces all spaces with hyphens.
   return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}
?>