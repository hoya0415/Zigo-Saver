import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BootPay from 'bootpay-js';
import {
  Box,
  Radio,
  RadioGroup,
  Modal,
  Button,
  Tab,
  FormControl,
  FormControlLabel,
  Stack,
  Alert,
  Snackbar,
  MenuItem,
  Muialert,
  Select,
} from '@mui/material';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import x from '../assets/x.png';
import {
  exchangeCashToPoint,
  exchangePointToCash,
} from '../_action/exchange_action';
import SeedBuy from '../components/Exchange/SeedBuy';
import { getForestList } from "../_action/forest_action";
import Spinner from '../components/Spinner/Spinner.js';

const modalStyle2 = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vmin',
  height: 'auto',
  backgroundColor: '#ffffff',
  border: 'none',
  borderRadius: '3vmin',
  boxShadow: 24,
  padding: '3vmin',
  backdrop: 0,
};

//포인트 충전, 환급 모달
function PointExchange({ pointExOpen, setPointExOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access, point } = useSelector((state) => ({
    access: state.user.access,
    point: state.user.userPoint,
  }));

  const [pointPaybackOpen, setPointPaybackOpen] = useState(false);
  // 탭 이동
  const [tabValue, setTabValue] = useState('1');
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 충전할 금액
  const [expoint, setExpoint] = useState('5000');
  const handleExpointChange = (event) => {
    setExpoint(event.target.value);
  };
  const expointNum = Number(expoint);
  const expectPoint = point + expointNum;

  const [payDone, setPayDone] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const handleClick = () => {
    setOpenAlert(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const onClickRequest = () => {
    BootPay.request({
      price: expointNum, //실제 결제되는 가격
      application_id: '6278bfaf2701800023f6b313',
      name: `포인트 결제 ${expointNum}P`, //결제창에서 보여질 이름
      pg: 'kakao',
      method: 'easy', //결제수단, 입력하지 않으면 결제수단 선택부터 화면이 시작합니다.
      show_agree_window: 0, // 부트페이 정보 동의 창 보이기 여부
      items: [
        {
          item_name: `${expointNum}P`, //상품명
          qty: 1, //수량
          unique: '123', //해당 상품을 구분짓는 primary key
          price: expointNum, //상품 단가
          cat1: 'TOP', // 대표 상품의 카테고리 상, 50글자 이내
          cat2: '티셔츠', // 대표 상품의 카테고리 중, 50글자 이내
          cat3: '라운드 티', // 대표상품의 카테고리 하, 50글자 이내
        },
      ],
      user_info: {
        username: '사용자 이름',
        email: '사용자 이메일',
        addr: '사용자 주소',
        phone: '010-1234-4567',
      },
      order_id: '고유order_id_1234', //고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
      params: {
        callback1: '그대로 콜백받을 변수 1',
        callback2: '그대로 콜백받을 변수 2',
        customvar1234: '변수명도 마음대로',
      },

    })
      .error(function (data) {
        //결제 진행시 에러가 발생하면 수행됩니다.
        console.log(data);
      })
      .cancel(function (data) {
        //결제가 취소되면 수행됩니다.
        console.log(data);
      })
      .ready(function (data) {
        // 가상계좌 입금 계좌번호가 발급되면 호출되는 함수입니다.
        console.log(data);
      })
      .confirm(function (data) {
        //결제가 실행되기 전에 수행되며, 주로 재고를 확인하는 로직이 들어갑니다.
        //주의 - 카드 수기결제일 경우 이 부분이 실행되지 않습니다.
        console.log(data);
        var enable = true; // 재고 수량 관리 로직 혹은 다른 처리
        if (enable) {
          BootPay.transactionConfirm(data); // 조건이 맞으면 승인 처리를 한다.
        } else {
          BootPay.removePaymentWindow(); // 조건이 맞지 않으면 결제 창을 닫고 결제를 승인하지 않는다.
        }
      })
      .close(function (data) {
        // 결제창이 닫힐때 수행됩니다. (성공,실패,취소에 상관없이 모두 수행됨)
        console.log(data);
      })
      .done(function (data) {
        dispatch(exchangeCashToPoint(access, expointNum))
        //결제가 정상적으로 완료되면 수행됩니다
        //비즈니스 로직을 수행하기 전에 결제 유효성 검증을 하시길 추천합니다.
        console.log(data);
        setPayDone(true);
        setOpenAlert(true);
      });
  };
  return (
    <div>
      <Modal open={pointExOpen} onClose={() => setPointExOpen(false)}>
        <Box style={modalStyle2}>
          <div className='npc-modal-x-img-con'>
            <img src={x} onClick={() => setPointExOpen(false)} />
          </div>
          <TabContext
            value={tabValue}
            onChange={handleTabChange}
            className='point-modal'
          >
            <Box>
              <div className='point-modal'>
                <TabList onChange={handleTabChange} className='point-tab-list'>
                  <Tab label='포인트 충전' value='1'></Tab>
                  <Tab label='포인트 환급' value='2'></Tab>
                </TabList>
              </div>
            </Box>
            <div className={payDone ? '' : 'd-none'}>
              <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar
                  open={openAlert}
                  autoHideDuration={3000}
                  onClose={handleClose}
                >
                  <Alert
                    severity='success'
                    sx={{ width: '100%' }}
                    className='pay-alert'
                    onClose={handleClose}
                  >
                    결제가 완료되었습니다!
                  </Alert>
                </Snackbar>
              </Stack>
            </div>

            <div className='pay-tabpanel'>
              <TabPanel value='1'>
                <div className='choice-point'>
                  <FormControl>
                    <div className='radio-buttons-group-label'>
                      <h3>충전할 포인트</h3> <br />
                      <RadioGroup
                        className='radio-buttons-group'
                        onChange={handleExpointChange}
                        defaultValue='5000'
                      >
                        <FormControlLabel
                          value='5000'
                          control={<Radio />}
                          label={
                            <div className='expoint-label-con'>
                              <div className='expoint-label-p'>5,000P</div>{' '}
                              <div className='expoint-label-c'>5,000원</div>{' '}
                            </div>
                          }
                        ></FormControlLabel>
                        <FormControlLabel
                          value='10000'
                          control={<Radio />}
                          label={
                            <div className='expoint-label-con'>
                              <div className='expoint-label-p'>10,000P</div>{' '}
                              <div className='expoint-label-c'>10,000원</div>{' '}
                            </div>
                          }
                        ></FormControlLabel>
                        <FormControlLabel
                          value='20000'
                          control={<Radio />}
                          label={
                            <div className='expoint-label-con'>
                              <div className='expoint-label-p'>20,000P</div>{' '}
                              <div className='expoint-label-c'>20,000원</div>{' '}
                            </div>
                          }
                        ></FormControlLabel>
                        <FormControlLabel
                          value='50000'
                          control={<Radio />}
                          label={
                            <div className='expoint-label-con'>
                              <div className='expoint-label-p'>50,000P</div>{' '}
                              <div className='expoint-label-c'>50,000원</div>{' '}
                            </div>
                          }
                        ></FormControlLabel>
                        <FormControlLabel
                          value='100000'
                          control={<Radio />}
                          label={
                            <div className='expoint-label-con'>
                              <div className='expoint-label-p'>100,000P</div>{' '}
                              <div className='expoint-label-c'>100,000원</div>{' '}
                            </div>
                          }
                        ></FormControlLabel>
                      </RadioGroup>
                    </div>
                  </FormControl>
                </div>
                <div className='after-point'>
                  <div className='after-point-text'>
                    <h5>보유 포인트 {point}P</h5>
                    <br />
                    <h5>충전 후 예상 보유 포인트 {expectPoint}P</h5>
                  </div>
                  <div>
                    <button
                      className='pay-btn'
                      onClick={() => onClickRequest()}
                    >
                      결제하기
                    </button>
                  </div>
                </div>
              </TabPanel>
              {/* 포인트 환급 탭 */}
              <TabPanel value='2'>
                <div className='payback-ask'>
                  <h3>
                    포인트는 씨앗으로 기부할 수도 있어요!
                    <br /> 정말 환급하시겠어요?
                  </h3>
                </div>
                <div className='payback-ask-btns'>
                  <div>
                    <button
                      className='payback-btn'
                      onClick={() => setPointPaybackOpen(true)}
                    >
                      환급하기
                    </button>
                  </div>
                  <div>
                    <button
                      className='payback-ask-btn2'
                      onClick={() => {
                        dispatch(getForestList()).then(() => {
                          navigate('/forestroad');
                        });
                      }}
                    >
                      기부하러가기
                    </button>
                  </div>
                </div>
                <ChildModal_payback
                  pointPaybackOpen={pointPaybackOpen}
                  setPointPaybackOpen={setPointPaybackOpen}
                />
              </TabPanel>
            </div>
          </TabContext>
        </Box>
      </Modal>
    </div>
  );
}

//포인트 환급탭에서 환급하기 누르면 나오는 모달
function ChildModal_payback({ pointPaybackOpen, setPointPaybackOpen }) {
  const dispatch = useDispatch();
  const [exchangePoint, setExchangePoint] = useState(0);
  const [isBankInfo, setIsBankInfo] = useState(false);
  const [doneInfo, setDoneInfo] = useState(false);
  const [isActiveNext, setIsActiveNext] = useState(false);
  const { access, point } = useSelector((state) => ({
    access: state.user.access,
    point: state.user.userPoint,
  }));
  const resPoint = point - exchangePoint;
  useEffect(() => {
    handleActiveNext();
  });

  const [bank, setBank] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [holder, setHolder] = useState('');
  const bankList = ['신한', '국민', '우리', '하나', '카카오', '제주', '기업', '우체국', '경남', '대구', '부산', '전북', '새마을' ]

  const handleActiveNext = () => {
    if (exchangePoint >= 3000 && point > 0 && exchangePoint <= point) {
      setIsActiveNext(false);
    } else {
      setIsActiveNext(true);
    }
  };
  // 환급 신청 제출
  const submitPayback = () => {
    dispatch(
      exchangePointToCash(
        access,
        Number(exchangePoint),
        bank,
        accountNum,
        holder
      )
    )
      .then(() => {
        setIsBankInfo(false);
        setDoneInfo(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Modal open={pointPaybackOpen} onClose={() => setPointPaybackOpen(false)}>
        <Box style={modalStyle2}>
          <div className='payback-title row'>
            <div className='col-3'></div>
            <h2 className='col-6'>포인트 환급</h2>
            <div className='npc-modal-x-img-con col-3'>
              <img src={x} onClick={() => setPointPaybackOpen(false)} />
            </div>
          </div>
          <div
            className={
              isBankInfo === false && doneInfo === false
                ? 'payback-point-con'
                : 'd-none'
            }
          >
            <div className='payback-points'>
              <div className='payback-point'>
                <h5>보유 포인트</h5>
                <h5>{point}P</h5>
              </div>
              <div className='payback-point'>
                <h6>-</h6>
              </div>
              <div className='payback-point'>
                <h5>환급할 포인트</h5>
                <input
                  type='number'
                  value={point > 0 ? exchangePoint : '0'}
                  max={point}
                  min={0}
                  className='payback-input'
                  onChange={(e) => {
                    if (point > 0) {
                      setExchangePoint(e.target.value);
                    }
                  }}
                ></input>
              </div>
              <div className='payback-point'>
                <h6>=</h6>
              </div>
              <div className='payback-point'>
                <h5>잔여 포인트</h5>
                <h5>{resPoint}P</h5>
              </div>
            </div>
            <div className={isActiveNext ? 'payback-least' : 'd-none'}>
              <h6>
                최소 환급 포인트는 3,000P 이며 보유 포인트를 초과할 수 없습니다.
              </h6>
            </div>
            <button
              onClick={() => {
                setIsBankInfo(true);
              }}
              className={
                isActiveNext ? 'payback-btn-fin-disabled' : 'payback-btn-fin'
              }
              disabled={isActiveNext}
            >
              다음
            </button>
          </div>
          <div
            className={
              isBankInfo === false ? 'd-none' : doneInfo ? 'd-none' : ''
            }
          >
            <div>
              <h3 className='payback-acctitle'>
                환급 받을 계좌 정보를 입력해주세요
              </h3>
            </div>
            <div className='payback-account'>
              <div className='payback-account-info'>
                <h3 className='payback-accinfo'>은행</h3>
                
                <h3 className='payback-accinfo'>계좌번호</h3>
                <h3 className='payback-accinfo'>예금주</h3>
              </div>
              <div className='payback-account-inputs'>
                <FormControl sx={{ minWidth: 100}}  variant="standard" className="bankform" >
                        <Select
                          value={bank}
                          onChange={(e) => setBank(e.target.value)}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          className='payback-accinput'
                        >
                          <MenuItem value={bankList[0]} style={{fontFamily:'Dung'}}>신한</MenuItem>
                          <MenuItem value={bankList[1]} style={{fontFamily:'Dung'}}>국민</MenuItem>
                          <MenuItem value={bankList[2]} style={{fontFamily:'Dung'}}>우리</MenuItem>
                          <MenuItem value={bankList[3]} style={{fontFamily:'Dung'}}>하나</MenuItem>
                          <MenuItem value={bankList[4]} style={{fontFamily:'Dung'}}>카카오</MenuItem>
                          <MenuItem value={bankList[5]} style={{fontFamily:'Dung'}}>제주</MenuItem>
                          <MenuItem value={bankList[6]} style={{fontFamily:'Dung'}}>기업</MenuItem>
                          <MenuItem value={bankList[7]} style={{fontFamily:'Dung'}}>우체국</MenuItem>
                          <MenuItem value={bankList[8]} style={{fontFamily:'Dung'}}>경남</MenuItem>
                          <MenuItem value={bankList[9]} style={{fontFamily:'Dung'}}>대구</MenuItem>
                          <MenuItem value={bankList[10]} style={{fontFamily:'Dung'}}>부산</MenuItem>
                          <MenuItem value={bankList[11]} style={{fontFamily:'Dung'}}>전북</MenuItem>
                          <MenuItem value={bankList[12]} style={{fontFamily:'Dung'}}>새마을</MenuItem>
                        </Select>
                      </FormControl>
                <input
                  className='payback-accinput'
                  onChange={(e) => setAccountNum(e.target.value)}
                ></input>
                <input
                  className='payback-accinput'
                  onChange={(e) => setHolder(e.target.value)}
                ></input>
              </div>
            </div>
            <div>
              <button className='payback-submit' onClick={submitPayback}>
                확인
              </button>
            </div>
          </div>
          <div className={doneInfo ? '' : 'd-none'}>
            <div className='payback-done'>환급 신청이 완료되었습니다.</div>
            <div>
              <button
                className='payback-submit'
                onClick={() => {
                  setIsBankInfo(false);
                  setDoneInfo(false);
                  setPointPaybackOpen(false);
                  setExchangePoint(0);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

const Exchange = () => {
  const navigate = useNavigate();

  const [pointExOpen, setPointExOpen] = useState(false);
  const [seedBuyOpen, setSeedBuyOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
      setLoading(false);
    }, 2000);
    }
  }, []);

  return (
    <>
    {loading ? (<Spinner loca={"환전소"}/> ) :
    (<div className='exchange'>
      <div className='exchange-back'>
        <div className='location-banner'>환전소</div>
        <div className='banner-open-btn-con'>
          <Button
            onClick={() => setPointExOpen(true)}
            className='banner-open-npc1'
          >
            포인트 환급하기
          </Button>
          <Button
            onClick={() => setSeedBuyOpen(true)}
            className='banner-open-npc2'
          >
            포인트로 씨앗 구매하기
          </Button>
        </div>
        <PointExchange
          pointExOpen={pointExOpen}
          setPointExOpen={setPointExOpen}
        />
        <SeedBuy seedBuyOpen={seedBuyOpen} setSeedBuyOpen={setSeedBuyOpen} />
      <button className='exchange-exit' onClick={() => {
            navigate(-1);
          }}><p>EXIT</p></button>
      </div>
    </div>)}</>
  );
};

export default Exchange;
