const initialBoard = [
  ['B', '', 'B'],
  ['', '', ''],
  ['W', '', 'W']
];

function drawBoard(board) {
  const boardDiv = document.getElementById('board');
  let html = '<table>';
  for (let row = 0; row < 3; row++) {
    html += '<tr>';
    for (let col = 0; col < 3; col++) {
      html += `<td>${board[row][col]}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  boardDiv.innerHTML = html;
}

drawBoard(initialBoard);
