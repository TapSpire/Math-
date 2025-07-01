const circle = document.getElementById("circle");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const gameContainer = document.querySelector(".game-container");
const bonusSound = document.getElementById("bonus-sound");
const wordHolder = document.getElementById("wordHolder");

const textContent = [
  '0', '1', '2', '1', '0',
  '1', '2', '4', '2', '1',
  '2', '4', '8', '4', '2',
  '1', '2', '4', '2', '1',
  '0', '1', '2', '1', '0',
];

const correctEquations = [
  "5 + 3 = 8", "9 - 4 = 5", "6 × 2 = 12", "12 ÷ 4 = 3", "7 + 6 = 13",
  "15 - 7 = 8", "3 × 5 = 15", "20 ÷ 5 = 4", "8 + 2 = 10", "14 - 6 = 8",
  "9 × 3 = 27", "16 ÷ 2 = 8", "4 + 4 = 8", "18 - 9 = 9", "7 × 2 = 14",
  "10 ÷ 2 = 5", "11 + 5 = 16", "13 - 3 = 10", "6 × 4 = 24", "24 ÷ 3 = 8",
  "2 + 9 = 11", "17 - 8 = 9", "5 × 3 = 15", "21 ÷ 7 = 3", "3 + 3 = 6",
  "10 - 5 = 5", "4 × 4 = 16", "12 ÷ 6 = 2", "1 + 6 = 7", "8 - 3 = 5",
  "9 + 0 = 9", "6 ÷ 3 = 2", "7 + 1 = 8", "10 + 10 = 20", "100 ÷ 10 = 10",
  "2 × 6 = 12", "30 ÷ 5 = 6", "25 - 5 = 20", "13 + 2 = 15", "3 × 4 = 12",
  "18 ÷ 6 = 3", "9 + 6 = 15", "40 - 10 = 30", "6 + 5 = 11", "28 ÷ 4 = 7",
  "8 × 3 = 24", "36 ÷ 6 = 6", "4 + 9 = 13", "7 + 7 = 14", "15 ÷ 3 = 5"
];


const incorrectEquations = [
  "5 + 3 = 9", "9 - 4 = 6", "6 × 2 = 10", "12 ÷ 4 = 2", "7 + 6 = 14",
  "15 - 7 = 6", "3 × 5 = 10", "20 ÷ 5 = 3", "8 + 2 = 9", "14 - 6 = 9",
  "9 × 3 = 26", "16 ÷ 2 = 6", "4 + 4 = 9", "18 - 9 = 10", "7 × 2 = 15",
  "10 ÷ 2 = 4", "11 + 5 = 15", "13 - 3 = 11", "6 × 4 = 23", "24 ÷ 3 = 6",
  "2 + 9 = 10", "17 - 8 = 10", "5 × 3 = 10", "21 ÷ 7 = 2", "3 + 3 = 5",
  "10 - 5 = 6", "4 × 4 = 15", "12 ÷ 6 = 3", "1 + 6 = 8", "8 - 3 = 6",
  "9 + 0 = 8", "6 ÷ 3 = 1", "7 + 1 = 9", "10 + 10 = 19", "100 ÷ 10 = 11",
  "2 × 6 = 13", "30 ÷ 5 = 5", "25 - 5 = 15", "13 + 2 = 14", "3 × 4 = 10",
  "18 ÷ 6 = 2", "9 + 6 = 14", "40 - 10 = 25", "6 + 5 = 12", "28 ÷ 4 = 6",
  "8 × 3 = 23", "36 ÷ 6 = 7", "4 + 9 = 14", "7 + 7 = 13", "15 ÷ 3 = 6"
];



let currentWord = "";
let score = 0;
let awarded_15 = false;
let awarded_30 = false;
let awarded_60 = false;
let timeLeft = 120;
let gameInterval;
let timerInterval;
let bonusMessageVisible = false;
let lastClickedTextValue = 0;
const normalSize = 120;

// === INSTRUCTION OVERLAY TRIGGER ===
window.onload = () => {
  document.getElementById("instructionsOverlay").style.display = "flex";
};

// === CALLED ON OK BUTTON PRESS ===
function startGameWithOverlay() {
  document.getElementById("instructionsOverlay").style.display = "none";
  startGame();
}

function createGrid() {
  const grid = document.querySelector('.grid');
  grid.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const square = document.createElement('div');
    square.classList.add('square');

    const span = document.createElement('span');
    span.textContent = textContent[i];
    square.appendChild(span);

    square.addEventListener('click', function () {
      square.classList.add('clicked');
      lastClickedTextValue = parseInt(span.textContent);
    });

    grid.appendChild(square);
  }
}

function getRandomWord() 
{
  if (Math.random() < 0.5) 
  {
    currentWord = correctEquations[Math.floor(Math.random() * correctEquations.length)];
  } 
  else 
  {
    currentWord = incorrectEquations[Math.floor(Math.random() * incorrectEquations.length)];
  }
  return currentWord;
}


function showBonusMessage(message, color) {
  if (bonusMessageVisible) return;
  bonusMessageVisible = true;

  const bonusMessage = document.createElement('div');
  bonusMessage.classList.add('bonus-message');
  bonusMessage.textContent = message;
  bonusMessage.style.color = color;
  document.body.appendChild(bonusMessage);

  setTimeout(() => {
    bonusMessage.remove();
    bonusMessageVisible = false;
  }, 3000);
}

function startGame() {
  createGrid();
  score = 0;
  timeLeft = 120;
  awarded_15 = false;
  awarded_30 = false;
  awarded_60 = false;

  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  restartBtn.style.display = "none";

  wordHolder.style.cursor = "pointer";
  wordHolder.style.pointerEvents = "auto";

  wordHolder.textContent = getRandomWord();
  wordHolder.onclick = handleWordClick;

  // === Word changes every 5 seconds ===
  gameInterval = setInterval(() => {
    currentWord = getRandomWord();
    wordHolder.textContent = currentWord;
  }, 5000);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  circle.style.display = "none";
  restartBtn.style.display = "inline-block";
  timerDisplay.textContent = `Game Over! Final Score: ${score}`;
}

function createFireworks() {
  const fireworksContainer = document.createElement("div");
  fireworksContainer.classList.add("fireworks");

  for (let i = 0; i < 10; i++) {
    const spark = document.createElement("div");
    spark.classList.add("firework-spark");
    const angle = Math.random() * 360;
    const distance = Math.random() * 50 + 50;
    const duration = Math.random() * 0.5 + 1;
    spark.style.animationDuration = `${duration}s`;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    spark.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

    fireworksContainer.appendChild(spark);
  }

  document.body.appendChild(fireworksContainer);

  setTimeout(() => {
    fireworksContainer.remove();
  }, 2000);
}

function checkScoreForFireworks() {
  if (score === 15 && !awarded_15) {
    createFireworks();
    showBonusMessage("TIME-BONUS! 15s", "gold");
    timeLeft += 15;
    awarded_15 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
  if (score === 30 && !awarded_30) {
    createFireworks();
    showBonusMessage("TIME-BONUS! 30s", "gold");
    timeLeft += 30;
    awarded_30 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
  if (score === 60 && !awarded_60) {
    createFireworks();
    showBonusMessage("TIME-BONUS! 60s", "gold");
    timeLeft += 60;
    awarded_60 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
}

function handleWordClick() {
  let hoverText = document.createElement("div");
  hoverText.classList.add("hover-feedback");

  const correctSound = document.getElementById("correct-sound");
  const clickSound = document.getElementById("click-sound");

  if (correctEquations.includes(currentWord)) {
    score++;
    score += lastClickedTextValue;
    correctSound.currentTime = 0;
    correctSound.play();
    showBonusMessage("Correct!", "green");
    hoverText.textContent = "Good!";
    hoverText.style.color = "green";
  } else if (incorrectEquations.includes(currentWord)) {
    score--;
    score -= lastClickedTextValue;
    clickSound.currentTime = 0;
    clickSound.play();
    showBonusMessage("Oops! That's a misspelling!", "red");
    hoverText.textContent = "Ouch!!!!";
    hoverText.style.color = "red";
  }

  const wordRect = wordHolder.getBoundingClientRect();
  hoverText.style.position = "absolute";
  hoverText.style.left = `${wordRect.left + wordRect.width / 2}px`;
  hoverText.style.top = `${wordRect.top - 20}px`;
  hoverText.style.transform = "translateX(-50%)";
  hoverText.style.fontWeight = "bold";
  hoverText.style.fontSize = "20px";
  hoverText.style.pointerEvents = "none";
  hoverText.style.zIndex = "1000";
  hoverText.style.transition = "opacity 1s ease-out, transform 1s ease-out";
  hoverText.style.opacity = "1";

  document.body.appendChild(hoverText);

  setTimeout(() => {
    hoverText.style.opacity = "0";
    hoverText.style.transform = "translateX(-50%) translateY(-30px)";
  }, 50);

  setTimeout(() => {
    hoverText.remove();
  }, 1000);

  scoreDisplay.textContent = `Score: ${score}`;
  checkScoreForFireworks();

  // Load next word immediately after click
  currentWord = getRandomWord();
  wordHolder.textContent = currentWord;
}


restartBtn.addEventListener("click", startGame);
