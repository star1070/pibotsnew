const express = require('express');
const path = require('path');
const submitTransactionHandler = require('./functions/submit-transaction');

const app = express();
const port = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/submit-transaction', submitTransactionHandler);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
