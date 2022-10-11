import {  Typography, Box,Tab, Tabs } from '@mui/material';
import x from '../../assets/x.png';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect ,useState} from "react";
import { getBuyList } from '../../_action/user_action';
import ProfileHistoryDetail from './ProfileHistoryDetail';

const ProfileBuy = ({buyOpen, setBoxOpen, setBuyOpen}) => {
  const dispatch = useDispatch();

  const [buyHistoryPk, setBuyHistoryPk] = useState(0);
  const [buyHistoryOpen, setBuyHistoryOpen] = useState(false);

  const { access,buyList } = useSelector((state) => ({
    access : state.user.access,
    buyList : state.user.buyList,
  }));

  useEffect(() => {
    if (buyOpen)
    {
      dispatch(getBuyList(access, 1))
    }
  }, [buyOpen]);

  const handleBuyList = (type_pk) => {
    dispatch(getBuyList(access, type_pk));
  }

  const handelBuyDetail = (id) =>{
    setBuyOpen(false)
    setBuyHistoryPk(id)
    setBuyHistoryOpen(true)
  }
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div  className={buyOpen ? '' : 'd-none'}>
        <div className='modal-top-con'>
          <div className='col-3'></div>
          <Typography
            className='modal-title col-6'
            variant='h6'
            component='span'
            fontFamily='Dung'
          >
            구매 내역
          </Typography>
          <div className='modal-x-img-con col-3'>
            <img src={x} onClick={() => {setBoxOpen(true); setBuyOpen(false); handleBuyList(1)}} />
          </div>
        </div>
        
        <Box className='point-modal'>
          <Tabs value={value} onChange={handleChange} className='point-tab-list' >
            <Tab label="구매 중"  onClick={() => handleBuyList(1)} />
            <Tab label="구매 완료"  onClick={() => handleBuyList(2)}/>
          </Tabs>
        </Box>

        <div className='sales-modal-box'>

          <div className='sales-scroll-container row'>
            {buyList?.map((item) => 
              <div className="sales-item col-4" key={item.id} onClick={() => handelBuyDetail(item.id)}>
                <img className='sales-album-img' src={item?.album?.album_img} />
                <div className='sales-album-info-con'>

                <h4>{item?.album?.album_name} </h4>
                <div className='sales-album-info-singer'>{item?.album?.singer.split('(', 1)} </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      <ProfileHistoryDetail 
        historyId={buyHistoryPk} 
        historyOpen={buyHistoryOpen}
        setHistoryOpen={setBuyHistoryOpen}
        setBeforeOpen={setBuyOpen}
      />
    </div>
  )
}

export default ProfileBuy