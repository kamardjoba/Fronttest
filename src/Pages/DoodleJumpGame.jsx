import React, { useRef, useEffect, useState } from 'react';
import doodlerRightSrc from '../IMG/Doodle_jump/MainCharacter_right.png';
import doodlerLeftSrc from '../IMG/Doodle_jump/MainCharacter_left.png';
import platformSrc from '../IMG/Doodle_jump/MainPlatform.png';
import backgroundSrc from '../IMG/Doodle_jump/Background_game.png';
import coinImgSrc from '../IMG/Doodle_jump/coin.png';
import '../Css/doodlejump.css';





const DoodleJumpGame = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [showRestartButton, setShowRestartButton] = useState(false);

  let boardWidth = window.innerWidth;
  let boardHeight = window.innerHeight;

  let doodlerWidth = 60;
  let doodlerHeight = 60;

  const doodlerRightImg = useRef(new Image());
  const doodlerLeftImg = useRef(new Image());
  const platformImg = useRef(new Image());
  const coinImg = useRef(new Image());

  const doodler = useRef({
    img: null,
    x: 0,
    y: 0,
    width: doodlerWidth,
    height: doodlerHeight,
  });

  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const initialVelocityY = useRef(-15);
  const gravity = useRef(0.5);

  const platformArray = useRef([]);
  let platformWidth = 85;
  let platformHeight = 20;

  const score = useRef(0);
  const maxScore = useRef(0);
  const gameOver = useRef(false);
  const coinsCollected = useRef(0); 

  doodlerRightImg.current.src = doodlerRightSrc;
  doodlerLeftImg.current.src = doodlerLeftSrc;
  platformImg.current.src = platformSrc;
  coinImg.current.src = coinImgSrc;

  doodler.current.img = doodlerRightImg.current;

  const backgroundImg = useRef(new Image());
  backgroundImg.current.src = backgroundSrc;

  useEffect(() => {
    const board = canvasRef.current;
    const context = board.getContext('2d');
    contextRef.current = context; 
    board.width = boardWidth;
    board.height = boardHeight;

    backgroundImg.current.onload = function () {
      context.drawImage(backgroundImg.current, 0, 0, boardWidth, boardHeight);
    };

    velocityY.current = initialVelocityY.current;
    placePlatforms();
    requestAnimationFrame(update);

    const resizeCanvas = () => {
      boardWidth = window.innerWidth;
      boardHeight = window.innerHeight;
      board.width = boardWidth;
      board.height = boardHeight;

      contextRef.current.drawImage(
        backgroundImg.current,
        0,
        0,
        boardWidth,
        boardHeight
      );

      placePlatforms();
    };

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  function update() {
    if (gameOver.current) {
      setShowRestartButton(true);
      return;
    }
    contextRef.current.clearRect(0, 0, boardWidth, boardHeight);

    contextRef.current.drawImage(
      backgroundImg.current,
      0,
      0,
      boardWidth,
      boardHeight
    );

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

    for (let i = 0; i < platformArray.current.length; i++) {
      let platform = platformArray.current[i];
      if (
        velocityY.current < 0 &&
        doodler.current.y < boardHeight * 0.75
      ) {
        platform.y -= initialVelocityY.current;
        if (platform.coin) {
          platform.coin.y -= initialVelocityY.current;
        }
      }
      if (
        detectCollision(doodler.current, platform) &&
        velocityY.current >= 0
      ) {
        velocityY.current = initialVelocityY.current;
      }

      contextRef.current.drawImage(
        platform.img,
        platform.x,
        platform.y,
        platform.width,
        platform.height
      );

      if (platform.coin) {
        contextRef.current.drawImage(
          platform.coin.img,
          platform.coin.x,
          platform.coin.y,
          platform.coin.width,
          platform.coin.height
        );

        if (detectCollision(doodler.current, platform.coin)) {
          coinsCollected.current += 1; 
          platform.coin = null; 
        }
      }
    }

    while (
      platformArray.current.length > 0 &&
      platformArray.current[0].y >= boardHeight
    ) {
      platformArray.current.shift();
      newPlatform();
    }

    updateScore();

    contextRef.current.fillStyle = 'black';
    contextRef.current.font = `20px sans-serif`;
    contextRef.current.fillText(`Score: ${score.current}`, 5, 20);

    contextRef.current.fillText(
      `Coins: ${coinsCollected.current}`,
      5,
      45
    );

    requestAnimationFrame(update);
  }

  function placePlatforms() {
    platformArray.current = [];

    const gapBetweenPlatforms = 100;
    const numberOfPlatforms = Math.ceil(
      boardHeight / (platformHeight + gapBetweenPlatforms)
    );

    for (let i = 0; i < numberOfPlatforms; i++) {
      let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));

      let platform = {
        img: platformImg.current,
        x: randomX,
        y:
          boardHeight -
          i * (platformHeight + gapBetweenPlatforms) -
          platformHeight,
        width: platformWidth,
        height: platformHeight,
        coin: null,
      };

      if (Math.random() < 0.01) {
        // 30% вероятность появления монеты
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

    let firstPlatform = platformArray.current[0];
    doodler.current.x =
      firstPlatform.x + firstPlatform.width / 2 - doodler.current.width / 2;
    doodler.current.y = firstPlatform.y - doodler.current.height;
  }

  function newPlatform() {
    let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));
    let platform = {
      img: platformImg.current,
      x: randomX,
      y: -platformHeight,
      width: platformWidth,
      height: platformHeight,
      coin: null,
    };

    // Случайным образом решаем, будет ли монета на платформе
    if (Math.random() < 0.3) {
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
    if (velocityY.current < 0) {
      maxScore.current += points;
      if (score.current < maxScore.current) {
        score.current = maxScore.current;
      }
    } else if (velocityY.current >= 0) {
      maxScore.current -= points;
    }
  }

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
    coinsCollected.current = 0;
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
        </div>
      )}
    </div>
  );
};

export default DoodleJumpGame;