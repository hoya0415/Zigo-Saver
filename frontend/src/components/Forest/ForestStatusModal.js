import React, { useState } from 'react';
import { Box, Typography, Backdrop, Modal } from '@mui/material';
import x from '../../assets/x.png';
import floor from '../../assets/floor.png';
import floor_seed3 from '../../assets/floor_seed3.png';
import tree1 from '../../assets/tree1.png';
import trophy from '../../assets/trophy.png';
import { useDispatch, useSelector } from 'react-redux';
import { getToplist, plantSeed } from '../../_action/forest_action';
import { useNavigate } from 'react-router-dom';
import ForestTopListModal from './ForestTopListModal';
import { getSeedList } from '../../_action/user_action';
import SeedBuy from '../Exchange/SeedBuy';
import { getStoreInfo } from '../../_action/store_action';

const ForestStatusModal = ({ statusOpen, setStatusOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { forestSinger, forestSeed, forestTree, seed, access, forestId } =
    useSelector((state) => ({
      forestSinger: state.forest.forestSinger,
      forestSeed: state.forest.forestSeed,
      forestTree: state.forest.forestTree,
      forestId: state.forest.forestId,
      seed: state.user.userSeed,
      access: state.user.access,
    }));
  const [seedBuyOpen, setSeedBuyOpen] = useState(false);
  const [seedModal, setSeedModal] = useState(false);
  const [topListOpen, setTopListOpen] = useState(false);
  const [plantCnt, setPlantCnt] = useState(1);
  const floorSeedCnt = forestSeed % 25;
  const floorSeedUrl = '/seeds/floor' + floorSeedCnt + '.png';

  // 씨앗 심기
  const handlePlantSeed = () => {
    dispatch(plantSeed(access, forestId, plantCnt))
      .then(() => {
        setSeedModal(false);
        setPlantCnt(1);
        dispatch(getSeedList(access));
      })
      .catch((err) => console.log(err));
  };

  // 명예의 전당 모달
  const handleToplistOpen = () => {
    dispatch(getToplist(forestId)).then(() => setTopListOpen(true));
  };

  // 숲 현황 모달스타일
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vmin',
    height: 'auto',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '3vmin',
    boxShadow: 24,
    padding: '0 4vmin 0 4vmin',
  };
  // 씨앗심기 모달스타일
  const seedModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35vmin',
    height: 'auto',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '3vmin',
    boxShadow: 24,
    padding: '3vmin',
    opacity: '0.9',
  };
  return (
    <>
      {/* 숲 현황 모달 */}
      <div className='forest-status-modal'>
        <Modal
          open={statusOpen}
          aria-labelledby='forest-status-modal-title'
          onClose={() => setStatusOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box style={modalStyle} className='forest-status-modal-box'>
            {/* 제목, x버튼 있는 필드 */}
            <div className='modal-top-con'>
              <div className='col-3'></div>
              <Typography
                className='modal-title col-6'
                variant='h6'
                component='span'
                fontFamily='Dung'
              >
                {forestSinger} 숲 현황
              </Typography>
              <div className='modal-x-img-con col-3'>
                <img src={x} onClick={() => setStatusOpen(false)} />
              </div>
            </div>
            {/* 하단 필드 */}
            <div className='forest-status-modal-img-con'>
              {/* 현황 박스 */}
              <div className='cnt-fld'>
                <div className='cnt-fld-item'>
                  <img src={floor_seed3} />X {forestSeed}
                </div>
                <div className='cnt-fld-item'>
                  <img src={tree1} />X {forestTree}
                </div>
              </div>
              {/* 명예의 전당 버튼 */}
              <div className='plant-top-list-btn' onClick={handleToplistOpen}>
                <img src={trophy} />
              </div>
              {/* 새싹 이미지 */}
              <div className='floor-fld' onClick={() => setSeedModal(true)}>
                <img
                  className='forest-status-floor seed-con'
                  src={floorSeedCnt === 0 ? '' : floorSeedUrl}
                />
                {/* 판떼기 */}
                <img className='forest-status-floor' src={floor} />
              </div>
            </div>
          </Box>
        </Modal>
      </div>

      {/* 씨앗 모달 */}
      <div className='forest-seed-modal'>
        <Modal
          open={seedModal}
          aria-labelledby='forest-seed-modal-title'
          onClose={() => setSeedModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box style={seedModalStyle} className='forest-seed-modal-box'>
            {/* 제목, x버튼 있는 필드 */}
            <div className='forest-seed-modal-top-con'>
              <div className='col-3'></div>
              <Typography
                className='forest-seed-modal-title col-6'
                variant='h6'
                component='span'
                fontFamily='Dung'
              >
                씨앗 심기
              </Typography>
              <div className='forest-seed-modal-x-img-con col-3'>
                <img src={x} onClick={() => setSeedModal(false)} />
              </div>
            </div>
            {/* 하단 필드 */}
            <div className='plant-seed-fld'>
              <div className={seed <= 0 ? '' : 'd-none'}>
                <h4>가진 씨앗이 없어요</h4>
                <h5>
                  씨앗은 앨범을 거래할 때 발생하고 <br /> 포인트로도 구매할 수
                  있어요!
                </h5>
                <div className='seed-btn-con'>
                  <button
                    className='seed-btn'
                    onClick={() =>
                      dispatch(getStoreInfo(access)).then(() => {
                        navigate('/shop');
                      })
                    }
                  >
                    앨범거래
                  </button>
                  <button
                    className='seed-btn'
                    onClick={() => setSeedBuyOpen(true)}
                  >
                    씨앗구매
                  </button>
                </div>
              </div>
              <div className={seed <= 0 ? 'd-none' : ''}>
                <div className='seed-input-con'>
                  <span
                    className='minus'
                    onClick={() => {
                      if (plantCnt > 1) {
                        setPlantCnt((prev) => prev - 1);
                      }
                    }}
                  >
                    -
                  </span>
                  <input
                    className='seed-input'
                    type='number'
                    value={plantCnt}
                    max={seed}
                    min='1'
                    readOnly
                  ></input>
                  <span
                    className='plus'
                    onClick={() => {
                      if (plantCnt < seed) {
                        setPlantCnt((prev) => prev + 1);
                      }
                    }}
                  >
                    +
                  </span>
                </div>
                <div className='seed-btn-con'>
                  <button className='seed-btn' onClick={handlePlantSeed}>
                    씨앗심기
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
      <ForestTopListModal
        topListOpen={topListOpen}
        setTopListOpen={setTopListOpen}
      />
      <SeedBuy seedBuyOpen={seedBuyOpen} setSeedBuyOpen={setSeedBuyOpen} />
    </>
  );
};

export default ForestStatusModal;
