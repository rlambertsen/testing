<?php
$servername = 'localhost';
$dbName = 'devsite_the_shits_blogs';
$username = 'root';
$password = 'rylan4608';
$postdata = file_get_contents("php://input");

$conn = new mysqli($servername, $username, $password, $dbName);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 


if (isset($postdata)) {
    $request = json_decode($postdata);
    $postTitle = $request->postTitle;
    $postDesc = $request->postDesc;
    $postCont = $request->postCont;
    $postDate = date("Y-m-d");
    $postImage = $request->postImage;

    $sql = "INSERT INTO blog_posts (postTitle, postDesc, postCont, postDate, postImage) VALUES ('$postTitle','$postDesc', '$postCont', '$postDate', '$postImage')";

    if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();

    
}

?>