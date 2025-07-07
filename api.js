const express = require('express');
const path = require('path');
const { Server, Transaction } = require('stellar-sdk');

const app = express();
const port = process.env.PORT || 4000;

// Static files serve karo (React/Vite frontend)
app.use(express.static(path.join(__dirname, 'public')));

// JSON Body parse karne ke liye
app.use(express.json());

// ✅ Pi Network Transaction Route
app.post('/submitTransaction', async (req, res) => {
  try {
    const { xdr } = req.body;

    if (!xdr) {
      return res.status(400).json({ success: false, error: "Missing signed XDR" });
    }

    const server = new Server("https://api.mainnet.minepi.com");
    const transaction = new Transaction(xdr, "Pi Mainnet");
    const response = await server.submitTransaction(transaction);

    res.json({ success: true, result: response });
  } catch (e) {
    console.error("🔥 submitTransaction error:", e);
    const reason = e.response?.data?.extras?.result_codes || "Unknown error";
    res.status(500).json({
      success: false,
      error: e.message,
      reason
    });
  }
});

// ✅ React Frontend ke liye fallback (All Other Routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
