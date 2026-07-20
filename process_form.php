<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';

$siteUrl = 'https://ujjainpanditmangalpuja.com';
$ownerEmail = 'ramlakhansharma8319@gmail.com';
$fromEmail = 'no-reply@ujjainpanditmangalpuja.com';
$fromName = 'Ujjain Pandit Booking';
$smtpHost = 'smtp.hostinger.com';
$smtpPort = 587;
$smtpUser = getenv('UJJAIN_SMTP_USERNAME') ?: $fromEmail;
$smtpPassword = getenv('UJJAIN_SMTP_PASSWORD') ?: '';

$pujaNames = [
    'kalsarp' => 'Kalsarp Dosh Puja',
    'mangal' => 'Mangal Dosh Puja',
    'mahamrityunjay' => 'Mahamrityunjay Jaap',
    'navgraha' => 'Navgraha Puja',
    'rudrabhishek' => 'Rudrabhishek',
    'grahshanti' => 'Grah Shanti Puja',
    'vastu' => 'Vastu Shanti Puja',
    'shivabhishek' => 'Shiv Abhishek Puja',
    'special' => 'Special Puja',
];

function is_ajax_request(): bool
{
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower((string) $_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}

function clean_text(string $value): string
{
    return trim(strip_tags($value));
}

function clean_mobile(string $value): string
{
    $digits = preg_replace('/\D+/', '', $value) ?? '';
    if (strlen($digits) > 10 && substr($digits, 0, 2) === '91') {
        $digits = substr($digits, -10);
    }
    return $digits;
}

function response_redirect_target(): string
{
    $fallback = 'index.html';
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    if ($referer === '') {
        return $fallback;
    }

    $parts = parse_url($referer);
    $path = $parts['path'] ?? '';
    $file = basename($path);

    return $file !== '' ? $file : $fallback;
}

function respond(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);

    if (is_ajax_request()) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => $success,
            'message' => $message,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $target = response_redirect_target();
    $status = $success ? 'success' : 'error';
    header('Location: ' . $target . '?status=' . urlencode($status) . '&message=' . urlencode($message));
    exit;
}

function send_with_phpmailer(
    string $ownerEmail,
    string $fromEmail,
    string $fromName,
    string $smtpHost,
    int $smtpPort,
    string $smtpUser,
    string $smtpPassword,
    string $name,
    string $mobile,
    string $email,
    string $pujaName,
    string $sourcePage,
    string $siteUrl
): void {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtpPort;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($ownerEmail, 'Pandit Ram Lakhan Sharma');
    $mail->addReplyTo($email, $name);
    $mail->Subject = 'New Puja Booking Request - ' . $pujaName;
    $mail->isHTML(false);
    $mail->Body =
        "New Puja Booking Request\n\n" .
        "Name: {$name}\n" .
        "Mobile: {$mobile}\n" .
        "Email: {$email}\n" .
        "Selected Puja: {$pujaName}\n" .
        "Source Page: {$sourcePage}\n" .
        "Date: " . date('d M Y, h:i A') . "\n" .
        "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
    $mail->send();

    $customer = new PHPMailer(true);
    $customer->isSMTP();
    $customer->Host = $smtpHost;
    $customer->SMTPAuth = true;
    $customer->Username = $smtpUser;
    $customer->Password = $smtpPassword;
    $customer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $customer->Port = $smtpPort;
    $customer->CharSet = 'UTF-8';
    $customer->setFrom($fromEmail, 'Pandit Ram Lakhan Sharma');
    $customer->addAddress($email, $name);
    $customer->addReplyTo($ownerEmail, 'Pandit Ram Lakhan Sharma');
    $customer->Subject = 'Puja Booking Confirmation';
    $customer->isHTML(false);
    $customer->Body =
        "Namaste {$name},\n\n" .
        "Your enquiry for {$pujaName} has been received successfully.\n" .
        "Pandit Ji ki team aapse jaldi contact karegi.\n\n" .
        "Contact: +91-6263635078\n" .
        "Website: {$siteUrl}\n";
    $customer->send();
}

function send_with_mail(
    string $ownerEmail,
    string $fromEmail,
    string $fromName,
    string $name,
    string $mobile,
    string $email,
    string $pujaName,
    string $sourcePage,
    string $siteUrl
): bool {
    $subject = 'New Puja Booking Request - ' . $pujaName;
    $body =
        "New Puja Booking Request\n\n" .
        "Name: {$name}\n" .
        "Mobile: {$mobile}\n" .
        "Email: {$email}\n" .
        "Selected Puja: {$pujaName}\n" .
        "Source Page: {$sourcePage}\n" .
        "Date: " . date('d M Y, h:i A') . "\n";
    $headers = "From: {$fromName} <{$fromEmail}>\r\n";
    $headers .= "Reply-To: {$name} <{$email}>\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $ownerSent = mail($ownerEmail, $subject, $body, $headers);

    $customerHeaders = "From: Pandit Ram Lakhan Sharma <{$fromEmail}>\r\n";
    $customerHeaders .= "Reply-To: {$ownerEmail}\r\n";
    $customerHeaders .= "MIME-Version: 1.0\r\n";
    $customerHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $customerBody =
        "Namaste {$name},\n\n" .
        "Your enquiry for {$pujaName} has been received successfully.\n" .
        "Pandit Ji ki team aapse jaldi contact karegi.\n\n" .
        "Contact: +91-6263635078\n" .
        "Website: {$siteUrl}\n";
    @mail($email, 'Puja Booking Confirmation', $customerBody, $customerHeaders);

    return $ownerSent;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.', 405);
}

$name = clean_text((string) ($_POST['name'] ?? ''));
$mobile = clean_mobile((string) ($_POST['mobile'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$pujaKey = clean_text((string) ($_POST['puja'] ?? ''));
$sourcePage = clean_text((string) ($_POST['source_page'] ?? response_redirect_target()));

if ($name === '' || strlen($name) < 2) {
    respond(false, 'Please enter your full name.', 422);
}

if (!preg_match('/^\d{10}$/', $mobile)) {
    respond(false, 'Please enter a valid 10-digit mobile number.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.', 422);
}

if ($pujaKey === '') {
    respond(false, 'Please select the puja you want to book.', 422);
}

$pujaName = $pujaNames[$pujaKey] ?? $pujaKey;

if ($smtpPassword !== '') {
    try {
        send_with_phpmailer(
            $ownerEmail,
            $fromEmail,
            $fromName,
            $smtpHost,
            $smtpPort,
            $smtpUser,
            $smtpPassword,
            $name,
            $mobile,
            $email,
            $pujaName,
            $sourcePage,
            $siteUrl
        );
        respond(true, 'Thank you. Your enquiry has been sent successfully.');
    } catch (Exception $exception) {
        error_log('PHPMailer error: ' . $exception->getMessage());
    }
}

$fallbackSent = send_with_mail(
    $ownerEmail,
    $fromEmail,
    $fromName,
    $name,
    $mobile,
    $email,
    $pujaName,
    $sourcePage,
    $siteUrl
);

if ($fallbackSent) {
    respond(true, 'Thank you. Your enquiry has been sent successfully.');
}

respond(false, 'The form could not be sent right now. Please call +91-6263635078.', 500);
