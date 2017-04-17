<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);

$q = strtolower($_GET['q']);
$q = preg_replace('/\s+/', '', $q);

// Create connection
//mysqli_connect(host,username,password,dbname);

$prod=1;
//$prod=0;

//if($prod){
$user='bull';
$pass='1senheimer';
$db='bulldozer';
$server='wyattisraelcom.ipagemysql.com';
                    
$con=mysqli_connect($server,$user,$pass,$db);
//}
//else{
//$user='root';
//$pass='';
//$db='bulldozer';
//}

//$con=mysqli_connect("localhost",$user,$pass,$db);
if (!$con) {
  die('Could not connect: ' . mysqli_error($con));
}

$table=$q . '_stats';

//Check if the table already exists
if(mysqli_query($con,"DESCRIBE $table")){


}
else{
	//$sql="CREATE TABLE $table(IP INT(10),User TEXT(30),Moves INT,Time TEXT(30), Date DATE)";
	$sql="CREATE TABLE $table(IP INT(10) UNSIGNED DEFAULT NULL,User TEXT(30),Moves INT,Time TEXT(30), Date DATE)";
	mysqli_query($con,$sql);
	if(mysqli_query($con,"DESCRIBE $table")){
		echo "<p>created new level</p>";
	}
	else{
		echo"fuck this table<br>";
		die('Could not create level ' . mysqli_error($con));
	}
}

$sql="SELECT * FROM $table ORDER BY Moves, Time";
$result = mysqli_query($con,$sql);

echo "<table border='1'>
<tr>
<th></th>
<th>Player</th>
<th class='align-right'>Moves</th>
<th class='align-right'>Time (h:m:s:m)</th>
<th class='align-right'>Date</th>
</tr>";

$count=0;
while($row = mysqli_fetch_array($result)) {
	$count=$count+1;
	echo "<tr>";
	echo "<td>$count</td>";
	echo "<td>" . $row['User'] . "</td>";
	echo "<td class='align-right'>" . $row['Moves'] . "</td>";
	echo "<td class='align-right'>" . $row['Time'] . "</td>";
	echo "<td class='align-right'>" . $row['Date'] . "</td>";
	echo "</tr>";
	if($count==20){
		break;
	}
}
echo "</table>";

mysqli_close($con);
?>