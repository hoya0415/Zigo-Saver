import {  Typography,Table,TableBody , TableCell,TableContainer,TableHead ,TableRow , Paper  } from '@mui/material';
import x from '../../assets/x.png';
import {useEffect, useState} from "react";
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import { getSellDetail } from '../../_action/user_action';
import ProfileHistoryDetail from './ProfileHistoryDetail';

const ProfileSellDetail = ({sellPk,  sellDetailOpen, setSellDetailOpen, setSellOpen}) => {
  
  const dispatch = useDispatch();
  const [sellHistoryPk, setSellHistoryPk] = useState(0);
  const [sellHistoryOpen, setSellHistoryOpen] = useState(false);

  const { access , sellDetail} = useSelector((state) => ({
    access: state.user.access,
    sellDetail: state.user.sellDetail,
  }));

  const handelSellDetail = (index) =>{
    setSellDetailOpen(false)
    setSellHistoryPk(sellDetail?.type4_history[index]?.id)
    setSellHistoryOpen(true)
  }

  const timeReturn = (value) => {
    return value?.slice(0, 10)
  }

  useEffect(() => {
    if (sellDetailOpen)
    {
      dispatch(getSellDetail(access, sellPk))
    }
  }, [sellPk, sellDetailOpen]);

  return (
    <div>
      <div  className={sellDetailOpen ? '' : 'd-none'}>
        <div className='modal-top-con'>
          <div className='col-3'></div>
          <Typography
            className='modal-title col-6'
            variant='h6'
            component='span'
            fontFamily='Dung'
          >
            거래 내역
          </Typography>
          <div className='modal-x-img-con col-3'>
            <img src={x} onClick={() => {setSellDetailOpen(false); setSellOpen(true);}}/>
          </div>
        </div>

        <div className='sell-album-detail'>
          <img className='sell-album-img' src={sellDetail?.item?.album?.album_img}/>
          <div className='sell-album-detail-text'>
            <span className='sell-album-name'>{sellDetail?.item?.album?.album_name}</span>
            <span>{sellDetail?.item?.album?.singer}</span>
            <div className="sell-created">
              작성일:{timeReturn(sellDetail?.item?.created_at)} 　
              수량:{sellDetail?.cnt ? sellDetail?.cnt : '0'}
            </div>
            
            <div className='sell-item-detail'>
              <div>
                {sellDetail?.item?.opened ? <div>개봉 </div>:<div> 미개봉</div>}
                <h2>{sellDetail?.item?.detail}</h2>
              </div>
              <h2 className='sell-price'>{sellDetail?.item?.price}₩</h2>
            </div>
          </div>
        </div>

        <div>
          <TableContainer component={Paper} sx={{ mt:5 ,borderRadius: 5, p:4 }}>
            <Table sx={{ minWidth: 300}} aria-label="simple table">
              <TableHead >
                <TableRow >
                  <TableCell sx={{ fontSize: 18, fontFamily:'Dung', fontWeight:'bold'}} >구매자</TableCell>
                  <TableCell sx={{ fontSize: 18, fontFamily:'Dung', fontWeight:'bold'}} align="right">거래일</TableCell>
                  <TableCell sx={{ fontSize: 18, fontFamily:'Dung', fontWeight:'bold'}} align="right">수량</TableCell>
                  <TableCell sx={{ fontSize: 18, fontFamily:'Dung', fontWeight:'bold'}} align="right">가격</TableCell>
                  <TableCell sx={{ fontSize: 18, fontFamily:'Dung', fontWeight:'bold'}} align="right">구매확정</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sellDetail?.type3_history?.map((row, index) => (
                  <TableRow
                    hover 
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onClick={() => handelSellDetail(index)}
                    className='sell-pointer'
                  >
                    <TableCell sx={{ fontFamily:'Dung'}} component="th" scope="row">
                      {row?.user?.nickname}
                    </TableCell>
                    <TableCell sx={{ fontFamily:'Dung'}} align="right">{timeReturn(row?.created_at)}</TableCell>
                    <TableCell sx={{ fontFamily:'Dung'}} align="right">{row?.cnt}</TableCell>
                    <TableCell sx={{ fontFamily:'Dung'}} align="right">{row?.trading_point}</TableCell>
                    {row?.is_confirm ? 
                      <TableCell sx={{ fontFamily:'Dung'}} align="right">확정</TableCell> 
                      :<TableCell sx={{ fontFamily:'Dung'}} align="right">미확정</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <ProfileHistoryDetail
        historyId={sellHistoryPk} 
        historyOpen={sellHistoryOpen}
        setHistoryOpen={setSellHistoryOpen}
        setBeforeOpen={setSellDetailOpen}
      />
    </div>
  )
}

export default ProfileSellDetail