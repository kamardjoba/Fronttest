import React, { useState } from 'react';
import '../Css/ref.css'
import boxIcon from '../IMG/box.png';
import znakLogo from '../IMG/Znak.png';
import s from '../IMG/s.png'
import ink from '../IMG/ink.png';
import inviteIcon from '../IMG/LowerIcon/Invite_Icon.png';
import FriendAvatar from '../IMG/Avatars/ArturAvatar.png';
import DimaAvatar from '../IMG/Avatars/DimaAvatar.png';
import NazarAvatar from '../IMG/Avatars/NazarAvatar.png';
import AndriiAvatar from '../IMG/Avatars/AndriiAvatar.png';
import IlyaAvatar from '../IMG/Avatars/IlyaAvatar.png';
import BoyarskiiAvatar from '../IMG/Avatars/BoyarskiiAvatar.png';

const Ref = ({onClose, openBox}) => {
    
    const [isClosingRefForAnim, setClosingRefForAnim] = useState(false);
    const handleCloseRefAnim = () => {setClosingRefForAnim(true);};

    return (
        <div className={`Ref_Earn_Shop_Window ${isClosingRefForAnim ? 'closing' : ''}`}>
            <div className="Ref_Earn_BoxBorder">
                <div className='Ref_Earn_Box' onClick={openBox}>
                    <img src={boxIcon} alt='boxIcon' height={"60%"}/>
                </div>
                <div className='Ref_Earn_BoxTitle'>
                    <div className='Ref_Earn_BoxUp'>
                        <p>INVITE A FRIEND</p>
                    </div>
                    <div className='Ref_Earn_BoxDown'>
                        <div className='Ref_Earn_BoxLeft'>
                            <img src={znakLogo} alt='znakLogo' height={"50%"}/>
                        </div>
                        <div className='Ref_Earn_BoxRight'>
                            <p>GET <span className="Ref_Earn_Purple">MYSTERY BOX</span></p>
                            <p>FOR YOU AND YOUR</p>
                            <p>FRIEND</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="refFrandsBorder">
                <div className='refFrendsInfo'>
                    <p>LIST OF YOUR FRIENDS</p>
                    <img src={s} alt='s' height={"40%"}/>
                </div>
                <div className="refFrendsMenu">

                    <div className='refFrends'>
                        <div className='refFrendsIcon'>
                            <img src={FriendAvatar} alt='FriendAvatar' height={"75%"}/>
                        </div>
                        <div className='refFrendsName'>
                            <p>ARTUR</p>
                            <p id="Friends_rank">Beginner <span id="Beginner_rank"> ● </span></p>
                        </div>
                        <div className='refFrendsIcon'>
                            <img src={boxIcon} alt='boxIcon' height={"65%"}/>
                        </div>
                    </div>

                    <div className='refFrends'>
                        <div className='refFrendsIcon'>
                            <img src={DimaAvatar} alt='DimaAvatar' height={"75%"}/>
                        </div>
                        <div className='refFrendsName'>
                            <p>DIMA BAGMET</p>
                            <p id="Friends_rank">Advanced <span id="Advanced_rank"> ● </span></p>
                        </div>
                        <div className='refFrendsIcon'>
                            <img src={boxIcon} alt='boxIcon' height={"65%"}/>
                        </div>
                    </div>

                    <div className='refFrends'>
                        <div className='refFrendsIcon'>
                            <img src={NazarAvatar} alt='NazarAvatar' height={"75%"}/>
                        </div>
                        <div className='refFrendsName'>
                            <p>NAZAR</p>
                            <p id="Friends_rank">Intermediate <span id="Intermediate_rank"> ● </span></p>
                        </div>
                        <div className='refFrendsIcon'>
                            <img src={boxIcon} alt='boxIcon' height={"65%"}/>
                        </div>
                    </div>

                    <div className='refFrends'>
                        <div className='refFrendsIcon'>
                            <img src={AndriiAvatar} alt='AndriiAvatar' height={"75%"}/>
                        </div>
                        <div className='refFrendsName'>
                            <p>АНДРІЙ</p>
                            <p id="Friends_rank">Expert <span id="Expert_rank"> ● </span></p>
                        </div>
                        <div className='refFrendsIcon'>
                            <img src={boxIcon} alt='boxIcon' height={"65%"}/>
                        </div>
                    </div>

                    <div className='refFrends'>
                        <div className='refFrendsIcon'>
                            <img src={IlyaAvatar} alt='IlyaAvatar' height={"75%"}/>
                        </div>
                        <div className='refFrendsName'>
                            <p>ИЛЬЯ</p>
                            <p id="Friends_rank">Master <span id="Master_rank"> ● </span></p>
                        </div>
                        <div className='refFrendsIcon'>
                            <img src={boxIcon} alt='boxIcon' height={"65%"}/>
                        </div>
                    </div>

                    <div className='refFrends'>
                        <div className='refFrendsIcon'>
                            <img src={BoyarskiiAvatar} alt='BoyarskiiAvatar' height={"75%"}/>
                        </div>
                        <div className='refFrendsName'>
                            <p>BOYARSKIY</p>
                            <p id="Friends_rank">Grandmaster <span id="Grandmaster_rank"> ● </span></p>
                        </div>
                        <div className='refFrendsIcon'>
                            <img src={boxIcon} alt='boxIcon' height={"65%"}/>
                        </div>
                    </div>

                </div>
            </div>
            <div className="refthripleBTN">
                <button className="refgo">
                    <p>INVITE </p>
                    <img src={inviteIcon} alt='inviteIcon' height={"110%"}/>
                </button>
                <button className="refgo" id='refgoCopy'>
                    <img src={ink} alt='ink' height={"50%"}/>
                    <p>COPY</p>
                </button>
            </div>
            <button id='CloseDebug' onClick={(event) => {onClose(event); handleCloseRefAnim(event); }}>X</button>
        </div>
    );
};

export default Ref;