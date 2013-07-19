<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata); 
ini_set('max_execution_time', 300); 

// *** Include the class
include("resize-class.php");

if(isset($request->watermark)&& isset($request->ids) && isset($request->chId))
{
    
    
    $watermarkFileName = $request->watermark;
    $ids = $request->ids;
    $chId = $request->chId;
    $height = $request->height;
    $posX = $request->posX;
    $posY = $request->posY;
    
    $path = "../uploads/".$chId."/";

    $extension = strtolower(strrchr($watermarkFileName, '.'));

    switch($extension)
    {
        case '.jpg':
        case '.jpeg':
            $watermark = @imagecreatefromjpeg($path.$watermarkFileName);
            break;
        case '.gif':
            $watermark = @imagecreatefromgif($path.$watermarkFileName);
            break;
        case '.png':
            $watermark = @imagecreatefrompng($path.$watermarkFileName);
            break;
        default:
            $watermark = false;
            break;
    }

    //create a directory for channel
    if(!file_exists("../uploads/".$chId))
         mkdir("../uploads/".$chId);



    foreach($ids as $i)
    {
        if($i != "")
        {
            $image = imagecreatefromjpeg("https://i1.ytimg.com/vi/".$i."/mqdefault.jpg");
            // $srcsize = getimagesize("../images/".$watermarkFileName.".png");
            // $srcsize = getimagesize($watermarkFileName);
            $srcsize = getimagesize($path.$watermarkFileName);
            
            $src_h = $height;//height
            $src_w = ($srcsize[0]*$src_h)/$srcsize[1];// width/height         
            
            imagecopyresampled($image, $watermark, $posX , $posY , 0 , 0 , $src_w , $src_h, imagesx($watermark), imagesy($watermark));
        
            // header('Content-Type: image/png');
             imagepng($image, $path.$i.".png");
            imagedestroy($image);
           
        }
    }
     imagedestroy($watermark);
     
}

else   
{
    // $resizeObj = new resize("../uploads/thumb/anytvlogo.png");
    // $resizedWatermark = $resizeObj->resizeImage(200, 200, 'auto');
    
    $resizedWatermark = imagecreatefrompng("../uploads/thumb/Chrome.png");
    $image = imagecreatefromjpeg("https://i1.ytimg.com/vi/nqxjpfWo2nk/mqdefault.jpg");
   
    $srcsize = getimagesize("../uploads/thumb/Chrome.png");
   
    $src_y = 80;//height
     $src_x = ($srcsize[0]*$src_y)/$srcsize[1];// width/height         
    
    
    
    $dst_y = imagesy($image)-$src_y;
    // echo imagesy($resizedWatermark);
    
    // imagecopyresampled($image, $resizedWatermark,0, $dst_y , 0 , 0 , $src_x , 40, imagesx($resizedWatermark), imagesy($resizedWatermark));
    imagecopyresampled($image, $resizedWatermark,0, $dst_y , 0 , 0 , $src_x , $src_y, imagesx($resizedWatermark), imagesy($resizedWatermark));
                
    header('Content-Type: image/png');
    imagepng($image);
     imagedestroy($image);
     imagedestroy($watermark);
}
    
    
?>