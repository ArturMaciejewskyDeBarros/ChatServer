const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // substitua pelo domínio do seu cliente
  credentials: true
}));
app.use(express.json());
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // substitua pelo domínio do seu cliente
    methods: ['GET', 'POST'],
    credentials: true
  }
});

let users = [
  { username: 'Artur', password: '123' },
  { username: 'geral', password: '123' }
];

app.post('/login', (req, res) => {
  const user = users.find(user => user.username === req.body.username && user.password === req.body.password);
  if (user) {
    res.status(200).send({ username: user.username });
  } else {
    res.status(401).send({ error: 'Usuário ou senha incorreta!' });
  }
});

app.post('/register', (req, res) => {
  const existingUser = users.find(user => user.username === req.body.username);
  if (existingUser) {
    res.status(400).send({ error: 'Usuário já existe!' });
  } else {
    const newUser = { username: req.body.username, password: req.body.password };
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

io.on('connection', socket => {
  console.log('New client connected');

  socket.on('chat message', (msg, username) => {
    console.log('Message received:', msg, username);
    io.emit('chat message', msg, username);
    console.log('Message sent:', msg, username);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
