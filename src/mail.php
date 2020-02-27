<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;



require $_SERVER['DOCUMENT_ROOT'] . '/modules/PHPMailer/Exception.php';
require $_SERVER['DOCUMENT_ROOT'] . '/modules/PHPMailer/PHPMailer.php';
require $_SERVER['DOCUMENT_ROOT'] . '/modules/PHPMailer/SMTP.php';

$user_name = $_POST['name'];
$user_phone = $_POST['phone'];
$user_email = $_POST['email'];

$mail = new PHPMailer;
$mail->isSMTP();
$mail->CharSet = "utf-8";
$mail->SMTPDebug = 0; // 0 = off (for production use) - 1 = client messages - 2 = client and server messages
$mail->Host = "smtp.mail.ru"; // use $mail->Host = gethostbyname('smtp.gmail.com'); // if your network does not support SMTP over IPv6
$mail->Port = 465;
$mail->SMTPSecure = 'ssl'; // use tls. ssl is deprecated
$mail->SMTPAuth = true;
$mail->Username = 'frontenddev@inbox.ru'; // email
$mail->Password = '@%kojn!%lhh'; // password
$mail->setFrom('frontenddev@inbox.ru'); // From email and name
$mail->addAddress('daniusupir87@gmail.com'); // to email and name
$mail->Subject = 'заявка с тестового сайта';
$mail->msgHTML(' клиент: ' . $user_name . '<br> телефон: ' . $user_phone . '<br> email: ' . $user_email); //$mail->msgHTML(file_get_contents('contents.html'), __DIR__); //Read an HTML message body from an external file, convert referenced images to embedded,
$mail->AltBody = 'HTML messaging not supported'; // If html emails is not supported by the receiver, show this body
$mail->SMTPOptions = array(
  'ssl' => array(
    'verify_peer' => false,
    'verify_peer_name' => false,
    'allow_self_signed' => true
  )
);

if(!$mail->send()){
    echo "Mailer Error: " . $mail->ErrorInfo;
}else{
    echo "Сообщение отправлено!";
}