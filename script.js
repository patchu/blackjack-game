// script.js
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }

  deck = deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
  if (['K', 'Q', 'J'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  for (let card of hand) {
    score += getCardValue(card);
    if (card.value === 'A') aces++;
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}

function displayHands() {
  const dealerHandDiv = document.getElementById('dealer-hand');
  const playerHandDiv = document.getElementById('player-hand');
  dealerHandDiv.innerHTML = '';
  playerHandDiv.innerHTML = '';

  dealerHand.forEach(card => {
    dealerHandDiv.innerHTML += `<div class="card">${card.value}${card.suit}</div>`;
  });

  playerHand.forEach(card => {
    playerHandDiv.innerHTML += `<div class="card">${card.value}${card.suit}</div>`;
  });

  document.getElementById('dealer-score').textContent = `Score: ${calculateScore(dealerHand)}`;
  document.getElementById('player-score').textContent = `Score: ${calculateScore(playerHand)}`;
}

function endGame() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);
  let result = '';

  if (playerScore > 21) {
    result = 'You busted! Dealer wins.';
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    result = 'You win!';
  } else if (dealerScore > playerScore) {
    result = 'Dealer wins!';
  } else {
    result = 'Push!';
  }

  document.getElementById('result').textContent = result;
  gameOver = true;
}

function dealerPlay() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  displayHands();
  endGame();
}

function startGame() {
  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  gameOver = false;
  document.getElementById('result').textContent = '';
  displayHands();
}

document.getElementById('hit').addEventListener('click', () => {
  if (gameOver) return;
  playerHand.push(deck.pop());
  displayHands();

  if (calculateScore(playerHand) > 21) {
    endGame();
  }
});

document.getElementById('stand').addEventListener('click', () => {
  if (gameOver) return;
  dealerPlay();
});

document.getElementById('restart').addEventListener('click', startGame);

startGame();
