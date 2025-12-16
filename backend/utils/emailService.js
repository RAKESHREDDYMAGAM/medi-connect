const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const createTransporter = () => {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null; // Will use console logging instead
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT || 587;

  // If custom SMTP host is provided, use it
  if (emailHost) {
    return nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPort),
      secure: emailPort == 465, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
  }

  // Use service-based configuration (Gmail, Outlook, etc.)
  return nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

const sendVerificationEmail = async (email, token, role) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@mediconnect.com',
      to: email,
      subject: 'Verify Your MediConnect Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Welcome to MediConnect!</h2>
          <p>Thank you for registering as an <strong>${role}</strong>.</p>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #667eea; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't create this account, please ignore this email.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // For development without email setup, log the verification link
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    console.log('\n📧 EMAIL VERIFICATION LINK (Development Mode):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(verificationUrl);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Copy this link and open it in your browser to verify your email.\n');
    return { success: true, devMode: true, token, verificationUrl };
  }
};

const sendOTPEmail = async (email, otp, role) => {
  try {
    const transporter = createTransporter();
    
    // If transporter is null, email is not configured - use console logging
    if (!transporter) {
      console.log('\n📧 OTP VERIFICATION CODE (Email not configured - Development Mode):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`To: ${email}`);
      console.log(`OTP: ${otp}`);
      console.log(`Role: ${role}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️  To enable email sending, configure EMAIL_USER and EMAIL_PASS in backend/.env');
      console.log('Enter this OTP in the verification form.\n');
      return { success: true, devMode: true, otp };
    }
    
    const mailOptions = {
      from: `"MediConnect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your MediConnect Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #667eea;">MediConnect Verification Code</h2>
          <p>Thank you for registering as an <strong>${role}</strong>.</p>
          <p>Your verification OTP is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; font-size: 36px; font-weight: bold; letter-spacing: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              ${otp}
            </div>
          </div>
          <p style="text-align: center; font-size: 16px;">Enter this code to complete your registration.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
            This OTP will expire in 10 minutes. If you didn't create this account, please ignore this email.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    console.log(`   Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    // Fallback to console logging
    console.log('\n📧 OTP VERIFICATION CODE (Email sending failed - Fallback Mode):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Email configuration error. Check your EMAIL_USER and EMAIL_PASS in .env');
    console.log('Enter this OTP in the verification form.\n');
    return { success: true, devMode: true, otp, error: error.message };
  }
};

module.exports = { sendVerificationEmail, sendOTPEmail };

