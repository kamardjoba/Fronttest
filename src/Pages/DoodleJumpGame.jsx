import React, { useRef, useEffect } from 'react';
import doodlerRightSrc from '../IMG/Doodle_jump/doodler-right.png';
import doodlerLeftSrc from '../IMG/Doodle_jump/doodler-left.png';
import platformSrc from '../IMG/Doodle_jump/platform.png';
import backgroundSrc from '../IMG/Doodle_jump/doodlejumpbg.png';
import '../Css/doodlejump.css';


const DoodleJumpGame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Инициализация Canvas
    const board = canvasRef.current;
    const context = board.getContext('2d');
    let boardWidth = window.innerWidth;
    let boardHeight = window.innerHeight;
    board.width = boardWidth;
    board.height = boardHeight;

    // Размеры и объекты
    let doodlerWidth = 60; // Фиксированная ширина дудлера
    let doodlerHeight = 60; // Фиксированная высота дудлера
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
    let initialVelocityY = -15; // Фиксированная скорость прыжка
    let gravity = 0.5;          // Фиксированная гравитация

    // Платформы
    let platformArray = [];
    let platformWidth = 85;  // Фиксированная ширина платформы
    let platformHeight = 20; // Фиксированная высота платформы

    let score = 0;
    let maxScore = 0;
    let gameOver = false;

    // Загрузка изображений
    doodlerRightImg.src = doodlerRightSrc;
    doodlerLeftImg.src = doodlerLeftSrc;
    platformImg.src = platformSrc;

    doodler.img = doodlerRightImg;

    // Фоновое изображение
    const backgroundImg = new Image();
    backgroundImg.src = backgroundSrc;

    backgroundImg.onload = function () {
      context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);
    };

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener('keydown', moveDoodlerKeyDown);
    document.addEventListener('keyup', moveDoodlerKeyUp);

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
      document.removeEventListener('keydown', moveDoodlerKeyDown);
      document.removeEventListener('keyup', moveDoodlerKeyUp);
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
          "Game Over: Press 'Space' to Restart",
          boardWidth / 7,
          boardHeight * 0.875
        );
      } else {
        requestAnimationFrame(update);
      }
    }

    // Функция управления дудлером с клавиатуры
    function moveDoodlerKeyDown(e) {
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        velocityX = 6; // Фиксированная скорость
        doodler.img = doodlerRightImg;
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        velocityX = -6;
        doodler.img = doodlerLeftImg;
      } else if (e.code === 'Space' && gameOver) {
        // Сброс игры
        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
        requestAnimationFrame(update);
      }
    }

    function moveDoodlerKeyUp(e) {
      if (
        e.code === 'ArrowRight' ||
        e.code === 'KeyD' ||
        e.code === 'ArrowLeft' ||
        e.code === 'KeyA'
      ) {
        velocityX = 0;
      }
    }

    // Функции управления для сенсорных событий
    function moveLeftStart() {
      velocityX = -6; // Та же скорость, что и при нажатии клавиши
      doodler.img = doodlerLeftImg;
    }

    function moveLeftEnd() {
      velocityX = 0;
    }

    function moveRightStart() {
      velocityX = 6;
      doodler.img = doodlerRightImg;
    }

    function moveRightEnd() {
      velocityX = 0;
    }

    // Остальные функции остаются без изменений (placePlatforms, newPlatform, detectCollision, updateScore)

    function placePlatforms() {
      platformArray = [];

      const gapBetweenPlatforms = 100; // Зазор между платформами
      const numberOfPlatforms = Math.ceil(boardHeight / (platformHeight + gapBetweenPlatforms));

      for (let i = 0; i < numberOfPlatforms; i++) {
        let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));

        let platform = {
          img: platformImg,
          x: randomX,
          y: boardHeight - i * (platformHeight + gapBetweenPlatforms) - platformHeight,
          width: platformWidth,
          height: platformHeight,
        };

        platformArray.push(platform);
      }

      // Устанавливаем дудлера на первую платформу
      let firstPlatform = platformArray[0];
      doodler.x = firstPlatform.x + firstPlatform.width / 2 - doodler.width / 2;
      doodler.y = firstPlatform.y - doodler.height;
    }

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

    function detectCollision(a, b) {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    }

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

  // Возвращаем JSX с кнопками
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        id="board"
        ref={canvasRef}
        style={{
          display: 'block',
          margin: '0 auto',
        }}
      ></canvas>
      {/* Кнопка "Влево" */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: '20%',
          height: '20%',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '50%',
        }}
        onTouchStart={moveLeftStart}
        onTouchEnd={moveLeftEnd}
      ></div>
      {/* Кнопка "Вправо" */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '20%',
          height: '20%',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '50%',
        }}
        onTouchStart={moveRightStart}
        onTouchEnd={moveRightEnd}
      ></div>
    </div>
  );
};

export default DoodleJumpGame;