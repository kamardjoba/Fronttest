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

import React from 'react';
import { useParams } from 'react-router-dom';

const DoodleJumpGame = () => {
  const { userId } = useParams(); // Извлекаем userId из параметров маршрута

  const gameUrl = `https://gameocties.netlify.app?userId=${userId}`;

  return (
    <div style={{ display: "flex", flex: 1 }}>
      <iframe style={{ flex: 1, border: "none", height: '90%' }} src={gameUrl} title="Game" />
    </div>
  );
};

export default DoodleJumpGame;


