import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Modal, Typography, Backdrop, Slide, Fade, Grow } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUserInfo, loginUser } from '../_action/user_action';
import zigu_logo1 from '../assets/zigu_logo1.png';
import heart from '../assets/heart.gif';

const Login = () => {
  // 변수
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputId, setInputId] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [activeBtn, setActiveBtn] = useState(false);
  const [activeId, setActiveId] = useState(true);
  const [activeEntBtn, setActiveEntBtn] = useState(false);
  const [open, setOpen] = useState(false);

  // 모달스타일
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: '150px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '30px',
    boxShadow: 24,
    padding: '30px',
    opacity: '85%',
  };

  // 로그인 버튼 활성화 유효성 검사
  const onActiveBtn = () => {
    if (
      inputId &&
      inputPassword &&
      inputPassword.trim().length >= 8 &&
      activeId
    ) {
      setActiveBtn(true);
    } else {
      setActiveBtn(false);
    }
  };

  // 아이디 입력
  const onIdChange = (event) => {
    setInputId(event.target.value.trim());
    if (
      (event.target.value.length > 3 && event.target.value.length < 13) ||
      event.target.value.length == 0
    ) {
      setActiveId(true);
    } else {
      setActiveId(false);
    }
  };

  // 비밀번호 입력
  const onPasswordChange = (event) => {
    setInputPassword(event.target.value.trim());
  };

  // 제출
  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(inputId, inputPassword))
      .then((res) => {
        if (res.payload.access) {
          localStorage.setItem('jwt', res.payload.access);
          localStorage.setItem('userName', inputId);
          setActiveEntBtn(true);
          dispatch(getUserInfo(res.payload.access))
        }
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      });
  };

  return (
    <div id='Account'>
      {/* 로고 필드 */}
      <div className='account-logo' alt='로고' onClick={() => navigate('/')}>
        <img src={zigu_logo1} />
      </div>
      <div className={activeEntBtn ? 'd-none' : 'account-wrap'}>
        <div>
          {/* 로그인 필드 */}
          <Box
            onSubmit={onSubmit}
            component='form'
            noValidate
            autoComplete='off'
          >
            <div className='input-fld'>
              <TextField
                autoFocus
                id='input'
                label='아이디'
                value={inputId || ''}
                onChange={onIdChange}
                onKeyUp={onActiveBtn}
              />
              <span className={activeId ? 'err-msg hide' : 'err-msg'}>
                4글자 이상, 12글자 이하
              </span>

              <TextField
                id='input'
                label='비밀번호'
                type='password'
                autoComplete='current-password'
                value={inputPassword || ''}
                onChange={onPasswordChange}
                onKeyUp={onActiveBtn}
              />
              <Button
                className='submit-btn'
                style={{
                  background: activeBtn
                    ? 'linear-gradient(to right, #b9d1ea, #a7a1d8)'
                    : '#E5E5E5',
                }}
                disabled={!activeBtn}
                type='submit'
                variant='contained'
              >
                로그인
              </Button>
            </div>

            <div className='hr'></div>

            <div className='move-to-fld'>
              <span>계정이 없으신가요? </span>
              <Link to='/signup' className='move-to'>
                회원가입
              </Link>
            </div>
          </Box>

          {/* 모달 */}
          <div>
            <Modal
              open={open}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
              onClose={() => setOpen(false)}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Box style={modalStyle} className='modal-box'>
                <Typography
                  id='modal-modal-title'
                  variant='h6'
                  component='h2'
                  fontFamily='Dung'
                >
                  로그인 실패
                </Typography>
                <Typography
                  id='modal-modal-description'
                  fontFamily='Dung'
                  sx={{ mt: 2 }}
                >
                  계정 정보를 확인해주세요!
                </Typography>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
      <div
        className={activeEntBtn ? 'enter-btn' : 'd-none'}
        onClick={() => navigate('/loading')}
      >
        <img src={heart} />
        입장하기!
        <img src={heart} />
      </div>
    </div>
  );
};

export default Login;
