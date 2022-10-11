import React, { useState, useEffect }  from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Backdrop, Modal, LinearProgress } from '@mui/material';
import character2 from '../../assets/character2.gif';
import x from '../../assets/x.png';
import ProfileDelivery from './ProfileDelivery';
import ProfilePoint from './ProfilePoint';
import ProfileSeed from './ProfileSeed';
import ProfileBuy from './ProfileBuy';
import ProfileSell from './ProfileSell';
import axios from 'axios';

const ProfileMain = ({profileOpen,setProfileOpen}) => {
  const [boxOpen, setBoxOpen] = useState(true);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [pointOpen, setPointOpen] = useState(false);
  const [seedOpen, setSeedOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [totalSeed, setTotalSeed] = useState(0);

  const { nickname, access } = useSelector((state) => ({
    nickname : state.user.userNickname,
    access : state.user.access
  }));
  useEffect(()=>{
    axios({
      method: 'get',
      url: 'http://k6d202.p.ssafy.io:5000/accounts/history/seed/',
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => {
        setTotalSeed(res.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  })

  
  const profileClose = () => {
    setProfileOpen(false)
    setBoxOpen(true)
    setDeliveryOpen(false)
    setPointOpen(false)
    setSeedOpen(false)
    setBuyOpen(false)
    setSellOpen(false)
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vmin',
    height: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.77)',
    border: 'none',
    borderRadius: '3vmin',
    boxShadow: 24,
    padding: '1vmin 4vmin 4vmin 4vmin',
  };

  const level = parseInt(totalSeed / 25) 
  const exp =  totalSeed % 25 * 4

  return (
    <div>
      <div className='forest-status-modal'>
        <Modal
          open={profileOpen}
          aria-labelledby='forest-status-modal-title'
          onClose={() => profileClose()}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box style={modalStyle} className='forest-status-modal-box'>
            {/* 제목, x버튼 있는 필드 */}
            <div className={boxOpen ? '' : 'd-none'}>
              <div className='modal-top-con'>
                <div className='col-3'></div>
                <Typography
                  className='modal-title col-6'
                  variant='h6'
                  component='span'
                  fontFamily='Dung'
                >
                  마이페이지
                </Typography>
                <div className='modal-x-img-con col-3'>
                  <img src={x} onClick={() => setProfileOpen(false)} />
                </div>
              </div>
              <div className='profile-content-con row'>
                <div className='profile-info-con col-6'>
                  <h4>{nickname}</h4>
                  <img src={character2} />
                  <div className='profile-level-prog'>
                    <h4>Lv.{level}</h4>
                    <LinearProgress variant='determinate' value={exp} />
                  </div>
                </div>
                <div className='profile-btn-con col-6'>
                  <button className='profile-btn' onClick={() => {setBoxOpen(false); setDeliveryOpen(true);} }>배송지 관리</button>
                  <button className='profile-btn' onClick={() => {setBoxOpen(false); setPointOpen(true);} }>포인트</button>
                  <button className='profile-btn' onClick={() => {setBoxOpen(false); setSeedOpen(true);} }>씨앗 기부 내역</button>
                  <button className='profile-btn' onClick={() => {setBoxOpen(false); setBuyOpen(true);} }>구매 내역</button>
                  <button className='profile-btn' onClick={() => {setBoxOpen(false); setSellOpen(true);} }>판매 내역</button>
                </div>
              </div>
            </div>

            <ProfileDelivery deliveryOpen={deliveryOpen} setBoxOpen={setBoxOpen} setDeliveryOpen={setDeliveryOpen}/>
            <ProfilePoint 
              pointOpen={pointOpen} 
              setBoxOpen={setBoxOpen} 
              setPointOpen={setPointOpen} 
              profileClose={profileClose}/>
            <ProfileSeed seedOpen={seedOpen} setBoxOpen={setBoxOpen} setSeedOpen={setSeedOpen} profileClose={profileClose}/>
            <ProfileBuy buyOpen={buyOpen} setBoxOpen={setBoxOpen} setBuyOpen={setBuyOpen}/>
            <ProfileSell sellOpen={sellOpen} setBoxOpen={setBoxOpen} setSellOpen={setSellOpen}/>
          
          </Box>
        </Modal>
      </div>
    </div>
  )
}

export default ProfileMain