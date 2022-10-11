import { useEffect ,useState} from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  Typography } from '@mui/material';
import x from '../../assets/x.png';
import axios from 'axios';

const ProfilePoint= ({pointOpen, setBoxOpen, setPointOpen, profileClose}) => {
  const navigate = useNavigate();
  const [pointList, setPointList] = useState();
  const { point,access } = useSelector((state) => ({
    point: state.user.userPoint,
    access : state.user.access,
  }));
  
  useEffect(() => {
    handlePoint()
  }, []);

  const handlePoint = () => {
    axios({
      method: 'get',
      url: 'http://k6d202.p.ssafy.io:5000/accounts/history/point/',
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => {
        setPointList(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const item_types = {
    1 : "포인트 충전",
    2 : "포인트 환전",
    3 : "앨범 구매",
    4 : "앨범 판매",
    5 : "씨앗 구매",
    6 : "배송비"
  }

  const timeReturn = (value) => {
    return (`${value.slice(0, 10)} ${value.slice(11,19)}`)
  }

  const moveToExchange = () => {
    navigate('/exchange')
    profileClose()
  }

  return (
    <div  className={pointOpen ? '' : 'd-none'}>
      <div className='modal-top-con'>
        <div className='col-3'></div>
        <Typography
          className='modal-title col-6'
          variant='h6'
          component='span'
          fontFamily='Dung'
        >
          포인트 내역
        </Typography>
        <div className='modal-x-img-con col-3'>
          <img src={x} onClick={() => {setBoxOpen(true); setPointOpen(false);}}/>
        </div>
      </div>
      <div className="point-status">현재 보유 포인트 : {point}P</div>
      <div className='point-centent-con'>
        <div className='point-list-con'>
          <div className='point-list-item'><div>거래 종류</div> {pointList?.map((item, i) => <div className='point-list-detail' key={i}>{item_types[item.types]}</div>)}</div>
          <div className='point-list-item'><div>거래 내용</div> {pointList?.map((item, i) => <div className='point-list-detail' key={i}>{item?.album ? item?.album?.singer [item?.album?.album_name] : '-' }</div>)}</div>
          <div className='point-list-item'><div>거래 일시</div>{pointList?.map((item, i) => <div className='point-list-detail' key={i}> {timeReturn(`${item?.created_at}`)}</div>)}</div>
          <div className='point-list-item'><div>포인트</div> {pointList?.map((item, i) => <div className={item.types % 3 == 1 ? 'point-list-detail point-plus' : 'point-list-detail point-minus'} key={i}>{item?.trading_point}</div>)}</div>
          <div className='point-list-item'><div>거래 후 포인트</div>{pointList?.map((item, i) => <div className='point-list-detail' key={i}>{item?.total_point}</div>)}</div>
        </div>
        <button className='deliv-btn mt-1' onClick={moveToExchange}>환전하러 가기</button>
      </div>
    </div>
  )
}

export default ProfilePoint