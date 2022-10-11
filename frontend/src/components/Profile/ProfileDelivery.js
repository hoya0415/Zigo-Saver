import React, { useState }  from 'react'
import { useSelector,useDispatch } from 'react-redux';
import {  Typography } from '@mui/material';
import x from '../../assets/x.png';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { getUserInfo } from '../../_action/user_action';

const ProfileDelivery = ({deliveryOpen, setBoxOpen, setDeliveryOpen}) => {
  const dispatch = useDispatch();
  const [deliveryEdit, setDeliveryEdit ] = useState(false);

  const { name, phone, address, message, access } = useSelector((state) => ({
    name: state.user.userName,
    phone: state.user.userPhone,
    address: state.user.userAddress,
    message : state.user.userMessage,
    access : state.user.access,
  }));

  const [inputName, setInputName ] = useState(name);
  const [inputPhone, setInputPhone ] = useState(phone);
  const [inputAddress, setInputAddress] = useState(address);
  const [inputMessage, setInputMessage ] = useState(message);

  const onNameChange = (event) => {
    setInputName(event.target.value);
  };

  const onPhoneChange = (event) => {
    setInputPhone(event.target.value);
  };

  const onAddressChange = (event) => {
    setInputAddress(event.target.value);
  };

  const onMessageChange = (event) => {
    setInputMessage(event.target.value);
  };
  const enterBtn = () => {
    if (deliveryEdit) {
      handleDelivery()
    }
    setDeliveryEdit((prev) => !prev)
  }

  const handleDelivery = () => {
    axios({
      method: 'put',
      url: 'http://k6d202.p.ssafy.io:5000/accounts/address/create/',
      headers: {
        Authorization: `Bearer ${access}`,
      },
      data: {
        name:inputName,
        phonenum : inputPhone,
        address : inputAddress,
        message: inputMessage
      }
    })
      .then((res) => {
        dispatch(getUserInfo(access));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <div  className={deliveryOpen ? '' : 'd-none'}>
        <div className='modal-top-con'>
          <div className='col-3'></div>
            <Typography
              className='modal-title col-6'
              variant='h6'
              component='span'
              fontFamily='Dung'
            >
              배송지 관리
            </Typography>
          <div className='modal-x-img-con col-3'>
            <img src={x} onClick={() => {setBoxOpen(true); setDeliveryOpen(false);}}/>
          </div>
        </div>
        <div className='deliv-content-con'>
          <div className='deliv-input-con'>
            <div className='deliv-input-item'>
              <h4>
                수령인 : 
              </h4>
              <TextField
                variant="standard" 
                className='deliv-input col-9'
                value={inputName || ''}
                onChange={onNameChange}
                disabled={!deliveryEdit}
                autoComplete='off'
              />
            </div>
            <div className='deliv-input-item'>
              <h4>
                연락처 : 
              </h4>
              <TextField
                variant="standard" 
                className='deliv-input col-9'
                value={inputPhone || ''}
                onChange={onPhoneChange}
                disabled={!deliveryEdit}
                autoComplete='off'
              />
            </div>
            <div className='deliv-input-item'>
              <h4>
                주소 : 
              </h4>
              <TextField
                variant="standard" 
                className='deliv-input col-9'
                value={inputAddress|| ''}
                onChange={onAddressChange}
                disabled={!deliveryEdit}
                autoComplete='off'
              />
            </div>
            <div className='deliv-input-item'>
              <h4>
              배송메세지 : 
              </h4>
              <TextField
                variant="standard"
                className='deliv-input col-9' 
                value={inputMessage || ''}
                onChange={onMessageChange}
                disabled={!deliveryEdit}
                autoComplete='off'
              />
            </div>
          </div>
          <button className='deliv-btn' onClick={enterBtn}>{ deliveryEdit ? '완료' : '수정하기'}</button>
        </div>
      </div>
    </div>
  )
}

export default ProfileDelivery