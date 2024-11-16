export const generateVerificationEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
          color: #4a90e2;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Email Verification</h1>
        <p>Thank you for registering! Please use the following code to verify your email address:</p>
        <div class="otp-code">${otp}</div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
};

// ... existing code ...

export const generateWelcomeEmailTemplate = (fullName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          padding: 20px;
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
        }
        .username {
          color: #4a90e2;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Blogify! 🎉</h1>
        <p>Hi <span class="username">${fullName}</span>,</p>
        <p>Thank you for joining Blogify! We're excited to have you as part of our community.</p>
        <p>Start exploring and sharing your stories with the world!</p>
        <p>Best regards,<br>The Blogify Team</p>
      </div>
    </body>
    </html>
  `;
};

export const generatePasswordResetTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          padding: 20px;
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          color: #333;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #4a90e2;
          text-align: center;
          padding: 20px;
          margin: 20px 0;
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #e1e1e1;
        }
        .warning {
          color: #e74c3c;
          font-size: 14px;
          margin-top: 20px;
          padding: 10px;
          background-color: #fff;
          border-left: 4px solid #e74c3c;
        }
        .expiry-note {
          color: #666;
          font-size: 14px;
          text-align: center;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
          <p>You've requested to reset your password.</p>
        </div>
        
        <p>Please use the following OTP code to reset your password:</p>
        
        <div class="otp-code">${otp}</div>
        
        <div class="expiry-note">
          This code will expire in 10 minutes for security purposes.
        </div>
        
        <div class="warning">
          ⚠️ If you didn't request this password reset, please ignore this email or contact support if you have concerns about your account security.
        </div>
        
        <p>Best regards,<br>The Blogify Team</p>
      </div>
    </body>
    </html>
  `;
};
