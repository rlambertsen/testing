<?php
$servername = 'localhost';
$dbName = 'devsite_the_shits_blogs';
$username = 'root';
$password = 'rylan4608';


// Create connection
$conn = new mysqli($servername, $username, $password, $dbName);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT postId, postTitle, postDesc, postCont, postDate, postImage FROM blog_posts ";
$result = $conn->query($sql);
$encode = array();
    while($row = mysqli_fetch_assoc($result)) {

        $encode[] = $row;
    }

    $conn->close();

    echo json_encode($encode);

?>