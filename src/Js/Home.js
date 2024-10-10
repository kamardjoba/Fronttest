import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../Css/App.css';
import { Reward_Age, Reward_Premium, Reward_Chanel,
         Reward_Invite, Reward_X, Reward_PartnerChanels,
         Reward_NFT, Reward_Nick, Reward_pass,
         Reward_pass_ticket,  Reward_hz_sho_ce_kakoito_karandash,
         Reward_racketa} from "../IMG/Reward_icon";


//import image SwapTask
import AnyTapChanel from '../IMG/All_Logo/AnyTapChanel.png';
import tgLogo from '../IMG/All_Logo/TgComunity.png';
import XLogo from '../IMG/All_Logo/XCominity.png';
// import FreePosition from '../IMG/All_Logo/freePosiction.png';
import NickLogo from '../IMG/All_Logo/nick.png';
//import image SupportSwapTask
import galo4ka from '../IMG/All_Logo/galol4ka.png';
import nickGalka from '../IMG/All_Logo/galka.png';
import nickKr from '../IMG/All_Logo/nickNema.png';
// import ContactUs from '../IMG/All_Logo/ContactUs.png';
import Join from '../IMG/All_Logo/Join.png';
import Watch from '../IMG/All_Logo/watch.png';
import racketaMain from '../IMG/All_Logo/karandash_in_hand.png';
//import image Main
import Ellipse from '../IMG/All_Logo/Ellipse.png';
import Logo from '../IMG/All_Logo/Logo.png';
import Play from '../IMG/All_Logo/Play.png';
import Octo from '../IMG/All_Logo/Octo.png';
import NFTm from '../IMG/All_Logo/NFTmint.png';
// import beeVerse from '../IMG/All_Logo/BeeVerse.png';
import clock from '../IMG/All_Logo/clock.png';

function Home({Galo4ka, Knopka, Galo4kaX, KnopkaX,  GalkaAnyTap, KnopkaAnyTap, KnopkaNick, 
    Ton5Succes, hasTelegramPremium, accountAgeCoins, transactionNumber,
     coins, setYearsOpen, isMint, subscriptionCoins, referralCoins, REACT_APP_BACKEND_URL,  userId, checkSubscriptionAndUpdate , setCoins,
     Galo4kaBee, setGalo4kaBee, KnopkaBee, setKnopkaBee

 }) {

  const TG_CHANNEL_LINK = "https://t.me/octies_community";
  const TG_CHANNEL_LINK2 = "https://t.me/any_tap";
  const X_LINK = "https://x.com/Octies_GameFI";
  // const Support = "https://t.me/octies_manage";
  // const bot_part = "https://t.me/bee_verse_bot?start=7236554978";

  const userId1 = new URLSearchParams(window.location.search).get('userId');
  const AdControllerRef = useRef(null);

  useEffect(() => {
    if (window.Adsgram) {
        AdControllerRef.current = window.Adsgram.init({
            blockId: "2682", // замените на ваш реальный blockId
            debug: false, // отключите в продакшене
            debugBannerType: "FullscreenMedia" // тип тестового баннера, если debug включен
        });
    }
}, []); // пустой массив зависимостей для выполнения только один раз

const showAd = async () => {
  try {

          if (AdControllerRef.current) {
              AdControllerRef.current.show()
                  .then(async (result) => {
                      if (result.done) {
                          console.log('Пользователь досмотрел рекламу до конца');
                      }
                  })
                  .catch((error) => {
                      console.error('Ошибка при показе рекламы:', error);
                  });
          } else {
              console.error('AdsGram SDK не загружен');
          }
      
  } catch (error) {
      console.error('Ошибка при запросе количества просмотренной рекламы:', error);
  }
};

  function handleOpenStoryWithVibration() {
    setYearsOpen(true);
    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
  }


  const Tg_Channel_Open_chek = () => {
    const userId = new URLSearchParams(window.location.search).get('userId');
    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    window.open(TG_CHANNEL_LINK, '_blank');
    setTimeout(() => {
      checkSubscriptionAndUpdate(userId);
    }, 3000);
  };

  const Tg_Channel_Open_chek2 = () => {
    const userId = new URLSearchParams(window.location.search).get('userId');
    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    window.open(TG_CHANNEL_LINK2, '_blank');
    setTimeout(() => {
      checkSubscriptionAndUpdate(userId);
    }, 3000);
  };

  // const Tg_Channel_Support = () => {
  //   const userId = new URLSearchParams(window.location.search).get('userId');
  //   window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
  //   window.open(Support, '_blank');
  //   setTimeout(() => {
  //     checkSubscriptionAndUpdate(userId);
  //   }, 3000);
  // };

  const Tg_Channel_Open_X = async () => {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    console.log('Отправляемый userId:', userId1);  
    window.open(X_LINK, '_blank');
    setTimeout(async () => {
      if (localStorage.getItem('KnopkaX') === 'true') {
        localStorage.setItem('KnopkaX', 'false');
        localStorage.setItem('GalkaX', 'true');
        try {
          const response = await axios.post(`${REACT_APP_BACKEND_URL}/update-coins`, { userId: userId1, amount: 500 });
          if (response.data.success) {
            setCoins(response.data.coins);
            if (response.data.hasReceivedTwitterReward) {
              localStorage.setItem('hasReceivedTwitterReward', 'true');
              setCoins(response.data.coins);
            }
          } else {
            console.error('Ошибка при обновлении монет:', response.data.message);
          }
        } catch (error) {
          console.error('Ошибка при обновлении монет:', error);
        }
      }
    }, 5000);
  };


  const [ads] = useState(true);
  // const Open_Ads = async () => {
  //   setads(false);
  //   window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
   
  //   setTimeout(async () => {
  //     setads(true);
  //   }, 5000);
  // };

  
  // const Tg_Bot_Bee = async () => {
  //   window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
  //   console.log('Отправляемый userId:', userId);  
  //   window.open(bot_part, '_blank');
  //   setTimeout(async () => {
  //     if (localStorage.getItem('KnopkaBee') === 'true') {
  //       localStorage.setItem('KnopkaBee', 'false');
  //       localStorage.setItem('Galo4kaBee', 'true');
  //       setGalo4kaBee(true);
  //       setKnopkaBee(false);
  //       try {
  //         const response = await axios.post(`${REACT_APP_BACKEND_URL}/update-coins-bot`, { userId: userId, amount: 750 });
  //         if (response.data.success) {
  //           setCoins(response.data.coins);
  //           if (response.data.hasBotSub) {
  //             localStorage.setItem('hasBotSub', 'true');
  //             setCoins(response.data.coins);
  //             console.log('Отправляемый userId:успех');  
  //           }
  //         } else {
  //           console.error('Ошибка при обновлении монет:', response.data.message);
  //         }
  //       } catch (error) {
  //         console.error('Ошибка при обновлении монет:', error);
  //       }
  //     }
  //   }, 5000);};
  // window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
  // setTimeout(async () => {
    
  //     setGalo4kaBee(true);
  //     setKnopkaBee(false);
    
  // }, 5000);

//_______________________________________________________________Task_Swap
const blockRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
const [blockVisibility, setBlockVisibility] = useState([false, false, false, false]);

useEffect(() => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      const index = blockRefs.findIndex(ref => ref.current === entry.target);
      if (index !== -1) {
        setBlockVisibility(prevVisibility => {
          const newVisibility = [...prevVisibility];
          newVisibility[index] = entry.isIntersecting;
          return newVisibility;
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  blockRefs.forEach(ref => {
    if (ref.current) {
      observer.observe(ref.current);
    }
  });

  return () => {
    blockRefs.forEach(ref => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    });
  };
}, );

const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Set the interval to update the time every second
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    // Cleanup the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);
//_______________________________________________________________________________________

    return (
        <div className="mainHome">
               <div className="info">
        <img src={Logo} alt='Logo' />
        <div className='Txt' onClick={handleOpenStoryWithVibration}>
          <img src={Play} alt='Play' />
          <p>Your Score</p>
        </div>
      </div>
      {!isMint && <div className="main">
        <img src={Octo} alt='Octo' onClick={(event) => {localStorage.clear()}}/>
      </div>}
      {!isMint &&<div className='MainCoin'>
        
        {coins === 0 ? <p>Loading...</p> : <p>{coins.toLocaleString('en-US')} $OCTIES</p>}
      
      </div>}
      {isMint &&<div className='MintCoin'>
        <img src={NFTm} alt='NFTm'/>
        <p id='endtxt'> {coins === 0 ? <p>Loading...</p> : <p>{coins.toLocaleString('en-US')}</p>} <span id='highlight'>{transactionNumber}</span> $OCTIES</p>
      </div>}

      <div className='Menu'>

        <div className='AdsGramBorder'>
        
            
              <div className='rightFlex' id='rightFlexAds'>
                <div id='upAds'>
                  <div className='ForClock'>
                    <p>DAILY QUEST <span id='highgreen'>20</span>/20</p>
                    <div className='Dailytimer'>
                      <img src={clock} alt=''/>
                      <p>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                   
                  </div>
                  
                </div>
                <div  id='dpAds'>
                  <p>Watch ads to farm $OCTIES and earn a <br/>special reward by viewing all 20 daily!</p>
                </div> 
                <div className='MenuBtn' id='AdsMenu'>
                {ads && (<img onClick={showAd} src={Watch} alt='' />)}
                {!ads && 
                 <div className='Clocktimer'>
                   <img src={clock} id='clockimg' alt=''/>
                   <p>3:00</p>
                 </div>
               
                  
                  }
                <p>+35 $OCTIES for<span id='highlight'> view </span></p>   
                </div>
                <img src={racketaMain} id='telefon' alt=''/>
              </div>
          
        </div>
        <div className='Skroll_Menu_Border'>

          <div className='MenuBorder' ref={blockRefs[0]}>
            <div className='flex_menu_border' id='lightGreenBack'>
              <div className='rightFlex'>
                <div  id='up'>
                  <p>OCTIES COMMUNITY</p>
                </div>
                <div  id='dp'>
                  <p>Home for Telegram OCs</p>
                </div> 
                <div className='MenuBtn'>
                  {Knopka && <img onClick={Tg_Channel_Open_chek} src={Join} alt='Join' />}
                  <p id='lightGray'> {Knopka && <p id="plus">+</p>}1,000 $OCTIES</p>
                  {Galo4ka && <img id="galo4ka" src={galo4ka} alt='' />}
                </div>
              </div>
              <div className='leftFlex'>
                <img src={tgLogo} alt=''/>
              </div>
            </div>
          </div>

          <div className='MenuBorder' ref={blockRefs[1]}>
            <div className='flex_menu_border'>
              <div className='rightFlex'>
                <div  id='up'>
                  <p>OCTIES X</p>
                </div>
                <div  id='dp'>
                  <p>Home for X OCs</p>
                </div> 
                <div className='MenuBtn'>
                  {KnopkaX && <img onClick={Tg_Channel_Open_X} src={Join} alt='Join' />}
                  <p> {KnopkaX && <p id="plus">+</p>}500 $OCTIES</p>
                  {Galo4kaX && <img id="galo4ka" src={galo4ka} alt='' />}
                </div>
              </div>
              <div className='leftFlex'>
                <img src={XLogo} alt=''/>
              </div>
            </div>
          </div>

          <div className='MenuBorder' ref={blockRefs[2]}>
            <div className='flex_menu_border'  id='orangeBack'>
              <div className='rightFlex'>
                <div id='up'>
                  <p >AnyTap Community</p>
                </div>
                <div id='dpp'>
                  <p>Complete tasks, earn rewards, and join <br/>the on-chain community.</p>
                </div>
                <div className='MenuBtn'>
                  {KnopkaAnyTap && <img onClick={Tg_Channel_Open_chek2} src={Join} alt='Join' />}
                  <p> {KnopkaAnyTap && <p id="plus">+</p>}750 $OCTIES</p>
                  {GalkaAnyTap && <img id="galo4ka" src={galo4ka} alt='' />}
                </div>
              </div>
              <div className='leftFlex'>
                <img src={AnyTapChanel} alt=''/>
              </div>
            </div>
          </div>
          
          {/* <div className='MenuBorder' ref={blockRefs[3]}>
            <div className='flex_menu_border'  id='orangeBack'>
              <div className='rightFlex'>
                <div id='up'>
                  <p >BeeVerse</p>
                </div>
                <div id='dp'>
                  <p>Defeat boss, earn real money rewards</p>
                </div>
                <div className='MenuBtn'>
                  {KnopkaBee && <img onClick={Tg_Bot_Bee} src={Join} alt='Join' />}
                  <p> {KnopkaBee && <p id="plus">+</p>}750 $OCTIES</p>
                  {Galo4kaBee && <img id="galo4ka" src={galo4ka} alt='' />}
                </div>
              </div>
              <div className='leftFlex'>
                <img src={beeVerse} alt=''/>
              </div>
            </div>
          </div>

          <div className='MenuBorder' ref={blockRefs[4]}>
            <div className='flex_menu_border' id='greenBack'>
              <div className='rightFlex'>
                <div  id='up'>
                  <p>Available Partner Space</p>
                </div>
                <div  id='dp'>
                  <p>Your proposition</p>
                </div> 
                <div className='MenuBtn'>
                  <img onClick={Tg_Channel_Support} src={ContactUs} alt='ContactUs' />
                  <p>+??? $OCTIES</p>
                </div>
              </div>
              <div className='leftFlex'>
                <img src={FreePosition} alt=''/>
              </div>
            </div>
          </div> */}

          <div className='MenuBorder' ref={blockRefs[3]}>
            <div className='flex_menu_border'>
              <div className='rightFlex'>
              <div id='up'>
                <p>OCTIES NICKNAME</p>
              </div>
              <div id='dpp'>
                <p>Add the word “Octies” to <br/>your nickname.</p>
              </div>
                <div className='MenuBtn'>
                  {KnopkaNick &&  <div className='nickDiv'>
                    <p><img src={nickGalka} alt=''/><span id='Greentxt'>Completed </span>300 $OCTIES</p>  
                  </div>}
                  {!KnopkaNick &&  <div className='nickDiv'>
                    <p><img src={nickKr} alt=''/><span id='Redtxt'>Not completed</span>+300 $OCTIES</p>  
                  </div>}
                </div>
              </div>
              <div className='leftFlex' id='nick'>
                <img src={NickLogo} alt=''/>
              </div>
             </div>
          </div>      

        </div>
        <div className='Reward'>
          <div className='EllipsSkroll'>
            <img src={Ellipse} alt='Ellips' className={blockVisibility[0] ? '' : 'img-dark'} />
            <img src={Ellipse} alt='Ellips' className={blockVisibility[1] ? '' : 'img-dark'} />
            <img src={Ellipse} alt='Ellips' className={blockVisibility[2] ? '' : 'img-dark'} />
            <img src={Ellipse} alt='Ellips' className={blockVisibility[3] ? '' : 'img-dark'} />
            {/* <img src={Ellipse} alt='Ellips' className={blockVisibility[4] ? '' : 'img-dark'} />
            <img src={Ellipse} alt='Ellips' className={blockVisibility[5] ? '' : 'img-dark'} /> */}
          </div>
          <p>Your Rewards</p>
        </div>
        <div className='Tasks' id={isMint ? 'TaskswithoutNft' : undefined}>
          
        <div className='TS'>
            <div className='tsPhoto'>
              <img src={Reward_hz_sho_ce_kakoito_karandash} alt='' /> <p>Special reward</p>
            </div>
            <div className='tsPhoto'>
              <p id='highpurple' ><img src={Reward_racketa} id='Reward_racketa' alt='' />+ 1 ADS</p>
            </div>
          </div>


          {Ton5Succes > 0 &&(<div className='TS'>
            <div className='tsPhoto'>
              <img src={Reward_pass} alt='' /> <p>Unique pass</p>
            </div>
            <div className='tsPhoto'>
              <p id='highpink' ><img src={Reward_pass_ticket} id='pass' alt='' />+{Ton5Succes} PASS</p>
            </div>
          </div>)}

          {isMint && <div className='TS'>
            <div className='tsPhoto'>
              <img src={Reward_NFT} alt='' /> <p>OCTIES NFT</p>
            </div>
            <div className='tsPhoto'>
              <p id='highlight' >+1 NFT</p>
            </div>
          </div>}

          {subscriptionCoins > 0 && <div className='TS'>
            <div className='tsPhoto'>
              <img src={Reward_PartnerChanels} alt='' /> <p>Partner channels subs</p>
            </div>
            <div className='tsPhoto'>
              <p id='highlight' >+{subscriptionCoins.toLocaleString('en-US')} $OCTIES</p>
            </div>
          </div>}

          <div className='TS'>
            <div className='tsPhoto'>
              <img src={Reward_Age} alt='' /> <p>Account age</p>
            </div>
            <div className='tsPhoto'>
              <p>+{accountAgeCoins.toLocaleString('en-US')} $OCTIES</p>
            </div>
          </div>

          {hasTelegramPremium && <div className='TS'>
            <div className='tsPhoto'>
              <img src={Reward_Premium} alt='' /> <p>Telegram Premium</p>
            </div>
            <div className='tsPhoto'>
              <p>+{hasTelegramPremium ? 500 : 0} $OCTIES</p>
            </div>
          </div>}

          {Galo4ka && <div className='TS'>
            <div className='tsPhoto'>
              <img src={Reward_Chanel} alt='' /> <p>Channel Subscription</p>
            </div>
            <div className='tsPhoto'>
              <p>+1,000 $OCTIES</p>
            </div>
          </div>}

          {KnopkaNick && <div className='TS'>
            <div className='tsPhoto'>
              <img src={Reward_Nick} alt='' /> <p>Add "Octies" to nickname</p>
            </div>
            <div className='tsPhoto'>
              <p>+300 $OCTIES</p>
            </div>
          </div>}

          {Galo4kaX && <div className='TS'>
          <div className='tsPhoto'>
            <img src={Reward_X} alt='' /> <p>Octies X</p>
          </div>
          <div className='tsPhoto'>
            <p>+500 $OCTIES</p>
          </div>
        </div>}       

          {referralCoins > 0 && <div className='TS'>
            <div className='tsPhoto'>
              <img src={Reward_Invite} alt='TS4' /> <p>Invites</p>
            </div>
            <div className='tsPhoto'>
              <p>+{referralCoins.toLocaleString('en-US')} $OCTIES</p>
            </div>
          </div>}
        </div>
      </div>
    </div>
    );
}

export default Home;