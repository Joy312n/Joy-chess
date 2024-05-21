const gameBoard = document.querySelector("#gameboard")
const playerdisplay = document.querySelector("#player")
const width = 8

const startPieces = [Brook, Bknight, Bbishop, Bqueen, Bking, Bbishop, Bknight, Brook,
    Bpawn, Bpawn, Bpawn, Bpawn, Bpawn, Bpawn, Bpawn, Bpawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
]
createBoard()
function createBoard() {
    startPieces.forEach((startPiece,i) => {
        const square = document.createElement('div')
        square.classList.add('square')


        square.innerHTML = startPiece

        const row1 = 8-Math.floor(i/8)
        const column = String.fromCharCode(97+(i%8))
        square.id = column+row1
        const row = Math.floor( (63 -i)/ 8) + 1
        if (row %2 === 0){
            square.classList.add(i%2 === 0? 'cyan' : 'sblue')
        }else {
            square.classList.add(i%2 === 0? 'sblue' : 'cyan')
        }
        gameBoard.append(square)
    })
    
}



