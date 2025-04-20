// utils/emailTemplates.js

const logoUrl = 'https://res.cloudinary.com/dgjvxaspl/image/upload/v1745091189/media/acpyj3xhiuihrjwrxacz.png';

const wrapperStyle = `
  style="margin: 0 auto; padding: 20px; max-width: 600px; font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); color: #333;"
`;

const buttonStyle = `
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-size: 16px;
`;

const footerStyle = `
  font-size: 13px;
  color: #888;
  margin-top: 40px;
  text-align: center;
`;

const headerImage = `
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="${logoUrl}" alt="Track Mark Logo" style="max-width: 120px; height: auto;" />
  </div>
`;

// ✅ 1. Account Approved
const approvalTemplate = (name, loginUrl) => `
  <div ${wrapperStyle}>
    ${headerImage}
    <h2 style="color: #4CAF50; margin-bottom: 10px;">🎉 Welcome, ${name}!</h2>
    <p>Your account has been <strong>successfully approved</strong> by the admin.</p>
    <p>You can now access your dashboard and start exploring the platform.</p>

    <a href="${loginUrl}" style="${buttonStyle}">
      Go to Dashboard
    </a>

    <div style="${footerStyle}">
      This is an automated email. Please do not reply.<br>
      &copy; ${new Date().getFullYear()} Track Mark. All rights reserved.
    </div>
  </div>
`;

// ✅ 2. OTP for Verification
const otpTemplate = (otp) => `
  <div ${wrapperStyle}>
    ${headerImage}
    <h2 style="color: #4CAF50; margin-bottom: 10px;">🔐 OTP Verification</h2>
    <p>Use the following OTP to complete your email verification:</p>
    <div style="font-size: 28px; font-weight: bold; color: #111; letter-spacing: 3px; margin: 20px 0;">${otp}</div>
    <p>This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>

    <div style="${footerStyle}">
      If you didn’t request this, you can ignore this email.<br>
      &copy; ${new Date().getFullYear()} Track Mark. All rights reserved.
    </div>
  </div>
`;

// ✅ 3. Password Reset Success
const passwordResetSuccessTemplate = (name, loginUrl) => `
  <div ${wrapperStyle}>
    ${headerImage}
    <h2 style="color: #4CAF50;">✅ Password Reset Successful</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your password has been successfully changed. You can now log in using your new password.</p>

    <a href="${loginUrl}" style="${buttonStyle}">
      Login to Your Account
    </a>

    <div style="${footerStyle}">
      Didn’t reset your password? Please contact our support team immediately.<br>
      &copy; ${new Date().getFullYear()} Track Mark. All rights reserved.
    </div>
  </div>
`;

// ✅ 4. Admin Rejection Notice
const rejectionTemplate = (name) => `
  <div ${wrapperStyle}>
    ${headerImage}
    <h2 style="color: #e53935;">❌ Account Rejected</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>We regret to inform you that your account registration has been <strong>rejected</strong> after review by the admin.</p>
    <p>This could be due to incomplete information or eligibility issues. You may reapply with accurate details or contact support for clarification.</p>

    <div style="${footerStyle}">
      Need help? Reply to this email or contact support.<br>
      &copy; ${new Date().getFullYear()} Track Mark. All rights reserved.
    </div>
  </div>
`;

module.exports = {
  approvalTemplate,
  otpTemplate,
  passwordResetSuccessTemplate,
  rejectionTemplate,
};
