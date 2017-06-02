<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);


$username = $_GET['username'];
$level = $_GET['level'];

//$ip=str_replace(':','.',getClientIP());
//$ip=intval($ip);


$prod=1;
//$prod=0;

$ip=20;
settype($ip, "integer");

/*echo $username . " " .gettype($username) ."<br>";
echo $level . " " .gettype($level) ."<br>" ;
echo $ip . " " .gettype($ip) ."<br>" ;*/


// Create connection
//mysqli_connect(host,username,password,dbname);

//if($prod){
$user='bull';
$pass='1senheimer';
$db='bulldozer';
$server='wyattisraelcom.ipagemysql.com';
                    
$con=mysqli_connect($server,$user,$pass,$db);

if (!$con) {
  die('Could not connect: ' . mysqli_error($con));
}

$table='alllevels';

//echo $table;


//Test if it is a shared client
if (!empty($_SERVER['REMOTE_ADDR'])){
  $ip=$_SERVER['REMOTE_ADDR'];
//Is it a proxy address
}elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
  $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
}else{
  $ip=$_SERVER['HTTP_CLIENT_IP'];
}
//The value of $ip at this point would look something like: "192.0.34.166"
$ip = ip2long($ip);

if(gettype($ip)!='integer'){
	settype($ip, "integer");
}
echo $ip . "   " . gettype($ip);
//The $ip would now look something like: 1073732954

//Check if the table already exists
if(mysqli_query($con,"DESCRIBE $table")){
	$sql="INSERT INTO $table(Level,IP,Finish, Username, DateTime, Moves) VALUES ('$level',$ip,0,'$username',NOW(),NULL)";
	mysqli_query($con,$sql);
}




//TODO: Figure out how to store the users IP correctly


//use INET_NTOA to return the IP address to it's orginal form




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
    return '3.56.1234';
	}
}

?>
