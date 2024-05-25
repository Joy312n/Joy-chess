// let legalSquares = []
let boardSquaresArray = []
let isWhiteTurn = true
let isComputerOn = true
let whiteKingSquare = "e1";
let blackKingSquare = "e8";
const boardSquares = document.getElementsByClassName("square")
const pieces = document.getElementsByClassName("piece")
const piecesImages = document.getElementsByTagName("img")
let highlightedSquares = []; // To keep track of highlighted squares

setupBoardSquares()
setupPieces()
fillBoardSquaresArray()
// function turn() {
//     let player = document.getElementById('player');
//     if (isWhiteTurn== true) {

//         // Change the text content of the div
//         player.textContent = 'white\'s turn';
//     }
//     if(!isWhiteTurn){
//         player.textContent = 'black\'s turn'
//     }
// }

function fillBoardSquaresArray() {
    const boardSquares = document.getElementsByClassName("square");
    for (let i = 0; i < boardSquares.length; i++) {
        let row = 8 - Math.floor(i / 8);
        let column = String.fromCharCode(97 + (i % 8));
        let square = boardSquares[i];
        square.id = column + row;
        let color = "";
        let pieceType = "";
        let pieceId = "";
        if (square.querySelector(".piece")) {
            color = square.querySelector(".piece").getAttribute("color");
            pieceType = square.querySelector(".piece").classList[1];
            pieceId = square.querySelector(".piece").id;
        } else {
            color = "blank";
            pieceType = "blank";
            pieceId = "blank";
        }
        let arrayElement = {
            squareId: square.id,
            pieceColor: color,
            pieceType: pieceType,
            pieceId: pieceId
        };
        boardSquaresArray.push(arrayElement);
    }

    // console.log(boardSquaresArray);
}
// function generateFEN(boardSquaresArray) {
//     // console.log(boardSquaresArray);
//     let fen = '';
//     let emptyCount = 0;

//     for (let rank = 8; rank >= 1; rank--) {
//         for (let file = 1; file <= 8; file++) {
//             let arrayElement = boardSquaresArray.find(element => element.squareId === `${String.fromCharCode(96 + file)}${rank}`);

//             if (arrayElement) {
//                 if (emptyCount > 0) {
//                     fen += emptyCount;
//                     emptyCount = 0;
//                 }
//                 fen += `${arrayElement.pieceColor === 'white' ? arrayElement.pieceType.charAt(0).toUpperCase() : arrayElement.pieceType.charAt(0).toLowerCase()}`;
//             } else {
//                 emptyCount++;
//             }
//         }

//         if (emptyCount > 0) {
//             fen += emptyCount;
//             emptyCount = 0;
//         }

//         if (rank > 1) {
//             fen += '/';
//         }
//     }
//     // console.log(fen);
//     for (let i = 8; i > 0; i--) {
//         let regex = new RegExp('b'.repeat(i), 'g');
//         fen = fen.replace(regex, i.toString());
//     }

//     // console.log(fen);
//     return fen + " b";
// }
// function generateFEN(boardSquaresArray) {
//     let fen = '';
//     let emptyCount = 0;

//     const pieceTypeToFEN = {
//         'pawn': 'p',
//         'knight': 'n',
//         'bishop': 'b',
//         'rook': 'r',
//         'queen': 'q',
//         'king': 'k'
//     };

//     for (let rank = 8; rank >= 1; rank--) {
//         for (let file = 1; file <= 8; file++) {
//             let arrayElement = boardSquaresArray.find(element => element.squareId === `${String.fromCharCode(96 + file)}${rank}`);

//             if (arrayElement) {
//                 if (emptyCount > 0) {
//                     fen += emptyCount;
//                     emptyCount = 0;
//                 }
//                 let pieceChar = pieceTypeToFEN[arrayElement.pieceType];
//                 if (!pieceChar) {
//                     // console.error(`Unrecognized piece type: ${arrayElement.pieceType}`);
//                     for (let i = 8; i > 0; i--) {
//                         let regex = new RegExp('blank'.repeat(i), 'g');
//                         fen = fen.replace(regex, i.toString());
//                     }
//                     // continue; // Skip unrecognized pieces
//                 }
//                 fen += arrayElement.pieceColor === 'white' ? pieceChar.toUpperCase() : pieceChar.toLowerCase();
//             } else {
//                 emptyCount++;
//             }
//         }

//         if (emptyCount > 0) {
//             fen += emptyCount;
//             emptyCount = 0;
//         }

//         if (rank > 1) {
//             fen += '/';
//         }
//     }

//     // Add turn to move (you might want to handle this dynamically)
//     fen += " b"; // 'b' indicates black to move; replace with 'w' if white's turn.

//     return fen;
// }
function generateFEN(boardSquaresArray) {
    let fen = '';
    let emptyCount = 0;

    const pieceTypeToFEN = {
        'pawn': 'p',
        'knight': 'n',
        'bishop': 'b',
        'rook': 'r',
        'queen': 'q',
        'king': 'k',
        'blank': '' // Add blank to handle empty squares
    };

    for (let rank = 8; rank >= 1; rank--) {
        for (let file = 1; file <= 8; file++) {
            let squareId = `${String.fromCharCode(96 + file)}${rank}`;
            let arrayElement = boardSquaresArray.find(element => element.squareId === squareId);

            if (arrayElement) {
                if (arrayElement.pieceType === 'blank') {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        fen += emptyCount;
                        emptyCount = 0;
                    }
                    let pieceChar = pieceTypeToFEN[arrayElement.pieceType];
                    if (!pieceChar) {
                        console.error(`Unrecognized piece type: ${arrayElement.pieceType}`);
                        continue; // Skip unrecognized pieces
                    }
                    fen += arrayElement.pieceColor === 'white' ? pieceChar.toUpperCase() : pieceChar.toLowerCase();
                }
            } else {
                emptyCount++;
            }
        }

        if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
        }

        if (rank > 1) {
            fen += '/';
        }
    }

    // Add turn to move (you might want to handle this dynamically)
    fen += " b"; // 'b' indicates black to move; replace with 'w' if white's turn.

    return fen;
}





const selectedLevel = 15;
function getBestMove(fen, selectedLevel, callback) {
    let engine = new Worker("https://github.com/Joy312n/Joy-chess/node_modules/stockfish/src/stockfish.js");
    engine.onmessage = function (event) {
        let message = event.data;
        if (message.startsWith("bestmove")) {
            let bestMove = message.split(" ")[1];
            callback(bestMove);
            engine.terminate();
        }
    };
    engine.postMessage("position fen " + fen);
    engine.postMessage(`go depth ${selectedLevel}`);
}

function playBestMove(bestMove) {
    let startingSquareId = bestMove.substring(0, 2);
    let destinationSquareId = bestMove.substring(2, 4);
    let promotedTo = "";
    if (bestMove.length === 5) {
        promotedTo = bestMove.substring(4, 5);
        let pieceMap = {
            "q": "queen",
            "r": "rook",
            "n": "knight",
            "b": "bishop"
        };
        promotedTo = pieceMap[promotedTo];
    }
    console.log(startingSquareId, destinationSquareId, promotedTo);
}

function handleBestMove(bestMove) {
    console.log("Best Move: " + bestMove);
}

function updateBoardSquaresArray(currentSquareId, destinationSquareId, boardSquaresArray) {
    let currentSquare = boardSquaresArray.find(
        (element) => element.squareId === currentSquareId
    );
    // console.log(typeof(currentSquareId));
    let destinationSquareElement = boardSquaresArray.find(
        (element) => element.squareId === destinationSquareId
    );
    let pieceColor = currentSquare.pieceColor;
    let pieceType = currentSquare.pieceType;
    let pieceId = currentSquare.pieceId;
    destinationSquareElement.pieceColor = pieceColor;
    destinationSquareElement.pieceType = pieceType;
    destinationSquareElement.pieceId = pieceId;
    currentSquare.pieceColor = "blank";
    currentSquare.pieceType = "blank";
    currentSquare.pieceId = "blank";
    let fen = generateFEN(boardSquaresArray);
    // console.log(fen);
}



function deepCopyArray(array) {
    let arrayCopy = array.map(element => {
        return { ...element };
    });
    return arrayCopy;
}


function playerInCheck(pieceColor) {
    if (pieceColor == "white") {
        // Set or change text based on condition
        message = "WHITE IS IN CHECK";
    }
    if (pieceColor == "black") {
        // Set or change text based on other condition
        message = "BLACK IS IN CHECK";
    }
    showAlert(message)

}

function setupBoardSquares() {

    for (let i = 0; i < boardSquares.length; i++) {

        boardSquares[i].addEventListener("dragover", allowDrop)
        boardSquares[i].addEventListener("drop", drop)
    }
}

function setupPieces() {

    for (let i = 0; i < pieces.length; i++) {
        pieces[i].addEventListener("dragstart", drag)
        pieces[i].setAttribute("draggable", true)
        pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id
    }
    for (let i = 0; i < piecesImages.length; i++) {
        piecesImages[i].setAttribute("draggable", false)

    }
}

function allowDrop(ev) {
    ev.preventDefault()
}


// function drag(ev) {
//     const piece = ev.target;
//     const pieceColor = piece.getAttribute("color");
//     const pieceType = piece.classList[1];
//     const pieceId = piece.id;

//     if ((isWhiteTurn && pieceColor == "white")) {
//         const startingSquareId = piece.parentNode.id;
//         ev.dataTransfer.setData("text", piece.id + "|" + startingSquareId);

//         // Clear previous highlights
//         clearHighlights();

//         const pieceObject = { pieceColor: pieceColor, pieceType: pieceType, pieceId: pieceId };
//         let legalSquares;

//         let kingSquareId = findKingSquare(pieceColor, boardSquaresArray);
//         console.log(`King Square ID: ${kingSquareId}`);

//         if (isKingInCheck(kingSquareId, pieceColor, boardSquaresArray)) {
//             console.log(`King is in check: ${pieceColor}`);
//             playerInCheck(pieceColor)

//             // Get only moves that resolve the check
//             let validMoves = getValidMovesWhenInCheck(pieceColor, boardSquaresArray);
//             legalSquares = validMoves.filter(move => move.from === startingSquareId).map(move => move.to);
//         } else {
//             console.log(`King is not in check: ${pieceColor}`);
//             // Get all possible moves
//             legalSquares = getPossibleMoves(startingSquareId, pieceObject, boardSquaresArray);
//             // console.log(legalSquares);

//         }

//         console.log(`Legal Squares for ${pieceId}:`, legalSquares);
//         let legalSquaresJson = JSON.stringify(legalSquares);
//         ev.dataTransfer.setData("application/json", legalSquaresJson);
//         highlightMove(legalSquares);
//     }
// }


// function displayMove(startingSquareId, destinationSquareId,legalSquares) {
//   const pieceObject = getPieceAtSquare(startingSquareId,boardSquaresArray);

//   const piece = document.getElementById(pieceObject.pieceId);
//   const pieceId = pieceObject.pieceId;
//   const pieceColor = pieceObject.pieceColor;
//   const pieceType = pieceObject.pieceType;


//     const destinationSquare = document.getElementById(destinationSquareId);
//     clearHighlights();
//     let squareContent = getPieceAtSquare(destinationSquareId, boardSquaresArray);



//     // let legalSquares = getPossibleMoves(startingSquareId,pieceObject,boardSquaresArray);

//     // legalSquares = getValidMovesWhenInCheck(pieceColor, boardSquaresArray);

//     // Check if the move is in legalSquares
//     console.log(legalSquares);
//     if (legalSquares.includes(destinationSquareId)) {

//         // Save original square content for potential revert
//         let originalSquareContent = { ...squareContent };

//         // Move the piece temporarily
//         destinationSquare.appendChild(piece);
//         updateBoardSquaresArray(startingSquareId, destinationSquareId, boardSquaresArray);

//         // Check if the move puts the player's own king in check
//         let kingSquareId = findKingSquare(pieceColor, boardSquaresArray);
//         if (isKingInCheck(kingSquareId, pieceColor, boardSquaresArray)) {
//             // Revert the move
//             console.log("Move puts king in check, reverting");
//             destinationSquare.removeChild(piece);
//             document.getElementById(startingSquareId).appendChild(piece);
//             updateBoardSquaresArray(destinationSquareId, startingSquareId, boardSquaresArray, originalSquareContent);

//             alert("Move puts your king in check. Try a different move.");
//         } else {
//             // If destination square is occupied, remove the existing piece
//             while (destinationSquare.firstChild && destinationSquare.firstChild !== piece) {
//                 destinationSquare.removeChild(destinationSquare.firstChild);
//             }
//             // Finalize the move
//             isWhiteTurn = !isWhiteTurn;
//             if ((pieceType === "pawn" && pieceColor === "white" && destinationSquareId[1] === "8") ||
//                 (pieceType === "pawn" && pieceColor === "black" && destinationSquareId[1] === "1")) {
//                 showPromotionChoices(piece, destinationSquare, pieceColor);
//             } else {
//                 // Check for checkmate
//                 if (isCheckmate(pieceColor === "white" ? "black" : "white", boardSquaresArray)) {
//                     showAlert(pieceColor === "white" ? "Black is checkmated!" : "White is checkmated!");
//                 }
//             }
//         }

//         // If it's the computer's turn, get the best move from Stockfish
//         if (!isWhiteTurn && isComputerOn) {
//             let fen = generateFEN(boardSquaresArray);
//             getBestMove(fen, selectedLevel, (bestMove) => {
//                 let compStartingSquareId = bestMove.slice(0, 2);
//                 let compDestinationSquareId = bestMove.slice(2, 4);

//                 // Generate legal squares for the computer's move (or get from Stockfish if available)
//                 let compLegalSquares = getPossibleMoves(compStartingSquareId, {
//                     pieceColor: 'black',
//                     pieceType: piece.classList[1],
//                     pieceId: piece.id
//                 }, boardSquaresArray);

//                 displayMove(compStartingSquareId, compDestinationSquareId, compLegalSquares);
//             });
//             // const pieceObject = { pieceColor: pieceColor, pieceType: pieceType, pieceId: pieceId };
//             // legalSquares = getPossibleMoves(startingSquareId, pieceObject, boardSquaresArray);
//         }
//     } else {
//         alert("Invalid move. Please try again.");
//     }
// }

// function drop(ev) {
//     // if (isEngineTurn) return;
// // 
//     ev.preventDefault();
//     const destinationSquareId = ev.currentTarget.id;

//     let data = ev.dataTransfer.getData("text");
//     let [pieceId, startingSquareId] = data.split("|");
//     let legalSquaresJson = ev.dataTransfer.getData("application/json");
//     if (legalSquaresJson.length == 0) return;
//     let legalSquares = JSON.parse(legalSquaresJson);


//     // Call displayMove with the drag-and-drop move
//     displayMove(startingSquareId, destinationSquareId,legalSquares);

//     // If it's the computer's turn, get the best move from Stockfish
//     if (!isWhiteTurn && isComputerOn) {
//         let fen = generateFEN(boardSquaresArray);
//         getBestMove(fen, selectedLevel, (bestMove) => {
//             let startingSquareId = bestMove.slice(0, 2);
//             let destinationSquareId = bestMove.slice(2, 4);
//             displayMove(startingSquareId, destinationSquareId);
//         });
//     }
// }



// function drop(ev) {
//     ev.preventDefault();
//     let data = ev.dataTransfer.getData("text");
//     let [pieceId, startingSquareId] = data.split("|");
//     let legalSquaresJson = ev.dataTransfer.getData("application/json");
//     if (legalSquaresJson.length == 0) return;
//     let legalSquares = JSON.parse(legalSquaresJson);

//     const piece = document.getElementById(pieceId);
//     const pieceColor = piece.getAttribute("color");
//     const pieceType = piece.classList[1];

//     const destinationSquare = ev.currentTarget;
//     let destinationSquareId = destinationSquare.id;

//     clearHighlights();
//     let squareContent = getPieceAtSquare(destinationSquareId, boardSquaresArray);

//     if ((squareContent.pieceColor == "blank" && legalSquares.includes(destinationSquareId)) ||
//         (squareContent.pieceColor !== "blank" && legalSquares.includes(destinationSquareId))) {

//         // Save original square content for potential revert
//         let originalSquareContent = { ...squareContent };

//         // Move the piece temporarily
//         destinationSquare.appendChild(piece);
//         updateBoardSquaresArray(startingSquareId, destinationSquareId, boardSquaresArray);

//         // Check if the move puts the player's own king in check
//         let kingSquareId = findKingSquare(pieceColor, boardSquaresArray);
//         if (isKingInCheck(kingSquareId, pieceColor, boardSquaresArray)) {
//             // Revert the move
//             console.log("Move puts king in check, reverting");
//             destinationSquare.removeChild(piece);
//             document.getElementById(startingSquareId).appendChild(piece);
//             updateBoardSquaresArray(destinationSquareId, startingSquareId, boardSquaresArray, originalSquareContent);

//             alert("Move puts your king in check. Try a different move.");
//         } else {
//             // If destination square is occupied, remove the existing piece
//             while (destinationSquare.firstChild && destinationSquare.firstChild !== piece) {
//                 destinationSquare.removeChild(destinationSquare.firstChild);
//             }
//             // Finalize the move
//             isWhiteTurn = !isWhiteTurn;
//             if ((pieceType === "pawn" && pieceColor === "white" && destinationSquareId[1] === "8") ||
//                 (pieceType === "pawn" && pieceColor === "black" && destinationSquareId[1] === "1")) {
//                 showPromotionChoices(piece, destinationSquare, pieceColor);
//             } else {
//                 // Check for checkmate
//                 if (isCheckmate(pieceColor === "white" ? "black" : "white", boardSquaresArray)) {
//                     showAlert(pieceColor === "white" ? "Black is checkmated!" : "White is checkmated!");
//                 }
//             }

//         }
//         if (!isWhiteTurn) {
//             let fen= generateFEN(boardSquaresArray)
//             getBestMove(fen, selectedLevel, handleBestMove)

//         }
//     }
// }


function drag(ev) {
    const piece = ev.target;
    const pieceColor = piece.getAttribute("color");
    const pieceType = piece.classList[1];
    const pieceId = piece.id;

    if ((isWhiteTurn && pieceColor == "white")) {
        const startingSquareId = piece.parentNode.id;
        ev.dataTransfer.setData("text", piece.id + "|" + startingSquareId);

        // Clear previous highlights
        clearHighlights();

        const pieceObject = { pieceColor: pieceColor, pieceType: pieceType, pieceId: pieceId };
        let legalSquares;

        let kingSquareId = findKingSquare(pieceColor, boardSquaresArray);
        console.log(`King Square ID: ${kingSquareId}`);

        if (isKingInCheck(kingSquareId, pieceColor, boardSquaresArray)) {
            console.log(`King is in check: ${pieceColor}`);
            playerInCheck(pieceColor);

            // Get only moves that resolve the check
            let validMoves = getValidMovesWhenInCheck(pieceColor, boardSquaresArray);
            legalSquares = validMoves.filter(move => move.from === startingSquareId).map(move => move.to);
        } else {
            console.log(`King is not in check: ${pieceColor}`);
            // Get all possible moves
            legalSquares = getPossibleMoves(startingSquareId, pieceObject, boardSquaresArray);
        }

        console.log(`Legal Squares for ${pieceId}:`, legalSquares);
        let legalSquaresJson = JSON.stringify(legalSquares);
        ev.dataTransfer.setData("application/json", legalSquaresJson);
        highlightMove(legalSquares);
    }
}

function displayMove(startingSquareId, destinationSquareId, legalSquares) {
    const pieceObject = getPieceAtSquare(startingSquareId, boardSquaresArray);
    const piece = document.getElementById(pieceObject.pieceId);
    const pieceId = pieceObject.pieceId;
    const pieceColor = pieceObject.pieceColor;
    const pieceType = pieceObject.pieceType;
    const destinationSquare = document.getElementById(destinationSquareId);

    clearHighlights();
    let squareContent = getPieceAtSquare(destinationSquareId, boardSquaresArray);

    if (legalSquares.includes(destinationSquareId)) {
        let originalSquareContent = { ...squareContent };
        destinationSquare.appendChild(piece);
        updateBoardSquaresArray(startingSquareId, destinationSquareId, boardSquaresArray);

        let kingSquareId = findKingSquare(pieceColor, boardSquaresArray);
        if (isKingInCheck(kingSquareId, pieceColor, boardSquaresArray)) {
            console.log("Move puts king in check, reverting");
            destinationSquare.removeChild(piece);
            document.getElementById(startingSquareId).appendChild(piece);
            updateBoardSquaresArray(destinationSquareId, startingSquareId, boardSquaresArray, originalSquareContent);

            alert("Move puts your king in check. Try a different move.");
        } else {
            while (destinationSquare.firstChild && destinationSquare.firstChild !== piece) {
                destinationSquare.removeChild(destinationSquare.firstChild);
            }
            isWhiteTurn = !isWhiteTurn;
            if ((pieceType === "pawn" && pieceColor === "white" && destinationSquareId[1] === "8") ||
                (pieceType === "pawn" && pieceColor === "black" && destinationSquareId[1] === "1")) {
                showPromotionChoices(piece, destinationSquare, pieceColor);
            } else {
                if (isCheckmate(pieceColor === "white" ? "black" : "white", boardSquaresArray)) {
                    showAlert(pieceColor === "white" ? "Black is checkmated!" : "White is checkmated!");
                }
            }

            if (!isWhiteTurn && isComputerOn) {
                handleBestMove()
            }
        }
    } else {
        // alert("Invalid move. Please try again.");
        handleBestMove()
    }
}
function handleBestMove(){
    let fen = generateFEN(boardSquaresArray);
    console.log("comp fen", fen);
    getBestMove(fen, selectedLevel, (bestMove) => {
        let compStartingSquareId = bestMove.slice(0, 2);
        let compDestinationSquareId = bestMove.slice(2, 4);
        let compLegalSquares = getPossibleMoves(compStartingSquareId, {
            pieceColor: 'black',
            pieceType: getPieceAtSquare(compStartingSquareId, boardSquaresArray).pieceType,
            pieceId: getPieceAtSquare(compStartingSquareId, boardSquaresArray).pieceId
        }, boardSquaresArray);


        console.log("computer move", bestMove);
        console.log(compLegalSquares);
        displayMove(compStartingSquareId, compDestinationSquareId, compLegalSquares);
    });
}
function drop(ev) {
    ev.preventDefault();
    const destinationSquareId = ev.currentTarget.id;

    let data = ev.dataTransfer.getData("text");
    let [pieceId, startingSquareId] = data.split("|");
    let legalSquaresJson = ev.dataTransfer.getData("application/json");
    if (legalSquaresJson.length == 0) return;
    let legalSquares = JSON.parse(legalSquaresJson);

    displayMove(startingSquareId, destinationSquareId, legalSquares);
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


function getPossibleMoves(startingSquareId, piece, boardSquaresArray) {
    const pieceColor = piece.pieceColor
    const pieceType = piece.pieceType
    let legalSquares = []
    if (pieceType == "pawn") {
        legalSquares = getPawnMoves(startingSquareId, pieceColor, boardSquaresArray)
        // console.log(legalSquares);
        return legalSquares;

    }
    if (pieceType == "knight") {
        legalSquares = getKnightMoves(startingSquareId, pieceColor, boardSquaresArray)
        // console.log(legalSquares);
        return legalSquares;

    }
    if (pieceType == "rook") {
        legalSquares = getRookMoves(startingSquareId, pieceColor, boardSquaresArray)
        // console.log(legalSquares);
        return legalSquares;

    }
    if (pieceType == "bishop") {
        legalSquares = getBishopMoves(startingSquareId, pieceColor, boardSquaresArray)
        // console.log(legalSquares);
        return legalSquares;

    }
    if (pieceType == "queen") {
        legalSquares = getQueenMoves(startingSquareId, pieceColor, boardSquaresArray)
        // console.log(legalSquares);
        return legalSquares;

    }
    if (pieceType == "king") {
        legalSquares = getKingMoves(startingSquareId, pieceColor, boardSquaresArray)

        console.log(legalSquares);
        return legalSquares;

    }

}


function getPieceAtSquare(squareId, boardSquaresArray) {
    let currentSquare = boardSquaresArray.find(
        (element) => element.squareId === squareId
    );
    const color = currentSquare.pieceColor;
    const pieceType = currentSquare.pieceType;
    const pieceId = currentSquare.pieceId;
    return { pieceColor: color, pieceType: pieceType, pieceId: pieceId };
}


function getPawnMoves(startingSquareId, pieceColor, boardSquaresArray) {
    let file = startingSquareId.charAt(0);
    let rank = parseInt(startingSquareId.charAt(1));
    let direction = pieceColor == "white" ? 1 : -1;
    let startingRank = pieceColor == "white" ? 2 : 7;
    let legalSquares = []
    // Define potential move offsets: forward one square, forward two squares, capture left, capture right
    let moveOffsets = [direction, 2 * direction];
    let captureOffsets = [-1, 1];

    // Check forward moves
    for (let offset of moveOffsets) {
        // Only check the double move if the pawn is on its starting rank
        if (offset === 2 * direction && rank !== startingRank) continue;

        let newRank = rank + offset;
        let currentSquareId = file + newRank;
        // let squareContent = isSquareOccupied(document.getElementById(currentSquareId));
        let currentSquare = boardSquaresArray.find((element) => element.squareId === currentSquareId);
        let squareContent = currentSquare.pieceColor;

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
            let currentSquare = boardSquaresArray.find((element) => element.squareId === currentSquareId);
            let squareContent = currentSquare.pieceColor;
            // let squareContent = isSquareOccupied(document.getElementById(currentSquareId));

            if (squareContent !== "blank" && squareContent !== pieceColor) {
                legalSquares.push(currentSquareId);
            }
        }
    }
    return legalSquares
}


function getKnightMoves(startingSquareId, pieceColor, boardSquaresArray) {
    const knightMoves = [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];
    let legalSquares = []
    let file = startingSquareId.charCodeAt(0) - 97;
    let rank = parseInt(startingSquareId.charAt(1));

    knightMoves.forEach((move) => {
        let currentFile = file + move[0]
        currrentRank = rank + move[1]

        if ((currentFile >= 0 && currentFile <= 7) && (currrentRank >= 1 && currrentRank <= 8)) {
            let currentSquareId = String.fromCharCode(currentFile + 97) + currrentRank;
            let currentSquare = boardSquaresArray.find((element) => element.squareId === currentSquareId);
            let squareContent = currentSquare.pieceColor;
            if (squareContent !== "blank" && squareContent == pieceColor)
                return
            legalSquares.push(currentSquareId)


        }
    })
    return legalSquares;

}



function getRookMoves(startingSquareId, pieceColor, boardSquaresArray) {
    let legalSquares = []
    let currentFile = startingSquareId.charCodeAt(0);
    let currentRank = parseInt(startingSquareId.charAt(1));

    // Function to add moves in one direction
    function addMoves(deltaFile, deltaRank) {
        let file = currentFile;
        let rank = currentRank;

        while (true) {
            file += deltaFile;
            rank += deltaRank;
            let currentSquareId = String.fromCharCode(file) + rank;

            let currentSquare = boardSquaresArray.find((element) => element.squareId === currentSquareId);
            if (!currentSquare) break; // Stop if the square is outside the board
            let squareContent = currentSquare.pieceColor;

            if (squareContent === pieceColor) break; // Stop if it's a piece of the same color
            legalSquares.push(currentSquareId); // Add move to legal squares

            if (squareContent !== "blank") break; // Stop if it's an opponent's piece (we can capture it)

        }
    }

    // Check all four directions
    addMoves(1, 0); // Right
    addMoves(-1, 0); // Left
    addMoves(0, 1); // Up
    addMoves(0, -1); // Down

    return legalSquares;


}


function getBishopMoves(startingSquareId, pieceColor, boardSquaresArray) {
    let currentFile = startingSquareId.charCodeAt(0);
    let currentRank = parseInt(startingSquareId.charAt(1));
    let legalSquares = []
    // Function to add moves in one diagonal direction
    function addDiagonalMoves(deltaFile, deltaRank) {
        let file = currentFile;
        let rank = currentRank;

        while (true) {
            file += deltaFile;
            rank += deltaRank;
            let currentSquareId = String.fromCharCode(file) + rank;

            let currentSquare = boardSquaresArray.find((element) => element.squareId === currentSquareId);
            if (!currentSquare) break; // Stop if the square is outside the board
            let squareContent = currentSquare.pieceColor;

            if (squareContent === pieceColor) break; // Stop if it's a piece of the same color
            legalSquares.push(currentSquareId); // Add move to legal squares

            if (squareContent !== "blank") break; // Stop if it's an opponent's piece (we can capture it)
        }
        // return legalSquares;
    }

    // Check all four diagonal directions
    addDiagonalMoves(1, 1); // Up-Right
    addDiagonalMoves(-1, 1); // Up-Left
    addDiagonalMoves(1, -1); // Down-Right
    addDiagonalMoves(-1, -1); // Down-Left
    return legalSquares;

}



function getQueenMoves(startingSquareId, pieceColor, boardSquaresArray) {
    let legalSquares = []

    let currentFile = startingSquareId.charCodeAt(0);
    let currentRank = parseInt(startingSquareId.charAt(1));

    // Function to add moves in one direction
    function addMoves(deltaFile, deltaRank) {
        let file = currentFile;
        let rank = currentRank;

        while (true) {
            file += deltaFile;
            rank += deltaRank;
            let currentSquareId = String.fromCharCode(file) + rank;

            let currentSquare = boardSquaresArray.find((element) => element.squareId === currentSquareId);
            if (!currentSquare) break; // Stop if the square is outside the board
            let squareContent = currentSquare.pieceColor;

            if (squareContent === pieceColor) break; // Stop if it's a piece of the same color
            legalSquares.push(currentSquareId); // Add move to legal squares
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
    return legalSquares;

}

function getKingMoves(startingSquareId, pieceColor, boardSquaresArray) {
    const currentFile = startingSquareId.charCodeAt(0);
    const currentRank = parseInt(startingSquareId.charAt(1));
    const legalSquares = [];

    const potentialMoves = [
        { df: -1, dr: -1 }, { df: -1, dr: 0 }, { df: -1, dr: 1 },
        { df: 0, dr: -1 }, { df: 0, dr: 1 },
        { df: 1, dr: -1 }, { df: 1, dr: 0 }, { df: 1, dr: 1 },
    ];

    const boardSquaresMap = new Map(boardSquaresArray.map(square => [square.squareId, square]));

    potentialMoves.forEach(move => {
        const newFile = currentFile + move.df;
        const newRank = currentRank + move.dr;
        const newSquareId = String.fromCharCode(newFile) + newRank;

        if (newFile >= 97 && newFile <= 104 && newRank >= 1 && newRank <= 8) {
            const currentSquare = boardSquaresMap.get(newSquareId);
            if (currentSquare && currentSquare.pieceColor !== pieceColor) {
                legalSquares.push(newSquareId);
            }
        }
    });

    return legalSquares;
}




function isKingInCheck(SquareId, pieceColor, boardSquaresArray) {
    let legalSquares = getRookMoves(SquareId, pieceColor, boardSquaresArray);
    for (let squareId of legalSquares) {
        let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
        if (
            (pieceProperties.pieceType == "rook" ||
                pieceProperties.pieceType == "queen") &&
            pieceColor != pieceProperties.color
        ) {
            return true;
        }
    }

    legalSquares = getBishopMoves(SquareId, pieceColor, boardSquaresArray);
    for (let squareId of legalSquares) {
        let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
        if (
            (pieceProperties.pieceType == "bishop" ||
                pieceProperties.pieceType == "queen") &&
            pieceColor != pieceProperties.color
        ) {
            return true;
        }
    }

    legalSquares = getKnightMoves(SquareId, pieceColor, boardSquaresArray);
    for (let squareId of legalSquares) {
        let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
        if (
            pieceProperties.pieceType == "knight" &&
            pieceColor != pieceProperties.color
        ) {
            return true;
        }
    }

    legalSquares = getPawnMoves(SquareId, pieceColor, boardSquaresArray);
    for (let squareId of legalSquares) {
        let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
        if (
            pieceProperties.pieceType == "pawn" &&
            pieceColor != pieceProperties.color
        ) {
            return true;
        }
    }

    legalSquares = getKingMoves(SquareId, pieceColor, boardSquaresArray);
    for (let squareId of legalSquares) {
        let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
        if (
            pieceProperties.pieceType == "king" &&
            pieceColor != pieceProperties.color
        ) {
            return true;
        }
    }
    return false;
}



// Helper function to find the king's square
function findKingSquare(pieceColor, boardSquaresArray) {
    for (let square of boardSquaresArray) {
        if (square.pieceType === "king" && square.pieceColor === pieceColor) {
            return square.squareId;
        }
    }
    return null;
}

// Function to get all legal moves for the given color
function getAllLegalMoves(pieceColor, boardSquaresArray) {
    let allLegalMoves = [];
    for (let square of boardSquaresArray) {
        if (square.pieceColor === pieceColor) {
            let pieceObject = { pieceColor: square.pieceColor, pieceType: square.pieceType, pieceId: square.pieceId };
            let legalMoves = getPossibleMoves(square.squareId, pieceObject, boardSquaresArray);
            allLegalMoves.push({ from: square.squareId, moves: legalMoves });
        }
    }
    return allLegalMoves;
}

// Function to simulate a move and check if it resolves the check condition
function simulateMoveAndCheck(fromSquareId, toSquareId, pieceColor, boardSquaresArray) {
    // Save the original state
    let originalFromSquare = { ...boardSquaresArray.find((element) => element.squareId === fromSquareId) };
    let originalToSquare = { ...boardSquaresArray.find((element) => element.squareId === toSquareId) };

    // Simulate the move
    updateBoardSquaresArray(fromSquareId, toSquareId, boardSquaresArray);

    // Find the king's square after the move
    let kingSquareId = findKingSquare(pieceColor, boardSquaresArray);

    // Check if the king is still in check
    let isInCheck = isKingInCheck(kingSquareId, pieceColor, boardSquaresArray);

    // Revert the move
    boardSquaresArray.find((element) => element.squareId === fromSquareId).pieceColor = originalFromSquare.pieceColor;
    boardSquaresArray.find((element) => element.squareId === fromSquareId).pieceType = originalFromSquare.pieceType;
    boardSquaresArray.find((element) => element.squareId === fromSquareId).pieceId = originalFromSquare.pieceId;

    boardSquaresArray.find((element) => element.squareId === toSquareId).pieceColor = originalToSquare.pieceColor;
    boardSquaresArray.find((element) => element.squareId === toSquareId).pieceType = originalToSquare.pieceType;
    boardSquaresArray.find((element) => element.squareId === toSquareId).pieceId = originalToSquare.pieceId;

    return !isInCheck;
}

// Function to get valid moves when the king is in check
function getValidMovesWhenInCheck(pieceColor, boardSquaresArray) {
    let allLegalMoves = getAllLegalMoves(pieceColor, boardSquaresArray);
    let validMoves = [];

    for (let moveSet of allLegalMoves) {
        let fromSquareId = moveSet.from;
        for (let toSquareId of moveSet.moves) {
            if (simulateMoveAndCheck(fromSquareId, toSquareId, pieceColor, boardSquaresArray)) {
                validMoves.push({ from: fromSquareId, to: toSquareId });
            }
        }
    }
    return validMoves;
}
function isCheckmate(pieceColor, boardSquaresArray) {
    // Check if the player is in check
    let kingSquareId = findKingSquare(pieceColor, boardSquaresArray);
    if (!isKingInCheck(kingSquareId, pieceColor, boardSquaresArray)) {
        return false; // Not in check, so not checkmate
    }

    // Get all legal moves for the player
    let allLegalMoves = getAllLegalMoves(pieceColor, boardSquaresArray);

    // Check if there is any move that resolves the check
    for (let moveSet of allLegalMoves) {
        let fromSquareId = moveSet.from;
        for (let toSquareId of moveSet.moves) {
            if (simulateMoveAndCheck(fromSquareId, toSquareId, pieceColor, boardSquaresArray)) {
                return false; // Found a move that resolves the check, so not checkmate
            }
        }
    }
    return true; // No moves resolve the check, so it is checkmate
}

function showAlert(message) {
    const alert = document.getElementById("alert");
    alert.innerHTML = message;
    alert.style.display = "block";

    setTimeout(function () {
        alert.style.display = "none";
    }, 3000);
}



function showPromotionChoices(pawn, square, color) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "promotion-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = 1;
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    // Create promotion options container
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.backgroundColor = "white";
    container.style.padding = "10px";
    container.style.borderRadius = "5px";

    // Promotion pieces
    const pieces = ["queen", "rook", "bishop", "knight"];
    pieces.forEach(piece => {
        const pieceDiv = document.createElement("div");
        pieceDiv.classList.add("piece", piece, color);
        pieceDiv.style.margin = "10px";
        pieceDiv.style.cursor = "pointer";
        pieceDiv.onclick = () => {
            promotePawn(pawn, square, piece, color);
            document.body.removeChild(overlay);
        };
        container.appendChild(pieceDiv);
    });

    overlay.appendChild(container);
    document.body.appendChild(overlay);
}
function promotePawn(pawn, square, pieceType, color) {
    // Remove the pawn
    square.removeChild(pawn);

    // Create the new piece
    const newPiece = document.createElement("div");
    newPiece.classList.add("piece", pieceType, color);
    newPiece.setAttribute("color", color);
    newPiece.setAttribute("draggable", "true");
    newPiece.addEventListener("dragstart", drag);
    newPiece.id = `${pieceType}` + square.id

    var img = document.createElement("img");

    // Set the image source
    // if(color == "white")
    //     img.src = "path/to/your/image.jpg"; 


    color == "white" ? img.src = `src/pieces/${pieceType}.png` : `src/pieces/B${pieceType}.png`;
    img.setAttribute("draggable", "false");
    // Append the image to the div
    newPiece.appendChild(img);


    square.appendChild(newPiece);
    // console.log(newPiece);

    // Update the board array
    updateBoardSquaresArrayForPromotion(square.id, pieceType, color, boardSquaresArray);
    // updateBoardSquaresArray(square.id, square.id, boardSquaresArray)


    // Check for checkmate
    if (isCheckmate(color === "white" ? "black" : "white", boardSquaresArray)) {
        alert(color === "white" ? "Black is checkmated!" : "White is checkmated!");
    }
}

// Function to update the board squares array for promotion
function updateBoardSquaresArrayForPromotion(squareId, pieceType, color, boardSquaresArray) {
    let square = boardSquaresArray.find(
        (element) => element.squareId === squareId
    );
    console.log(square);
    // square.piece = { type: pieceType, color: color };
    // let pieceColor = currentSquare.pieceColor;
    // let pieceType = currentSquare.pieceType;
    // let pieceId = currentSquare.pieceId;
    square.pieceColor = color;
    square.pieceType = pieceType;
    // destinationSquareElement.pieceId = pieceId;
    // currentSquare.pieceColor = "blank";
    // currentSquare.pieceType = "blank";
    // currentSquare.pieceId = "blank";
}


