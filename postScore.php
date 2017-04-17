<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);


$username = $_GET['username'];
$level = strtolower($_GET['level']);
$unformlevel=$_GET['level'];
$level = preg_replace('/\s+/', '', $level);

$moves = intval($_GET['moves']);
$time = $_GET['time'];

$prod=1;
//$prod=0;



//Test if it is a shared client
if (!empty($_SERVER['HTTP_CLIENT_IP'])){
  $ip=$_SERVER['HTTP_CLIENT_IP'];
//Is it a proxy address
}elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
  $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
}else{
  $ip=$_SERVER['REMOTE_ADDR'];
}
//The value of $ip at this point would look something like: "192.0.34.166"
$ip = ip2long($ip);
//The $ip would now look something like: 1073732954

if(gettype($ip)!='integer'){
	settype($ip, "integer");
}
echo $ip . "   " . gettype($ip);


echo $username . " " .gettype($username) ."<br>";
echo $level . " " .gettype($level) ."<br>" ;
echo $moves . " " .gettype($moves) ."<br>" ;
echo $time . " " .gettype($time) ."<br>" ;
echo $ip . " " .gettype($ip) ."<br>" ;

//level=Level 1&moves=###moves&time=1000s

// Create connection
//mysqli_connect(host,username,password,dbname);

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

$table=$level . '_stats';

echo $table;

//Check if the table already exists
if(mysqli_query($con,"DESCRIBE $table")){


}
else{
	$sql="CREATE TABLE $table(IP INT(10) UNSIGNED DEFAULT NULL,User TEXT(30),Moves INT,Time TEXT(30), Date DATE)";
	mysqli_query($con,$sql);
	if(mysqli_query($con,"DESCRIBE $table")){
		echo "<p>created new level highscore table</p>";
	}
	else{
		echo"fuck this table<br>";
		die('Could not create level ' . mysqli_error($con));
	}
}

//$sql="INSERT INTO level1_stats(IP, User, Moves, Time, Date) VALUES (INET_ATON('192.168.10.50'),'username',12,'21000s',CURDATE())";
//$sql="INSERT INTO $table(IP, User, Moves, Time, Date) VALUES (INET_ATON($ip),'$username',$moves,'$time',CURDATE())";

//TODO: Figure out how to store the users IP
$sql="INSERT INTO $table(IP, User, Moves, Time, Date) VALUES ($ip,'$username',$moves,'$time',CURDATE())";


//use INET_NTOA to return the IP address to it's orginal form
mysqli_query($con,$sql);


$table='alllevels';
if(mysqli_query($con,"DESCRIBE $table")){
	$sql="INSERT INTO $table(Level,IP,Finish, Username, DateTime, Moves) VALUES ('$unformlevel',$ip,1,'$username',NOW(),$moves)";
	mysqli_query($con,$sql);
}


mysqli_close($con);



function getClientIP(){

     if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER)){
            return  $_SERVER["HTTP_X_FORWARDED_FOR"];  
    }else if (array_key_exists('REMOTE_ADDR', $_SERVER)) { 
        return $_SERVER["REMOTE_ADDR"]; 
    }else if (array_key_exists('HTTP_CLIENT_IP', $_SERVER)) {
        return $_SERVER["HTTP_CLIENT_IP"]; 
    } 
    else{
    return '0000000';
	}
}

?>
