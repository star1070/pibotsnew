const express = require("express");
const bodyParser = require("body-parser");
const { Server, Transaction } = require("stellar-sdk");  // ✅ Correct Import

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static("public"));  // public folder serve

app.post("/submitTransaction", async (req, res) => {
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
    console.error("SubmitTransaction Error:", e);
    const reason = e.response?.data?.extras?.result_codes || "Unknown error";
    res.status(500).json({ success: false, error: e.message, reason });
  }
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
