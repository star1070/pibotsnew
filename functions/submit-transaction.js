const { Server, Networks, Transaction } = require('stellar-sdk');

async function submitTransactionHandler(req, res) {
  const { xdr } = req.body;

  if (!xdr) {
    return res.status(400).json({ success: false, error: 'Missing XDR' });
  }

  try {
    const server = new Server("https://horizon.stellar.org");
    const transaction = new Transaction(xdr, Networks.PUBLIC);
    const response = await server.submitTransaction(transaction);
    res.json({ success: true, result: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = submitTransactionHandler;
