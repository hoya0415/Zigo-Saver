import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Modal, Typography } from '@mui/material';
import x from '../../assets/x.png';
import { exchangePointToSeed } from '../../_action/exchange_action';

const SeedBuy = ({ seedBuyOpen, setSeedBuyOpen }) => {
  const dispatch = useDispatch();
  const { access, point, seed } = useSelector((state) => ({
    access: state.user.access,
    point: state.user.userPoint,
    seed: state.user.userSeed,
  }));
  const [buySeed, setBuySeed] = useState(1);
  const [isBuy, setIsBuy] = useState(false);
  const maxSeed = Number(point) / 500;
  const resPoint = point - buySeed * 500;
  const submitBuySeed = () => {
    dispatch(exchangePointToSeed(access, buySeed)).then(() => {
      setBuySeed(0);
      setIsBuy(true);
    });
  };
  const [activeBtn, setIsActiveBtn] = useState(false);
  const isActiveBtn = () => {
    if (point < 500 || resPoint < 0 || buySeed == 0) {
      setIsActiveBtn(false);
    } else {
      setIsActiveBtn(true);
    }
  };
  useEffect(() => {
    isActiveBtn();
  });
  const modalStyle2 = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vmin',
    height: 'auto',
    backgroundColor: '#ffffff90',
    border: 'none',
    borderRadius: '3vmin',
    boxShadow: 24,
    padding: '3vmin',
    backdrop: 0,
  };
  return (
    <div>
      <Modal open={seedBuyOpen} onClose={() => setSeedBuyOpen(false)}>
        <Box style={modalStyle2}>
          <div className='modal-top-con'>
            <div className='col-3'></div>
            <Typography
              className='modal-title col-6'
              variant='h6'
              component='span'
              fontFamily='Dung'
            >
              씨앗구매
            </Typography>
            <div className='modal-x-img-con col-3'>
              <img src={x} onClick={() => setSeedBuyOpen(false)} />
            </div>
          </div>
          <div className={isBuy ? 'd-none' : 'seed-content'}>
            <div className='seed-content-item row'>
              <h3 className='col-6'>보유 포인트</h3>
              <h3 className='col-6'>{point}P</h3>
            </div>
            <div className='seed-content-item row'>
              <h3 className='col-6'>보유 씨앗</h3>
              <h3 className='col-6'>{seed}개</h3>
            </div>
            <div className='seed-content-item row'>
              <h3 className='col-6'>구매할 씨앗</h3>
              <div className='seed-buy-input-con col-6'>
                <span
                  className='minus'
                  onClick={() => {
                    if (buySeed > 1) {
                      setBuySeed((prev) => prev - 1);
                    }
                  }}
                >
                  -
                </span>
                <input
                  className='seed-buy-input'
                  type='number'
                  value={buySeed}
                  max={maxSeed}
                  min='1'
                  readOnly
                ></input>
                <span
                  className='plus'
                  onClick={() => {
                    if (buySeed < maxSeed) {
                      setBuySeed((prev) => prev + 1);
                    }
                  }}
                >
                  +
                </span>
              </div>
            </div>
            <div className='seed-content-item row'>
              <h3 className='col-6'>예상 잔여 포인트</h3>
              <h3 className='col-6'> {resPoint}P</h3>
            </div>
            <div className={point < 500 || resPoint < 0 ? '' : 'opacity-0'}>
              <h6> 포인트가 부족합니다.</h6>
            </div>
            <button
              className={activeBtn ? 'seed-buy-btn active-btn' : 'seed-buy-btn'}
              onClick={submitBuySeed}
              disabled={activeBtn ? false : true}
            >
              구매하기
            </button>
          </div>
          <div className={isBuy ? 'buy-done' : 'd-none'}>
            <div className='buy-done-text'> 씨앗 구매가 완료되었습니다.</div>
            <button
              className='seed-buy-btn-done active-btn'
              onClick={() => {
                setIsBuy(false);
                setBuySeed(1);
                setSeedBuyOpen(false);
              }}
            >
              확인
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SeedBuy;
