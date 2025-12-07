<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer library files
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Create an instance of PHPMailer
$mail = new PHPMailer(true);

try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';      // Hostinger SMTP server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'no-reply@ujjainpanditmangalpuja.com'; // Your Hostinger email
    $mail->Password   = 'Google@1462834#';       // Email password
    $mail->SMTPSecure = 'tls';                       // Encryption: 'tls' or 'ssl'
    $mail->Port       = 587;                         // Port: 587 (TLS), 465 (SSL)

    // Sender and recipient
    $mail->setFrom('no-reply@ujjainpanditmangalpuja.com', 'Your Name');
    $mail->addAddress('no-reply@ujjainpanditmangalpuja.com', 'Recipient Name');

    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'Test Email from PHPMailer via Hostinger SMTP';
    $mail->Body    = '<h3>This is a test email</h3><p>Sent using <b>PHPMailer</b> with Hostinger SMTP.</p>';
    $mail->AltBody = 'This is a plain-text version of the email content.';

    // Send email
    $mail->send();
    echo '✅ Email sent successfully!';
} catch (Exception $e) {
    echo "❌ Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
