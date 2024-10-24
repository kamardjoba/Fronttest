import React, { useEffect, useState } from 'react';

const DoodleJumpGame = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Получаем userId из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromTelegram = urlParams.get('userId');
    setUserId(userIdFromTelegram);
  }, []);

  const gameUrl = userId 
    ? `https://gameocties.netlify.app?userId=${userId}` 
    : "https://gameocties.netlify.app";

  return (
    <div style={{ display: "flex", flex: 1 }}>
      {userId ? (
        <iframe 
          style={{ flex: 1, border: "none", height: '90%' }} 
          src={gameUrl} 
          title="Game" 
        />
      ) : (
        <p>Загрузка игры...</p>
      )}
    </div>
  );
};

export default DoodleJumpGame;