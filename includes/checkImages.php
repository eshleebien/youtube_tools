<?php

if(isset($_GET['channelId']))
{
    if(file_exists("../uploads/".$_GET['channelId']))
    {
       $filenames = scandir("../uploads/".$_GET['channelId']);
       // var_dump($filenames);
       
       
       $videoIds = Array();
       
       foreach ($filenames as $value) 
       {
           if($value!="." && $value !=".." && $value != "")
           {
               $partial = explode(",", $value);
               if(isset($partial[1]))
               {
                    $video = explode(".",$partial[1]);
                    array_push($videoIds,$video[0]);   
               }
                
           }
       }
       echo json_encode($videoIds);
    }
    else 
    {
        
    }
}


?>
