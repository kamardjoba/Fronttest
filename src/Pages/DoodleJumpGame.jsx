// import React from 'react';
// import '../Css/P2e.css';

// const PlayToEarn = () => {

//     return (
//         <div className='P2E_Window'>
//             <iframe 
//                 src="https://octiesdev.github.io/test_game_v8/" 
//                 width="100%" 
//                 height="100%" 
//                 style={{ border: 'none' }}
//             />
//         </div>
//     );
// }

// export default PlayToEarn;

import { useEffect, useState } from 'react';

const DoodleJumpGame = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Получаем userId из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromTelegram = urlParams.get('userId');
    setUserId(userIdFromTelegram);
  }, []);

  // Формируем URL для игры с переданным userId
  const gameUrl = userId ? `https://gameocties.netlify.app?userId=${userId}` : 'https://gameocties.netlify.app';

  return (
    <div style={{ display: "flex", flex: 1 }}>
      {userId ? (
        // Передаём userId в iframe через URL
        <iframe style={{ flex: 1, border: "none", height: '90%' }} src={gameUrl} title="Game" />
      ) : (
        <p>Loading game...</p>
      )}
    </div>
  );
};

export default DoodleJumpGame;

