const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

// ✅ Static files serve karo (jo public folder me hote hain)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Agar koi bhi URL aaye toh index.html dikhao (React/Vite ke liye jaruri)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Server start
app.listen(port, () => {
  console.log(`✅ API running on http://localhost:${port}`);
});
