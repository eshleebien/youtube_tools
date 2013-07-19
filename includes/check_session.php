<?php
session_start();
require 'include/oauth_instance.php';


    if(isset($_SESSION['state']))
    {
        // header( 'Location: '.$redirect."?state=".$_SESSION['state']) ;
        if(strval($_GET['valid']) == 'no')
        {
            // session_unregister("state") = true;
            unset($_SESSION['state']);
            unset($_SESSION['token']);
        }
        else
            echo "true";
    }
    else
    {
        // header('location:'.$redirect."?state=false");    
        echo "false";
    }
?>
