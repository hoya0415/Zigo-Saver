import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import character2 from '../assets/character2.gif';
import { useDispatch, useSelector } from 'react-redux';
import { getForestInfo } from '../_action/forest_action';
import Spinner from '../components/Spinner/Spinner.js';

const ForestRoad = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { forestList } = useSelector((state) => ({
    forestList: state.forest.forestList,
  }));

  const moveToForest = (forestId) => {
    dispatch(getForestInfo(forestId)).then(() => navigate(`/forest`));
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
      setLoading(false);
    }, 2000);
    }
  }, []);

  return (
    <>
    {loading ? (<Spinner loca={"숲으"}/>) :
    (
    <div>
      <div className='road-back'>
        <div className='location-banner'>숲</div>
        <div className='forest-character'>
          <img src={character2} />
        </div>
        <div className='forest-item-con'>
          {forestList?.map((item, i) => (
            <div
              className='forest-item'
              onClick={() => moveToForest(`${item?.id}`)}
              key={i}
            >
              {item?.singer}
            </div>
          ))}
        </div>
        <div className='forest-exit-con'>
        <button className='forest-exit' onClick={() => {
            navigate(-1);
          }}><p>EXIT</p></button>
        </div>
      </div>
    </div>)}</>
  );
};

export default ForestRoad;
