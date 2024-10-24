import React from 'react';

const DoodleJumpGame = ({ userId }) => {
  // Формируем URL игры с параметром userId
  const gameUrl = userId 
    ? `https://gameocties.netlify.app?userId=${userId}` 
    : "https://gameocties.netlify.app";

  return (
    <div style={{ display: "flex", flex: 1, height: '100vh' }}>
      {userId ? (
        <iframe 
          style={{ flex: 1, border: "none", height: '100%' }} 
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