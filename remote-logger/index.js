const express = require('express');
const path = require('path');
const app = express();

// Middleware to log all incoming requests
app.use((req, res, next) => {
  // get query string value of "cookie", urldecode it, and log it
  const cookieValue = decodeURIComponent(req.query.cookie);
  console.log(`Cookie value: ${cookieValue}`);
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

