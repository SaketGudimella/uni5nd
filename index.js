require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
