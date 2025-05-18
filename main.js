// --- Inicialización Firebase ---
// Configura con los datos de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Variables globales ---
let boardSize = 3;
let board = [];
let goalBoard = [];
let selected = null;

// --- Generadores de tablero ---
function generateBoard(size) {
  let newBoard = [];
  for (let r = 0; r < size; r++) {
    newBoard[r] = [];
    for (let c = 0; c < size; c++) {
      newBoard[r][c] = '';
    }
  }
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
  newBoard[0][0] = 'W';
  newBoard[0][size - 1] = 'W';
  newBoard[size - 1][0] = 'B';
  newBoard[size - 1][size - 1] = 'B';
  return newBoard;
}

// --- Comparar tableros ---
function boardsEqual(b1, b2) {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (b1[r][c] !== b2[r][c]) return false;
    }
  }
  return true;
}

// --- Dibujar tablero ---
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
    guardarJugada({
      fecha: new Date(),
      resultado: "victoria",
      tableroFinal: JSON.stringify(board)
    });
  } else {
    document.getElementById('message').textContent = '';
  }
}

// --- Validar movimiento caballo ---
function isValidLMove(from, to) {
  const dx = Math.abs(from.row - to.row);
  const dy = Math.abs(from.col - to.col);
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

// --- Manejar clic en celda ---
function handleClick(row, col) {
  const cell = board[row][col];

  if (selected) {
    if (cell === '' && isValidLMove(selected, { row, col })) {
      board[row][col] = board[selected.row][selected.col];
      board[selected.row][selected.col] = '';
      selected = null;

      drawBoard();

      // Guardar jugada tras movimiento válido
      guardarJugada({
        fecha: new Date(),
        tablero: JSON.stringify(board),
        movimiento: `De (${selected?.row},${selected?.col}) a (${row},${col})`
      });
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

// --- Reiniciar tablero ---
function resetBoard() {
  board = JSON.parse(JSON.stringify(generateBoard(boardSize)));
  goalBoard = JSON.parse(JSON.stringify(generateGoalBoard(boardSize)));
  selected = null;
  document.getElementById('message').textContent = '';
  drawBoard();
}

// --- Guardar jugada en Firestore ---
function guardarJugada(jugada) {
  db.collection("jugadas").add(jugada)
    .then(docRef => {
      console.log("Jugada guardada con ID:", docRef.id);
    })
    .catch(error => {
      console.error("Error guardando jugada:", error);
    });
}

// --- Exponer funciones globales para onclick ---
window.drawBoard = drawBoard;
window.handleClick = handleClick;
window.resetBoard = resetBoard;

// --- Inicialización al cargar DOM ---
document.addEventListener('DOMContentLoaded', () => {
  board = generateBoard(boardSize);
  goalBoard = generateGoalBoard(boardSize);
  drawBoard();

  document.getElementById('resetBtn').addEventListener('click', resetBoard);
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
