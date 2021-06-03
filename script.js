// Adjusted June 3, 2021 @4:14 pm
// Initialize Variables
let numPlayerAcquired = 0;    // number of pieces acquired by player
let numComputerAcquired = 0;  // number of pieces acquired by computer
const playerHTML = '<img ondragstart="onDragStart(event)" ondragend="onDragEnd(event)" ondragenter="onDragEnter(event)" ondragleave="onDragLeave(event)" class="red" draggable="true" src="img/red-piece.png">';
const computerHTML = '<img ondragstart="onDragStart(event)" ondragend="onDragEnd(event)" ondragenter="onDragEnter(event)" ondragleave="onDragLeave(event)" class="white" draggable="true" src="img/white-piece.png">';
const computerKingHTML = '<img ondragstart="onDragStart(event)" ondragend="onDragEnd(event)" ondragenter="onDragEnter(event)" ondragleave="onDragLeave(event)" class="kingWhite" draggable="true" src="img/white-king-piece.png">';
const playerKingHTML = '<img ondragstart="onDragStart(event)" ondragend="onDragEnd(event)" ondragenter="onDragEnter(event)" ondragleave="onDragLeave(event)" class="kingRed" draggable="true" src="img/red-king-piece.png">';
const moveAudioElement = new Audio("music/move.mp3");
const winAudioElement = new Audio("music/win.mp3");

var dragged;
let killPiece;
let board = [["white","white","white","white"], ["white","white","white","white"], ["white","white","white","white"], ["","","",""], ["","","",""], ["red","red","red","red"], ["red","red","red","red"], ["red","red","red","red"]];
let startingId = null;
let startingX;
let finalX;
let startingY;
let finalY;
let currentPlayer;
let previousPlayer;
let kingPiece;
let firstTurn = true;
let ableToMove;
let kill;
let dragWorked;
let registerWinner = false;

// Cache Elements from HTML to JS
let activeCellsEl = document.querySelectorAll(".active-cell");
let playerScoreEl = document.getElementById("player-score");
let computerScoreEl = document.getElementById("computer-score");
let resetBtnEl = document.getElementById("reset");
let currentTurnEl = document.getElementById("current-turn");

// Add Event Listeners
resetBtnEl.addEventListener("click", resetGame);
for (i=0; i < 32; i++){
  activeCellsEl[i].addEventListener("dragstart", onDragStart);
  activeCellsEl[i].addEventListener("dragend", onDragEnd);
  activeCellsEl[i].addEventListener("dragover", onDragOver);
  activeCellsEl[i].addEventListener("dragenter", onDragEnter);
  activeCellsEl[i].addEventListener("dragleave", onDragLeave);
  activeCellsEl[i].addEventListener("drop", onDrop);
}

console.log(board[0],board[1],board[2],board[3],board[4],board[5],board[6],board[7]);

function updateScore(player, computer){
    numPlayerAcquired += player;
    numComputerAcquired += computer;
    playerScoreEl.innerHTML = "RED: " + numPlayerAcquired;
    computerScoreEl.innerHTML = "WHITE: " + numComputerAcquired;
};

function kingsRow(event) {
  if (["00", "01", "02", "03"].includes(event.target.id)){
    document.getElementById(event.target.id).innerHTML = playerKingHTML;
    kingPiece = true;
  } else if (["70", "71", "72", "73"].includes(event.target.id)){
    document.getElementById(event.target.id).innerHTML = computerKingHTML;
    kingPiece = true;
  } else {
    kingPiece = false;
  }
}

function checkAndAnnounceWinner(){
  let countWhite = 0;
  let countRed = 0;
  for (let j = 0; j < 4; j++){
    for (let i = 0; i < 8; i++){
      if (board[i][j] === "white" || board[i][j] === "kingWhite"){
        countRed += 1;
      } else if (board[i][j] === "red" || board[i][j] === "kingRed"){
        countWhite += 1;
      }
    }
  }
    // console.log(countWhite, countRed);
  if (countWhite === 0) {
    registerWinner = true;
    computerScoreEl.innerHTML = "WHITE WINS!";
    currentTurnEl.innerHTML = "";
    playerScoreEl.innerHTML = "";
    winAudioElement.currentTime = 51;
    winAudioElement.volume = 0.05;
    winAudioElement.play();
    } else if (countRed === 0) {
    registerWinner = true;
    playerScoreEl.innerHTML = "RED WINS!";
    currentTurnEl.innerHTML = "";
    computerScoreEl.innerHTML = "";
    winAudioElement.currentTime = 51;
    winAudioElement.volume = 0.05;
    winAudioElement.play();
  }
};

function even(number){
  if(number % 2 == 0) {
    return true;
  }
}

// dragging crap :D

function onDragStart(event){
  dragged = event.target;
  currentPlayer = dragged.className;
  if (currentPlayer !== previousPlayer && dragged.parentNode.className !== "cell"){
    dragWorked = true;
    startingId = dragged.parentNode.id;
    ableToMove = true;
    kill = true;
    board[parseInt(startingId[0])][parseInt(startingId[1])] = "";
    event.target.style.opacity = .5;
    startingX = event.clientX;
    startingY = event.clientY;
  } else if (currentPlayer === previousPlayer){
    event.preventDefault(); // prevents player from repeating
  }
  else {
    dragWorked = false;
    currentPlayer = previousPlayer;
  }
}

function onDragEnd(event){
  event.preventDefault();
  event.target.style.opacity = "";
}

function onDragOver(event){
  event.preventDefault(); 
}

function onDragEnter(event){
  if (event.target.className == "active-cell") {
    event.target.style.background = "black";
  }
}

function onDragLeave(event){
  if (event.target.className == "active-cell") {
    event.target.style.background = "";
  }
}

function onDrop(event) {
  finalX = event.clientX;
  finalY = event.clientY;
  differenceX = finalX - startingX;
  differenceY = startingY - finalY;
  console.log (differenceX, differenceY);

  event.preventDefault();
  let dropId = event.target.id;
  let killId = "";

  if (even(startingId[0])) {
    killId = (Math.round((parseInt(startingId) + parseInt(dropId))/2)).toString();
  } else if (!even(startingId[0])){
    killId = (Math.floor((parseInt(startingId) + parseInt(dropId))/2)).toString();
  }
  if (!["00","01","02","03","10","11","12","13","20","21","22","23","30","31","32","33","40","41","42","43","50","51","52","53","60","61","62","63","70","71","72","73"].includes(killId)) {
    killId = dropId;
  }
  console.log("starting ID is", startingId);
  console.log("kill ID is", killId);
  console.log("drop ID is", dropId);

  // let killId = (Math.round((parseInt(startingId) + parseInt(dropId))/2)).toString();
  if (Math.abs(parseInt(startingId[0]) - parseInt(dropId[0])) > 2) {
    ableToMove = false;
    kill = false;
  } else if (Math.abs(parseInt(startingId[0]) - parseInt(dropId[0])) == 2 && board[parseInt(dropId[0])][parseInt(dropId[1])] === "" && board[parseInt(killId[0])][parseInt(killId[1])] === dragged.className){
      ableToMove = false;
      kill = false;
  } else if (dragged.className === "red" && differenceY < 0 && !kingPiece) {
      ableToMove = false;
      kill = false;
  } else if (dragged.className === "white" && differenceY > 0 && !kingPiece) {
      ableToMove = false;
      kill = false;
  } else if (dragged.className === "kingRed") {
        ableToMove = true;
        kill = true;
  } else if (dragged.className === "kingWhite") {
        ableToMove = true;
        kill = true;
  } else if (Math.abs(parseInt(startingId[0]) - parseInt(dropId[0])) >= 2 && board[parseInt(dropId[0])][parseInt(dropId[1])] === "" && board[parseInt(killId[0])][parseInt(killId[1])] === "") {
      ableToMove = false;
      kill = false;
  } else if (currentPlayer === previousPlayer){
      ableToMove = false;
      kill = false;
  } else if (dragged.className === "white" && firstTurn === true){
      ableToMove = false;
      kill = false;
  } else if (Math.abs(parseInt(startingId[0]) - parseInt(dropId[0])) == 2 && board[parseInt(dropId[0])][parseInt(dropId[1])] === "" && board[parseInt(killId[0])][parseInt(killId[1])] !== dragged.className) {
      ableToMove = true;
      kill = true;
  } else if (Math.abs(parseInt(startingId[0]) - parseInt(dropId[0])) === 1 && board[parseInt(dropId[0])][parseInt(dropId[1])] === "") {
      ableToMove = true;
  } else if (startingId === dropId){
      dragWorked = false;
  }
  if (dragWorked && dragged.className === "white" && board[parseInt(killId[0])][parseInt(killId[1])] === "red" && kill === true && ableToMove === true){
    board[parseInt(killId[0])][parseInt(killId[1])] = "";
    updateScore(0, 1);
    document.getElementById(killId).innerHTML = "";
    kill = false;
  } else if (dragWorked && dragged.className === "red" && board[parseInt(killId[0])][parseInt(killId[1])] === "white" && kill === true && ableToMove === true) {
      board[parseInt(killId[0])][parseInt(killId[1])] = "";
      updateScore(1, 0);
      document.getElementById(killId).innerHTML = "";
      kill = false;
  } else if (dragWorked && dragged.className === "red" && board[parseInt(killId[0])][parseInt(killId[1])] === "white" && kill === true && ableToMove === true) {
      board[parseInt(killId[0])][parseInt(killId[1])] = "";
      updateScore(1, 0);
      document.getElementById(killId).innerHTML = "";
      kill = false;
  } else if (dragWorked && dragged.className === "kingRed" && board[parseInt(killId[0])][parseInt(killId[1])] === "white" && kill === true && ableToMove === true){
      board[parseInt(killId[0])][parseInt(killId[1])] = "";
      updateScore(1, 0);
      document.getElementById(killId).innerHTML = "";
      kill = false;
  } else if (dragWorked && dragged.className === "kingWhite" && board[parseInt(killId[0])][parseInt(killId[1])] === "red" && kill === true && ableToMove === true){
    board[parseInt(killId[0])][parseInt(killId[1])] = "";
    updateScore(0, 1);
    document.getElementById(killId).innerHTML = "";
    kill = false;
}

  if (ableToMove && dragWorked) {
    if (event.target.className == "active-cell") {
      event.target.style.background = "";
      console.log("removed is", dragged);
      dragged.parentNode.removeChild( dragged );
      console.log("after removed is", dragged);
      event.target.appendChild( dragged );
      moveAudioElement.currentTime = 0.6;
      moveAudioElement.volume = 0.1;
      moveAudioElement.play();
      console.log("appended is", dragged);
      if (dragged.className === "red") {
        board[parseInt(dropId[0])][parseInt(dropId[1])] = "red";
        kingsRow(event);
      } else if (dragged.className === "white") {
          board[parseInt(dropId[0])][parseInt(dropId[1])] = "white";  
          kingsRow(event);
      } else if (dragged.className === "kingRed") {
          board[parseInt(dropId[0])][parseInt(dropId[1])] = "red";
      } else if (dragged.className === "kingWhite") {
          board[parseInt(dropId[0])][parseInt(dropId[1])] = "white";
      }
    }
      console.log(board[0],board[1],board[2],board[3],board[4],board[5],board[6],board[7]);
  }
  checkAndAnnounceWinner();
  if (dragWorked && !registerWinner){
    previousPlayer = currentPlayer;
  } else {
      if (currentPlayer === "red") {
        previousPlayer = "white";
      } else if (currentPlayer === "white") {
        previousPlayer = "red";
      }
  }
  if (currentPlayer === "white" && !registerWinner && dragWorked){
    currentTurnEl.innerHTML = 'TURN:<img src="img/red-piece.png">'
  } else if (currentPlayer === "red" && !registerWinner && dragWorked) {
      currentTurnEl.innerHTML = 'TURN:<img src="img/white-piece.png">'
  } else if (currentPlayer === "kingWhite" && !registerWinner && dragWorked) {
      currentTurnEl.innerHTML = 'TURN:<img src="img/red-piece.png">'
  } else if (currentPlayer === "kingRed" && !registerWinner && dragWorked) {
      currentTurnEl.innerHTML = 'TURN:<img src="img/white-piece.png">'
  }
  firstTurn = false;
}

function resetGame(){
  numPlayerAcquired = 0;    // number of pieces acquired by player
  numComputerAcquired = 0;  
  winAudioElement.currentTime = 0;
  winAudioElement.pause();
  let id = "";
  board = [["white","white","white","white"], ["white","white","white","white"], ["white","white","white","white"], ["","","",""], ["","","",""], ["red","red","red","red"], ["red","red","red","red"], ["red","red","red","red"]];
  currentPlayer = "red";
  previousPlayer = null;
  firstTurn = true;
  registerWinner = false;
  currentTurnEl.innerHTML = 'TURN:<img src="img/red-piece.png">';
  computerScoreEl.innerHTML = "WHITE: 0";
  playerScoreEl.innerHTML = "RED: 0";
  for (let j=0; j < 4; j++) {
    for (let i=0; i < 8; i++) {
      id = i.toString() + j.toString();
      console.log(id);
      if (board[i][j] === "red") {
        document.getElementById(id).innerHTML = playerHTML;
      } else if (board[i][j] === "white") {
          document.getElementById(id).innerHTML = computerHTML;
      } else if (board[i][j] === "") {
          document.getElementById(id).innerHTML = "";
      }
    }
  }
};