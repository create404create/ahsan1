const board = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

let selectedPiece = null;
let selectedSquare = null;
let currentPlayer = 'white';

const chessboard = document.getElementById('chessboard');
const statusText = document.getElementById('status');

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

function updateBoard() {
  const squares = document.querySelectorAll('.square');
  squares.forEach((square) => {
    const row = square.dataset.row;
    const col = square.dataset.col;
    const piece = board[row][col];
    square.textContent = getPieceSymbol(piece);
    square.style.color = piece === piece.toUpperCase() ? 'white' : 'black';
  });
}

function getPieceSymbol(piece) {
  switch (piece.toLowerCase()) {
    case 'p': return '♟';
    case 'r': return '♜';
    case 'n': return '♞';
    case 'b': return '♝';
    case 'q': return '♛';
    case 'k': return '♚';
    default: return '';
  }
}

function handleSquareClick(row, col) {
  const piece = board[row][col];

  if (selectedPiece) {
    movePiece(row, col);
  } else if (piece && isValidPiece(piece)) {
    selectPiece(row, col);
  }
}

function isValidPiece(piece) {
  const isWhitePiece = piece === piece.toUpperCase();
  return (currentPlayer === 'white' && isWhitePiece) || (currentPlayer === 'black' && !isWhitePiece);
}

function selectPiece(row, col) {
  selectedPiece = board[row][col];
  selectedSquare = { row, col };
  highlightSquare(row, col);
}

function movePiece(row, col) {
  if (isValidMove(row, col)) {
    board[row][col] = selectedPiece;
    board[selectedSquare.row][selectedSquare.col] = '';
    selectedPiece = null;
    selectedSquare = null;
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    updateBoard();
    updateStatus();
  } else {
    alert('Invalid move!');
  }
}

function isValidMove(row, col) {
  // Basic move validation (for simplicity, allows any move)
  return true;
}

function highlightSquare(row, col) {
  const squares = document.querySelectorAll('.square');
  squares.forEach((square) => square.classList.remove('selected'));
  const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
  square.classList.add('selected');
}

function updateStatus() {
  statusText.textContent = `${currentPlayer === 'white' ? 'White' : 'Black'}'s turn`;
}

createBoard();
