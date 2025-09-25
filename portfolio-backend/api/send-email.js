const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use memory storage (no writing to disk, works on Vercel)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => cb(null, true)
});

// ✅ Gmail transporter (use App Password, not your real password!)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'malaktawfikbusiness.fl@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// ✅ API endpoint for contact form
app.post('/api/send-email', upload.array('attachments', 5), async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required.' });
    }

    const mailOptions = {
      from: 'malaktawfikbusiness.fl@gmail.com',
      to: 'malaktawfikbusiness.fl@gmail.com',
      subject: `New Message from Portfolio: ${email}`,
      text: `
        From: ${email}
        Message: ${message}
        
        ${req.files && req.files.length > 0
          ? `Attachments: ${req.files.map(f => f.originalname).join(', ')}`
          : 'No attachments'}
      `,
      attachments: req.files
        ? req.files.map(file => ({
            filename: file.originalname,
            content: file.buffer // ✅ stored in memory
          }))
        : []
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// ✅ Export app for Vercel
module.exports = app;
