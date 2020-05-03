const express = require('express');
const jwt = require('jsonwebtoken');
const env = require('dotenv-safe');

const serve = express();

serve.use(express.json());
env.config();

serve.get('', verifyJWT, (req, res) => {
  res.json({ message: 'Hello World!' });
});

serve.post('/login', (req, res) => {
  const { user, pass } = req.body;
  const id = 1;

  if (validUser(user, pass)) {  
    const token = jwt.sign(
      { 
        id // Login
      }, 
      process.env.SECRET, // Secret key
      { 
        expiresIn: 300  // 5 MIN
      });

      res.status(200).header({ token }).json({ 
        auth: true,
        token
      });
  }

  res.status(500).send('Login inválido');
});

serve.listen(3333);

// Functions

function validUser(user, pass) {
  return user === 'philip' && pass === '12345';
}

function verifyJWT(req, res, next) {

  const token = req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : false;

  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(
    token,
    process.env.SECRET,
    (err, decoded) => {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

      req.userId = decoded.id;
      next();
    });
}
