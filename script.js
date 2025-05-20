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

    let pattern = /^\w{3,15}$/ // Regularni izrazi (regex) za proveru duzine input-a

    if (!nameF.match(pattern) || !nameS.match(pattern)) {
        alert("Ime mora biti duzine 3 karaktera, ali do 15 karaktera i sme sadrzati iskljucivo slova, brojeve i donje crte.")
        name1.value = "";
        name2.value = "";
    }
    else {
        localStorage.setItem("nameF", nameF);
        localStorage.setItem("nameS", nameS);
        window.location.href = "gameSetup.html";
    }
}
var boardF =[
    [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
    ]
]
var boardS =[
    [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
    ]
]

let playerNow = 1;

//document.getElementById('player2Name').textContent = localStorage.getItem('nameS') ;
function createBoard(board) {
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
    let dragOffsetIndex = 0; // где је брод ухваћен

    const board1 = document.getElementById("boardhtml");
    document.getElementById('playerName').textContent = localStorage.getItem('nameF') + " ";
    createBoard(board1);

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

    if (board1) {
        board1.addEventListener("dragover", e => e.preventDefault());

        board1.addEventListener("drop", e => {
            e.preventDefault();
            const cell = e.target;
            if (!cell.classList.contains("cell")) return;

            const index = parseInt(cell.dataset.index);
            const cells = board1.querySelectorAll(".cell");

            let valid = true;
            const positions = [];

            for (let i = 0; i < draggedLength; i++) {
                let pos = isVertical 
                    ? index - dragOffsetIndex * 10 + i * 10
                    : index - dragOffsetIndex + i;

                // Проверa граница
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
                });
                if (draggedShip) draggedShip.remove();
            }
        });
    }
}

function rotirajbrodove()
{
    document.querySelectorAll(".ship").forEach(ship => {
    
        if(ship.classList.contains("vertical"))
        {
            // Change ship to horizontal
            ship.style.width = `${parseInt(ship.style.height)}px`;
            ship.style.height = '30px';
            
            ship.classList.remove("vertical");
        }
        else
        {
           ship.style.height = `${parseInt(ship.style.width)}px`;
            ship.style.width = '30px';
            ship.classList.add("vertical"); 
        }
        
    });
}

/*    
let placingPlayer = 1;
function updateBoardVisibility() {
    if (placingPlayer === 1) {
        document.getElementById('board2').style.display = 'none';
        document.getElementById('board1').style.display = 'center';
    } else {
        document.getElementById('board1').style.display = 'none';
        document.getElementById('player2Area').style.display = 'flex';
    }
}
updateBoardVisibility();
*/