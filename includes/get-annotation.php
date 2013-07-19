<?php
// echo "hello";

if(isset($_GET['ids']))
{
	$ids = $_GET['ids'];
	$xml_output = simplexml_load_file("https://www.youtube.com/annotations_invideo?video_id=".$ids."&features=1&legacy=1");
	echo  json_encode($xml_output);
	

	
	
}

	// $text = file_get_contents('https://www.youtube.com/my_videos_annotate?feature=vm&v=CAc2JyONesI');
	// echo $text;
		
?>