<!DOCTYPE HTML>
<html>

<head>
  <title>P-CHAT</title>
  <meta name="description" content="website description" />
  <meta name="keywords" content="website keywords, website keywords" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <!-- stylesheets -->
  <link href="css/style.css" rel="stylesheet" type="text/css" />
  <link href="css/colour.css" rel="stylesheet" type="text/css" />
  <!-- modernizr enables HTML5 elements and feature detects -->
  <script type="text/javascript" src="js/modernizr-1.5.min.js"></script>
</head>

<body>




<div id="main">

    <!-- begin header -->
    <header>
      <div id="logo"><h1>P<a href="#">-CHAT</a></h1></div>
      <nav>
        <ul class="sf-menu" id="nav">
          <li><a href="main.php">Home</a></li>
          <li><a href="about.php">About Us</a></li>
          <li><a href="contact.php">Contact Us</a></li>
        </ul>
      </nav>
    </header>
  
  
  
  
  
  
  
  
  <div class="container_16">
  <div class="grid_6 prefix_5 suffix_5">
   	  <h1> </h1>
    	<div id="login">
    	  <p class="tip"><?php
	error_reporting(0);
	 echo $msg=$_GET['msg'];?></p>
            
    	  

<form id="form1" name="form1" method="post" action="login_action.php">
    	    <p>
    	      <label><strong>Username</strong>
<input type="text" name="name" class="inputText" id="textfield" />
    	      </label>
  	      </p>
    	    <p>
    	      <label><strong>Password</strong>
  <input type="password" name="pass" class="inputText" id="textfield2" />
  	        </label>
    	    </p>

	
    		<input type="submit" value="submit">
             <label>
             
 <p>
    	      <label><strong><a href="signup.php"><font color="red">New User Register Here</font></a></strong>
 
  	        </label>
    	    </p>

       </label>            
    	  </form>
		  <br clear="all" />
    	</div>
        
</div>
<br clear="all" />
  
  
  
  
  
  
  
  
  
  
  
  
  
  	
    <footer>
      <p align="center">Copyright &copy; 2015 P-CHAT. All Rights Reserved. <a href="http://www.css3templates.co.uk">P-CHAT</a>.</p><br>
      <p><img src="images/twitter.png" alt="twitter" />&nbsp;<img src="images/facebook.png" alt="facebook" />&nbsp;<img src="images/rss.png" alt="rss" /></p>
    </footer>
    <!-- end footer -->

  </div>
  <!-- javascript at the bottom for fast page loading -->
  <script type="text/javascript" src="js/jquery.min.js"></script>
  <script type="text/javascript" src="js/jquery.easing-sooper.js"></script>
  <script type="text/javascript" src="js/jquery.sooperfish.js"></script>
  <script type="text/javascript" src="js/image_fade.js"></script>
  <!-- initialise sooperfish menu -->
  <script type="text/javascript">
    $(document).ready(function() {
      $('ul.sf-menu').sooperfish();
    });
  </script>
</body>
</html>
