const express = require("express");
const path = require("path");
const { Server, TransactionBuilder } = require("@stellar/stellar-sdk");

const app = express();
const PORT = process.env.PORT || 4000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// API for submitting transaction
app.post("/submitTransaction", async (req, res) => {
  try {
    const { xdr } = req.body;

    if (!xdr) {
      return res.status(400).json({ success: false, error: "Missing signed XDR" });
    }

    const server = new Server("https://api.mainnet.minepi.com");
    const transaction = TransactionBuilder.fromXDR(xdr, "Pi Mainnet");
    const result = await server.submitTransaction(transaction);

    res.json({ success: true, result });
  } catch (err) {
    console.error("SubmitTransaction Error:", err);
    const reason = err.response?.data?.extras?.result_codes || "Unknown error";
    res.status(500).json({ success: false, error: err.message, reason });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
