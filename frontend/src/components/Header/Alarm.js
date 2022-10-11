import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Backdrop, Modal } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import x from '../../assets/x.png';



const Alarm = ({ alarmOpen, setAlarmOpen }) => {
  const [alarmList, setAlarmList] = useState([]);
  const { access } = useSelector((state) => ({
    access : state.user.access,
  }));

  useEffect(()=>{
    if (alarmOpen){
      axios({
        method: 'get',
        url: 'http://k6d202.p.ssafy.io:5000/headers/alarm/',
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })
        .then((res) => {
          setAlarmList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [alarmOpen])

  // 모달스타일
  const modalStyle = {
    position: 'absolute',
    top: '48%',
    left: '33px',
    width: '500px',
    height: '500px',
    backgroundColor: 'rgba(255, 255, 255, 0.77)',
    border: 'none',
    borderRadius: '25px',
    boxShadow: 24,
    padding: '15px',
  };

  return (
    <div className='alarm-modal'>
      <Modal
        open={alarmOpen}
        aria-labelledby='alarm-modal-title'
        onClose={() => setAlarmOpen(false)}
        closeAfterTransition
        BackdropProps={{style: {backgroundColor:'#ffffff00' }}}
      >
        <Box style={modalStyle} className='alarm-modal-box'>
          {/* 제목, x버튼 있는 필드 */}
          <div className='modal-top-con'>
            <div className='col-3'></div>
            <Typography
              className='modal-title col-6'
              variant='h6'
              component='span'
              fontFamily='Dung'
            >
              알림
            </Typography>
            <div className='modal-x-img-con col-3'>
              <img src={x} onClick={() => setAlarmOpen(false)} />
            </div>
          </div>
          {/* 하단 필드 */}
          <div className='alarm-modal-img-con'>
            {alarmList?.map((item, i) => (
              <div key={i} className='alarm-item'>
                {
                  item.content == '앨범 구매' ?
                  `'${item.sender}'님이 앨범을 구매했어요! 배송을 시작하고 운송장을 입력해주세요!`  : 
                  item.content == '운송장 입력' ?
                  `'${item.sender}'님이 운송장을 입력했어요! 운송장 번호를 확인해보세요!` : 
                  `'${item.sender}'님과의 거래가 확정되었어요!`
                }
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Alarm;
