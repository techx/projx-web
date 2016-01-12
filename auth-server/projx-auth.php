<?php
    include 'config.php';

    $error = False;
    $error_message = 'Log in failed (requires valid MIT certificate).<br><br><a href="' . $projx_url . '">Back to ProjX.</a>';

    if (isset($_GET['key'])) {
        $key = $_GET['key'];
    } else {
        $error = True;
    }

    if (@$_SERVER['SSL_CLIENT_S_DN_Email']) {
        $email = strtolower($_SERVER['SSL_CLIENT_S_DN_Email']);
        $name = $_SERVER['SSL_CLIENT_S_DN_CN'];
        $options = array('cost' => 10);
        $token = hash('sha256', $email . $key . $secret);
    } else {
        $error = True;
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>ProjX Auth</title>
    </head>
    <body>
        <?php
            if ($error) {
                echo $error_message;
            } else {
                echo 'Redirecting...
                <script>
                    window.location = "' . $login_url . '?email=' . $email . '&name=' . $name . '&token=' . $token . '";
                </script>';
            }
        ?>
    </body>
</html>
