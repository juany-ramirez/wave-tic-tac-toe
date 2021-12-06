'use strict';
const express = require('express');
const cors = require('cors');
const url = require('url');
const TicTacToe = require('./utils/tic-tac-toe');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  console.log(req.body);
  res.send('Hello Wave! :)');
});

app.get('/tic-tac-toe', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  let board = queryObject.board || req.body.board;
  if (board) {
    try {
      board = board.toLowerCase();
      const game = new TicTacToe(board);
      const result = game.playTheGame(board);
      res.json({ board: result });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  } else {
    res.status(400).send('Invalid parameters');
  }
});

app.listen(port);
