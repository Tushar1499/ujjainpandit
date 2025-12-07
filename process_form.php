<?php
// process_form.php - Optimized for Hostinger Server
// Direct PHP mail() function - No external libraries needed!

// Email configuration
$to_email = "ramlakhansharma8319@gmail.com";
$subject = "New Puja Booking Request - Ujjain Pandit";

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Sanitize and validate input data
    $name = filter_var(trim($_POST["name"]), FILTER_SANITIZE_STRING);
    $mobile = filter_var(trim($_POST["mobile"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $puja = filter_var(trim($_POST["puja"]), FILTER_SANITIZE_STRING);
    
    // Validation
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($mobile) || !preg_match("/^[0-9]{10}$/", $mobile)) {
        $errors[] = "Valid 10-digit mobile number is required";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required";
    }
    
    if (empty($puja)) {
        $errors[] = "Please select a puja";
    }
    
    // If no errors, send email
    if (empty($errors)) {
        
        // Puja names mapping
        $puja_names = [
            'kalsarp' => 'Kalsarp Dosh Puja (कालसर्प दोष पूजा)',
            'mangal' => 'Mangal Dosh Puja (मंगल दोष पूजा)',
            'mahamrityunjay' => 'Mahamrityunjay Jaap (महामृत्युंजय जाप)',
            'navgraha' => 'Navgraha Puja (नवग्रह पूजा)',
            'rudrabhishek' => 'Rudrabhishek (रुद्राभिषेक)',
            'grahshanti' => 'Grah Shanti Puja (ग्रह शांति पूजा)',
            'vastu' => 'Vastu Shanti Puja (वास्तु शांति पूजा)',
            'shivabhishek' => 'Shiv Abhishek Puja (शिव अभिषेक पूजा)',
            'special' => 'Special Pujas (विशेष पूजा)'
        ];
        
        $puja_name = isset($puja_names[$puja]) ? $puja_names[$puja] : $puja;
        
        // Email body (Plain Text)
        $email_body = "🕉️ New Puja Booking Request\n\n";
        $email_body .= "================================\n\n";
        $email_body .= "Name: $name\n";
        $email_body .= "Mobile: $mobile\n";
        $email_body .= "Email: $email\n";
        $email_body .= "Selected Puja: $puja_name\n\n";
        $email_body .= "================================\n";
        $email_body .= "Date: " . date('d M Y, h:i A') . "\n";
        $email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
        
        // Email headers (Important for avoiding spam)
        $headers = "From: Ujjain Pandit Booking <noreply@ujjainpanditmangalpuja.com>\r\n";
        $headers .= "Reply-To: $name <$email>\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // Send email to owner
        $mail_sent = mail($to_email, $subject, $email_body, $headers);
        
        if ($mail_sent) {
            // Send confirmation email to customer
            $customer_subject = "पूजा बुकिंग की पुष्टि - Booking Confirmation";
            $customer_body = "प्रिय $name जी,\n\n";
            $customer_body .= "आपका पूजा बुकिंग फॉर्म सफलतापूर्वक प्राप्त हो गया है।\n\n";
            $customer_body .= "आपकी पूजा: $puja_name\n\n";
            $customer_body .= "हम जल्द ही आपसे संपर्क करेंगे।\n\n";
            $customer_body .= "धन्यवाद!\n";
            $customer_body .= "पंडित राम लखन शर्मा\n";
            $customer_body .= "संपर्क: +91-6263635078\n";
            $customer_body .= "वेबसाइट: ujjainpanditmangalpuja.com\n";
            
            $customer_headers = "From: Pandit Ram Lakhan Sharma <noreply@ujjainpanditmangalpuja.com>\r\n";
            $customer_headers .= "Reply-To: ramlakhansharma8319@gmail.com\r\n";
            $customer_headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
            $customer_headers .= "MIME-Version: 1.0\r\n";
            $customer_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
            
            mail($email, $customer_subject, $customer_body, $customer_headers);
            
            // Success - redirect with success message
            header("Location: index.html?status=success");
            exit();
        } else {
            // Email sending failed - log error
            error_log("Failed to send email for: $name ($email)");
            header("Location: index.html?status=error");
            exit();
        }
        
    } else {
        // Validation errors
        header("Location: index.html?status=validation_error");
        exit();
    }
    
} else {
    // Not a POST request
    header("Location: index.html");
    exit();
}
?>