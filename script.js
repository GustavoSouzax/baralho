function formatTimeElapsed(seconds) {
    const years = Math.floor(seconds / (365 * 24 * 60 * 60));
    seconds = seconds % (365 * 24 * 60 * 60);
    
    const months = Math.floor(seconds / (30 * 24 * 60 * 60));
    seconds = seconds % (30 * 24 * 60 * 60);

    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    const formattedYears = String(years).padStart(2, '0');
    const formattedMonths = String(months).padStart(2, '0');
    const formattedDays = String(days).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    let timeString = '';
    if (years > 0) timeString += `${formattedYears} a, `;
    if (months > 0) timeString += `${formattedMonths} m, `;
    if (days > 0) timeString += `${formattedDays} d, `;
    timeString += `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    return timeString;
}

function factorial(n) {
    let result = BigInt(1);
    for (let i = 2n; i <= BigInt(n); i++) {
        result *= i;
    }
    return result;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createDeck() {
    const suits = {
        'hearts': '♥',
        'diamonds': '♦',
        'spades': '♠',
        'clubs': '♣'
    };
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = document.getElementById('deck');
    const allCards = [];
    const usedPatterns = new Set();

    let cyclesCount = 0;
    let combinationsLastSecond = 0;
    let lastUpdateTime = Date.now();
    let startTime = Date.now();
    let elapsedSeconds = 0;

    for (let suit in suits) {
        for (let value of values) {
            allCards.push({
                suit: suit,
                value: value,
                symbol: suits[suit]
            });
        }
    }

    const totalPossibleCombinations = factorial(52);
    const maxCombinationsPerCycle = 1000000000;
    let attempts = 0;
    const maxAttempts = 100;

    function displayCards() {
        let shuffledCards;
        let patternKey;
        attempts = 0;

        do {
            shuffledCards = shuffleArray([...allCards]);
            patternKey = shuffledCards.map(card => `${card.suit}${card.value}`).join(',');
            attempts++;
            
            if (attempts >= maxAttempts) {
                usedPatterns.clear();
                cyclesCount++;
                break;
            }
        } while (usedPatterns.has(patternKey));

        usedPatterns.add(patternKey);
        deck.innerHTML = '';

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                const cardIndex = i * 13 + j;
                const card = document.createElement('div');
                card.className = `card ${shuffledCards[cardIndex].suit}`;
                card.innerHTML = `
                    <div>${shuffledCards[cardIndex].value}</div>
                    <div class="symbol">${shuffledCards[cardIndex].symbol}</div>
                `;
                deck.appendChild(card);
            }
        }

        const currentTime = Date.now();
        const timeElapsed = (currentTime - lastUpdateTime) / 1000;
        const combinationsPerSecond = Math.round(
            (usedPatterns.size - combinationsLastSecond) / timeElapsed
        );

        elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const timeElapsedString = formatTimeElapsed(elapsedSeconds);

        // Atualizar os elementos com as estatísticas
        document.getElementById('combinacoes').textContent = usedPatterns.size.toLocaleString();
        document.getElementById('ciclos-completos').textContent = cyclesCount;
        document.getElementById('tempo-anos').textContent = timeElapsedString.split(", ")[0];
        document.getElementById('tempo-horas').textContent = timeElapsedString.split(", ").slice(1).join(" ");
        document.getElementById('velocidade').textContent = combinationsPerSecond.toLocaleString();

        combinationsLastSecond = usedPatterns.size;
        lastUpdateTime = currentTime;

        if (usedPatterns.size >= maxCombinationsPerCycle) {
            usedPatterns.clear();
            cyclesCount++;
        }
    }

    displayCards();
    setInterval(displayCards, 1000);
}

window.onload = function() {
    createDeck();
};