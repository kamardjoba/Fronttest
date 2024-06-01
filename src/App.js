import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Импорт библиотеки для генерации уникальных идентификаторов
import './App.css';
import coinIcon from './IMG/CU.png';
import Icon from './IMG/N.png';
import logo from './IMG/b.png';
import BB from './IMG/BB.png';
import ProgressBar from './ProgressBar';
import Shop from './shop';
import Coindiv from './coin';
import Ref from './ref';
import Earn from './earn';
import localStorage from 'localStorage';

function App() {

  const [clicks, setClicks] = useState(0);
  const [coins, setCoins] = useState(0);

  const [upgradeCost, setUpgradeCost] = useState(10);
  const [upgradeLevel, setUpgradeLevel] = useState(1);
  const [coinPerClick, setCoinPerClick] = useState(1);

  const [upgradeCostEnergy, setUpgradeCostEnergy] = useState(100)
  const [upgradeLevelEnergy, setUpgradeLevelEnergy] = useState(1)
  const [clickLimit, setClickLimit] = useState(1000);
  const [energyNow, setEnergyNow] = useState(1000);

  const [upgradeCostEnergyTime, setUpgradeCostEnergyTime] = useState(200)
  const [valEnergyTime, setvalEnergyTime] = useState(0.5)
  const [upgradeEnergyTimeLevel, setupgradeEnergyTimeLevel] = useState(1)
  const [time, setTime] = useState(2000)

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isRefOpen, setIsRefOpen] = useState(false);
  const [isEarnOpen, setIsEarnOpen] = useState(false);

  const [telegramId, setTelegramId] = useState(null);

  // Получение или генерация идентификатора пользователя
  useEffect(() => {
    let storedTelegramId = localStorage.getItem('telegramId');
    if (!storedTelegramId) {
      storedTelegramId = uuidv4();
      localStorage.setItem('telegramId', storedTelegramId);
    }
    setTelegramId(storedTelegramId);
  }, []);

  // Загрузка данных пользователя при монтировании компонента
  useEffect(() => {
    if (telegramId) {
      const loadUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${telegramId}`);
          const userData = response.data;
          setClicks(userData.clicks);
          setCoins(userData.coins);
          setUpgradeCost(userData.upgradeCost);
          setUpgradeLevel(userData.upgradeLevel);
          setCoinPerClick(userData.coinPerClick);
          setUpgradeCostEnergy(userData.upgradeCostEnergy);
          setUpgradeLevelEnergy(userData.upgradeLevelEnergy);
          setClickLimit(userData.clickLimit);
          setEnergyNow(userData.energyNow);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };

      loadUserData();
    }
  }, [telegramId]);


  useEffect(() => {
    if (telegramId) {
      const saveUserData = async () => {
        const userData = {
          telegramId,
          clicks,
          coins,
          upgradeCost,
          upgradeLevel,
          coinPerClick,
          upgradeCostEnergy,
          upgradeLevelEnergy,
          clickLimit,
          energyNow
        };
        try {
          await axios.put('/api/user', { telegramId, userData });
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      };

      const interval = setInterval(saveUserData, 10000); // Сохранение каждые 10 секунд

      return () => clearInterval(interval);
    }
  }, [telegramId, clicks, coins, upgradeCost, upgradeLevel, coinPerClick, upgradeCostEnergy, upgradeLevelEnergy, clickLimit, energyNow]);

  //Нажатие на монету
  const handleCoinClick = () => {
    if (energyNow >= coinPerClick) {
      setCoins(coins + coinPerClick);
      setClicks(clicks + 1);
      setEnergyNow(energyNow - coinPerClick);
    }
  };

  //Востановления енергиї
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyNow((energyNow) => {
        if (energyNow < clickLimit) {
          return energyNow + 1;
        } else {
          return energyNow;
        }
      });
    }, time);

    return () => clearInterval(interval);
  }, [clickLimit, time]);

  //Прокачка монет за тап
  const CoinPerClickUpgrade = () => {
    if (coins >= upgradeCost) {
      setCoins(coins - upgradeCost);
      setCoinPerClick(coinPerClick + 1);
      setUpgradeLevel(upgradeLevel + 1);
      setUpgradeCost(Math.floor(upgradeCost * 1.5));
    }
  };

  //Прокачка лимита енергиї
  const EnergyUpgrade = () => {
    if (coins >= upgradeCostEnergy) {
      setCoins(coins - upgradeCostEnergy);
      setClickLimit(clickLimit * 2);
      setUpgradeLevelEnergy(upgradeLevelEnergy + 1);
      setUpgradeCostEnergy(Math.floor(upgradeCostEnergy * 1.5));
    }
  };

  //Прокачка востановления енергії
  const EnergyTimeUpgrade = () => {
    if (coins >= upgradeCostEnergyTime) {
      setCoins(coins - upgradeCostEnergyTime);
      setvalEnergyTime(valEnergyTime * 2);
      setupgradeEnergyTimeLevel(upgradeEnergyTimeLevel + 1);
      setTime(time / 2);
      setUpgradeCostEnergyTime(Math.floor(upgradeCostEnergyTime * 1.5));
    }
  };

  const handleOpenShop = () => {
    setIsShopOpen(true);
  };

  const handleCloseShop = () => {
    setIsShopOpen(false);
  };

  const handleOpenRef = () => {
    setIsRefOpen(true);
  };

  const handleCloseRef = () => {
    setIsRefOpen(false);
  };

  const handleOpenEarn = () => {
    setIsEarnOpen(true);
  };

  const handleCloseEarn = () => {
    setIsEarnOpen(false);
  };

  return (
      <body>
      <div className="App">
        <div className = "info">
          <img src={Icon} alt="Icon"/>
          <p> Name </p>
          <img src={logo} alt="Bifclif"/>
        </div>
        <div className = "main">
          <div className="mainInfo">
            <div className="halfBox">
              <div className = "halfBoxDiv">
                <p> Coin Per Tap</p>
                <p>+{coinPerClick} <img src={coinIcon} alt="Coin" className="coin-image"/></p>
              </div>
            </div>
            <div className="halfBox">
              <div className = "halfBoxDiv">
                <p> Energy </p>
                <p>{clickLimit} / {energyNow}<img src={BB} alt="Battery" className="coin-image"/></p>
              </div>
            </div>
          </div>
          <div className="CoinInfo">
            <img src={coinIcon} alt="Coin" height = "90%" />
            <p>{coins}</p>
          </div>
          <Coindiv onClick={handleCoinClick} coinPerClick={coinPerClick} energyNow={energyNow}/>
          <div className="Progress">
            <ProgressBar current={energyNow} max={clickLimit} />
          </div>
          <div className = "lower">
            <div className = "lowerDiv">
              <div className="BTNLOW" onClick={handleOpenEarn}>
                <p>Earn</p>
                <p>💸</p>
              </div>
              <div className="BTNLOW" onClick={handleOpenShop}>
                <p>Shop</p>
                <p>🛒</p>
              </div>
              <div  className="BTNLOW" onClick={handleOpenRef}>
                <p>Ref</p>
                <p>👥</p>
              </div>
              <div className="BTNLOW">
                <p>🚀</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isShopOpen && (
          <Shop
              coins={coins}
              coinPerClick={coinPerClick}
              upgradeCost={upgradeCost}
              upgradeLevel={upgradeLevel}

              clickLimit={clickLimit}
              upgradeCostEnergy={upgradeCostEnergy}
              upgradeLevelEnergy={upgradeLevelEnergy}

              upgradeCostEnergyTime={upgradeCostEnergyTime}
              valEnergyTime={valEnergyTime}
              upgradeEnergyTimeLevel={upgradeEnergyTimeLevel}

              onClose={handleCloseShop}
              onUpgrade={CoinPerClickUpgrade}
              onUpgradeEnergy={EnergyUpgrade}
              onUpgradeEnergyTime={EnergyTimeUpgrade}
          />
      )}

      {isRefOpen && (
          <Ref
              onClose={handleCloseRef}
          />
      )};

      {isEarnOpen && (
          <Earn
              onClose={handleCloseEarn}
          />
      )};

      </body>
  );
}

export default App;
