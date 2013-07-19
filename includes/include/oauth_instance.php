<?php
// Call set_include_path() as needed to point to your client library.
require_once 'google-api-php-client/src/Google_Client.php';
require_once 'google-api-php-client/src/contrib/Google_YouTubeService.php';

$OAUTH2_CLIENT_ID = '544761083604-j9qemfslbb2m91ehods34c3tuq7e3tqn.apps.googleusercontent.com';
$OAUTH2_CLIENT_SECRET = 'V0nQeDnaNIgHW1Fj3VpmhgrO';
$DEVELOPER_KEY = 'AIzaSyAhkr8hbq6J0_4HD8ANO4DQqPoHmQFiFDY';


$client = new Google_Client();
$client->setClientId($OAUTH2_CLIENT_ID);
$client->setClientSecret($OAUTH2_CLIENT_SECRET);
$redirect = filter_var('http://localhost/youtube_annotation/');
$client->setRedirectUri($redirect);
$client->setDeveloperKey($DEVELOPER_KEY);


$youtube = new Google_YoutubeService($client);


$youtubeThumb = new Google_Thumbnail($client);

?>