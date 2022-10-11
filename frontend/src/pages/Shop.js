import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Radio,
  RadioGroup,
  Modal,
  FormControl,
  FormControlLabel,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import x from '../assets/x.png';
import searchIcon from '../assets/searchIcon.png';

import {
  getStoreInfo,
  getItemInfo,
  registerItem,
  getItemDetail,
  getSearchItem,
  buyItem,
} from '../_action/store_action';
import { useDispatch, useSelector } from 'react-redux';
import ProfileDelivery from '../components/Profile/ProfileDelivery';
import { getUserInfo } from '../_action/user_action';
import Spinner from '../components/Spinner/Spinner.js';

const modalStyle2 = {
  position: 'absolute',
  top: '47%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vmin',
  height: 'auto',
  backgroundColor: '#ffffff',
  border: 'none',
  borderRadius: '3vmin',
  boxShadow: 24,
  padding: '3vmin',
  backdrop: 10,
  // prsent: 'modally'
};

const modalStyle3 = {
  position: 'absolute',
  top: '47%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vmin',
  height: 'auto',
  backgroundColor: '#fff',
  border: 'none',
  borderRadius: '3vmin',
  boxShadow: 24,
  padding: '3vmin',
  backdrop: 0,
};


// 앨범 상세
function EachAlbum({ detailOpen, setDetailOpen, albumId }) {
  const dispatch = useDispatch();
  const [wantSellOpen, setWantSellOpen] = useState(false);
  const [wantBuyOpen, setWantBuyOpen] = useState(false);

  const handleBuyOpen = (price, detail, seller, opened, date, id) => {
    dispatch(
      getItemDetail({
        price: price,
        detail: detail,
        seller: seller,
        opened: opened,
        date: date,
        id: id,
      })
    );
    setWantBuyOpen(true);
  };

  const { sellingList, priceList, userId } = useSelector((state) => ({
    sellingList: state.store.sellingList,
    priceList: state.store.priceList,
    userId: state.user.userId
  }));

  const priceArray = priceList.map((item) => item.price);
  const minPrice = Math.min.apply(null, priceArray);
  priceList.sort((a, b) => a.price - b.price);
  let temp = [];
  let tempZero = []
  for (var i in priceList) {
    if (priceList[i].cnt) {
      temp.push(priceList[i])
    }
    else {
      tempZero.push(priceList[i])
    }
  }
  const priceResult = [...temp, ...tempZero]

  return (
    <div>
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} BackdropProps={{style: {backgroundColor:'#ffffff00' }}}>
        <Box style={modalStyle2}>
          <div className='npc-modal-x-img-con'>
            <img src={x} onClick={() => setDetailOpen(false)} />
          </div>
          <div className='container'>
            <div className='item-detail-con'>
              <img className='each-album-img' src={sellingList.album_img} />
              <div className='item-info-section'>
                <div className='item-detail-name-con'>
                  <span className='album-name'>{sellingList.album_name}</span>
                  <span className='release'>{sellingList.release}</span>
                </div>
                <h4>{sellingList.singer}</h4>
                {/* 최저가 구하기 */}
                <div className='item-detail-price-con'>
                  <span className='price'>{minPrice}P ~</span>
                  <button
                    className='item-sell-btn'
                    onClick={() => setWantSellOpen(true)}
                  >
                    판매등록
                  </button>
                </div>
                <RegisterSell
                  wantSellOpen={wantSellOpen}
                  setWantSellOpen={setWantSellOpen}
                  album_id={sellingList.id}
                />
              </div>
            </div>
            {/* 판매 리스트 */}
            <div className='selling-list-fld'>
              <div className='selling-list-label'>판매 목록</div>
              <div className='selling-list-con'>
                <div className='selling-item-con row'>
                  <div className='item-title col-2'>판매자</div>
                  <div className='item-title col-2'>가격</div>
                  <div className='item-title col-1'>개봉여부</div>
                  <div className='item-title col-5'>앨범구성</div>
                  <div className='item-title col-1'>수량</div>
                  {/* <div className='item-title col-2'>작성일</div> */}
                  <div className='item-title col-1'>구매</div>
                </div>
                {priceResult?.map((item, i) => (
                  <div key={i} className='selling-item-con row'>
                    <div className='selling-item col-2'>
                      {item.seller.nickname}
                    </div>
                    <div className='selling-item col-2 item-price'>
                      {item.price}P
                    </div>
                    <div className='selling-item col-1'>
                      {item.opened ? <div>O</div> : <div>X</div>}
                    </div>
                    <div className='selling-item col-5'>
                      {item.detail ? item.detail : '-'}
                    </div>
                    <div className='selling-item col-1'>{item.cnt}</div>
                    {item.seller.id == userId ? 
                      <button disabled className='selling-item-disabled-buy-btn col-1'>삭제</button> :
                      item.cnt ? 
                        <button
                        className='selling-item-buy-btn col-1'
                        onClick={() =>
                          handleBuyOpen(
                            item.price,
                            item.detail,
                            item.seller.nickname,
                            item.opened,
                            item.created_at,
                            item.id
                          )
                        }
                      >
                        구매
                      </button> :
                      <button 
                      className='selling-item-disabled-buy-btn col-1'
                      disabled>구매</button>
                    }

                    <BuyItem
                      wantBuyOpen={wantBuyOpen}
                      setWantBuyOpen={setWantBuyOpen}
                      price={item.price}
                      detail={item.detail}
                      album_id={item.album}
                      item_id={item.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {priceResult[0] ? (
              <div></div>
            ) : (
              <div className='no-sell'>
                판매중인 앨범이 없어요. 앨범을 판매해보세요.
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}

// 구매 하기
function BuyItem({ wantBuyOpen, setWantBuyOpen }) {
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [boxOpen, setBoxOpen] = useState(true);

  const { point, price, detail, date, seller, opened, itemId } = useSelector(
    (state) => ({
      point: state.user.userPoint,
      price: state.store.itemPrice,
      detail: state.store.itemDetail,
      date: state.store.itemDate,
      seller: state.store.itemSeller,
      opened: state.store.itemOpened,
      itemId: state.store.itemId,
    })
  );

  const { access, name, phone, address, message } = useSelector((state) => ({
    access: state.user.access,
    name: state.user.userName,
    phone: state.user.userPhone,
    address: state.user.userAddress,
    message: state.user.userMessage,
  }));

  const after_price = point - (price + 3000);
  const dispatch = useDispatch();
  const { sellingItem } = useSelector((state) => ({
    sellingItem: state.store.sellingList,
  }));

  const handleBuyItem = () => {
    dispatch(buyItem(access, itemId))
      .then((res) => {
        setIsDone(true);
        dispatch(getUserInfo(access));
      })
      .catch((err) => console.log(err));
  };
  const allDone = () => {
    setIsDone(false);
    setWantBuyOpen(false);
  };

  return (
    <>
      <Modal open={wantBuyOpen} onClose={() => setWantBuyOpen(false)} BackdropProps={{style: {backgroundColor:'#ffffff00' }}}>
        <Box style={modalStyle2}>
          <div className={deliveryOpen || isDone ? 'd-none' : ''}>
            <div className='modal-top-con'>
              <div className='col-3'></div>
              <Typography
                className='modal-title col-6'
                variant='h4'
                component='span'
                fontFamily='Dung'
              >
                구매 정보 등록
              </Typography>
              <div className='modal-x-img-con col-3'>
                <img src={x} onClick={() => setWantBuyOpen(false)} />
              </div>
            </div>

            <div className='buy-item row'>
              <div className='col-2 p-0'>
                <img className='buy-album-img' src={sellingItem.album_img} />
              </div>
              <div className='buy-name-section col-6'>
                <span className='album-name'>{sellingItem.album_name}</span>
                <h4 className='singer-name'>{sellingItem.singer}</h4>
                <h5 className='release'>{sellingItem.release}</h5>
              </div>
              <div className='seller-info col-4'>
                <div className='seller-input'>
                  {seller}님의 &ensp;
                  {opened ? <span>개봉</span> : <span>미개봉</span>} 앨범 &ensp;
                  {/* {date.substring(0, 10)} <br /> */}
                  <h4>{detail}</h4>
                </div>
              </div>
            </div>

            <div className='buy-info-con'>
              <div className='buy-input-con'>
                <div className='buy-price-con'>
                  <div className='buy-info-item'>
                    <div className='col-2'>
                      배송정보
                      <button
                        onClick={() => {
                          setDeliveryOpen(true);
                        }}
                      >
                        수정
                      </button>
                    </div>

                    <div className='buy-input'>
                      <h5>수령인 : {name}</h5>
                      <h5>연락처 : {phone}</h5>
                      <h5>주소 : {address}</h5>
                      <h5>배송메세지 : {message}</h5>
                    </div>
                  </div>
                </div>
                <div className='buy-price-con'>
                  <div className='buy-info-item'>
                    <h4 className='col-2'>앨범 금액</h4>
                    <div className='col-2 buy-price'>{price + 'P'}</div>
                    <h4 className='col-2'>배송비</h4>
                    <div className='col-2 buy-price'>{'3000P'}</div>
                    <h4 className='col-2'>결제 포인트</h4>
                    <div className='col-2 buy-price'>{price + 3000 + 'P'}</div>
                  </div>

                  <div className='buy-result-con'>
                    {after_price < 0 ? (
                      <span className='minus'>
                        포인트가 {-after_price}P 만큼 부족합니다.
                      </span>
                    ) : (
                      <span className='plus'>
                        구매 후 예상 포인트: {after_price}P
                      </span>
                    )}
                    <button onClick={() => navigate('/exchange')}>
                      포인트 충전하러 가기
                    </button>
                  </div>
                </div>

                <button className='buy-btn' onClick={handleBuyItem}>
                  구매하기
                </button>
              </div>
            </div>
          </div>
          <div className={isDone ? 'buy-notice-con' : 'd-none'}>
            <div className='buy-notice-title'>구매 신청이 완료되었습니다.</div>
            <div className='buy-notice-content'>
              판매자가 10일 내에 운송장을 입력하지 않으면 구매가 자동
              취소됩니다.
            </div>
            <button onClick={allDone} className='buy-notice-btn'>
              닫기
            </button>
          </div>
          <ProfileDelivery
            deliveryOpen={deliveryOpen}
            setBoxOpen={setBoxOpen}
            setDeliveryOpen={setDeliveryOpen}
          />
        </Box>
      </Modal>
    </>
  );
}

// 판매등록
function RegisterSell({ wantSellOpen, setWantSellOpen, album_id }) {
  const { access, sellingList, priceList } = useSelector((state) => ({
    access: state.user.access,
    sellingList: state.store.sellingList,
    priceList: state.store.priceList,
  }));

  const [registerCount, setRegisterCount] = useState(1);
  const [isActivePrice, setIsActivePrice] = useState(false);
  const [registerPrice, setRegisterPrice] = useState(1000);
  const [registerDetail, setRegisterDetail] = useState('');
  const [isOpened, setIsOpened] = useState(true);
  const [isRegister, setIsRegister] = useState(false);

  const expectRevenue = Number(registerPrice) - 1000;

  useEffect(() => {
    handleActivePrice();
  });

  const handleActivePrice = () => {
    if (registerPrice < 1000) setIsActivePrice(false);
    else setIsActivePrice(true);
  };
  const registerReset = () => {
    setRegisterCount(1);
    setRegisterPrice(1000);
    setRegisterDetail('');
    setIsRegister(false);
    setWantSellOpen(false);
  };



  const isEnableBtn = () => {
    if (
      isActivePrice &&
      registerCount >= 1 &&
      registerDetail != ''
    )
      return true;
    else return false;
  };

  const dispatch = useDispatch();

  const registerAlbum = () => {
    dispatch(
      registerItem(
        access,
        album_id,
        isOpened,
        Number(registerPrice),
        registerCount,
        registerDetail
      )
    ).then(() => {
      setIsRegister(true);
    });
  };

  return (
    <div>
      <Modal open={wantSellOpen} onClose={() => setWantSellOpen(false)}>
        <Box style={modalStyle3}>
          <div className='modal-top-con'>
            <div className='col-3'></div>
            <Typography
              className='modal-title col-6'
              variant='h6'
              component='span'
              fontFamily='Dung'
            >
              앨범 판매 등록
            </Typography>
            <div className='modal-x-img-con col-3'>
              <img
                src={x}
                onClick={() => {
                  setWantSellOpen(false);
                  registerReset();
                }}
              />
            </div>
          </div>
          {/* 상단 앨범 정보 */}
          <div className={isRegister ? 'd-none' : 'register-content-con'}>
            <div className='register-item-con'>
              <div>
                <img
                  className='register-album-img'
                  src={sellingList.album_img}
                />
              </div>
              <div className='register-each-name-section'>
                <span className='register-album-name'>
                  {sellingList.album_name}
                </span>
                <span className='register-release'>{sellingList.release}</span>
                <h3>{sellingList.singer}</h3>
              </div>
            </div>
            {/* 판매 정보 인풋 */}
            <div className='register-containers row'>
              {/* 개봉여부 */}
              <div className='register-content row'>
                <h4 className='col-2'>개봉여부</h4>
                <FormControl className='opened-radio col-10'>
                  <RadioGroup
                    row
                    onChange={() => {
                      setIsOpened((prev) => !prev);
                    }}
                    defaultValue='개봉'
                  >
                    <FormControlLabel
                      value='개봉'
                      control={<Radio />}
                      label={<div>개봉</div>}
                    ></FormControlLabel>
                    <FormControlLabel
                      value='미개봉'
                      control={<Radio />}
                      label={<div>미개봉</div>}
                    ></FormControlLabel>
                  </RadioGroup>
                </FormControl>
              </div>

              <div className='register-content row'>
                <div className='register_price col-6'>
                  <div className='register-input-con row'>
                    <h4 className='col-4'>가격</h4>
                    <input
                      className='register-price-input col-8'
                      min={0}
                      value={registerPrice}
                      onChange={(e) => setRegisterPrice(e.target.value)}
                    ></input>
                  </div>
                  <div
                    className={
                      isActivePrice ? 'd-none' : 'albumprice-least col-12'
                    }
                  >
                    <h6>최소 앨범 가격은 1,000P 입니다.</h6>
                  </div>
                </div>
                <div className='register-cnt col-6'>
                  <h4 className='col-2'>수량</h4>
                  <div className='register-count'>
                    <span
                      className='minus'
                      onClick={() => {
                        if (registerCount > 1) {
                          setRegisterCount((prev) => prev - 1);
                        }
                      }}
                    >
                      -
                    </span>
                    <input
                      className='register-count-input'
                      type='number'
                      value={registerCount}
                      min='1'
                      readOnly
                    ></input>
                    <span
                      className='plus'
                      onClick={() => {
                        setRegisterCount((prev) => prev + 1);
                      }}
                    >
                      +
                    </span>
                  </div>
                </div>
              </div>
              {/* 상품상세 인풋 */}
              <div className='register-content row'>
                <div className='register-info row'>
                  <h4 className='col-2'>상품상세</h4>
                  <textarea
                    className='register-info-input col-10'
                    rows={4}
                    placeholder='정확한 앨범구성품과 상태를 적어주세요.'
                    multiline
                    variant='outlined'
                    value={registerDetail}
                    // label="."
                    label='상품상세'
                    onChange={(e) => setRegisterDetail(e.target.value)}
                    // onKeyPress={(e) => setRegisterDetail(e.target.value)}
                  />
                </div>
              </div>
              <div className='expect-revenue-phrase'>
                판매 후 예상 정산 포인트 {expectRevenue} P <br />
                <h6>
                  거래 수수료 1000P는 구매자와 판매자에게 씨앗으로 지급됩니다!
                </h6>
              </div>
            </div>

            <button
              onClick={registerAlbum}
              className={
                isEnableBtn()
                  ? 'register-btn-fin'
                  : 'register-btn-fin register-btn-fin-disabled'
              }
              disabled={!isEnableBtn()}
            >
              판매등록
            </button>
          </div>
          <div className={isRegister ? 'register-done-con' : 'd-none'}>
            <div className='register-done-text'> 등록이 완료되었습니다.</div>
            <button className='register-btn-fin' onClick={registerReset}>확인</button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

// 앨범 리스트
function AlbumList({ open, setOpen }) {
  const dispatch = useDispatch();
  const { access } = useSelector((state) => ({
    access: state.user.access,
  }));
  const [albumList, setAlbumList] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [result, setResult] = useState(albumList);
  const inputChange = (value) => {
    setSearchInput(value);
    if (value != '') {
      dispatch(getSearchItem(value)).then((res) => {
        setResult(res.payload);
      });
    } else {
      setResult(albumList);
    }
  };
  const handleDetailOpen = (albumId) => {
    dispatch(getItemInfo(albumId)).then(() => {
      setDetailOpen(true);
    });
  };

  useEffect(() => {
    dispatch(getStoreInfo(access)).then((res) => {
      setResult(res.payload);
      setAlbumList(res.payload);
    });
  }, []);

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box style={modalStyle2}>
          <div className='modal-top-con'>
            <div className='col-3'></div>
            <Typography
              className='modal-title col-6'
              variant='h6'
              component='span'
              fontFamily='Dung'
            >
              앨범 리스트
            </Typography>
            <div className='modal-x-img-con col-3'>
              <img src={x} onClick={() => setOpen(false)} />
            </div>
          </div>
          {/* 검색 창 */}
          <div>
            <TextField
              className='main-search-input'
              onChange={(event) => inputChange(event.target.value)}
              placeholder='앨범/아티스트를 검색하세요!'
              autoComplete='off'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <img
                      src={searchIcon}
                      style={{ width: '1em', opacity: 0.5 }}
                    />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position='end'></InputAdornment>,
              }}
              value={searchInput}
            />
          </div>
          {/* 앨범리스트 */}
          <div className='albumlist-modal-box'>
            <div className='scroll-container row'>
              {result.map((item, i) => (
                <div className='item col-4' key={i}>
                  <img
                    className='album-img'
                    onClick={() => handleDetailOpen(item.id)}
                    src={item.album_img}
                  />
                  <div className='album-info-con'>
                    <h4>{item.album_name}</h4>
                    <h6>{item.singer.split('(', 1)}</h6>
                  </div>
                  <EachAlbum
                    detailOpen={detailOpen}
                    setDetailOpen={setDetailOpen}
                    albumId={item.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

const Shop = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
      setLoading(false);
    }, 2000);
    }
  }, []);

  return (
    <div>
    {loading ? (<Spinner  loca={"앨범거래소"}/>) :
    (<div className='shop'>
      <div className='shop-back'>
        <div className='location-banner'>앨범 거래소</div>
        <button
          className='banner-open-btn'
          onClick={() => setOpen(true)}
        ></button>
        <AlbumList open={open} setOpen={setOpen} />
      </div>
      <button className="shop-exit" onClick={() => {
            navigate(-1);
          }}><p>EXIT</p></button>
    </div>)}
    </div>
  );
};

export default Shop;
