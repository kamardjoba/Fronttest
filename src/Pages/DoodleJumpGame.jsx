import React, { useRef, useEffect, useState } from 'react';
import doodlerRightSrc from '../IMG/Doodle_jump/MainCharacter_right.png';
import doodlerLeftSrc from '../IMG/Doodle_jump/MainCharacter_left.png';
import platformSrc from '../IMG/Doodle_jump/MainPlatform.png';
import backgroundSrc from '../IMG/Doodle_jump/Background_game.png';
import coinImgSrc from '../IMG/Doodle_jump/coin.png';
import disappearingPlatformSrc from '../IMG/Doodle_jump/OneTimePlatform.png';
import movingPlatformSrc from '../IMG/Doodle_jump/MovingPlatfotm.png';
import '../Css/doodlejump.css';





const DoodleJumpGame = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [showRestartButton, setShowRestartButton] = useState(false);

  // Размеры и объекты
  let boardWidth = window.innerWidth;
  let boardHeight = window.innerHeight;

  let doodlerWidth = 60;
  let doodlerHeight = 60;

  const doodlerRightImg = useRef(new Image());
  const doodlerLeftImg = useRef(new Image());
  const platformImg = useRef(new Image());
  const disappearingPlatformImg = useRef(new Image()); // Создаем ref для исчезающей платформы
  const movingPlatformImg = useRef(new Image()); // Создаем ref для движущейся платформы
  const coinImg = useRef(new Image()); // Создаем ref для изображения монеты

  const doodler = useRef({
    img: null,
    x: 0,
    y: 0,
    width: doodlerWidth,
    height: doodlerHeight,
  });

  // Физика
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const initialVelocityY = useRef(-15);
  const gravity = useRef(0.5);

  // Платформы
  const platformArray = useRef([]);
  let platformWidth = 85;
  let platformHeight = 20;

  const score = useRef(0);
  const maxScore = useRef(0);
  const gameOver = useRef(false);
  const coinsCollected = useRef(0); // Количество собранных монет

  // Загрузка изображений
  doodlerRightImg.current.src = doodlerRightSrc;
  doodlerLeftImg.current.src = doodlerLeftSrc;
  platformImg.current.src = platformSrc;
  disappearingPlatformImg.current.src = disappearingPlatformSrc; // Загрузка изображения исчезающей платформы
  movingPlatformImg.current.src = movingPlatformSrc; // Загрузка изображения движущейся платформы
  coinImg.current.src = coinImgSrc; // Загрузка изображения монеты

  doodler.current.img = doodlerRightImg.current;

  // Фоновое изображение
  const backgroundImg = useRef(new Image());
  backgroundImg.current.src = backgroundSrc;

  useEffect(() => {
    // Инициализация Canvas
    const board = canvasRef.current;
    const context = board.getContext('2d');
    contextRef.current = context; // Сохраняем контекст в ref
    board.width = boardWidth;
    board.height = boardHeight;

    backgroundImg.current.onload = function () {
      context.drawImage(backgroundImg.current, 0, 0, boardWidth, boardHeight);
    };

    velocityY.current = initialVelocityY.current;
    placePlatforms();
    requestAnimationFrame(update);

    // Обработка изменения размера окна
    const resizeCanvas = () => {
      boardWidth = window.innerWidth;
      boardHeight = window.innerHeight;
      board.width = boardWidth;
      board.height = boardHeight;

      // Перерисовываем фон
      contextRef.current.drawImage(
        backgroundImg.current,
        0,
        0,
        boardWidth,
        boardHeight
      );

      // Переразмещаем платформы
      placePlatforms();
    };

    window.addEventListener('resize', resizeCanvas);

    // Очищаем обработчики при размонтировании
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Функция обновления игры
  function update() {
    if (gameOver.current) {
      setShowRestartButton(true); // Показываем кнопку перезапуска
      return;
    }
    contextRef.current.clearRect(0, 0, boardWidth, boardHeight);

    // Отрисовка фона
    contextRef.current.drawImage(
      backgroundImg.current,
      0,
      0,
      boardWidth,
      boardHeight
    );

    // Обновление позиции дудлера
    doodler.current.x += velocityX.current;
    if (doodler.current.x > boardWidth) {
      doodler.current.x = 0 - doodler.current.width;
    } else if (doodler.current.x + doodler.current.width < 0) {
      doodler.current.x = boardWidth;
    }

    velocityY.current += gravity.current;
    doodler.current.y += velocityY.current;
    if (doodler.current.y > boardHeight) {
      gameOver.current = true;
    }
    contextRef.current.drawImage(
      doodler.current.img,
      doodler.current.x,
      doodler.current.y,
      doodler.current.width,
      doodler.current.height
    );

    // Обновление платформ
    for (let i = 0; i < platformArray.current.length; i++) {
      let platform = platformArray.current[i];
      if (
        velocityY.current < 0 &&
        doodler.current.y < boardHeight * 0.75
      ) {
        const displacement = -velocityY.current; // velocityY.current отрицательно, поэтому берем отрицательное значение
        platform.y += displacement;
        if (platform.coin) {
          platform.coin.y += displacement;
        }
      }

      // Обновление позиции по X для движущихся платформ
      if (platform.type === 'moving') {
        platform.x += platform.velocityX;

        // Изменение направления при достижении края экрана
        if (platform.x <= 0 || platform.x + platform.width >= boardWidth) {
          platform.velocityX *= -1; // Меняем направление движения
        }

        // Обновляем позицию монеты вместе с платформой
        if (platform.coin) {
          platform.coin.x += platform.velocityX;
        }
      }

      // Проверка столкновения с платформой
      if (
        detectCollision(doodler.current, platform) &&
        velocityY.current >= 0
      ) {
        velocityY.current = initialVelocityY.current;

        if (platform.type === 'disappearing') {
          // Удаляем платформу из массива
          platformArray.current.splice(i, 1);
          i--; // Корректируем индекс после удаления
          continue;
        }
      }

      contextRef.current.drawImage(
        platform.img,
        platform.x,
        platform.y,
        platform.width,
        platform.height
      );

      // Отрисовка монеты, если она есть на платформе
      if (platform.coin) {
        contextRef.current.drawImage(
          platform.coin.img,
          platform.coin.x,
          platform.coin.y,
          platform.coin.width,
          platform.coin.height
        );

        // Проверка столкновения с монетой
        if (detectCollision(doodler.current, platform.coin)) {
          coinsCollected.current += 1; // Увеличиваем счетчик монет
          platform.coin = null; // Убираем монету с платформы
        }
      }
    }

    // Удаление старых платформ и добавление новых
// Удаление старых платформ
for (let i = 0; i < platformArray.current.length; i++) {
  if (platformArray.current[i].y >= boardHeight) {
    platformArray.current.splice(i, 1);
    i--; // Корректируем индекс после удаления
  }
}

// Добавление новых платформ, если их недостаточно
const gapBetweenPlatforms = 100;
const numberOfPlatforms = Math.ceil(
  boardHeight / (platformHeight + gapBetweenPlatforms)
);
while (platformArray.current.length < numberOfPlatforms) {
  newPlatform();
}
    // Обновление счета
    updateScore();

    // Отображение счета
    contextRef.current.fillStyle = 'black';
    contextRef.current.font = `20px sans-serif`;
    contextRef.current.fillText(`Score: ${score.current}`, 5, 20);

    // Отображение количества собранных монет
    contextRef.current.fillText(
      `Coins: ${coinsCollected.current}`,
      5,
      45
    );

    requestAnimationFrame(update);
  }

  // Функция размещения платформ
  function placePlatforms() {
    platformArray.current = [];

    const gapBetweenPlatforms = 100;
    const numberOfPlatforms = Math.ceil(
      boardHeight / (platformHeight + gapBetweenPlatforms)
    );

    for (let i = 0; i < numberOfPlatforms; i++) {
      let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));

      let platformType = 'normal';
      const randomValue = Math.random();
      if (randomValue < 0.05) {
        // 5% шанс появления исчезающей платформы
        platformType = 'disappearing';
      } else if (randomValue >= 0.05 && randomValue < 0.10) {
        // 5% шанс появления движущейся платформы
        platformType = 'moving';
      }

      let platformImgToUse = platformImg.current;
      if (platformType === 'disappearing') {
        platformImgToUse = disappearingPlatformImg.current;
      } else if (platformType === 'moving') {
        platformImgToUse = movingPlatformImg.current; // Используйте другое изображение для движущейся платформы
      }

      let platform = {
        img: platformImgToUse,
        x: randomX,
        y:
          boardHeight -
          i * (platformHeight + gapBetweenPlatforms) -
          platformHeight,
        width: platformWidth,
        height: platformHeight,
        coin: null,
        type: platformType,
        velocityX: 0, // По умолчанию скорость по X равна 0
      };

      // Устанавливаем скорость для движущихся платформ
      if (platformType === 'moving') {
        platform.velocityX = Math.random() < 0.5 ? 2 : -2; // Случайное направление движения
      }

      // Случайное появление монеты (только на обычных платформах)
      if (platformType === 'normal' && Math.random() < 0.3) {
        platform.coin = {
          img: coinImg.current,
          x: platform.x + platform.width / 2 - 15,
          y: platform.y - 30,
          width: 30,
          height: 30,
        };
      }

      platformArray.current.push(platform);
    }

    // Устанавливаем дудлера на первую платформу
    let firstPlatform = platformArray.current[0];
    doodler.current.x =
      firstPlatform.x + firstPlatform.width / 2 - doodler.current.width / 2;
    doodler.current.y = firstPlatform.y - doodler.current.height;
  }

  // Функция создания новой платформы
  function newPlatform() {
    let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));

    let platformType = 'normal';
    const randomValue = Math.random();
    if (randomValue < 0.05) {
      // 5% шанс появления исчезающей платформы
      platformType = 'disappearing';
    } else if (randomValue >= 0.05 && randomValue < 0.10) {
      // 5% шанс появления движущейся платформы
      platformType = 'moving';
    }

    let platformImgToUse = platformImg.current;
    if (platformType === 'disappearing') {
      platformImgToUse = disappearingPlatformImg.current;
    } else if (platformType === 'moving') {
      platformImgToUse = movingPlatformImg.current; // Используйте другое изображение для движущейся платформы
    }

    let platform = {
      img: platformImgToUse,
      x: randomX,
      y: -platformHeight,
      width: platformWidth,
      height: platformHeight,
      coin: null,
      type: platformType,
      velocityX: 0, // По умолчанию скорость по X равна 0
    };

    // Устанавливаем скорость для движущихся платформ
    if (platformType === 'moving') {
      platform.velocityX = Math.random() < 0.5 ? 2 : -2; // Случайное направление движения
    }

    // Случайное появление монеты (только на обычных платформах)
    if (platformType === 'normal' && Math.random() < 0.3) {
      platform.coin = {
        img: coinImg.current,
        x: platform.x + platform.width / 2 - 15,
        y: platform.y - 30,
        width: 30,
        height: 30,
      };
    }

    platformArray.current.push(platform);
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
    if (velocityY.current < 0) {
      maxScore.current += points;
      if (score.current < maxScore.current) {
        score.current = maxScore.current;
      }
    } else if (velocityY.current >= 0) {
      maxScore.current -= points;
    }
  }

  // Функции управления
  function moveLeft(e) {
    e.preventDefault();
    if (gameOver.current) return;
    velocityX.current = -6;
    doodler.current.img = doodlerLeftImg.current;
  }

  function moveRight(e) {
    e.preventDefault();
    if (gameOver.current) return;
    velocityX.current = 6;
    doodler.current.img = doodlerRightImg.current;
  }

  function stopMoving(e) {
    e.preventDefault();
    if (gameOver.current) return;
    velocityX.current = 0;
  }

  function resetGame() {
    velocityX.current = 0;
    velocityY.current = initialVelocityY.current;
    score.current = 0;
    maxScore.current = 0;
    coinsCollected.current = 0; // Сбрасываем счетчик монет
    gameOver.current = false;
    placePlatforms();
    setShowRestartButton(false);
    requestAnimationFrame(update);
  }



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
      {/* MOVement */}
      <div className='movement-left'
        onTouchStart={moveLeft}
        onTouchEnd={stopMoving}
        onMouseDown={moveLeft}
        onMouseUp={stopMoving}
      ></div>
      <div className='movement-right'
        onTouchStart={moveRight}
        onTouchEnd={stopMoving}
        onMouseDown={moveRight}
        onMouseUp={stopMoving}
      ></div>
      {/* REstart */}
      {showRestartButton && (
        <div className='restart'>
          {/* Кнопка перезапуска */}
           <div className='restart_click' onClick={resetGame}>
            REstart
          </div>
          <div className='menu_click'>
            Main Menu
          </div>
        </div>
      )}
    </div>
  );
};

export default DoodleJumpGame;