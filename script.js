// 選取DOM元素
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const cardContainer = document.getElementById('card-container');
const themeSelect = document.getElementById('theme-select');
const gridSizeSelect = document.getElementById('grid-size-select');
const timerDisplay = document.getElementById('timer-display'); 
let flippedCards = []; 
let matchedPairs = 0; 
let timer; 
let startTime; 
let countdownTime = 3; // 預設倒數時間

// 音效
const successSound = new Audio('audio/success.mp3'); // 成功音效
const failureSound = new Audio('audio/failure.mp3'); // 失敗音效

// 動態生成卡片
function generateCards(theme, gridSize) {
    cardContainer.innerHTML = '';  
    flippedCards = []; 
    matchedPairs = 0; 

    let backImages = [];
    // 設定每個主題的背面圖片
    for (let i = 1; i <= 18; i++) {
        if (theme === 'onepiece') {
            backImages.push(`image/onepiece ${i}.png`);
        } else if (theme === 'historical') {
            backImages.push(`image/historical figures ${i}.png`);
        }
    }

    let cardImages = [];
    // 根據網格大小計算所需卡片數量
    const numPairs = (gridSize === '2x2') ? 2 : (gridSize === '4x4') ? 8 : 18;
    
    // 隨機選擇兩兩成對的卡片
    for (let i = 0; i < numPairs; i++) {
        cardImages.push(backImages[i]);
        cardImages.push(backImages[i]);
    }
    
    cardImages.sort(() => Math.random() - 0.5); // 隨機打亂卡片順序

    // 創建卡片
    cardImages.forEach(imageSrc => {
        const card = document.createElement('div');
        card.classList.add('card');

        const frontFace = document.createElement('div');
        frontFace.classList.add('card-face', 'front');
        const frontImage = document.createElement('img');
        // 正面固定顯示主題對應的封面圖片
        frontImage.src = theme === 'onepiece' ? `image/onepiece 0.png` : `image/historical figures 0.png`;
        frontFace.appendChild(frontImage);

        const backFace = document.createElement('div');
        backFace.classList.add('card-face', 'back');
        const backImage = document.createElement('img');
        backImage.src = imageSrc; // 使用隨機分配的背面圖片
        backFace.appendChild(backImage);

        card.appendChild(frontFace);
        card.appendChild(backFace);

        card.addEventListener('click', () => {
            handleCardClick(card, backImage.src);
        });

        cardContainer.appendChild(card);
    });

    // 設定網格布局
    switch (gridSize) {
        case '2x2':
            cardContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
            break;
        case '4x4':
            cardContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
            break;
        case '6x6':
            cardContainer.style.gridTemplateColumns = 'repeat(6, 1fr)';
            break;
    }
}

// 處理卡片點擊事件
function handleCardClick(card, imageSrc) {
    if (card.classList.contains('is-flipped') || flippedCards.length === 2) {
        return; 
    }

    card.classList.add('is-flipped');
    flippedCards.push({ card, imageSrc });

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// 檢查兩張卡片是否配對
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.imageSrc === secondCard.imageSrc) {
        matchedPairs++;
        successSound.play(); // 播放成功音效

        // 添加淡化效果
        firstCard.card.classList.add('fade-out');
        secondCard.card.classList.add('fade-out');

        flippedCards = [];

        if (matchedPairs === (cardContainer.children.length / 2)) {
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            setTimeout(() => {
                alert(`恭喜！你贏了！總共花了 ${totalTime} 秒。`);
                resetGame();
            }, 500);
        }
    } else {
        failureSound.play(); // 播放失敗音效
        setTimeout(() => {
            firstCard.card.classList.remove('is-flipped');
            secondCard.card.classList.remove('is-flipped');
            flippedCards = [];
        }, 1000);
    }
}

// 按鈕事件處理
document.getElementById('start-game').addEventListener('click', () => {
    const selectedTheme = themeSelect.value;
    const selectedGridSize = gridSizeSelect.value;
    
    // 取得使用者設定的倒數時間
    const countdownInput = document.getElementById('countdown-input').value;
    countdownTime = countdownInput ? parseInt(countdownInput, 10) : 3;

    generateCards(selectedTheme, selectedGridSize);
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    // 初始翻到背面，等待倒數時間
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('is-flipped');
    });

    let countdown = countdownTime;
    timerDisplay.innerText = `倒數計時: ${countdown}秒`;

    const countdownInterval = setInterval(() => {
        countdown--;
        timerDisplay.innerText = `倒數計時: ${countdown}秒`;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('is-flipped');
            });
            startTime = Date.now();
            timerDisplay.innerText = `遊戲時間: 0秒`;
            startGameTimer();
        }
    }, 1000);
});

// 開始計時器
function startGameTimer() {
    timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.innerText = `遊戲時間: ${elapsed}秒`;
    }, 1000);
}

// 重置遊戲
function resetGame() {
    clearInterval(timer);
    timerDisplay.innerText = '';
    startScreen.style.display = 'block';
    gameScreen.style.display = 'none';
}

// 重新開始遊戲按鈕事件
document.getElementById('reset-cards').addEventListener('click', () => {
    resetGame();
});
