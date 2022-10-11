import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import character from '../../assets/character2.gif';

const Spinner = ({loca}) => {
  const [progLabel, setProgLabel] = useState(0);
  const [randomNum, setRandomNum] = useState(0);

  useEffect(() => {
    setRandomNum(Math.floor(Math.random()));
    const progTimer = setInterval(() => {
      setProgLabel((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 50
      );
    }, 800);
    return () => {
      clearInterval(progTimer);
    };
}, []);

  return (
    <div id='Account'>
      <div className='move-loading'>
        <div className='spinner'>
          <h3>{loca}로 이동중!</h3>
          <img src ={character}/>
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
  )
}

export default Spinner