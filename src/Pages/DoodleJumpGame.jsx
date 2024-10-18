import React, { useRef, useEffect } from 'react';
import doodlerRightSrc from '../IMG/Doodle_jump/MainCharacter_right.png';
import doodlerLeftSrc from '../IMG/Doodle_jump/MainCharacter_left.png';
import platformSrc from '../IMG/Doodle_jump/platform.png';
import backgroundSrc from '../IMG/Doodle_jump/Background_game.png';
import '../Css/doodlejump.css';




const DoodleJumpGame = () => {
  const canvasRef = useRef(null);

  // Размеры и объекты
  let boardWidth = window.innerWidth;
  let boardHeight = window.innerHeight;

  let doodlerWidth = 60;
  let doodlerHeight = 60;
  let doodlerRightImg = new Image();
  let doodlerLeftImg = new Image();
  let platformImg = new Image();

  let doodler = {
    img: null,
    x: 0,
    y: 0,
    width: doodlerWidth,
    height: doodlerHeight,
  };

  // Физика
  let velocityX = 0;
  let velocityY = 0;
  let initialVelocityY = -15;
  let gravity = 0.5;

  // Платформы
  let platformArray = [];
  let platformWidth = 85;
  let platformHeight = 20;

  let score = 0;
  let maxScore = 0;
  let gameOver = false;
  let touchStarted = false;

  // Загрузка изображений
  doodlerRightImg.src = doodlerRightSrc;
  doodlerLeftImg.src = doodlerLeftSrc;
  platformImg.src = platformSrc;

  doodler.img = doodlerRightImg;

  // Фоновое изображение
  const backgroundImg = new Image();
  backgroundImg.src = backgroundSrc;

  // Функции управления
  function moveLeft(e) {
    e.preventDefault();
    if (gameOver && !touchStarted) {
      // Сброс игры при касании после окончания
      resetGame();
      return;
    }
    velocityX = -6;
    doodler.img = doodlerLeftImg;
  }

  function moveRight(e) {
    e.preventDefault();
    if (gameOver && !touchStarted) {
      // Сброс игры при касании после окончания
      resetGame();
      return;
    }
    velocityX = 6;
    doodler.img = doodlerRightImg;
  }

  function stopMoving(e) {
    e.preventDefault();
    velocityX = 0;
  }

  function resetGame() {
    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
    requestAnimationFrame(update);
    touchStarted = true;
  }

  useEffect(() => {
    // Инициализация Canvas
    const board = canvasRef.current;
    const context = board.getContext('2d');
    board.width = boardWidth;
    board.height = boardHeight;

    backgroundImg.onload = function () {
      context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);
    };

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);

    // Обработка изменения размера окна
    const resizeCanvas = () => {
      boardWidth = window.innerWidth;
      boardHeight = window.innerHeight;
      board.width = boardWidth;
      board.height = boardHeight;

      // Перерисовываем фон
      context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);

      // Переразмещаем платформы
      placePlatforms();
    };

    window.addEventListener('resize', resizeCanvas);

    // Очищаем обработчики при размонтировании
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };

    // Функция обновления игры
    function update() {
      if (gameOver) {
        return;
      }
      context.clearRect(0, 0, board.width, board.height);

      // Отрисовка фона
      context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);

      // Обновление позиции дудлера
      doodler.x += velocityX;
      if (doodler.x > boardWidth) {
        doodler.x = 0 - doodler.width;
      } else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
      }

      velocityY += gravity;
      doodler.y += velocityY;
      if (doodler.y > board.height) {
        gameOver = true;
      }
      context.drawImage(
        doodler.img,
        doodler.x,
        doodler.y,
        doodler.width,
        doodler.height
      );

      // Обновление платформ
      for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight * 0.75) {
          platform.y -= initialVelocityY;
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
          velocityY = initialVelocityY;
        }
        context.drawImage(
          platform.img,
          platform.x,
          platform.y,
          platform.width,
          platform.height
        );
      }

      // Удаление старых платформ и добавление новых
      while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift();
        newPlatform();
      }

      // Обновление счета
      updateScore();
      context.fillStyle = 'black';
      context.font = `20px sans-serif`;
      context.fillText(score, 5, 20);

      if (gameOver) {
        context.fillText(
          "Game Over: Tap to Restart",
          boardWidth / 7,
          boardHeight * 0.875
        );
      } else {
        requestAnimationFrame(update);
      }
    }

    // Функция размещения платформ
    function placePlatforms() {
      platformArray = [];

      const gapBetweenPlatforms = 100;
      const numberOfPlatforms = Math.ceil(
        boardHeight / (platformHeight + gapBetweenPlatforms)
      );

      for (let i = 0; i < numberOfPlatforms; i++) {
        let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));

        let platform = {
          img: platformImg,
          x: randomX,
          y:
            boardHeight -
            i * (platformHeight + gapBetweenPlatforms) -
            platformHeight,
          width: platformWidth,
          height: platformHeight,
        };

        platformArray.push(platform);
      }

      // Устанавливаем дудлера на первую платформу
      let firstPlatform = platformArray[0];
      doodler.x =
        firstPlatform.x + firstPlatform.width / 2 - doodler.width / 2;
      doodler.y = firstPlatform.y - doodler.height;
    }

    // Функция создания новой платформы
    function newPlatform() {
      let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));
      let platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight,
      };

      platformArray.push(platform);
    }

    // Функция обнаружения столкновения
    function detectCollision(a, b) {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    }

    // Функция обновления счета
    function updateScore() {
      let points = Math.floor(50 * Math.random());
      if (velocityY < 0) {
        maxScore += points;
        if (score < maxScore) {
          score = maxScore;
        }
      } else if (velocityY >= 0) {
        maxScore -= points;
      }
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        id="board"
        ref={canvasRef}
        style={{
          display: 'block',
          margin: '0 auto',
          touchAction: 'none',
        }}
      ></canvas>
      {/* Кнопки управления */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          // backgroundColor: 'rgba(255, 0, 0, 0.1)', // Можно раскомментировать для отладки
        }}
        onTouchStart={moveLeft}
        onTouchEnd={stopMoving}
        onMouseDown={moveLeft}
        onMouseUp={stopMoving}
      ></div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          // backgroundColor: 'rgba(0, 0, 255, 0.1)', // Можно раскомментировать для отладки
        }}
        onTouchStart={moveRight}
        onTouchEnd={stopMoving}
        onMouseDown={moveRight}
        onMouseUp={stopMoving}
      ></div>
    </div>
  );
};

export default DoodleJumpGame;