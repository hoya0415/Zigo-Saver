import React, { useState, useEffect } from 'react';
import './styles/App.scss';

import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Cover from './pages/Cover';
import Main from './pages/Main';
import Nav from './components/Header/Nav';
import ForestRoad from './pages/ForestRoad';
import ForestDetail from './components/Forest/ForestDetail';
import Exchange from './pages/Exchange';
import Shop from './pages/Shop';
import Loading from './pages/Loading';
import io from 'socket.io-client';
import { useSelector,useDispatch } from 'react-redux';
import { getUserInfo } from './_action/user_action';

const socket =  io.connect('http://k6d202.p.ssafy.io:9999/')

function App() {
  const access = useSelector((state) => (state.user.access))
  const dispatch = useDispatch();
  const [info, setInfo] = useState({'isAlarm': false, 'receiver': null})
  const [news, setNews] = useState({'forest': null, 'tree_cnt': null})

  useEffect(()=>{
    socket.on('alarm',({isAlarm, receiver})=>  
      setInfo({'isAlarm': isAlarm, 'receiver': receiver})
    )
    socket.on('new_tree', ({forest, tree_cnt})=> 
      setNews({'forest': forest, 'tree_cnt': tree_cnt})
    )
    dispatch(getUserInfo(access))
  })


  return (
    <Routes>
      <Route path='/' element={<Cover />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/loading' element={<Loading />} />

      <Route element={<Nav info={info} news={news} />}>
      <Route path='/main' element={<Main />} />
        <Route path='/forestroad' element={<ForestRoad />} />
        <Route path='/forest' element={<ForestDetail />} />
        <Route path='/exchange' element={<Exchange />} />
        <Route path='/shop' element={<Shop />} />
      </Route>

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
