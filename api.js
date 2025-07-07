const express = require("express");
const path = require("path");
const StellarSdk = require("stellar-sdk");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/submitTransaction", async (req, res) => {
  try {
    const { xdr } = req.body;

    if (!xdr) {
      return res.status(400).json({ success: false, error: "Missing signed XDR" });
    }

    const server = new StellarSdk.Server("https://api.mainnet.minepi.com");
    const transaction = new StellarSdk.Transaction(xdr, "Pi Mainnet");
    const result = await server.submitTransaction(transaction);

    res.json({ success: true, result });
  } catch (err) {
    console.error("SubmitTransaction Error:", err);
    const reason = err.response?.data?.extras?.result_codes || "Unknown error";
    res.status(500).json({ success: false, error: err.message, reason });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
