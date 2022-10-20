const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;
  const minLength = 16;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization.length < minLength) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
};

const nameValidation = (req, res, next) => {
  const { name } = req.body;
  const minLength = 3;

  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }

  if (name.length < minLength) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const ageValidation = (req, res, next) => {
  const { age } = req.body;
  const minAge = 18;

  if (!Number(age)) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (minAge > Number(age)) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;

  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }

  next();
};

const watchedAtValidation = (req, res, next) => {
  const { watchedAt } = req.body.talk;

  const dataRegex = /\d{2}\/\d{2}\/\d{4}/;

  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }

  if (!watchedAt.match(dataRegex)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const rateValidation = (req, res, next) => {
  const { rate } = req.body.talk;
  
  if (rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }

  if (Number(rate) < 1 || Number(rate) > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
};

module.exports = {
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
  tokenValidation,
};