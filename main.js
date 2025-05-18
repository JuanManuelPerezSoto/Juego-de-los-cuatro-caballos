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

function resetBoard() {
  board = JSON.parse(JSON.stringify(initialBoard));
  selected = null;
  document.getElementById('message').textContent = '';
  drawBoard();
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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('resetBtn').addEventListener('click', resetBoard);
});

drawBoard();
