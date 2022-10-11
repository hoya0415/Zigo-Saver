import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import x from '../../assets/x.png';
import tree1 from '../../assets/tree1.png';
import { useDispatch, useSelector } from 'react-redux';
import { getSeedList } from '../../_action/user_action';
import ForestStatusModal from '../Forest/ForestStatusModal';
import { getForestInfo } from '../../_action/forest_action';

const ProfileSeed = ({ seedOpen, setBoxOpen, setSeedOpen }) => {
  const dispatch = useDispatch();
  const [seedList, setSeedList] = useState({
    total: 0,
    seed_list: [],
  });
  const [statusOpen, setStatusOpen] = useState(false);
  const { access, userSeedList } = useSelector((state) => ({
    access : state.user.access,
    userSeedList: state.user.seedList,
  }));

  const handleStatusOpen = (forestId) => {
    dispatch(getForestInfo(forestId)).then(() => setStatusOpen(true));
  };

  useEffect(() => {
    if (userSeedList) {
      setSeedList(userSeedList);
    }
  });

  useEffect(() => {
    dispatch(getSeedList(access)).then((res) => {
      setSeedList(res.payload);
    });
  }, []);

  return (
    <div className={seedOpen ? '' : 'd-none'}>
      <div className='modal-top-con'>
        <div className='col-3'></div>
        <Typography
          className='modal-title col-6'
          variant='h6'
          component='span'
          fontFamily='Dung'
        >
          씨앗 기부 내역
        </Typography>
        <div className='modal-x-img-con col-3'>
          <img
            src={x}
            onClick={() => {
              setBoxOpen(true);
              setSeedOpen(false);
            }}
          />
        </div>
      </div>
      <div className='point-status'>총 기부 씨앗 : {seedList?.total}</div>
      <div className='seed-content-con row'>
        {seedList?.seed_list.map((fore, i) => (
          <div
            className='seed-fore-item col-3'
            onClick={() => handleStatusOpen(fore.forest.id)}
            key={i}
          >
            <h4>{fore.cnt}</h4>
            <img src={tree1} />
            <h3>{fore.forest.singer}</h3>
          </div>
        ))}
      </div>
      <ForestStatusModal
        statusOpen={statusOpen}
        setStatusOpen={setStatusOpen}
      />
    </div>
  );
};

export default ProfileSeed;
