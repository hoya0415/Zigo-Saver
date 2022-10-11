import {  Typography, Box,Tab, Tabs } from '@mui/material';
import x from '../../assets/x.png';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect ,useState} from "react";
import { getSellList } from '../../_action/user_action';
import ProfileSellDetail from './ProfileSellDetail';

const ProfileSell = ({sellOpen, setBoxOpen, setSellOpen}) => {
  const dispatch = useDispatch();

  const [sellPk, setSellPk] = useState(0);
  const [sellDetailOpen, setSellDetailOpen] = useState(false);

  const { access,sellList } = useSelector((state) => ({
    access : state.user.access,
    sellList : state.user.sellList,
  }));

  useEffect(() => {
    if (sellOpen)
    {
      dispatch(getSellList(access, 1))
    }
  }, [sellOpen]);

  const handleSellList = (type_pk) => {
    dispatch(getSellList(access, type_pk));
  }

  const handleSellDetail = (id) =>{
    setSellOpen(false)
    setSellPk(id)
    setSellDetailOpen(true)
  }
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div  className={sellOpen ? '' : 'd-none'}>
        <div className='modal-top-con'>
            <div className='col-3'></div>
            <Typography
              className='modal-title col-6'
              variant='h6'
              component='span'
              fontFamily='Dung'
            >
              판매 내역
            </Typography>
            <div className='modal-x-img-con col-3'>
              <img src={x} onClick={() => {setBoxOpen(true); setSellOpen(false); handleSellList(1);}} />
            </div>
          </div>

        <Box className='point-modal'>
          <Tabs value={value} onChange={handleChange} className='point-tab-list' >
            <Tab label="판매 중"  onClick={() => handleSellList(1)} />
            <Tab label="판매 완료"  onClick={() => handleSellList(2)}/>
          </Tabs>
        </Box>
        <div className='sales-modal-box'>

        <div className='sales-scroll-container row'>
          {sellList?.map((item) => 
            <div  className="sales-item col-4" key={item.id} onClick={() => handleSellDetail(item.id)}>
                <img className='sales-album-img' src={item?.album?.album_img} />
                <div className='sales-album-info-con'>

                <h4>{item?.album?.album_name} </h4>
                <div className='sales-album-info-singer'>{item?.album?.singer.split('(', 1)} </div>
                </div>
            </div>)}
        </div>
        </div>
      </div>
      <ProfileSellDetail 
        sellPk={sellPk} 
        sellDetailOpen={sellDetailOpen}
        setSellDetailOpen={setSellDetailOpen}
        setSellOpen={setSellOpen}
      />
    </div>
  )
}

export default ProfileSell