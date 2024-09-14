const Gameboard = (function() {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateBoard = (index, mark) => {
      if (board[index] === "") {
          board[index] = mark;
          return true;
      }
      return false;
  };

  const resetBoard = () => {
      board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, updateBoard, resetBoard };
})();

const Player = function(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;

  return { getName, getMarker };
}

const GameController = (function() {
  let currentPlayer = null;
  let winner = null;
  const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
      [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  const startGame = (player1, player2) => {
      currentPlayer = player1;
      winner = null;
      Gameboard.resetBoard();
      updateDisplay();
      attachEventListeners();
  };

  const switchPlayer = () => {
      currentPlayer = (currentPlayer === player1) ? player2 : player1;
  };

  const makeMove = (index) => {
      if (Gameboard.updateBoard(index, currentPlayer.getMarker())) {
          if (checkWinner()) {
              winner = currentPlayer;
          } else if (checkTie()) {
              winner = 'Tie';
          } else {
              switchPlayer();
          }
          updateDisplay();
      }
  };

  const checkWinner = () => {
      const board = Gameboard.getBoard();
      return winningCombinations.some(com => {
          const [a, b, c] = com;
          return board[a] && board[a] === board[b] && board[a] === board[c];
      });
  };

  const checkTie = () => {
      return Gameboard.getBoard().every(cell => cell !== "");
  };

  const updateDisplay = () => {
      const statusElement = document.getElementById('status');
      const boardElements = document.querySelectorAll('.cell');

      boardElements.forEach((element, index) => {
          element.textContent = Gameboard.getBoard()[index];
      });

      if (winner) {
          if (winner === 'Tie') {
              statusElement.textContent = "It's a Tie!";
          } else {
              statusElement.textContent = `${winner.getName()} Wins!`;
          }
      } else {
          statusElement.textContent = `${currentPlayer.getName()}'s Turn`;
      }
  };

  const attachEventListeners = () => {
      const boardElements = document.querySelectorAll('.cell');
      boardElements.forEach((cell) => {
          cell.addEventListener('click', () => {
              const index = cell.getAttribute('data-index');
              makeMove(index);
          });
      });
  };

  return { startGame, makeMove };
})();

const player1 = Player('SJB', 'X');
const player2 = Player('SP', 'O');

document.getElementById('restart').addEventListener('click', () => {
  GameController.startGame(player1, player2);
});

GameController.startGame(player1, player2);
