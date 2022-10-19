const express = require('express');
require('express-async-errors');
const crypto = require('crypto');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const path = require('path');
const fsUtils = require('./services/fsUtils');
const { emailValidation } = require('./middleware/ValidateEmail');
const { passwordValidation } = require('./middleware/ValidatePassword');
const { 
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
  tokenValidation,
 } = require('./services/validations');

const app = express();
app.use(bodyParser.json());
app.use(express.json());
// const router = express.Router();

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const token = () => crypto.randomBytes(8).toString('hex');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
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

app.post('/login', emailValidation, passwordValidation, (_req, res) => 
  res.status(200).json({ token: token() }));

app.post('/talker', 
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation, 
  async (req, res) => {
  const talkers = { ...req.body };

  const pathResolve = path.resolve(__dirname, './talker.json');
  const fileResult = JSON.parse(await fs.readFile(pathResolve));
  
  const newTalker = { ...talkers, id: fileResult.length + 1 };
  fileResult.push(newTalker);

  await fs.writeFile(pathResolve, JSON.stringify(fileResult));
  res.status(201).json(newTalker);
});

app.put('/talker/:id',
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation, 
  async (req, res) => {
  const { id } = req.params;
  const updatedData = { id: +id, ...req.body };
  
  const pathResolve = path.resolve(__dirname, './talker.json');
  const fileResult = JSON.parse(await fs.readFile(pathResolve));
  
  const index = fileResult.findIndex((item) => item.id === +id);
  fileResult[index] = updatedData;

  await fs.writeFile(pathResolve, JSON.stringify(fileResult));
  res.status(200).json(updatedData);
});

app.use((error, _req, res) => {
  res.status(400).json({ mensagem: error.message });
});