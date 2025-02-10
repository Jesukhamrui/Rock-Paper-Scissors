let playerScore = 0;
    let computerScore = 0;
    let gameHistory = [];

    // Create sound effects using oscillator nodes for distinct sounds
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    function createWinSound() {
        const duration = 1;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4); // G5
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    function createTieSound() {
        const duration = 0.8;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.4); // A4 again
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    function createLoseSound() {
        const duration = 1;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(493.88, audioContext.currentTime); // B4
        oscillator.frequency.setValueAtTime(466.16, audioContext.currentTime + 0.2); // Bb4
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.4); // A4
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    function getComputerChoice() {
        const choices = ['Rock', 'Paper', 'Scissors'];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    function getChoiceEmoji(choice) {
        const emojis = {
            'Rock': '✊',
            'Paper': '✋',
            'Scissors': '✌️'
        };
        return emojis[choice];
    }

    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) return 'tie';
        
        const winConditions = {
            'Rock': 'Scissors',
            'Paper': 'Rock',
            'Scissors': 'Paper'
        };
        
        return winConditions[playerChoice] === computerChoice ? 'player' : 'computer';
    }

    function updateHistory(playerChoice, computerChoice, winner) {
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const resultText = winner === 'tie' ? 'Tie!' : 
                         winner === 'player' ? 'You won!' : 'Computer won!';
        
        historyItem.innerHTML = `
            <div>
                <span class="choice-icon">${getChoiceEmoji(playerChoice)}</span> vs 
                <span class="choice-icon">${getChoiceEmoji(computerChoice)}</span>
                <span class="${winner === 'player' ? 'winner' : winner === 'computer' ? 'loser' : ''}">${resultText}</span>
            </div>
            <span class="timestamp">${timestamp}</span>
        `;
        
        const historyList = document.getElementById('historyList');
        historyList.insertBefore(historyItem, historyList.firstChild);
    }

    function updateScoreDisplay() {
        document.getElementById('playerScore').textContent = playerScore;
        document.getElementById('computerScore').textContent = computerScore;
    }

    function play(playerChoice) {
        // Resume audio context if it's suspended (browsers require user interaction)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const computerChoice = getComputerChoice();
        
        document.getElementById('playerChoice').textContent = `${getChoiceEmoji(playerChoice)} ${playerChoice}`;
        document.getElementById('computerChoice').textContent = `${getChoiceEmoji(computerChoice)} ${computerChoice}`;
        
        const winner = determineWinner(playerChoice, computerChoice);
        
        if (winner === 'player') {
            playerScore++;
            createWinSound();
            document.getElementById('result').textContent = 'You won! 🎉';
            document.getElementById('result').className = 'result winner';
        } else if (winner === 'computer') {
            computerScore++;
            createLoseSound();
            document.getElementById('result').textContent = 'Computer won! 🤖';
            document.getElementById('result').className = 'result loser';
        } else {
            createTieSound();
            document.getElementById('result').textContent = 'It\'s a tie! 🤝';
            document.getElementById('result').className = 'result';
        }
        
        updateScoreDisplay();
        updateHistory(playerChoice, computerChoice, winner);
        
        document.querySelectorAll('.choices button').forEach(button => {
            if (button.textContent.includes(playerChoice)) {
                button.classList.add('active-choice');
                setTimeout(() => button.classList.remove('active-choice'), 500);
            }
        });
    }

    function resetGame() {
        playerScore = 0;
        computerScore = 0;
        gameHistory = [];
        document.getElementById('playerChoice').textContent = '-';
        document.getElementById('computerChoice').textContent = '-';
        document.getElementById('result').textContent = '';
        document.getElementById('result').className = 'result';
        document.getElementById('historyList').innerHTML = '';
        updateScoreDisplay();
    }