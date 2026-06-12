const express = require('express');
const healthRoute = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/health', healthRoute);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js CI/CD Demo App' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
