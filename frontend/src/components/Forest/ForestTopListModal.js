import React from 'react';
import { Box, Typography, Backdrop, Modal } from '@mui/material';
import x from '../../assets/x.png';
import { useSelector } from 'react-redux';
import character2 from '../../assets/character2.gif';
import floor_seed3 from '../../assets/floor_seed3.png';

const ForestTopListModal = ({ topListOpen, setTopListOpen }) => {
  const { forestToplist } = useSelector((state) => ({
    forestToplist: state.forest.forestToplist,
  }));
  // 명예의 전당 모달스타일
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vmin',
    height: '40vmin',
    backgroundColor: '#4654b490',
    border: 'none',
    borderRadius: '3vmin',
    boxShadow: 24,
    padding: '3vmin',
  };
  return (
    <div className='forest-toplist-modal'>
      <Modal
        open={topListOpen}
        aria-labelledby='forest-toplist-modal-title'
        onClose={() => setTopListOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box style={modalStyle} className='forest-toplist-modal-box'>
          {/* 제목, x버튼 있는 필드 */}
          <div className='forest-toplist-modal-top-con'>
            <div className='col-3'></div>
            <Typography
              className='forest-toplist-modal-title col-6'
              variant='h6'
              component='span'
              fontFamily='Dung'
            >
              명예의 전당
            </Typography>
            <div className='forest-toplist-modal-x-img-con col-3'>
              <img src={x} onClick={() => setTopListOpen(false)} />
            </div>
          </div>
          {/* 하단 필드 */}
          <div className='forest-toplist-modal-img-con'>
            {forestToplist?.map((item, i) => (
              <div key={i} className='toplist-item row'>
                <div className='toplist-item-rank col-3'>{i + 1}</div>
                <div className='toplist-item-user col-5'>
                  <div className='toplist-item-user-img-con'>
                    <img
                      src={character2}
                    />
                  </div>
                  {item.user.nickname}
                </div>
                <div className='toplist-item-tree col-4'>
                  <img src={floor_seed3} />
                  {item.cnt}
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ForestTopListModal;
