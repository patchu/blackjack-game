let deck = [];
let playerHands = [[]];
let dealerHand = [];
let currentHandIndex = 0;
let splitCount = 0;
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

function isPair(hand) {
  if (!hand || hand.length !== 2) return false;
  return hand[0].value === hand[1].value;
}

function displayHands(revealDealerCard = false) {
  // Dealer hand
  const dealerHandDiv = document.getElementById('dealer-hand');
  dealerHandDiv.innerHTML = '';
  dealerHand.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    if (index === 0 && !revealDealerCard) {
      cardDiv.classList.add('back');
      cardDiv.textContent = '🂠';
    } else {
      cardDiv.textContent = `${card.value}${card.suit}`;
    }
    dealerHandDiv.appendChild(cardDiv);
  });
  document.getElementById('dealer-score').textContent =
    revealDealerCard ? `Score: ${calculateScore(dealerHand)}` : 'Score: ?';

  // Player hands
  const container = document.getElementById('player-hands-container');
  container.innerHTML = '';
  playerHands.forEach((hand, index) => {
    const handBox = document.createElement('div');
    handBox.classList.add('player-hand-box');
    if (index === currentHandIndex) handBox.classList.add('active');

    const label = document.createElement('p');
    label.textContent = `Hand ${index + 1}: ${calculateScore(hand)}`;
    handBox.appendChild(label);

    const handDiv = document.createElement('div');
    handDiv.classList.add('hand');

    hand.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.textContent = `${card.value}${card.suit}`;
      handDiv.appendChild(cardDiv);
    });

    handBox.appendChild(handDiv);
    container.appendChild(handBox);
  });

  // Split button visibility — ✅ fixed to prevent undefined error
  const splitBtn = document.getElementById('split');
  const hand = playerHands[currentHandIndex];
  if (hand && isPair(hand) && splitCount < 2) {
    splitBtn.style.display = 'inline-block';
  } else {
    splitBtn.style.display = 'none';
  }
}


function endGame() {
  gameOver = true;
  document.getElementById('split').style.display = 'none';

  const dealerScore = calculateScore(dealerHand);
  const dealerBust = dealerScore > 21;

  let resultHTML = '';
  playerHands.forEach((hand, i) => {
    const score = calculateScore(hand);
    const bust = score > 21;
    let result = '';

    if (bust) {
      result = 'Busted!';
    } else if (dealerBust || score > dealerScore) {
      result = 'Win!';
    } else if (score < dealerScore) {
      result = 'Lose!';
    } else {
      result = 'Push.';
    }

    resultHTML += `Hand ${i + 1}: ${result} `;
    console.log("Setting result to:", resultHTML);
  });

  // ✅ Only update result if resultHTML is not empty
  const resultElement = document.getElementById('result');
  resultElement.textContent = resultHTML.trim() || 'Dealer wins by default.';
}


function dealerPlay() {
  // Check if all player hands are busted
  const allBusted = playerHands.every(hand => calculateScore(hand) > 21);
  if (allBusted) {
    displayHands(true); // still show full dealer hand
    endGame();
    return;
  }

  // Otherwise, dealer draws as normal
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  displayHands(true);
  endGame();
}

function startGame() {
  createDeck();
  dealerHand = [deck.pop(), deck.pop()];
  playerHands = [[deck.pop(), deck.pop()]];
  currentHandIndex = 0;
  splitCount = 0;
  gameOver = false;
  document.getElementById('result').textContent = '';
  displayHands(false);
}

function nextHand() {
  currentHandIndex++;
  if (currentHandIndex < playerHands.length) {
    displayHands(false);
  } else {
    dealerPlay();
  }
}

document.getElementById('hit').addEventListener('click', () => {
  if (gameOver) return;
  const hand = playerHands[currentHandIndex];
  hand.push(deck.pop());
  displayHands(false);
  if (calculateScore(hand) > 21) {
    nextHand();
  }
});

document.getElementById('stand').addEventListener('click', () => {
  if (gameOver) return;
  nextHand();
});

document.getElementById('split').addEventListener('click', () => {
  if (gameOver) return;
  const hand = playerHands[currentHandIndex];
  if (isPair(hand) && splitCount < 2) {
    const [card1, card2] = hand;
    playerHands.splice(currentHandIndex, 1, [card1, deck.pop()], [card2, deck.pop()]);
    splitCount++;
    displayHands(false);
  }
});

document.getElementById('restart').addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
  if (gameOver) return;

  const key = event.key.toLowerCase();
  if (key === 'h') {
    document.getElementById('hit').click();
  } else if (key === 's') {
    document.getElementById('stand').click();
  } else if (key === 'r') {
    document.getElementById('restart').click();
  } else if (key === 'y') {
    const splitBtn = document.getElementById('split');
    if (splitBtn.style.display !== 'none') {
      splitBtn.click();
    }
  }
});

startGame();
