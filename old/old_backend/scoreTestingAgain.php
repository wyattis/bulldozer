<html>
<head>
<script>
function showLevel(str) {
  if (str=="") {
    document.getElementById("txtHint").innerHTML="";
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
      document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET","getScores.php?q="+str,true);
  xmlhttp.send();
}
</script>
</head>
<body>

<form>
<select name="users" onchange="showLevel(this.value)">
<option value="">Select a level</option>
<!--option value="1">Peter Griffin</option>
<option value="2">Lois Griffin</option>
<option value="3">Joseph Swanson</option>
<option value="4">Glenn Quagmire</option-->
<?php
    // Create connection
    //mysqli_connect(host,username,password,dbname);
    $user='root';
    $pass='';
    $db='bulldozer';
    
    $con=mysqli_connect("localhost",$user,$pass,$db);

    // Check connection
    if (mysqli_connect_errno()) {
      echo "Failed to connect to $db database: " . mysqli_connect_error();
    }
    else {
      $result = mysqli_query($con,"SELECT * FROM `alllevels` ORDER BY Name");
      //$count=0;
      while($row = mysqli_fetch_array($result)) {
        //$count=$count+1;
        $level=$row['Name'];

        //print table to html
        echo    "<option value='$level'> $level </option>";
          
      }
    }
    mysqli_close($con);

  ?>
  
</select>
</form>
<br>
<div id="txtHint"><b></b></div>

</body>
</html>