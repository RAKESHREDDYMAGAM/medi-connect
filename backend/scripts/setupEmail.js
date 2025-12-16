const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEmail() {
  console.log('📧 Email Configuration Setup for MediConnect\n');
  console.log('This will configure your email to send OTP verification codes.\n');

  const email = await question('Enter your email address: ');
  const password = await question('Enter your email password (or Gmail App Password): ');
  const frontendUrl = await question('Frontend URL (default: http://localhost:3000): ') || 'http://localhost:3000';

  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';

  // Read existing .env if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Remove existing email config if present
  envContent = envContent.replace(/EMAIL_USER=.*\n/g, '');
  envContent = envContent.replace(/EMAIL_PASS=.*\n/g, '');
  envContent = envContent.replace(/FRONTEND_URL=.*\n/g, '');
  envContent = envContent.replace(/# Email Configuration.*\n/g, '');

  // Add new email configuration
  const emailConfig = `
# Email Configuration for OTP Verification
EMAIL_USER=${email}
EMAIL_PASS=${password}
FRONTEND_URL=${frontendUrl}
`;

  envContent += emailConfig;

  // Write to .env file
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Email configuration saved to backend/.env');
  console.log('\n📋 Configuration:');
  console.log(`   Email: ${email}`);
  console.log(`   Frontend URL: ${frontendUrl}`);
  console.log('\n⚠️  Important Notes:');
  console.log('   - For Gmail: Use App Password (not regular password)');
  console.log('   - Generate App Password: https://myaccount.google.com/apppasswords');
  console.log('   - Restart your backend server after configuration');
  console.log('\n✅ Setup complete! Restart your server to apply changes.');

  rl.close();
}

setupEmail().catch(console.error);


