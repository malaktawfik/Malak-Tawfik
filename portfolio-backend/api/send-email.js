const express = require('express');
const cors = require('cors');
const app = express();

// Replace with your frontend URL (or use '*' to allow all for testing)
app.use(cors({
  origin: 'https://malaktawfik.github.io/portfolio-frontend/', // e.g., https://malak-portfolio.vercel.app
  methods: ['GET', 'POST'], // allowed methods
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your send-email route
app.post('/api/send-email', async (req, res) => {
  try {
    const { email, message } = req.body;
    console.log('Email:', email);
    console.log('Message:', message);

    // Your email sending logic here
    res.status(200).send('Message sent successfully!');
  } catch (err) {
    res.status(500).send('Error sending message');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
