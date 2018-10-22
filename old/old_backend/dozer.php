<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="Classic Bulldozer Puzzle Game">
    <meta name="keywords" content="Classic, Bulldozer, Puzzle, Game">
    <meta name="author" content="Wyatt Israel">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="images/Sprites/Bulldozer.png" type="image/x-icon">
    <title>Classic Bulldozer</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Bootstrap theme -->
    <link href="css/bootstrap-theme.min.css" rel="stylesheet">

    <!-- Own Style Sheet -->
    <link href="css/dozer.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

     <script>
        function showLevel(str) {
            console.log(str);
            $('#scores-table').hide();
            if (str=="") {
            document.getElementById("scores-table").innerHTML="";
            return;
            } 
            if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
            } else { // code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
              document.getElementById("scores-table").innerHTML=xmlhttp.responseText;
              $('#scores-table').slideDown('slow');
              //$('html, body').scrollTop( $(document).height() );

            }
            }
            xmlhttp.open("GET","getScores.php?q="+str,true);
            xmlhttp.send();
            
        }
    </script>
</head>
<body background="images/lowresBackground.png">
    <div class="container" align="center">
        <div class="title" >
            <img id="titleimage"src="images/bullTitleImage.png"/>
        </div>
        <div class="buttons">
            <button class="btn btn-lg btn-primary float-left butt" id="start-button">Start</button>
            <button class="btn btn-lg btn-primary float-right butt" id="reset-button">Reset</button>
        </div>
        <div class="text-boxes">
            <textarea class="float-left" cols="1" rows="1" id="password-box" maxlength="4">password</textarea>
            <textarea class="float-right" cols="1" rows="1" id="username-box">username</textarea>
        </div>
        <div class="header">
            <p id="curr-level">Level 1</p>
        </div>
        <div id="canvas-div">
            <canvas id="game-canvas">
                Your browser doesn't support HTML5. Please install Internet Explorer 9 :
                <br /> <a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home?ocid=ie9_bow_Bing&WT.srch=1&mtag=SearBing">http://windows.microsoft.com/en-US/internet-explorer/products/ie/home?ocid=ie9_bow_Bing&WT.srch=1&mtag=SearBing</a>
            </canvas>
        </div>
        <div id="instructions">
            <p> BEFORE YOU START:  Enter a username to save your high scores. </p>
            <p>Use the arrow keys to play. Push the boulders around until all of them are on top of the targets. You can't pull boulders and you can only push one at a time. If you screw up, hit the reset button. Be sure to write down your passwords because your level will NOT be saved! Unfortunately if your computer can't handle 60fps, this game won't feel very responsive.</p>
        </div>
        <div id="scores-div">
            <h1 id="scores-title"><b>High Scores</b></h1>
            <br>
            <form>
                <select id="level-score-selector" name="users" onchange="showLevel(this.value)">
                <option value="">Select a level</option>
                <?php
                    // Create connection
                    //mysqli_connect(host,username,password,dbname);
                $prod=1;
                if($prod){
                    $user='bull';
					$pass='1senheimer';
					$db='bulldozer';
					$server='wyattisraelcom.ipagemysql.com';
                }
                else{
                    $user='root';
                    $pass='';
                    $db='bulldozer';
                    $server='localhost';
                }
                    
                    $con=mysqli_connect($server,$user,$pass,$db);

                    // Check connection
                    if (mysqli_connect_errno()) {
                      echo "Failed to connect to $db database: " . mysqli_connect_error();
                    }
                    else {
                      //$result = mysqli_query($con,"SELECT DISTINCT `Level` FROM `alllevels` ORDER BY Level");
                      //$result = mysqli_query($con,"SELECT DISTINCT 'Level' FROM alllevels ORDER BY SUBSTR(Level FROM 1 FOR 1),CAST(SUBSTR(Level FROM 2) AS UNSIGNED)");
                      //$result = mysqli_query($con,"SELECT * FROM alllevels ORDER BY SUBSTR('Level' FROM 1 FOR 1),CAST(SUBSTR(Level FROM 2) AS UNSIGNED)");
                      $result = mysqli_query($con,"SELECT DISTINCT Level FROM alllevels ORDER BY CAST(SUBSTRING(Level,LOCATE(' ',Level)+1) AS SIGNED)");
                      while($row = mysqli_fetch_array($result)) {
                        //$count=$count+1;
                        $level=$row['Level'];

                        //print table to html
                        echo    "<option value='$level'> $level </option>";
                          
                      }
                    }
                    mysqli_close($con);

                ?>
                  
                </select>
            </form>
            <div id="scores-table"></div>
                <!--Empty div to house the returned data -->
            </div>
        </div>

    <div id="notification-modal" class="hidden-modal"></div>



    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
    
    <!-- Personal Scripts -->
    <script src="js/levels.min.js" type="text/javascript"></script>
    <script src="js/bulldozer.min.js" type="text/javascript"></script>

  </body>
</html>