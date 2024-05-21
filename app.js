const gameBoard = document.querySelector("#gameboard")
const playerdisplay = document.querySelector("#player")
const width = 8

const startPieces = [pawn, pawn, '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', pawn, pawn, '',
]
createBoard()
function createBoard() {
    startPieces.forEach((startPiece,i) => {
        const square = document.createElement('div')
        square.classList.add('square')


        square.innerHTML = startPiece

        
        // startPiece.setAttribute('dragabble', true)
        square.firstChild && square.firstChild.addEventListener('dragstart', drag)
        square.firstChild && square.firstChild.setAttribute('dragabble', true)
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
square.firstChild && square.firstChild.addEventListener("dragover",allowDrop)
square.firstChild && square.firstChild.addEventListener("drop",drop)






// const allSquares = document.querySelectorAll("#gameboard .square")
// allSquares.forEach(square => {
//     square.addEventListener('dragstart', dragStart)
    
// })

// let startPositionId

// function dragStart(e) {
    
//     startPositionId = e.target.parentElement.getAttribute('square-id')
//     console.log(e);
    
// }

// function dragOver(e){
//     e.preventDefault()
    
// }

const allSquares = document.querySelectorAll("#gameboard .square");


allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', drop);
});

let startPositionId;

function dragStart(e) {
    startPositionId = e.target.getAttribute('square-id');
    console.log('Drag start. Start position ID:', startPositionId);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const newPositionId = e.target.getAttribute('square-id');
    console.log('Dropped. New position ID:', newPositionId);
    // Here you can handle the logic for updating the piece's position
    // You can use startPositionId and newPositionId to update the position
    // of the dragged piece in your data structure or perform other actions
}


