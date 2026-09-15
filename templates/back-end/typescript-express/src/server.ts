import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send({ status: `Aplicação rodando na porta ${port}` });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
