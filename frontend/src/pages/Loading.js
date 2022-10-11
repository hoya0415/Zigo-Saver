import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import tuto from '../assets/tuto.png';


const Loading = () => {
  const [progLabel, setProgLabel] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 유니티 로딩이 완료되면 메인숲으로 이동
    if (progLabel == 100) {
      navigate('/main');
    }
  });
  
  useEffect(() => {
    const progTimer = setInterval(() => {
      setProgLabel((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      );
    }, 700);
    return () => {
      clearInterval(progTimer);
    };
  }, []);

  return (
    <div id='Account'>
      <div className='enter-loading'>
        <div className='tutorial'>
          <h3>앨범거래로 얻은 씨앗으로 <br /> 최애 아티스트의 숲을 키워보세요!</h3>
          <img src={tuto} />
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant='determinate' value={progLabel} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant='body2' color='text.secondary'>
              {`${Math.round(progLabel)}%`}
            </Typography>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Loading;
