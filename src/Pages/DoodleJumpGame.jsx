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
      document.addEventListener('keydown', moveDoodler);
  
      // Добавляем обработчики событий касания
      board.addEventListener('touchstart', handleTouchStart, { passive: false });
      board.addEventListener('touchmove', handleTouchMove, { passive: false });
      board.addEventListener('touchend', handleTouchEnd, { passive: false });
  
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
        document.removeEventListener('keydown', moveDoodler);
        board.removeEventListener('touchstart', handleTouchStart);
        board.removeEventListener('touchmove', handleTouchMove);
        board.removeEventListener('touchend', handleTouchEnd);
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
            "Game Over: Press 'Space' or Tap to Restart",
            boardWidth / 7,
            boardHeight * 0.875
          );
        } else {
          requestAnimationFrame(update);
        }
      }
  
      // Функция управления дудлером с клавиатуры
      function moveDoodler(e) {
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          velocityX = 6; // Фиксированная скорость
          doodler.img = doodlerRightImg;
        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          velocityX = -6;
          doodler.img = doodlerLeftImg;
        } else if (e.code === 'Space' && gameOver) {
          // Сброс игры
          resetGame();
        }
      }
  
      // Обработчики событий касания
      let touchX = null;
  
      function handleTouchStart(e) {
        e.preventDefault();
        touchX = e.touches[0].clientX;
        if (gameOver) {
          resetGame();
        } else {
          updateDoodlerDirection(touchX);
        }
      }
  
      function handleTouchMove(e) {
        e.preventDefault();
        touchX = e.touches[0].clientX;
        updateDoodlerDirection(touchX);
      }
  
      function handleTouchEnd(e) {
        e.preventDefault();
        velocityX = 0; // Останавливаем дудлера при прекращении касания
      }
  
      function updateDoodlerDirection(touchPositionX) {
        if (touchPositionX < boardWidth / 2) {
          // Касание слева от центра экрана - двигаем влево
          velocityX = -6;
          doodler.img = doodlerLeftImg;
        } else {
          // Касание справа от центра экрана - двигаем вправо
          velocityX = 6;
          doodler.img = doodlerRightImg;
        }
      }
  
      // Функция сброса игры
      function resetGame() {
        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
        requestAnimationFrame(update);
      }
  
      // Функция размещения платформ
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

    function handleButtonPress(direction) {
        if (direction === 'left') {
          velocityX = -6;
          doodler.img = doodlerLeftImg;
        } else if (direction === 'right') {
          velocityX = 6;
          doodler.img = doodlerRightImg;
        }
      }
      
      function handleButtonRelease() {
        velocityX = 0;
      }
  
    return (
        <div style={{ position: 'relative' }}>
          <canvas
            id="board"
            ref={canvasRef}
            style={{
              display: 'block',
              margin: '0 auto',
              touchAction: 'none',
            }}
          ></canvas>
          <div style={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>
            <button
              onTouchStart={() => handleButtonPress('left')}
              onTouchEnd={handleButtonRelease}
              style={{ fontSize: 30, marginRight: 50 }}
            >
              ⬅️
            </button>
            <button
              onTouchStart={() => handleButtonPress('right')}
              onTouchEnd={handleButtonRelease}
              style={{ fontSize: 30 }}
            >
              ➡️
            </button>
          </div>
        </div>
      );
    };
  
  export default DoodleJumpGame;