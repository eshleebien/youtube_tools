<?php

session_start();
require 'include/oauth_instance.php';


// if (isset($_GET['code']))
// {
	// if (strval($_SESSION['state']) !== strval($_GET['state'])) 
	// {
		// die('The session state did not match.');
	// }

	if(!isset($_SESSION['token']))
	{
		$client->authenticate();
		$_SESSION['token'] = $client->getAccessToken();
	}
// }

if (isset($_SESSION['token']))
{
	$client->setAccessToken($_SESSION['token']);
}

if ($client->getAccessToken())
{
	try
	{
        // $snippet = new Google_VideoSnippet();
        // $video = new Google_Video();
        // $video->setId('CAc2JyONesI');
        // $res = $video->getSnippet();
        // echo $res;
        
        
        
	   // echo $tryResponse;
		###########################ORIGINAL#######################################
		// $searchFinalResponse = $youtubeThumb->setUrl("http://www.esportsfrance.com/images/warwolf/dota-3.jpg");
		
		// $searchFinalResponse = $youtube->thumbnails->set("videoId",array('mediaUpload'=>$media, 'videoId'=>'CAc2JyONesI'));
        // $media->setFileSize(filesize("../images/uploads/UCZOy0iOyV8q4Bd4vGvax8FA/default_d6nzABTOSro.jpg"));
        
		$channelsResponse = $youtube->channels->listChannels('id,contentDetails', array(
								  'mine' => 'true'
			));
			$searchFinalResponse = array();
			$searchFinalResponse['items'] = array();
							  $channelId = $channelsResponse['items'][0]['id'];
			array_push($searchFinalResponse,$channelId);
							  $trimmed = Array();
			foreach ($channelsResponse['items'] as $channel) 
			{
				array_push($trimmed,$channel['contentDetails']['relatedPlaylists']['uploads']);
			}
				
				require 'arrToCSV.php';
				$csv_ids = generateCsv($trimmed);
                // if(sizeof($csv_ids)>=50)
                // {
                    // $searchFinalResponse = $youtube->playlistItems->listPlaylistItems('snippet', array(
                    // 'playlistId' => $csv_ids,
                    // 'maxResults' => 50,
                    // 'fields' => 'items(snippet(publishedAt,channelId,title,description,thumbnails(default),resourceId)),pageInfo,nextPageToken'
                    // ));
                // }
                // else 
                // {
                    $searchResponse = $youtube->playlistItems->listPlaylistItems('snippet', array(
                    'playlistId' => $csv_ids,
                    'maxResults' => 50,
                    'fields' => 'items(snippet(publishedAt,channelId,title,description,thumbnails(default),resourceId)),pageInfo,nextPageToken'
                    ));
    
                    $temp = array();
                    
                    $start =0;
                    $limit = 50;
                    $loops = $searchResponse['pageInfo']['totalResults']/$limit;
                    
                    if(isset($searchResponse['nextPageToken']))
                    {
                        $pToken = $searchResponse['nextPageToken'];    
                    }
                    
        
        
                    foreach($searchResponse['items'] as $eachData)
                    {
                        array_push($searchFinalResponse['items'],$eachData);
                    }
        
                    for($i=1;$i<$loops;$i++)
                    {
                         $partialResult= $youtube->playlistItems->listPlaylistItems('snippet', array(
                        'playlistId' => $csv_ids,
                        'maxResults' => 50,
                        'pageToken' => $pToken,
                        'fields' => 'items(snippet(publishedAt,channelId,title,description,thumbnails(default),resourceId)),pageInfo,nextPageToken'
                        ));
                        $temp[$i-1] = $partialResult['items'];
                        if($i==$loops-1)
                        $pToken = $temp[$i-1]['nextPageToken'];
                    }
                                          for($i=0;$i < sizeof($temp);$i++)
                    {
                        foreach($temp[$i] as $eachData)
                        {
                           array_push($searchFinalResponse['items'],$eachData);
                        }
                    }
                // }
                
				

		
		



	
		echo json_encode($searchFinalResponse);
		// echo "<pre>";
		// print_r($searchFinalResponse);
		// echo "</pre>";
  
	} 
	catch (Google_ServiceException $e) {
		// echo ($e->getMessage());
		echo "Error";
	} 
	catch (Google_Exception $e) {
		// echo ($e->getMessage());
		echo "Error";
	}

	$_SESSION['token'] = $client->getAccessToken();
}
else
{
	$state = mt_rand();
	$client->setState($state);
	$_SESSION['state'] = $state;

	$authUrl = $client->createAuthUrl();
	header( 'Location: '.$authUrl) ;
}




			


?>