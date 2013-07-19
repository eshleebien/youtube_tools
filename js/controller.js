function CopyYoutubeAnnotationCtrl($scope, $http)
{
    $scope.viewControl = "false";  //doesn't show the table for control first
    $scope.viewGenThumb = "false"; //don't show the generate thumbnails button first
    $scope.viewSlider = "false"; //don't show the slider first;
    $scope.canvasW = "320";
    $scope.canvasH = "180";
    
    var ids = getParameterByName('code');
    var st = getParameterByName('state');
    document.getElementById('resultVideos').style.display= "block";
    document.getElementById('progress').innerHTML = '<br/><img id="loadingbar" src = "images/loading-bar.gif"/><br/>'; //adds the loading bar
   
    $http({method: 'GET',
                url:'includes/googleRequest.php',
                params: {code:ids,state:st},
                headers: {'Content-Type': 'application/data;'}
                })
        .success(function(datas,status,headers,config)
        {
            console.log("result: " +datas);
            document.getElementById('progress').innerHTML = "";  //remove the loading bar
            if(datas == "Error")
            {
                document.getElementById('progress').innerHTML = "<center>No videos found</center>"; //no videos found
                 killSession($http,$scope);         //kill session
            }
            else
            {
                
                $scope.channelId = datas[0];
                // console.log($scope.channelId);
                $scope.videos= datas.items;
                $scope.currentPage = 0;
                $scope.pageSize = 10;
                // $scope.data = [];
                $scope.numberOfPages=function(){    //count the total number of pages based on pageSize and total items
                    return Math.ceil($scope.videos.length/$scope.pageSize);                
                }
                // for (var i=0; i<$scope.videos.length; i++) {
                    // $scope.data.push($scope.videos[i]);
                // }
                $scope.selectState = "Select All";
                $scope.viewControl = "true";
                
                checkImages($scope,$http);
                document.getElementById('post-list').style.display = "block";
            }
            
        }).
        error(function(data,status,headers,config)
        {
            console.log("There is an error in your request "+data);
            console.log(status);
            killSession($http,$scope);
        });
        
    //selection toggler
	$scope.selected = Array();
	$scope.toggleCheckbox = function(id)
	{
	    $scope.selected = [];
        angular.forEach($scope.videos, function(video){  
            if(video["toggle"] == 1)
            {
                $scope.selected.push(video["snippet"]["resourceId"]["videoId"]);
            }
        });
        
        
        if($scope.videos.length == $scope.selected.length)
        {
            $scope.selectSate = "Deselect All";
        }
        
         console.log($scope.selected);
	}
	
	//select all the videos
	$scope.selectAll = function()
	{
	    $scope.selected = [];
	    
	    if ($scope.selectState == 'Select All')
        {
            angular.forEach($scope.videos, function(video)
            {   
                video["toggle"] = 1;
                $scope.selected.push(video["snippet"]["resourceId"]["videoId"]);
                $scope.selectState = "Deselect All";
            });
        }
        else
        {
            angular.forEach($scope.videos, function(video)
            {
                video["toggle"] = undefined;
                $scope.selected=[]; 
                $scope.selectState = "Select All";
            });
        }
	    
	    
	}
	
	//saves the chId to cookie.
	$scope.process = function(content, completed)
    {
        var exdate=new Date();
        var exdays = 3;
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=escape($scope.channelId) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie="chId" + "=" + c_value;
        
        document.getElementById('progressUpload').innerHTML = '<img id="loadingbar" src = "images/loading-bar.gif"/><br/>';
        if(completed)
        {
            console.log("done uploading");
            document.getElementById('progressUpload').innerHTML = "";
            $scope.viewGenThumb = "true"; 
            $scope.watermark = content['filename']; //where the uploaded logo is located
            $scope.watermarkCurrW = content['width'];
              $scope.watermarkCurrH = content['height'];
              console.log(content);
            console.log(content['filename']);
            $scope.imageFullPath = "uploads/"+$scope.channelId+"/"+$scope.watermark;
            
            $scope.viewSlider = "true";
            $scope.sliderValue= 100;
            $scope.sliderValueX = 0;
            $scope.sliderValueY = 0;
            $scope.updateSliderFunc();
        }
        else
        {
            document.getElementById('progressUpload').innerHTML = "";
            console.log("Error in uploading");
        }
    }
    
    $scope.updateSliderFunc = function()
    {
        var canvas = document.getElementById('myCanvas');
          var context = canvas.getContext('2d');
          // context.clearRect ( x , y , w , h );
          var x = $scope.sliderValueX;
          var y = $scope.sliderValueY;
          
          
          console.log($scope.watermarkCurrH);
          var arrImageSize = getSizeByAuto($scope.watermarkCurrW, $scope.watermarkCurrH, 200, 200);
          
          console.log(arrImageSize);
           var width = arrImageSize[0];
          var height = arrImageSize[1];
          
          $scope.nw_h=$scope.sliderValue;
          $scope.nw_w = ((width*$scope.nw_h)/height);
          
          $scope.maxRangeX = $scope.canvasW-$scope.nw_w;
          $scope.maxRangeY = $scope.canvasH-$scope.nw_h;
          
          var imageObj = new Image();
            
          imageObj.onload = function() {
             canvas.width = canvas.width;
            context.drawImage(imageObj, x, y, $scope.nw_w, $scope.nw_h);
          };
          imageObj.src = $scope.imageFullPath;
    }
    
    //generate thumbnails
    $scope.generateThumb = function()
    {
        
        // var arr = Array();
        // arr = [];
        // angular.forEach($scope.videos, function(video)
        // {
            // arr.push(video["snippet"]["resourceId"]["videoId"]);
        // });
        
        document.getElementById('progressThumbnail').innerHTML = '<img id="loadingbar" src = "images/loading-bar.gif"/><br/>';
        
        $http({method: 'POST',
            url:'includes/Image.php',
            data: {ids:$scope.selected,chId:$scope.channelId,watermark:$scope.watermark,height:$scope.sliderValue,posX:$scope.sliderValueX,posY:$scope.sliderValueY},
            headers: {'Content-Type': 'application/data;'}
            })
            .success(function(datas,status,headers,config)
            {
                console.log("done generating thumbnails "+datas);
                document.getElementById('progressThumbnail').innerHTML = "";

                checkImages($scope,$http);
            }).
            error(function(data,status,headers,config)
            {
                document.getElementById('progressThumbnail').innerHTML = "";
                console.log("error in generating thumbnails "+data);
                // console.log("err"+status);
            });
            
    }
    
}


function loginCtrl($scope,$http,$location)
{
    
    $http({method:'GET',
            url: 'includes/check_session.php',
            params:{valid:''},
            headers:{'Content-Type':'application/data;'}
            }).
     success(function(datas,status,headers,config)
     {
         console.log("logged= "+datas);
         if(datas == "true")
         {
             $scope.btnShow = false;
             // $location.path = "/home";
             window.location = "#/home";
         }
         else
            $scope.btnShow = true;
     })
     .error(function(datas,status,headers,config)
     {
         alert("error");
     });
     
    $scope.googleLogin = function()
	{
	   window.location = "includes/googleRequest.php";
	}
	
}

function Oauth2CallBack($scope,$http)
{
	$scope.getAnnotation = function()
	{
		arr = $scope.txtVideo;
	
		$http({method: 'GET',
					url:'includes/get-annotation.php',
					params: {ids:arr},
					headers: {'Content-Type': 'application/data;'}
					})
			.success(function(datas,status,headers,config)
			{
				console.log(datas);
				alert(datas);
				$scope.obj = datas;
				$scope.xmlData = JSON.stringify(datas);
				// $scope.xmlData = xml_to_string(datas);
				document.getElementById("xmlData").innerHTML = datas;
				
				// document.getElementById("myFrame").src = "includes/get-annotation.php?ids="+arr;
				// document.getElementById("myFrame").src = "https://www.youtube.com/annotations_invideo?video_id="+arr+"&features=1&legacy=1";
				
		
			}).
			error(function(data,status,headers,config)
			{
				alert(data);
				alert(status);
			});
		
	}
}

function checkImages($scope,$http)
{
    //search server for images
     console.log("channelId: "+$scope.channelId);
    $http({method:'GET',
            url:'includes/checkImages.php',
            params:{channelId:$scope.channelId},
            headers:{'Content-Type':'application/data'}
    }).success(function(datas,status,headers,config)
    {
        console.log("directory: "+ datas);
        angular.forEach(datas, function(singleData)
        { 
            angular.forEach($scope.videos, function(video)
            {
                if(video["snippet"]["resourceId"]["videoId"] == singleData)
                {
                    video["toggle"] = 1;
                    $scope.toggleCheckbox(singleData);
                }
            });
                
        });
        
        
    }).error(function(datas,status,headers,config)
    {
        console.log("error in checkImages");
    });
}

function killSession($http,$scope)
{
    $http({method:'GET',
            url: 'includes/check_session.php',
            params:{valid:'no'},
            headers:{'Content-Type':'application/data;'}
            }).
             success(function(datas,status,headers,config)
             {
                 console.log("from killSession "+datas);
                 if(datas == "")
                 {
                     $scope.btnShow = false;
                     // $location.path = "/home";
                     window.location = "#/asdf";
                 }
                 else
                 {
                    $scope.btnShow = true;   
                 }
             })
             .error(function(datas,status,headers,config)
             {
                 console.log("error in killsession");
                 window.location = "#/asdf";
             });
}




function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
