'use strict';

var winCoords = [
  // row wins
  { a: 0, b: 1, c: 2 },
  { a: 3, b: 4, c: 5 },
  { a: 6, b: 7, c: 8 },

  // columns wins
  { a: 0, b: 3, c: 6 },
  { a: 1, b: 4, c: 7 },
  { a: 2, b: 5, c: 8 },

  // diagonal wins
  { a: 0, b: 4, c: 8 },
  { a: 2, b: 4, c: 6 },
];

var regexPlayer = {
  x: /x/g,
  o: /o/g,
};

module.exports = class TicTacToe {
  constructor(board) {
    if (this.isBoardValid(board)) {
      this.board = board;
    } else {
      throw new Error(`Invalid board: The only valid characters are x, o and spaces (Length must be 9)`);
    }
  }

  playTheGame() {
    this.printBoard();
    const oWinnerMove = this.getWinnerMove('o');
    if (oWinnerMove !== -1) {
      this.setMove(oWinnerMove);
      return this.board;
    }
    const xWinnerMove = this.getWinnerMove('x');
    if (xWinnerMove !== -1) {
      this.setMove(xWinnerMove);
      return this.board;
    }
    return this.board;
  }

  setMove(idx) {
    if (this.board[idx] !== ' ')
      throw new Error(`trying to make invalid move to ${idx}`);
    const board =
      this.board.substr(0, idx) +
      'o' +
      this.board.substr(idx + 1, this.board.length);
    this.board = board;
    this.printBoard();
  }

  getWinnerMove(player, imaginaryBoard) {
    const board = imaginaryBoard || this.board;
    for (let i = 0; i < winCoords.length; i++) {
      const { a, b, c } = winCoords[i];
      const set = `${board[a]}${board[b]}${board[c]}`;
      const playerCount = (set.match(regexPlayer[player]) || []).length;
      const spaceMatch = set.match(/ /);
      const spaceCount = (spaceMatch || []).length;
      if (playerCount >= 2 && spaceCount === 1) {
        const setArray = [a, b, c];
        return setArray[spaceMatch.index];
      }
    }
    return -1;
  }

  printBoard() {
    let idx = 0;
    let board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    board.forEach((elmt, i) => {
      elmt.forEach((e, j) => {
        board[i][j] = this.board[idx];
        idx += 1;
      });
      console.log(elmt);
    });
    console.log();
  }

  isBoardValid(board) {
    if (board.length !== 9) return false;
    const boardRegex = new RegExp(/^[xo ]+/i);
    return boardRegex.test(board);
  }
};
