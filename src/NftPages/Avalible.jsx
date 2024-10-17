import React from 'react';
import '../Css/NFTs.css';
import NFtV2 from '../IMG/NFTs/NftV2.png';
import TonRef1 from '../IMG/Nft_ref/1tonRef.png';


const AvalibleNFT = ( {buttonVisible, showNotCompleted, ChecknftDone, sendTransactionFunc, Checknft, sendTransaction1,
    handleCheckReferrals, timerforsent, updatedSpots, Tg_Form_Window, durov, ton55, isMintv2, isMintv3,sendTransaction1Ton
 }) => {



  return (
    <div className='mainNft'> 
       
       {!isMintv3 && <div className='nft-promo'>
      <div className='nft-text'>
        <h2>GET YOUR <span id='highlight'>REFERRAL</span> NFT!</h2>
        <p>Invite 15 friends <br/> & Connect Wallet <span id='highlight'>v.2</span></p>
        <div className='nft-buttons'>
          <div className="mint-section">

             {!buttonVisible && !showNotCompleted && 
              <button className="referral-button" onClick={handleCheckReferrals}> 
                Check referrals
              </button>} 

            {!buttonVisible && showNotCompleted && (         
              <button id="not-completed" >
                   <p>15 friends </p>
                   <img src={Checknft} alt="Not completed" />
              </button>
            )}

            {buttonVisible && (
              <button id="friends-count">
                <p>15 friends </p>
                <img src={ChecknftDone} alt="Checkmark" />
              </button> )}

              <p id='or'>OR</p>
              <button className='Referal5Ton'>
                <img src={TonRef1} onClick={sendTransaction1Ton} alt=''/>
              </button>

          </div>
          <div className="mint-section">
          <button
            className={`mint-button ${!buttonVisible ? 'canMint' : ''}`}
            onClick={sendTransactionFunc}> MINT
          </button>

          </div>
        </div>
      </div>
      <div className='nft-image'>
        <img src={NFtV2} alt='OCTIES NFT' /> 
      </div>
    </div>}

    <div className={`nft-promo2 ${!isMintv2 ? '' : 'nft-promoV2'}`}>
      <div className='LeftNft2'>
        <div alt='' id='redElipse'/>
        <h1><span id='highlight'>CREATE AN NFT</span> OF YOUR<br/>CHARACTER OCTIES!</h1>    
        <p>Currently <span id="highgreen">{updatedSpots}</span>/250 spots available</p>
        <p>Once you submit the transaction,<br /><span id='highlight'>you will receive:</span></p>
        <ul class="custom-list">
          <li>1 NFT of a unique OCTIES <br/> character, which you <br/> can design yourself</li>
        </ul>
        <ul class="custom-list">
          <li>Secret pass granting access<br/> to unique features & utilities</li>
        </ul>
        {!timerforsent && <button className='sendButtonm' onClick={sendTransaction1}>Send transaction <img src={ton55} alt=''/></button>}
        {timerforsent && <button className='FillButtonm' onClick={Tg_Form_Window}>Fill out the form</button>}
      </div>
      <div className='rightNft2'>
        <img src={durov} alt=''/>
      </div>
    </div>
  </div>
  );
};

export default AvalibleNFT;
