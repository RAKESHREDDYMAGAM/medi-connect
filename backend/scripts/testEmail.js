const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('🧪 Testing Email Configuration\n');
  
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  console.log('📋 Current Configuration:');
  console.log(`   EMAIL_USER: ${emailUser || 'NOT SET'}`);
  console.log(`   EMAIL_PASS: ${emailPass ? '***SET***' : 'NOT SET'}`);
  console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'NOT SET'}\n`);

  if (!emailUser || !emailPass) {
    console.log('❌ Email configuration is incomplete!');
    console.log('\n📝 Required Configuration:');
    console.log('   Add these to backend/.env file:');
    console.log('   EMAIL_USER=goltgamer88@gmail.com');
    console.log('   EMAIL_PASS=your-gmail-app-password');
    console.log('   FRONTEND_URL=http://localhost:3000');
    console.log('\n🔑 To get Gmail App Password:');
    console.log('   1. Go to: https://myaccount.google.com/apppasswords');
    console.log('   2. Enable 2-Factor Authentication');
    console.log('   3. Generate App Password for "Mail"');
    console.log('   4. Copy the 16-character password');
    process.exit(1);
  }

  console.log('✅ Email credentials found. Testing connection...\n');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📧 Sending test email...');
    const testOTP = '123456';
    const info = await transporter.sendMail({
      from: `"MediConnect" <${emailUser}>`,
      to: emailUser, // Send to yourself for testing
      subject: 'MediConnect Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #667eea;">Email Test Successful!</h2>
          <p>Your email configuration is working correctly.</p>
          <p>Test OTP: <strong style="font-size: 24px;">${testOTP}</strong></p>
          <p>OTPs will now be sent from: <strong>${emailUser}</strong></p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Check your inbox: ${emailUser}`);
    console.log('\n✅ Email service is ready to send OTPs!');
    
  } catch (error) {
    console.error('\n❌ Email sending failed!');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.code === 'EAUTH') {
      console.log('🔑 Authentication Error - Common causes:');
      console.log('   1. Wrong email or password');
      console.log('   2. Using regular password instead of App Password');
      console.log('   3. 2-Factor Authentication not enabled');
      console.log('\n📝 Solution:');
      console.log('   1. Go to: https://myaccount.google.com/apppasswords');
      console.log('   2. Generate a new App Password');
      console.log('   3. Use the App Password (not regular password)');
      console.log('   4. Update EMAIL_PASS in .env file');
    } else if (error.code === 'ECONNECTION') {
      console.log('🔌 Connection Error - Check your internet connection');
    } else {
      console.log('⚠️  Other error - Check error message above');
    }
    
    process.exit(1);
  }
}

testEmail();


