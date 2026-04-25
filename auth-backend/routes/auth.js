import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Forgot Password ───────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address.' });
    }

    // Generate a cryptographically secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing it in the database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Build the reset URL — uses FRONTEND_URL from .env
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0A0D0B; border-radius: 16px; overflow: hidden; border: 1px solid #1e2420;">
        <div style="padding: 40px 32px 24px; text-align: center; background: linear-gradient(135deg, rgba(39,174,96,0.15) 0%, transparent 60%);">
          <h1 style="color: #7fda96; font-size: 28px; margin: 0 0 8px;">🌱 AgriAI</h1>
          <p style="color: #becabd; font-size: 14px; margin: 0;">Password Reset Request</p>
        </div>
        <div style="padding: 32px;">
          <p style="color: #e2e3df; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
            Hi <strong>${user.name}</strong>,
          </p>
          <p style="color: #becabd; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
            We received a request to reset your password. Click the button below to choose a new password. This link will expire in <strong style="color:#7fda96;">15 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #7fda96 0%, #1e7d44 100%); color: #003919; font-weight: 800; font-size: 15px; padding: 14px 40px; border-radius: 10px; text-decoration: none; letter-spacing: -0.3px;">
              Reset My Password
            </a>
          </div>
          <p style="color: #6b7c6e; font-size: 12px; line-height: 1.6; margin: 24px 0 0; text-align: center;">
            If you didn't request this, you can safely ignore this email.<br/>
            Your password will remain unchanged.
          </p>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid #1e2420; text-align: center;">
          <p style="color: #3f4940; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} AgriAI Platform</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: '🔑 AgriAI — Reset Your Password',
      html: htmlBody,
    });

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
  }
});

// ─── Reset Password (verify token & update password) ───────────────
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful! You can now login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
