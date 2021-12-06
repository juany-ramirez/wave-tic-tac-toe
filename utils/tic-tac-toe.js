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

var cornerCoords = [0, 2, 6, 8];

var sideCoords = [1, 3, 5, 7];

var centerCoord = 4;

var regexPlayer = {
  x: /x/g,
  o: /o/g,
};

module.exports = class TicTacToe {
  constructor(board) {
    if (this.isBoardValid(board)) {
      this.board = board;
    } else {
      throw new Error(
        `Invalid board: The only valid characters are x, o and spaces (Length must be 9)`
      );
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
    this.onForkStrategy();
    return this.board;
  }

  onForkStrategy() {
    const currentMoves = Math.abs((this.board.match(/ /g) || []).length - 9);

    const player = 'o';
    const opponent = 'x';

    const playerCornerCount = this.getCornerCount(player);
    const opponentCornerCount = this.getCornerCount(opponent);
    const opponentSideCount = this.getSideCount(opponent);

    if (
      (playerCornerCount >= opponentCornerCount &&
        opponentSideCount < opponentCornerCount) ||
      currentMoves === 0 ||
      (currentMoves === 1 && this.board[centerCoord] === opponent)
    ) {
      this.onCornerFork();
      return;
    }

    if (this.board[centerCoord] === ' ') {
      this.onCenterFork();
      return;
    } else if (this.board[centerCoord] === player && opponentCornerCount <= 1) {
      this.onCornerFork(player);
      return;
    } else {
      this.onSideMove();
    }
  }

  getSideCount(player) {
    let counter = 0;
    for (let i = 0; i < sideCoords.length; i++) {
      const idx = sideCoords[i];
      if (this.board[idx] === player) counter += 1;
    }
    return counter;
  }

  getCornerCount(player) {
    let counter = 0;
    for (let i = 0; i < cornerCoords.length; i++) {
      const idx = cornerCoords[i];
      if (this.board[idx] === player) counter += 1;
    }
    return counter;
  }

  onCornerFork() {
    const emptyCorners = this.getEmptyCorners();
    let bestMove = this.getBestMove(emptyCorners);
    this.setMove(bestMove);
  }

  onCenterFork() {
    this.setMove(centerCoord);
  }

  onSideMove() {
    const emptySides = this.getEmptySides();
    let bestMove = this.getBestMove(emptySides);
    this.setMove(bestMove);
  }

  getEmptySides() {
    let emptySides = [];
    for (let i = 0; i < sideCoords.length; i++) {
      const idx = sideCoords[i];
      if (this.board[idx] === ' ') emptySides.push(idx);
    }
    return emptySides;
  }

  getEmptyCorners() {
    let emptyCorners = [];
    for (let i = 0; i < cornerCoords.length; i++) {
      const idx = cornerCoords[i];
      if (this.board[idx] === ' ') emptyCorners.push(idx);
    }
    return emptyCorners;
  }

  getBestMove(emptyCorners) {
    let bestMove = emptyCorners[0];
    const possibleMoves = this.getSimulatedBoards(
      'o',
      this.board,
      emptyCorners
    );
    possibleMoves.forEach((possibleMove) => {
      const winnerMove = this.getWinnerMove('o', possibleMove.board);
      if (winnerMove !== -1) bestMove = possibleMove.coords;
    });
    return bestMove;
  }

  getSimulatedBoards(player, board, emptySpaces) {
    let possibleMoves = [];
    emptySpaces.forEach((emptySpace) => {
      const imaginaryBoard =
        board.substr(0, emptySpace) +
        player +
        board.substr(emptySpace + 1, board.length);
      possibleMoves.push({ board: imaginaryBoard, coords: emptySpace });
    });
    return possibleMoves;
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
