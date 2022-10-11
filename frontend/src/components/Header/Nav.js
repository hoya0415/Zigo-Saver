import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Typography, Badge, Modal, Snackbar, Alert, SnackbarContent, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import coin from '../../assets/coin.png';
import map_close from '../../assets/map_close.png';
import map_close2 from '../../assets/map_close2.png';
import map2 from '../../assets/map2.png';
import alert from '../../assets/alert.png';
import mail2 from '../../assets/mail2.png';
import seedIcon from '../../assets/seed.png';
import character2 from '../../assets/character2.gif';
import minimap2 from '../../assets/minimap2.png';
import x from '../../assets/x.png';
import ProfileMain from '../Profile/ProfileMain';
import main_shop from '../../assets/main_shop.png';
import main_exchange from '../../assets/main_exchange.png';
import main_profile from '../../assets/main_profile.png';
import main_forest from '../../assets/main_forest.png';
import Alarm from './Alarm.js';
import { getStoreInfo,  
  getSearchItem,
  getItemInfo,
} from '../../_action/store_action';
import { getForestList } from '../../_action/forest_action';
import main from "../../assets/main.png";

const Nav = ({info, news}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mapOpen, setMapOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [isRead, setIsRead] = useState(true)
  const [infoOpen, setInfoOpen] = useState(false);
  const { username, point, seed, access } = useSelector((state) => ({
    username: state.user.userName,
    point: state.user.userPoint,
    seed: state.user.userSeed,
    access : state.user.access,
  }));

  useEffect(()=>{
    axios({
      method: 'get',
      url: 'http://k6d202.p.ssafy.io:5000/headers/alarm/check/',
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => {
        setIsRead(res.data.isRead);
      })
      .catch((err) => {
        console.log(err);
      });
  })

  useEffect(()=>{
    if(news.forest){
      setInfoOpen(true);
    }
  }, [news])

  const handleClose = () => {
    setInfoOpen(false);
  };

  const moveToAnywhere = (loca) => {
    setMapOpen(false);
    if (loca == '/shop') {
      dispatch(getSearchItem(0));
      dispatch(getItemInfo(1));
      dispatch(getStoreInfo(access)).then(() => {
        navigate(loca);
      });
    } else if (loca == '/forestroad') {
      dispatch(getForestList()).then(() => {
        navigate(loca);
      });
    } else {
      navigate(loca);
    }
  };

  const handelAlarmOpen = () => {
    setAlarmOpen((prev) => !prev);
  };

  // 모달스타일
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vmin',
    height: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    border: 'none',
    borderRadius: '3vmin',
    boxShadow: 24,
    padding: '1vmin 4vmin 4vmin 4vmin',
  };

  const vertical = 'bottom'
  const horizontal = 'left' 

  return (
    <div>
      <Snackbar
        className='snack-bar'
        anchorOrigin={{ vertical, horizontal }}
        open={infoOpen}
        autoHideDuration={4000}
        onClose={handleClose}
        message={
          `방금 '${news.forest}' 숲에 나무 ${news.tree_cnt}그루가 심어졌어요!`
        }
        key={vertical + horizontal}
      />
      <div className='main-nav'>
        <div className='nav-item'>
          <div className='nav-item-charac-img-con'>
            <img onClick={() => setProfileOpen(true)} src={character2} />
          </div>
        </div>
        <div className='nav-item'>
          <div className='nav-item-img-con'>
            <img src={seedIcon} />
          </div>
          {seed}
        </div>
        <div className='nav-item'>
          <div className='nav-item-img-con'>
            <img src={coin} />
          </div>
          {point}
        </div>
        <div className='nav-item' onClick={() => setMapOpen(true)}>
          <div className='nav-item-img-con'>
            <img src={map_close} />
          </div>
        </div>
        <div className='nav-item' onClick={handelAlarmOpen}>
            { username == info['receiver'] && info['isAlarm'] == true || isRead == false ?
              <Badge className='nav-item-img-con' overlap="circular" badgeContent="N">
                <img src={mail2} />
              </Badge> : 
              <div className='nav-item-img-con'>
                <img src={mail2} />
              </div>
            }
        </div>
        <div className='nav-item' onClick={() => moveToAnywhere('/main')}>
          <div className='nav-item-img-con'>
            <img src={main} />
          </div>
        </div>
      </div>
      <ProfileMain profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
      {/* 미니맵 모달 */}
      <div className='minimap-modal'>
        <Modal
          open={mapOpen}
          aria-labelledby='minimap-modal-title'
          onClose={() => setMapOpen(false)}
          closeAfterTransition
        >
          <Box style={modalStyle} className='minimap-modal-box'>
            <div className='modal-top-con'>
              <div className='col-3'></div>
              <Typography
                className='modal-title col-6'
                variant='h6'
                component='span'
                fontFamily='Dung'
              >
                마을 지도
              </Typography>
              <div className='modal-x-img-con col-3'>
                <img src={x} onClick={() => setMapOpen(false)} />
              </div>
            </div>
            <div className='minimap-modal-img-con'>
              <img src={minimap2} />
              <div className='minimap-move-btn-con'>
                <div
                  className='minimap-move-btn minimap-move-shop'
                  onClick={() => moveToAnywhere('/shop')}
                >
                  <div className='minimap-move-banner'>
                    <img src={main_shop} />
                  </div>
                </div>
                <div
                  className='minimap-move-btn minimap-move-exchange'
                  onClick={() => moveToAnywhere('/exchange')}
                >
                  <div className='minimap-move-banner'>
                    <img src={main_exchange} />
                  </div>
                </div>
                <div
                  className='minimap-move-btn minimap-move-forest'
                  onClick={() => moveToAnywhere('/forestroad')}
                >
                  <div className='minimap-move-banner'>
                    <img src={main_forest} />
                  </div>
                </div>
                <div
                  className='minimap-move-btn minimap-move-profile'
                  onClick={() => {
                    setProfileOpen(true);
                    setMapOpen(false);
                  }}
                >
                  <div className='minimap-move-banner'>
                    <img src={main_profile} />
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
      <Alarm alarmOpen={alarmOpen} setAlarmOpen={setAlarmOpen} />
      <Outlet />
    </div>
  );
};

export default Nav;
