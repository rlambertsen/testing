<?php
$servername = '127.0.0.1';
$dbName = 'devsite_the_shits_blogs';
$username = 'devsite_the_shit';
$password = '$100Bucks';
$postdata = file_get_contents("php://input");
$conn = new mysqli($servername, $username, $password, $dbName);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 


if($_SERVER["REQUEST_METHOD"] == "POST") {

    $request = json_decode($postdata);
    $email = $request->userEmail;
    $pass = $request->userPassword;
    $sql = "SELECT * FROM users WHERE userEmail = '$email' and userPassword = '$pass'";
    $result = mysqli_query($conn,$sql);
    $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $count = mysqli_num_rows($result);
    if($count > 0) {

        $encode = array();
        $encode = $row;
        echo json_encode($encode);
    }else {
        $error = "Your Login Email or Password is invalid";
        echo json_encode($error);
    }
}

?>