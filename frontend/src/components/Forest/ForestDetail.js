import React, { useState, useEffect, useRef, createRef } from 'react';
import { useSelector } from 'react-redux';
import Unity, { UnityContent } from 'react-unity-webgl';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import ForestStatusModal from './ForestStatusModal';
import floor_seed3 from '../../assets/floor_seed3.png';
import tree1 from '../../assets/tree1.png';
const socket = io.connect('http://k6d202.p.ssafy.io:4000', {
  transports: ['websocket'],
});

const ForestDetail = () => {
  const { forestSinger, forestSeed, forestTree, nickname } = useSelector(
    (state) => ({
      forestSeed: state.forest.forestSeed,
      forestTree: state.forest.forestTree,
      forestSinger: state.forest.forestSinger,
      nickname: state.user.userNickname,
    })
  );
  const unityContent = new UnityContent(
    `Build_${forestSinger}/Build.json`,
    `Build_${forestSinger}/UnityLoader.js`
  );
  
  function getNickname() {
    unityContent.send("NetworkManager", "getnickname", nickname);
  };

  const [statusOpen, setStatusOpen] = useState(false);
  const [state, setState] = useState({ name: nickname, message: '' });
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('message', ({ name, message }) => {
      setChat((prev) => [...prev, { name, message }]);
    });
    let delayTime = 1000;
    for (let i = 0; i < 20; i++) {
      (function (x) {
        setTimeout(() => {      
          unityContent.send("NetworkManager", "getnickname", nickname);
          getNickname();
        }, delayTime * x);
      })(i);
    };    
    return () => {
      socket.close();
    };
  }, []);

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', state);
    setState({ name: nickname, message: '' });
  };

  //채팅창 스크롤 하단 고정
  const messageBoxRef = useRef(null);
  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h6 className={name == nickname ? 'myname' : ''}>
          {name}:<span>{message}</span>
        </h6>
      </div>
    ));
  };
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div>
      <div className='forest'>
        <div className='location-banner'>{forestSinger}</div>
        <div className='forest-status' onClick={() => setStatusOpen(true)}>
          <h4>* 숲 현황 *</h4>
          <div className='forest-status-btn'>
            <img src={tree1} /> X {forestTree}
          </div>
          <div className='forest-status-btn'>
            <img src={floor_seed3} /> X {forestSeed}
          </div>
          <button className='forest-status-dona-btn'>씨앗심기</button>
        </div>
        <ForestStatusModal
          statusOpen={statusOpen}
          setStatusOpen={setStatusOpen}
        />
      </div>
      {/* 채팅 */}
      <div className='chatbox'>
        {/* 채팅내용  */}
        <div className='render-chat' ref={messageBoxRef}>
          {renderChat()}
        </div>
        {/* 메세지입력 & 버튼  */}
        <form>
          <div className='chat-input'>
            <TextField
              color='secondary'
              name='message'
              onChange={(e) => onTextChange(e)}
              value={state.message}
              id='outlined-multiline-static'
              variant='standard'
              className='chat-send-input'
            />
            <button
              className='chat-send-btn'
              variant='contained'
              onClick={onMessageSubmit}
            >
              SEND
            </button>
          </div>
        </form>
      </div>
      {/* 유니티 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        <Unity unityContent={unityContent} className='unity' />
      </div>
    </div>
  );
};

export default ForestDetail;
