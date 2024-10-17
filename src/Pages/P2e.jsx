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

import React, { useEffect, useState } from 'react';

const PlayToEarn = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Получаем userId из параметров или контекста приложения
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromTelegram = urlParams.get('userId');
    setUserId(userIdFromTelegram);
  }, []);

  const gameUrl = `https://octiesdev.github.io?userId=${userId}`;

  return (
    <div>
      {userId ? (
        <iframe src={gameUrl} width="800" height="600" title="Game" />
      ) : (
        <p>Loading game...</p>
      )}
    </div>
  );
};

export default PlayToEarn;