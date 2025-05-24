function pocetak()
{
    localStorage.removeItem("nameF");
    localStorage.removeItem("nameS");
}

function input()
{
    let name1 = document.getElementById("firstPlayer");
    let name2 = document.getElementById("secondPlayer");

    let nameF = name1.value;
    let nameS = name2.value;

    let pattern = /^\w{3,15}$/;

    if (!nameF.match(pattern) || !nameS.match(pattern)) {
        alert("Ime mora biti duzine 3 karaktera, ali do 15 karaktera i sme sadrzati iskljucivo slova, brojeve i donje crte.")
        name1.value = "";
        name2.value = "";
    } else {
        localStorage.setItem("nameF", nameF);
        localStorage.setItem("nameS", nameS);
        window.location.href = "gameSetup.html";
    }
}

let boardF = Array(10).fill(null).map(() => Array(10).fill(0));
let boardS = Array(10).fill(null).map(() => Array(10).fill(0));
let playerNow = 1;

function updatePlayerTurnDisplay() {
    const turnDisplay = document.getElementById('turnDisplay');
    if (turnDisplay) {
        turnDisplay.textContent = "Na potezu: " + (playerNow === 1 ? localStorage.getItem('nameF') : localStorage.getItem('nameS'));
    }
}

function createBoard(board) {
    board.innerHTML = "";
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        board.appendChild(cell);
    }
}

function SetupLoad() {
    let draggedShip = null;
    let draggedLength = 0;
    let isVertical = false;
    let dragOffsetIndex = 0;
    let shipNumber = 5;

    const board = document.getElementById("boardhtml");
    document.getElementById('playerName').textContent = localStorage.getItem('nameF') + " ";
    createBoard(board);

    document.querySelectorAll(".ship").forEach(ship => {
        ship.addEventListener("dragstart", e => {
            draggedShip = e.target;
            draggedLength = parseInt(draggedShip.dataset.length);
            isVertical = draggedShip.classList.contains("vertical");

            const rect = draggedShip.getBoundingClientRect();
            const mouseOffsetX = e.clientX - rect.left;
            const mouseOffsetY = e.clientY - rect.top;

            if (isVertical) {
                const partHeight = rect.height / draggedLength;
                dragOffsetIndex = Math.floor(mouseOffsetY / partHeight);
            } else {
                const partWidth = rect.width / draggedLength;
                dragOffsetIndex = Math.floor(mouseOffsetX / partWidth);
            }
        });
    });

    if (board) {
        board.addEventListener("dragover", e => e.preventDefault());

        board.addEventListener("drop", e => {
            e.preventDefault();
            const cell = e.target;
            if (!cell.classList.contains("cell")) return;

            const index = parseInt(cell.dataset.index);
            const cells = board.querySelectorAll(".cell");

            let valid = true;
            const positions = [];

            for (let i = 0; i < draggedLength; i++) {
                let pos = isVertical 
                    ? index - dragOffsetIndex * 10 + i * 10
                    : index - dragOffsetIndex + i;

                if (
                    pos < 0 || pos >= 100 ||
                    (isVertical && pos % 10 !== index % 10) ||
                    (!isVertical && Math.floor(pos / 10) !== Math.floor(index / 10))
                ) {
                    valid = false;
                    break;
                }

                if (cells[pos].classList.contains("occupied")) {
                    valid = false;
                    break;
                }

                positions.push(pos);
            }

            if (valid) {
                positions.forEach(p => {
                    cells[p].classList.add("occupied");
                    let x = p % 10;
                    let y = Math.floor(p / 10);
                    if(playerNow == 1)
                        boardF[y][x] = 1;
                    else
                        boardS[y][x] = 1;
                });
                if (draggedShip) draggedShip.remove();
                shipNumber--;
                if(shipNumber == 0 && playerNow == 1) {
                    playerNow = 2;
                    document.getElementById('playerName').textContent = localStorage.getItem('nameS') + " ";
                    for(let i = 0; i < 100; i++) {
                        cells[i].classList.remove("occupied");
                    }

                    const shipsDiv = document.querySelector("#ships .d-flex.gap-2.flex-wrap.justify-content-center.w-100");
                    if(shipsDiv) {
                        shipsDiv.innerHTML = `
                            <div class="ship" draggable="true" data-length="5" style="width: 150px; height: 30px; background: #888; border-radius: 5px;"></div>
                            <div class="ship" draggable="true" data-length="4" style="width: 120px; height: 30px; background: #888; border-radius: 5px;"></div>
                            <div class="ship" draggable="true" data-length="3" style="width: 90px; height: 30px; background: #888; border-radius: 5px;"></div>
                            <div class="ship" draggable="true" data-length="2" style="width: 60px; height: 30px; background: #888; border-radius: 5px;"></div>
                            <div class="ship" draggable="true" data-length="2" style="width: 60px; height: 30px; background: #888; border-radius: 5px;"></div>
                        `;
                        document.querySelectorAll(".ship").forEach(ship => {
                            ship.addEventListener("dragstart", e => {
                                draggedShip = e.target;
                                draggedLength = parseInt(draggedShip.dataset.length);
                                isVertical = draggedShip.classList.contains("vertical");

                                const rect = draggedShip.getBoundingClientRect();
                                const mouseOffsetX = e.clientX - rect.left;
                                const mouseOffsetY = e.clientY - rect.top;

                                if (isVertical) {
                                    const partHeight = rect.height / draggedLength;
                                    dragOffsetIndex = Math.floor(mouseOffsetY / partHeight);
                                } else {
                                    const partWidth = rect.width / draggedLength;
                                    dragOffsetIndex = Math.floor(mouseOffsetX / partWidth);
                                }
                            });
                        });
                    }
                    shipNumber = 5;
                } else if (shipNumber == 0 && playerNow == 2) {
                    localStorage.setItem("boardF", JSON.stringify(boardF));
                    localStorage.setItem("boardS", JSON.stringify(boardS));
                    window.location.href = "gamePage.html";
                }
            }
        });
    }
}

function rotirajbrodove()
{
    document.querySelectorAll(".ship").forEach(ship => {
        if(ship.classList.contains("vertical")) {
            ship.style.width = `${parseInt(ship.style.height)}px`;
            ship.style.height = '30px';
            ship.classList.remove("vertical");
        } else {
            ship.style.height = `${parseInt(ship.style.width)}px`;
            ship.style.width = '30px';
            ship.classList.add("vertical"); 
        }
    });
}

function sakriBoard(board)
{
    board.querySelectorAll(".cell").forEach(cell => cell.classList.remove("occupied"));
}

function prikaziBoard(board, matrix) {
    const cells = board.querySelectorAll(".cell");
    for (let i = 0; i < 100; i++) {
        let x = i % 10;
        let y = Math.floor(i / 10);
        cells[i].classList.remove("hittedShip", "miss", "occupied");
        if (matrix[y][x] === 2) {
            cells[i].classList.add("hittedShip");
        } else if (matrix[y][x] === -1) {
            cells[i].classList.add("miss");
        }
    }
}

function matricaPrazna(matrix) {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (matrix[y][x] === 1) {
                return false; 
            }
        }
    }
    return true; 
}

function gameLoad() {
    let boardF = JSON.parse(localStorage.getItem("boardF"));
    let boardS = JSON.parse(localStorage.getItem("boardS"));

    document.getElementById('player1').textContent = localStorage.getItem('nameF') + ":";
    document.getElementById('player2').textContent = localStorage.getItem('nameS') + ":";

    const board1 = document.getElementById("board1");
    const board2 = document.getElementById("board2");
    createBoard(board1);
    createBoard(board2);

    prikaziBoard(board1, boardF);
    prikaziBoard(board2, boardS);
    updatePlayerTurnDisplay();

    document.querySelectorAll("#board1 .cell").forEach(cell => {
        cell.addEventListener("click", () => {
            if (playerNow === 2) {
                const index = parseInt(cell.dataset.index);
                const x = index % 10;
                const y = Math.floor(index / 10);
                if (boardF[y][x] !== 0 && boardF[y][x] !== 1) return;

                if (boardF[y][x] === 1) {
                    boardF[y][x] = 2;
                } else {
                    boardF[y][x] = -1;
                    playerNow = 1;
                }
                prikaziBoard(board1, boardF);
                prikaziBoard(board2, boardS);
                updatePlayerTurnDisplay();
                if (matricaPrazna(boardF)) {
                    document.getElementById('winnerModalBody').textContent = localStorage.getItem('nameS') + " je pobedio!";
                    new bootstrap.Modal(document.getElementById('winnerModal')).show();
                }
            }
        });
    });

    document.querySelectorAll("#board2 .cell").forEach(cell => {
        cell.addEventListener("click", () => {
            if (playerNow === 1) {
                const index = parseInt(cell.dataset.index);
                const x = index % 10;
                const y = Math.floor(index / 10);
                if (boardS[y][x] !== 0 && boardS[y][x] !== 1) return;

                if (boardS[y][x] === 1) {
                    boardS[y][x] = 2;
                } else {
                    boardS[y][x] = -1;
                    playerNow = 2;
                }
                prikaziBoard(board1, boardF);
                prikaziBoard(board2, boardS);
                updatePlayerTurnDisplay();
                if (matricaPrazna(boardS)) {
                    document.getElementById('winnerModalBody').textContent = localStorage.getItem('nameF') + " je pobedio!";
                    new bootstrap.Modal(document.getElementById('winnerModal')).show();
                }
            }
        });
    });
}

function reload() {
    window.location.href = "pocetna.html";
}
