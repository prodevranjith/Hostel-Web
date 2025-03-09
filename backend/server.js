// require("dotenv").config();
// const nodemailer = require("nodemailer");
// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const bodyParser = require('body-parser');
// const cors = require('cors'); 

// const app = express();
// const PORT = 3000;
// const DATA_FILE = path.join(__dirname, 'data.json');
// app.use(bodyParser.urlencoded({ extended: true })); 



// app.use(cors()); // Enable CORS
// app.use(bodyParser.json());


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../rpshtz@123@admin.html'));
// });

// // Serve static files (if needed for CSS, JS, etc.)
// app.use(express.static(path.join(__dirname, '..')));

// // Read data
// app.get('/data', (req, res) => {
//     try {
//         const data = JSON.parse(fs.readFileSync(DATA_FILE));
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to read data.json' });
//     }
// });

// // Add data
// app.post('/add', (req, res) => {
//     try {
//         const newEntry = req.body;
//         const data = JSON.parse(fs.readFileSync(DATA_FILE));
//         data.push(newEntry);
//         fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
//         res.sendStatus(200);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to add data' });
//     }
// });

// // Delete data
// app.delete('/delete/:id', (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         let data = JSON.parse(fs.readFileSync(DATA_FILE));
//         data = data.filter(item => item.id !== id);
//         fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
//         res.sendStatus(200);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to delete data' });
//     }
// });

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true })); 

// // Nodemailer Transporter Setup
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,  
//     pass: process.env.EMAIL_PASS,   
//   },
// });

// // Handle form submission
// app.post('/send-message', async (req, res) => {
//   const { name, email, phone, message } = req.body;

//   if (!name || !email || !message) {
//     return res.status(400).json({ success: false, message: "All fields are required!" });
//   }

//   const mailOptions = {
//     from: email,
//     to: process.env.RECEIVER_EMAIL, // Your email to receive messages
//     subject: `New message from ${name}`,
//     text: `You have received a new message from the contact form:
    
//     Name: ${name}
//     Email: ${email}
//     Phone: ${phone}
//     Message: ${message}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ success: true, message: "Message sent successfully!" });
//     // window.location.href="../Index.html"
//   } catch (error) {
//     console.error("Email Error:", error);
//     res.status(500).json({ success: false, message: "Error sending email!" });
//   }
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const DATA_FILE = process.env.NODE_ENV === 'production' ? path.join('/tmp', 'data.json') : path.join(__dirname,'backend','data.json');
app.use(bodyParser.urlencoded({ extended: true })); 
if (process.env.NODE_ENV === 'production') {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      // Create empty array or copy from initial data if available
      const initialData = [];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
      console.log('Created new data file in /tmp');
    }
  } catch (error) {
    console.error('Error creating data file:', error);
  }
}

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../rpshtz@123@admin.html'));
});

// Serve static files (if needed for CSS, JS, etc.)
app.use(express.static(path.join(__dirname, '..')));

// Read data
// app.get('/data', (req, res) => {
//     try {
//         const data = JSON.parse(fs.readFileSync(DATA_FILE));
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to read data.json' });
//     }
// });
app.get('/data', (req, res) => {
  try {
      if (!fs.existsSync(DATA_FILE)) {
          return res.json([]);  // Return empty array if file doesn't exist
      }
      const data = JSON.parse(fs.readFileSync(DATA_FILE));
      res.json(data);
  } catch (error) {
      console.error('Error reading data file:', error);
      res.status(500).json({ error: 'Failed to read data.json', details: error.message });
  }
});

// Add data
// app.post('/add', (req, res) => {
//     try {
//         const newEntry = req.body;
//         const data = JSON.parse(fs.readFileSync(DATA_FILE));
//         data.push(newEntry);
//         fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
//         res.sendStatus(200);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to add data' });
//     }
// });
app.post('/add', (req, res) => {
  try {
      const newEntry = req.body;
      let data = [];
      
      if (fs.existsSync(DATA_FILE)) {
          data = JSON.parse(fs.readFileSync(DATA_FILE));
      }
      
      data.push(newEntry);
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      res.sendStatus(200);
  } catch (error) {
      console.error('Error adding data:', error);
      res.status(500).json({ error: 'Failed to add data', details: error.message });
  }
});

// Delete data
// app.delete('/delete/:id', (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         let data = JSON.parse(fs.readFileSync(DATA_FILE));
//         data = data.filter(item => item.id !== id);
//         fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
//         res.sendStatus(200);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to delete data' });
//     }
// });
app.delete('/delete/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (!fs.existsSync(DATA_FILE)) {
            return res.status(404).json({ error: 'Data file not found' });
        }
        
        let data = JSON.parse(fs.readFileSync(DATA_FILE));
        data = data.filter(item => item.id !== id);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Failed to delete data', details: error.message });
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,   
  },
});

// Handle form submission
app.post('/send-message', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL, // Your email to receive messages
    subject: `New message from ${name}`,
    text: `You have received a new message from the contact form:
    
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Message: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, message: "Error sending email!" });
  }
});

// Export the app for Vercel
module.exports = app;
