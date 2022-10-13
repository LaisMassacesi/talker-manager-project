const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const fsUtils = require('./services/fsUtils');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkers = await fsUtils.readFile();

  res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const talkers = await fsUtils.readFile();
  const { id } = req.params;

  const message = {
    message: 'Pessoa palestrante não encontrada',
  };

  if (id <= talkers.length) {
    const talker = await talkers.find((obj) => obj.id === Number(id));
  
    return res.status(200).json(talker);
  }
  return res.status(404).json(message);
});

app.post('/login', (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  res.status(200).json({ token });
});