const BLACK = -1
const WHITE = 1
const EMPTY = 0

// The board
let board = [  [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

// The current player
let currentPlayer = BLACK;

// The captured pieces
let capturedPieces = [];

// Handle clicks on the board
let boardElement = document.getElementById("board");
boardElement.addEventListener("click", (event) => {
    let clickedCell = event.target;
    if (clickedCell.classList.contains("cell")) {
        let clickedRow = clickedCell.parentElement;
        let clickedColumn = Array.prototype.indexOf.call(clickedRow.children, clickedCell);
        let clickedRowIndex = Array.prototype.indexOf.call(boardElement.children, clickedRow);

        // Check if the current player should skip their turn
        if (shouldSkipTurn()) {
            // The current player should skip their turn, so pass the turn to the next player
            currentPlayer = -currentPlayer;
        } else {
            // Place a piece if the move is valid
            if (isValidMove(board, currentPlayer, clickedRowIndex, clickedColumn)) {
                board[clickedRowIndex][clickedColumn] = currentPlayer;
                capturedPieces = [];
                let directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
                for (let [dRow, dColumn] of directions) {
                    capturedPieces = capturedPieces.concat(getCapturedPieces(board, currentPlayer, clickedRowIndex, clickedColumn, dRow, dColumn));
                }
                for (let [row, column] of capturedPieces) {
                    board[row][column] = currentPlayer;
                }
                currentPlayer = -currentPlayer;
            }
        }

        // Update the board
        renderBoard();
    }
});

class Confetti {
    constructor() {
        this.canvas = document.getElementById("confetti");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.colors = ["#f00", "#0f0", "#00f", "#0ff", "#f0f"];
    }

    draw() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.width, this.height);

        // Draw the particles
        for (let particle of this.particles) {
            this.context.fillStyle = particle.color;
            this.context.fillRect(particle.x, particle.y, particle.width, particle.height);
        }
    }

    animate() {
        // Update the position of each particle
        for (let particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Check if the particle is outside the canvas
            if (particle.x + particle.width < 0 || particle.x > this.width || particle.y + particle.height < 0 || particle.y > this.height) {
                // Reset the position of the particle
                particle.x = Math.random() * this.width;
                particle.y = 0;
                particle.vx = Math.random() * 4 - 2;
                particle.vy = Math.random() * 6 + 3;
            }
        }
    }

    addParticles(count) {
        // Add the specified number of particles to the confetti
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 6 + 3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)]
            });
        }
    }



    start() {
        // Start the confetti animation
        this.interval = setInterval(() => {
            this.animate();
            this.draw();
        }, 1000 / 60);

        // Stop the confetti animation after 5 seconds
        setTimeout(() => {
            this.stop();
        }, 5000);
    }

    stop() {
        // Stop the confetti animation
        clearInterval(this.interval);
        this.canvas.style.display = "none";

    }
}


function freshBoard() {
    board = [  [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, -1, 0, 0, 0],
        [0, 0, 0, -1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    currentPlayer = BLACK;
    renderBoard();
}

document.getElementById('new-game-button').addEventListener('click', freshBoard)

// Check if a move can capture any pieces
function canCapture(board, player, row, column) {
    // Check if there are any pieces that can be captured in this direction
    let directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (let [dRow, dColumn] of directions) {
        if (getCapturedPieces(board, player, row, column, dRow, dColumn).length > 0) {
            return true;
        }
    }
    return false;
}


// Check if a move is valid
function isValidMove(board, player, row, column) {
    // Check if the cell is empty
    if (board[row][column] != EMPTY) {
        return false;
    }

    // Check if the move can capture any pieces
    return canCapture(board, player, row, column);
}

function shouldSkipTurn() {
    // Check all cells on the board
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
            // Check if the current cell is empty and if the current player has a valid move in this cell
            if (board[rowIndex][columnIndex] == EMPTY && isValidMove(board, currentPlayer, rowIndex, columnIndex)) {
                // The current player has at least one valid move, so they should not skip their turn
                return false;
            }
        }
    }

    // The current player does not have any valid moves, so they should skip their turn
    return true;
}


// Get the pieces that will be captured by a move
function getCapturedPieces(board, player, row, column, dRow, dColumn) {
    let capturedPieces = [];
    let currentRow = row + dRow;
    let currentColumn = column + dColumn;
    while (currentRow >= 0 && currentRow < 8 && currentColumn >= 0 && currentColumn < 8) {
        let currentPiece = board[currentRow][currentColumn];
        if (currentPiece == player) {
            return capturedPieces;
        } else if (currentPiece == EMPTY) {
            return [];
        } else {
            capturedPieces.push([currentRow, currentColumn]);
        }
        currentRow += dRow;
        currentColumn += dColumn;
    }
    return [];
}

// Render the board
// Render the board on the page
function renderBoard() {
    let boardElement = document.getElementById("board");
    // Clear the board
    boardElement.innerHTML = "";

    // Render each cell on the board
    for (let row = 0; row < board.length; row++) {
        let rowElement = document.createElement("div");
        rowElement.classList.add("row");
        for (let column = 0; column < board[row].length; column++) {
            let cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.classList.add("borders")
            if (board[row][column] == BLACK || capturedPieces.includes([row, column])) {
                cellElement.classList.add("black");
            } else if (board[row][column] == WHITE || capturedPieces.includes([row, column])) {
                cellElement.classList.add("white");
            }
            rowElement.appendChild(cellElement);
        }
        boardElement.appendChild(rowElement);
    }
    let currentPlayerElement = document.getElementById("current-player");
    if (currentPlayer == BLACK) {
        currentPlayerElement.innerHTML = "Current player: BLACK";
    } else if (currentPlayer == WHITE) {
        currentPlayerElement.innerHTML = "Current player: WHITE";
    }

    // Count the number of black and white pieces on the board
    let blackCount = 0;
    let whiteCount = 0;
    for (let row of board) {
        for (let piece of row) {
            if (piece == BLACK) {
                blackCount += 1;
            } else if (piece == WHITE) {
                whiteCount += 1;
            }
        }
    }

    // Update the scoreboard element with the count of black and white pieces
    let scoreboardElement = document.getElementById("scoreboard");
    scoreboardElement.innerHTML = `BLACK: ${blackCount}, WHITE: ${whiteCount}`;

    // Check if the game has ended
    if (blackCount + whiteCount == 64 || blackCount == 0 || whiteCount == 0) {
        // The game has ended, so check if there is a winner
        if (blackCount > whiteCount || whiteCount == 0) {
            // BLACK wins
            scoreboardElement.innerHTML += " - BLACK wins!";

            // Add confetti to the animation
            let confetti = new Confetti();
            confetti.addParticles(500);
            confetti.start();
        } else if (whiteCount > blackCount || blackCount == 0) {
            // WHITE wins
            scoreboardElement.innerHTML += " - WHITE wins!";

            // Add confetti to the animation
            let confetti = new Confetti();
            confetti.addParticles(500);
            confetti.start()
        } else {
            // The game is a draw
            scoreboardElement.innerHTML += " - Draw!";
        }
    }
}
renderBoard()