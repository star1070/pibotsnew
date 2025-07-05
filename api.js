const express = require("express");
const { Server, Networks, Transaction } = require("stellar-sdk");

const app = express();
app.use(express.json());

app.post("/submitTransaction", async (req, res) => {
  const { xdr } = req.body;
  if (!xdr) {
    return res.status(400).json({ success: false, error: "Missing XDR" });
  }

  try {
    const server = new Server("https://horizon.stellar.org");
    const transaction = new Transaction(xdr, Networks.PUBLIC);
    const result = await server.submitTransaction(transaction);
    res.json({ success: true, result });
  } catch (err) {
    console.error("Transaction Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(4000, () => console.log("API running on port 4000"));