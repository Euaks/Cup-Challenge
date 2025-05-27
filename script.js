document.addEventListener('DOMContentLoaded', () => {
    const cups = document.querySelectorAll('.cup');
    const startBtn = document.getElementById('start');
    const tutorialBtn = document.getElementById('tutorial');
    const attemptsDisplay = document.querySelector('.attempts');
    const yourScoreElement = document.querySelector('.leaderboard-item.you');
  
    // Configurações
    const CONFIG = {
      SHUFFLE_DURATION: 2000,
      SHOW_DELAY: 1000,
      CUP_SPACING: 130,
      REVEAL_DURATION: 2000
    };
  
    // Estado do jogo
    let visualPositions = [0, 1, 2]; // Ordem visual dos copos
    let ballPosition = 0;            // Posição real da bola
    let clickable = false;           // Se os copos podem ser clicados
    let attempts = 0;                // Número de tentativas
    let score = 0;                   // Pontuação do jogador
    let playerId = 'player' + Math.floor(Math.random() * 1000); // ID aleatório
  
    // Inicialização do jogo
    initGame();
  
    function initGame() {
      attemptsDisplay.textContent = `ID: ${playerId} • Tentativas: ${attempts}`;
      setupEventListeners();
      showBallBeforeShuffle();
      setStartButtonState(true);
    }
  
    function setupEventListeners() {
      startBtn.addEventListener('click', startGame);
      tutorialBtn.addEventListener('click', showTutorial);
      
      cups.forEach((cup, index) => {
        cup.addEventListener('click', () => handleCupClick(index));
      });
    }
  
    function setStartButtonState(enabled) {
      startBtn.disabled = !enabled;
      startBtn.style.opacity = enabled ? '1' : '0.5';
    }
  
    function resetCups() {
      cups.forEach(cup => {
        cup.classList.remove('reveal', 'lifted', 'wrong-choice');
        cup.querySelector('.ball').classList.add('hidden-ball');
        cup.style.left = '';
      });
    }
  
    function showBallBeforeShuffle() {
      resetCups();
      ballPosition = Math.floor(Math.random() * 3);
      const cup = cups[ballPosition];
      cup.classList.add('lifted');
      cup.querySelector('.ball').classList.remove('hidden-ball');
      updateCupPositions();
    }
  
    function updateCupPositions() {
      cups.forEach((cup, i) => {
        cup.style.left = `${visualPositions[i] * CONFIG.CUP_SPACING}px`;
      });
    }
  
    function shuffleVisualPositions() {
      for (let i = visualPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [visualPositions[i], visualPositions[j]] = [visualPositions[j], visualPositions[i]];
      }
    }
  
    function startGame() {
      showBallBeforeShuffle();
      setTimeout(() => {
        shuffleCups();
      }, CONFIG.SHOW_DELAY);
    }
  
    function shuffleCups() {
      clickable = false;
      setStartButtonState(false);
      resetCups();
  
      const startTime = Date.now();
      const shuffleInterval = setInterval(() => {
        shuffleVisualPositions();
        updateCupPositions();
      }, 200);
  
      setTimeout(() => {
        clearInterval(shuffleInterval);
        clickable = true;
        setStartButtonState(true);
        attempts++;
        attemptsDisplay.textContent = `ID: ${playerId} • Tentativas: ${attempts}`;
      }, CONFIG.SHUFFLE_DURATION);
    }
  
    function handleCupClick(physicalIndex) {
      if (!clickable) return;
      clickable = false;
  
      const visualIndex = visualPositions[physicalIndex];
      const isCorrect = visualIndex === ballPosition;
  
      // Primeiro esconde TODAS as bolas
      cups.forEach(cup => {
        cup.querySelector('.ball').classList.add('hidden-ball');
      });
  
      // Levanta TODOS os copos
      cups.forEach(cup => {
        cup.classList.add('reveal');
      });
  
      if (isCorrect) {
        // Se acertou: mostra apenas a bola no copo clicado
        cups[physicalIndex].querySelector('.ball').classList.remove('hidden-ball');
        score++;
        yourScoreElement.textContent = `25- Você (${score} pts)`;
      } else {
        // Se errou: mostra apenas a bola no copo correto
        cups.forEach((cup, idx) => {
          if (visualPositions[idx] === ballPosition) {
            cup.querySelector('.ball').classList.remove('hidden-ball');
          }
        });
        // Destaca o copo errado que foi clicado
        cups[physicalIndex].classList.add('wrong-choice');
      }
  
      setTimeout(() => {
        startGame();
      }, CONFIG.REVEAL_DURATION);
    }
  
    function showTutorial() {
      alert("Tutorial:\n\n1. Clique em JOGAR para começar\n2. Observe onde a bola está\n3. Após o embaralhamento, clique no copo onde acha que está a bola\n4. Tente acertar o máximo possível!");
    }
  });