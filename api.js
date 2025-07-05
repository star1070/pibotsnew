const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

// ✅ Ye line jaroori hai (static files serve karne ke liye)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Default route agar koi unknown route aaye
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
