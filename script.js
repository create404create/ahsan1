const chessboard = document.getElementById('chessboard');
const statusText = document.getElementById('status');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

const game = new Chess();
let selectedSquare = null;
let draggablePiece = null;

// Initialize Stockfish
const stockfish = new Worker('stockfish.js'); // Download Stockfish.js from https://github.com/nmrugg/stockfish.js
stockfish.onmessage = (event) => {
  if (event.data.startsWith('bestmove')) {
    const move = event.data.split(' ')[1];
    game.move(move);
    updateBoard();
    updateStatus();
  }
};

// Create the chessboard
function createBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
      square.dataset.row = row;
      square.dataset.col = col;
      square.addEventListener('click', () => handleSquareClick(row, col));
      chessboard.appendChild(square);
    }
  }
  updateBoard();
}

// Update the board based on the game state
function updateBoard() {
  const squares = document.querySelectorAll('.square');
  squares.forEach((square) => {
    const row = square.dataset.row;
    const col = square.dataset.col;
    const piece = game.board()[row][col];
    square.textContent = piece ? getPieceSymbol(piece) : '';
    square.style.color = piece && piece.color === 'w' ? 'white' : 'black';
  });
}

// Get the Unicode symbol for a piece
function getPieceSymbol(piece) {
  const symbols = {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
    P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔',
  };
  return symbols[piece.type] || '';
}

// Handle square clicks
function handleSquareClick(row, col) {
  const square = `${String.fromCharCode(97 + col)}${8 - row}`;
  const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });

  if (move) {
    selectedSquare = null;
    updateBoard();
    updateStatus();
    if (game.turn() === 'b') {
      stockfish.postMessage('position fen ' + game.fen());
      stockfish.postMessage('go depth 10');
    }
  } else {
    selectedSquare = square;
  }
}

// Update the status text
function updateStatus() {
  statusText.textContent = `${game.turn() === 'w' ? 'White' : 'Black'}'s turn`;
  if (game.in_checkmate()) {
    statusText.textContent = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`;
  } else if (game.in_draw()) {
    statusText.textContent = 'Draw!';
  }
}

// Chat functionality
sendButton.addEventListener('click', () => {
  const message = chatInput.value.trim();
  if (message) {
    chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
    chatInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});

// Initialize the game
createBoard();
updateStatus();
