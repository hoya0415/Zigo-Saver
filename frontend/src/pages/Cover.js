import React from 'react';
import { useNavigate } from 'react-router-dom';
import zigu_logo1 from '../assets/zigu_logo1.png';


const Cover = () => {
  const navigate = useNavigate();
  return (
    <div id='Account'>
      <div className='cover-logo' onClick={() => navigate('/login')}>
        <img src={zigu_logo1} />
      </div>
    </div>
  );
};

export default Cover;
