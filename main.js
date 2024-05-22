let legalSquares = []
let isWhiteTurn = true
const boardSquares = document.getElementsByClassName("square")
const pieces = document.getElementsByClassName("piece")
const piecesImages = document.getElementsByTagName("img")
let highlightedSquares = []; // To keep track of highlighted squares

setupBoardSquares();
setupPieces();

function setupBoardSquares() {
    for (let i = 0; i < boardSquares.length; i++) {
        boardSquares[i].addEventListener("dragover", allowDrop);
        boardSquares[i].addEventListener("drop", drop);

        // Add touch event listeners for mobile devices
        boardSquares[i].addEventListener("touchmove", allowDrop);
        boardSquares[i].addEventListener("touchend", drop);
    }
}

function setupPieces() {
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].addEventListener("dragstart", drag);
        pieces[i].setAttribute("draggable", true);

        // Add touch event listeners for mobile devices
        pieces[i].addEventListener("touchstart", touchStart);
        pieces[i].addEventListener("touchmove", touchMove);
        pieces[i].addEventListener("touchend", touchEnd);

        pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
    }
    for (let i = 0; i < piecesImages.length; i++) {
        piecesImages[i].setAttribute("draggable", false);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    const piece = ev.target;
    const pieceColor = piece.getAttribute("color");
    const startingSquareId = piece.parentNode.id;

    if ((isWhiteTurn && pieceColor == "white") || (!isWhiteTurn && pieceColor == "black")) {
        ev.dataTransfer.setData("text", piece.id);

        // Clear previous highlights
        clearHighlights();

        // Get possible moves and highlight them
        getPossibleMoves(startingSquareId, piece);
        highlightMove(legalSquares);
    }
}

function touchStart(ev) {
    ev.preventDefault();
    const touch = ev.targetTouches[0];
    const piece = ev.target;
    const pieceColor = piece.getAttribute("color");
    const startingSquareId = piece.parentNode.id;

    if ((isWhiteTurn && pieceColor == "white") || (!isWhiteTurn && pieceColor == "black")) {
        piece.classList.add("dragging");

        // Clear previous highlights
        clearHighlights();

        // Get possible moves and highlight them
        getPossibleMoves(startingSquareId, piece);
        highlightMove(legalSquares);
    }
}

function touchMove(ev) {
    ev.preventDefault();
    const touch = ev.targetTouches[0];
    const piece = document.querySelector(".dragging");
    if (piece) {
        const touchLocation = document.elementFromPoint(touch.clientX, touch.clientY);
        if (touchLocation.classList.contains("square")) {
            touchLocation.appendChild(piece);
        }
    }
}

function touchEnd(ev) {
    ev.preventDefault();
    const piece = document.querySelector(".dragging");
    if (piece) {
        const destinationSquare = piece.parentElement;
        let destinationSquareId = destinationSquare.id;
        piece.classList.remove("dragging");
        clearHighlights();

        if ((isSquareOccupied(destinationSquare) == "blank") && (legalSquares.includes(destinationSquareId))) {
            destinationSquare.appendChild(piece);
            isWhiteTurn = !isWhiteTurn;
            legalSquares.length = 0;
            checkForCheckAndCheckmate();
            return;
        }
        if ((isSquareOccupied(destinationSquare) !== "blank") && (legalSquares.includes(destinationSquareId))) {
            while (destinationSquare.firstChild) {
                destinationSquare.removeChild(destinationSquare.firstChild);
            }
            destinationSquare.appendChild(piece);
            isWhiteTurn = !isWhiteTurn;
            legalSquares.length = 0;
            checkForCheckAndCheckmate();
            return;
        }
        legalSquares.length = 0;
    }
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    const piece = document.getElementById(data);
    const destinationSquare = ev.currentTarget;
    let destinationSquareId = destinationSquare.id;
    clearHighlights();

    if ((isSquareOccupied(destinationSquare) == "blank") && (legalSquares.includes(destinationSquareId))) {
        destinationSquare.appendChild(piece);
        isWhiteTurn = !isWhiteTurn;
        legalSquares.length = 0;

        return;
    }
    if ((isSquareOccupied(destinationSquare) !== "blank") && (legalSquares.includes(destinationSquareId))) {
        while (destinationSquare.firstChild) {
            destinationSquare.removeChild(destinationSquare.firstChild);
        }
        destinationSquare.appendChild(piece);
        isWhiteTurn = !isWhiteTurn;
        legalSquares.length = 0;
 
        return;
    }
    legalSquares.length = 0;
}

function highlightMove(validMoves) {
    for (let item of validMoves) {
        let div = document.getElementById(item);
        if (div) {
            div.classList.add("highlight");
            highlightedSquares.push(div); // Keep track of highlighted squares
        }
    }
}

function clearHighlights() {
    for (let div of highlightedSquares) {
        div.classList.remove("highlight");
    }
    highlightedSquares = []; // Clear the array after removing highlights
}

function getPossibleMoves(startingSquareId, piece) {
    const pieceColor = piece.getAttribute("color")
    if (piece.classList.contains("pawn")) {
        getPawnMoves(startingSquareId, pieceColor)
        console.log(legalSquares);

    }
    if (piece.classList.contains("knight")) {
        getKnightMoves(startingSquareId, pieceColor)
        console.log(legalSquares);

    }
    if (piece.classList.contains("rook")) {
        getRookMoves(startingSquareId, pieceColor)
        console.log(legalSquares);

    }
    if (piece.classList.contains("bishop")) {
        getBishopMoves(startingSquareId, pieceColor)
        console.log(legalSquares);
        
    }
    if (piece.classList.contains("queen")) {
        getQueenMoves(startingSquareId, pieceColor)
        console.log(legalSquares);

    }
    if (piece.classList.contains("king")) {
        getKingMoves(startingSquareId, pieceColor)
        console.log(legalSquares);

    }

}


function isSquareOccupied(square) {
    if (square.querySelector(".piece")) {
        const color = square.querySelector(".piece").getAttribute("color")
        return color

    } else {
        return "blank"
    }

}


function getPawnMoves(startingSquareId, pieceColor) {
    let file = startingSquareId.charAt(0);
    let rank = parseInt(startingSquareId.charAt(1));
    let direction = pieceColor == "white" ? 1 : -1;
    let startingRank = pieceColor == "white" ? 2 : 7;

    // Define potential move offsets: forward one square, forward two squares, capture left, capture right
    let moveOffsets = [direction, 2 * direction];
    let captureOffsets = [-1, 1];

    // Check forward moves
    for (let offset of moveOffsets) {
        // Only check the double move if the pawn is on its starting rank
        if (offset === 2 * direction && rank !== startingRank) continue;

        let newRank = rank + offset;
        let currentSquareId = file + newRank;
        let squareContent = isSquareOccupied(document.getElementById(currentSquareId));

        if (squareContent === "blank") {
            legalSquares.push(currentSquareId);
        } else {
            break; // If there's a piece directly in front, stop further forward checking
        }
    }

    // Check diagonal captures
    for (let i of captureOffsets) {
        let currentFile = String.fromCharCode(file.charCodeAt(0) + i);
        if (currentFile >= "a" && currentFile <= "h") {
            let currentSquareId = currentFile + (rank + direction);
            let squareContent = isSquareOccupied(document.getElementById(currentSquareId));

            if (squareContent !== "blank" && squareContent !== pieceColor) {
                legalSquares.push(currentSquareId);
            }
        }
    }
}


function getKnightMoves(startingSquareId, pieceColor) {
    const knightMoves = [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];

    let file = startingSquareId.charCodeAt(0) - 97;
    let rank = parseInt(startingSquareId.charAt(1));

    knightMoves.forEach((move) => {
        let currentFile = file + move[0]
        currrentRank = rank + move[1]

        if ((currentFile >= 0 && currentFile <= 7) && (currrentRank >= 1 && currrentRank <= 8)) {
            let currentSquareId = String.fromCharCode(currentFile + 97) + currrentRank;
            let squareContent = isSquareOccupied(document.getElementById(currentSquareId));
            if (squareContent !== "blank" && squareContent == pieceColor)
                return
            legalSquares.push(currentSquareId)


        }
    })

}



function getRookMoves(startingSquareId, pieceColor) {

    let currentFile = startingSquareId.charCodeAt(0);
    let currentRank = parseInt(startingSquareId.charAt(1));

    // Function to add moves in one direction
    function addMoves(deltaFile, deltaRank) {
        let file = currentFile;
        let rank = currentRank;

        while (true) {
            file += deltaFile;
            rank += deltaRank;
            let moveId = String.fromCharCode(file) + rank;
            let move = document.getElementById(moveId);

            if (!move) break; // Stop if the square is outside the board

            let squareContent = isSquareOccupied(move);

            if (squareContent === pieceColor) break; // Stop if it's a piece of the same color
            legalSquares.push(moveId); // Add move to legal squares

            if (squareContent !== "blank") break; // Stop if it's an opponent's piece (we can capture it)
        }
    }

    // Check all four directions
    addMoves(1, 0); // Right
    addMoves(-1, 0); // Left
    addMoves(0, 1); // Up
    addMoves(0, -1); // Down


}


function getBishopMoves(startingSquareId, pieceColor) {
    let currentFile = startingSquareId.charCodeAt(0);
    let currentRank = parseInt(startingSquareId.charAt(1));

    // Function to add moves in one diagonal direction
    function addDiagonalMoves(deltaFile, deltaRank) {
        let file = currentFile;
        let rank = currentRank;

        while (true) {
            file += deltaFile;
            rank += deltaRank;
            let moveId = String.fromCharCode(file) + rank;
            let move = document.getElementById(moveId);

            if (!move) break; // Stop if the square is outside the board

            let squareContent = isSquareOccupied(move);

            if (squareContent === pieceColor) break; // Stop if it's a piece of the same color
            legalSquares.push(moveId); // Add move to legal squares

            if (squareContent !== "blank") break; // Stop if it's an opponent's piece (we can capture it)
        }
    }

    // Check all four diagonal directions
    addDiagonalMoves(1, 1); // Up-Right
    addDiagonalMoves(-1, 1); // Up-Left
    addDiagonalMoves(1, -1); // Down-Right
    addDiagonalMoves(-1, -1); // Down-Left

}

;

function getQueenMoves(startingSquareId, pieceColor) {


    let currentFile = startingSquareId.charCodeAt(0);
    let currentRank = parseInt(startingSquareId.charAt(1));

    // Function to add moves in one direction
    function addMoves(deltaFile, deltaRank) {
        let file = currentFile;
        let rank = currentRank;

        while (true) {
            file += deltaFile;
            rank += deltaRank;
            let moveId = String.fromCharCode(file) + rank;
            let move = document.getElementById(moveId);

            if (!move) break; // Stop if the square is outside the board

            let squareContent = isSquareOccupied(move);

            if (squareContent === pieceColor) break; // Stop if it's a piece of the same color
            legalSquares.push(moveId); // Add move to legal squares

            if (squareContent !== "blank") break; // Stop if it's an opponent's piece (we can capture it)
        }
    }

    // Check all eight directions (rook and bishop directions combined)
    addMoves(1, 0); // Right
    addMoves(-1, 0); // Left
    addMoves(0, 1); // Up
    addMoves(0, -1); // Down
    addMoves(1, 1); // Up-Right (diagonal)
    addMoves(-1, 1); // Up-Left (diagonal)
    addMoves(1, -1); // Down-Right (diagonal)
    addMoves(-1, -1); // Down-Left (diagonal)


}

function getKingMoves(startingSquareId, pieceColor) {

    let currentFile = startingSquareId.charCodeAt(0);
    let currentRank = parseInt(startingSquareId.charAt(1));

    // Check all neighboring squares
    for (let deltaFile = -1; deltaFile <= 1; deltaFile++) {
        for (let deltaRank = -1; deltaRank <= 1; deltaRank++) {
            if (deltaFile === 0 && deltaRank === 0) continue; // Skip the square the king is on
            let file = currentFile + deltaFile;
            let rank = currentRank + deltaRank;
            let moveId = String.fromCharCode(file) + rank;
            let move = document.getElementById(moveId);

            if (!move) continue; // Skip if the square is outside the board

            let squareContent = isSquareOccupied(move);

            if (squareContent === pieceColor) continue; // Skip if it's a piece of the same color
            legalSquares.push(moveId); // Add move to legal squares
        }
    }

}
