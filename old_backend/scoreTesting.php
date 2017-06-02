<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="Classic Bulldozer Puzzle Game">
	<meta name="keywords" content="Classic, Bulldozer, Puzzle, Game">
	<meta name="author" content="Wyatt Israel">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="images/Sprites/Bulldozer.png" type="image/x-icon">
    <title>Score Testing</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
	
	<!-- Bootstrap theme -->
    <link href="css/bootstrap-theme.min.css" rel="stylesheet">
	
	<!-- Own Style Sheet -->
	<link href="css/bulldozer.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body background="images/lowresBackground.png">
<div id="scores">
	<script type="text/javascript">
		function LoadTable(){
			console.log("this was called");

		}
	</script>

	<a href="#1level" id="level-one-link" onclick="LoadTable(Level 1)">Level 1</a>
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
			echo "<table id='scores'>";
            echo "<tr><th> Player </th><th class='align-right'> Moves </th><th class='align-right'> Time </th><th class='align-right'> Date Completed </th></tr>";
			$result = mysqli_query($con,"SELECT * FROM `level1_stats` ORDER BY Moves");
			while($row = mysqli_fetch_array($result)) {
				$username=$row['User'];
				$moves=$row['Moves'];
				$time=$row['Time'];
				$date=$row['Date'];

				//print table to html
				echo    "<tr>
                        <td>".$username."</td>
                        <td class='align-right'>".$moves."</td>
                        <td class='align-right'>".$time." </td>
                        <td class='align-right'>".$date."</td>
                        </tr>";
			  	
			}
			echo "</table>";
		}
		mysqli_close($con);

	?>
</div>
</body>

</html>