
const express = require('express');
const bodyParser = require('body-parser');
const translateRoutes = require('./routes/translateRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/api/translate', translateRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
