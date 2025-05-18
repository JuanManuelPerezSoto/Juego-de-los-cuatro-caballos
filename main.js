const initialBoard = [
  ['B', '', 'B'],
  ['', '', ''],
  ['W', '', 'W']
];

let board = JSON.parse(JSON.stringify(initialBoard));

const goalBoard = [
  ['W', '', 'W'],
  ['', '', ''],
  ['B', '', 'B']
];

let selected = null;

function boardsEqual(b1, b2) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (b1[r][c] !== b2[r][c]) return false;
    }
  }
  return true;
}

function drawBoard() {
  const boardDiv = document.getElementById('board');
  let html = '<table>';
  for (let row = 0; row < 3; row++) {
    html += '<tr>';
    for (let col = 0; col < 3; col++) {
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
  board = JSON.parse(JSON.stringify(initialBoard));
  selected = null;
  document.getElementById('message').textContent = '';
  drawBoard();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('resetBtn').addEventListener('click', resetBoard);
});

drawBoard();

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('resetBtn').addEventListener('click', resetBoard);
});

drawBoard();
