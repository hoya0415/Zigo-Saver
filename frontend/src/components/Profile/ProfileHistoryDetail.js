import {
  Typography,
  Select,
  MenuItem,
  TextField,
  Box,
  InputLabel,
  FormControl,
  Modal,
  Backdrop,
  FormHelperText,
} from '@mui/material';
import x from '../../assets/x.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getHistoryDetail, getBuyList, getUserInfo } from '../../_action/user_action';

const ProfileHistoryDetail = ({
  historyId,
  historyOpen,
  setHistoryOpen,
  setBeforeOpen,
}) => {
  const dispatch = useDispatch();

  const { access,historyDetail , userId} = useSelector((state) => ({
    access: state.user.access, 
    historyDetail: state.user.historyDetail, 
    userId: state.user.userId, 
  }));

  const [deliveryEdit, setDeliveryEdit] = useState(false);
  const [deliveryCo, setDeliveryCo] = useState(historyDetail?.history?.delivery);
  const [deliveryNum, setDeliveryNum] = useState(historyDetail?.history?.delivery_num);
  const [openModal, setOpenModal] = useState(false);

  const handleDeliveryCo = (event) => {
    setDeliveryCo(event.target.value);
  };

  const changeDeliveryNum = (event) => {
    setDeliveryNum(event.target.value);
  };

  const timeReturn = (value) => {
    return value?.slice(0, 10);
  };

  const handleBuyList = (type_pk) => {
    dispatch(getBuyList(access, type_pk));
  };
  const enterBtn = () => {
    if (deliveryEdit) {
      handleDeliveryNum();
    }
    setDeliveryEdit((prev) => !prev);
  };

  const deliveryCoList = ['대한통운' , '롯데택배' , '한진택배', '우체국택배', '로젠택배', 'CU편의점택배', 'GS편의점택배']

  const handleConfirm = () => {
    axios({
      method: 'post',
      url: `http://k6d202.p.ssafy.io:5000/accounts/confirmed/${historyId}/`,
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => {
        dispatch(getBuyList(access, 2));
        dispatch(getHistoryDetail(access, historyId));
        dispatch(getUserInfo(access))
        setOpenModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeliveryNum = () => {
    axios({
      method: 'put',
      url: `http://k6d202.p.ssafy.io:5000/accounts/delivery/${historyId}/`,
      headers: {
        Authorization: `Bearer ${access}`,
      },
      data: {
        delivery: deliveryCo,
        delivery_num: deliveryNum,
      },
    })
      .then((res) => {
        dispatch(getBuyList(access, 2));
        dispatch(getHistoryDetail(access, historyId));
        setDeliveryCo('')
        setDeliveryNum('')
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (historyOpen) {
      dispatch(getHistoryDetail(access, historyId));
    }
  }, [historyId, historyOpen]);

  const seedModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '350px',
    height: 'auto',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '30px',
    boxShadow: 24,
    padding: '30px',
    opacity: '0.9',
  };

  return (
    <div>
      <div className={historyOpen ? '' : 'd-none'}>
        <div className='modal-top-con'>
          <div className='col-3'></div>
          <Typography
            className='modal-title col-6'
            variant='h6'
            component='span'
            fontFamily='Dung'
          >
            거래 상세 내역
          </Typography>
          <div className='modal-x-img-con col-3'>
            <img
              src={x}
              onClick={() => {
                setHistoryOpen(false);
                setBeforeOpen(true);
                handleBuyList(1);
                setDeliveryEdit(false);
              }}
            />
          </div>
        </div>

        <div className='history-album-detail'>
          <img
            className='history-album-img'
            src={historyDetail?.history?.album?.album_img}
          />

          <div className='history-album-detail-text'>
            <span className='history-album-name'>
              {historyDetail?.history?.album?.album_name}
            </span>
            <span>{historyDetail?.history?.album?.singer}</span>

            <div className='history-item-detail'>
              <div>
                {historyDetail?.history?.item?.opened ? (
                  <div>개봉 </div>
                ) : (
                  <div> 미개봉</div>
                )}
                <h2>{historyDetail?.history?.item?.detail}</h2>
              </div>
              <div className='history-confirm-text'>
                {historyDetail?.history?.is_confirm ? (
                  <div>확정</div>
                ) : (
                  <div>미확정</div>
                )}
                <h2>{historyDetail?.history?.item?.price}₩</h2>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className='history-list-fld'>
            <div className='history-list-con'>
              <div className='history-item-con row'>
                <div className='history-item-title col-2'>거래일</div>
                <div className='history-item-title col-1'>수량</div>
                <div className='history-item-title col-2'>
                  {historyDetail?.history?.item?.seller === userId ? '구매자' : '판매자'}
                </div>
                <div className='history-item-title col-2'>택배사</div>
                <div className='history-item-title col-3'>송장번호</div>
                <div className='history-item-title col-1'>
                  {historyDetail?.history?.item?.seller === userId ? '송장입력' :'구매확정'}
                </div>
              
                <div className='history-item-con row'>
                  <div className='history-item-content col-2'>
                    {timeReturn(historyDetail?.history?.created_at) || '　'}
                  </div>

                  <div className='history-item-content col-1 '>
                  {historyDetail?.history?.cnt || '　'}
                  </div>

                  <div className='history-item-content col-2'>
                  {historyDetail?.other_user || '　'}
                  </div>

                  <div className='history-item-content col-2'>
                    {historyDetail?.history?.item?.seller === userId && deliveryEdit 
                      ?<FormControl sx={{ minWidth: 100}}  variant="standard">
                        <Select
                          value={deliveryCo || historyDetail?.history?.delivery}
                          onChange={handleDeliveryCo}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          defaultValue={historyDetail?.history?.delivery}
                        >
                          <MenuItem value={deliveryCoList[0]} style={{fontFamily:'Dung'}}>대한통운</MenuItem>
                          <MenuItem value={deliveryCoList[1]} style={{fontFamily:'Dung'}}>롯데택배</MenuItem>
                          <MenuItem value={deliveryCoList[2]} style={{fontFamily:'Dung'}}>한진택배</MenuItem>
                          <MenuItem value={deliveryCoList[3]} style={{fontFamily:'Dung'}}>우체국택배</MenuItem>
                          <MenuItem value={deliveryCoList[4]} style={{fontFamily:'Dung'}}>로젠택배</MenuItem>
                          <MenuItem value={deliveryCoList[5]} style={{fontFamily:'Dung'}}>CU편의점택배</MenuItem>
                          <MenuItem value={deliveryCoList[6]} style={{fontFamily:'Dung'}}>GS편의점택배</MenuItem>
                        </Select>
                      </FormControl>
                      :<div>{historyDetail?.history?.delivery || '　'}
                    </div>}
                  </div>

                  <div className='history-item-content col-3'>
                    {historyDetail?.history?.item?.seller === userId && deliveryEdit 
                    ?
                    <TextField
                    variant="standard" 
                    className='deliv-input col-9'
                    value={deliveryNum ||''}
                    onChange={changeDeliveryNum}
                    autoComplete='off'
                    disabled={!deliveryEdit}
                    />
                    :<div>{historyDetail?.history?.delivery_num || '　'}</div>}
                  </div>

                  <div className='history-no-border-top col-1'>
                  {historyDetail?.history?.item?.seller === userId  
                    ? ''
                    :<div>{historyDetail?.history?.is_confirm
                      ? <button disabled={true} className='sales-done-btn'>구매완료</button> 
                      :<button className='sales-btn' onClick={() => setOpenModal(true)}>구매확정</button>}
                    </div>}

                  {historyDetail?.history?.item?.seller === userId 
                  ?<div>{historyDetail?.history?.is_confirm
                    ?<button disabled={true} className='sales-done-btn'>수정불가</button>
                    :<button className='sales-btn' onClick={enterBtn}>
                      {historyDetail?.history?.delivery_num? '수정하기' :'송장입력'}</button> }
                  </div>
                  : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='forest-seed-modal'>
          <Modal
            open={openModal}
            aria-labelledby='forest-seed-modal-title'
            onClose={() => setOpenModal(false)}
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
                  구매 확정
                </Typography>
                <div className='forest-seed-modal-x-img-con col-3'>
                  <img src={x} onClick={() => setOpenModal(false)} />
                </div>
              </div>
              {/* 하단 필드 */}
              <div className='plant-seed-fld'>
                <div className='history-album-detail'>
                  {historyDetail?.history?.delivery && historyDetail?.history?.delivery_num
                    ? '확정 후 취소 불가'
                    : '송장입력 후 확정 가능'}
                </div>

                {historyDetail?.history?.delivery && historyDetail?.history?.delivery_num ? (
                  <div className='seed-btn-con'>
                    <button className='seed-btn' onClick={handleConfirm}>
                      확정하기
                    </button>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProfileHistoryDetail;
