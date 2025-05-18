let boardSize = 3;
let board = [];
let goalBoard = [];
let selected = null;

function generateBoard(size) {
  let newBoard = [];
  for (let r = 0; r < size; r++) {
    newBoard[r] = [];
    for (let c = 0; c < size; c++) {
      newBoard[r][c] = '';
    }
  }
  // Caballos en esquinas
  newBoard[0][0] = 'B';
  newBoard[0][size - 1] = 'B';
  newBoard[size - 1][0] = 'W';
  newBoard[size - 1][size - 1] = 'W';
  return newBoard;
}

function generateGoalBoard(size) {
  let newBoard = [];
  for (let r = 0; r < size; r++) {
    newBoard[r] = [];
    for (let c = 0; c < size; c++) {
      newBoard[r][c] = '';
    }
  }
  // Caballos en esquinas invertidos
  newBoard[0][0] = 'W';
  newBoard[0][size - 1] = 'W';
  newBoard[size - 1][0] = 'B';
  newBoard[size - 1][size - 1] = 'B';
  return newBoard;
}

function boardsEqual(b1, b2) {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (b1[r][c] !== b2[r][c]) return false;
    }
  }
  return true;
}

function drawBoard() {
  const boardDiv = document.getElementById('board');
  let html = '<table>';
  for (let row = 0; row < boardSize; row++) {
    html += '<tr>';
    for (let col = 0; col < boardSize; col++) {
      let cell = board[row][col];
      let style = selected && selected.row === row && selected.col === col ? 'style="background: yellow;"' : '';
      html += `<td ${style} onclick="handleClick(${row}, ${col})">${cell}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  boardDiv.innerHTML = html;

  if (boardsEqual(board, goalBoard)) {
    document.getElementById('message').textContent = '¡Ganaste!';
  } else {
    document.getElementById('message').textContent = '';
  }
}

function isValidLMove(from, to) {
  const dx = Math.abs(from.row - to.row);
  const dy = Math.abs(from.col - to.col);
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

function handleClick(row, col) {
  const cell = board[row][col];

  if (selected) {
    if (cell === '' && isValidLMove(selected, { row, col })) {
      board[row][col] = board[selected.row][selected.col];
      board[selected.row][selected.col] = '';
      selected = null;
    } else if (cell !== '') {
      selected = { row, col };
    } else {
      selected = null;
    }
  } else {
    if (cell !== '') {
      selected = { row, col };
    }
  }

  drawBoard();
}

function resetBoard() {
  board = JSON.parse(JSON.stringify(generateBoard(boardSize)));
  selected = null;
  document.getElementById('message').textContent = '';
  drawBoard();
}

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar tablero
  board = generateBoard(boardSize);
  goalBoard = generateGoalBoard(boardSize);
  drawBoard();

  // Evento reiniciar
  document.getElementById('resetBtn').addEventListener('click', resetBoard);

  // Evento cambiar tamaño
  document.getElementById('changeSizeBtn').addEventListener('click', () => {
    const sizeInput = document.getElementById('boardSize');
    let newSize = parseInt(sizeInput.value);
    if (isNaN(newSize) || newSize < 3) {
      alert('Por favor, ingresa un tamaño válido mayor o igual a 3');
      return;
    }
    boardSize = newSize;
    board = generateBoard(boardSize);
    goalBoard = generateGoalBoard(boardSize);
    selected = null;
    document.getElementById('message').textContent = '';
    drawBoard();
  });
});
