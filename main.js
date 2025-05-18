let board = [
  ['B', '', 'B'],
  ['', '', ''],
  ['W', '', 'W']
];

let selected = null;

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
      // Mover caballo
      board[row][col] = board[selected.row][selected.col];
      board[selected.row][selected.col] = '';
      selected = null;
    } else if (cell !== '') {
      selected = { row, col }; // Selecciona otro caballo
    } else {
      selected = null; // Reinicia si clic en vacío no válido
    }
  } else {
    if (cell !== '') {
      selected = { row, col };
    }
  }
  if (isWinningBoard()) {
    setTimeout(() => {
      alert("¡Ganaste!");
      if (confirm("¿Quieres intentarlo de nuevo?")) {
        board = [
          ['B', '', 'B'],
          ['', '', ''],
          ['W', '', 'W']
        ];
      }
      drawBoard();
    }, 100); // pequeño retraso para que se vea el último movimiento
    return;
  }

  drawBoard();
}

drawBoard();
const finalBoard = [
  ['W', '', 'W'],
  ['', '', ''],
  ['B', '', 'B']
];

function isWinningBoard() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] !== finalBoard[row][col]) {
        return false;
      }
    }
  }
  return true;
}
