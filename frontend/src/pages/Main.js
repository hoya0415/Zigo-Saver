import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import main_shop from "../assets/main_shop.png";
import main_exchange from "../assets/main_exchange.png";
import main_profile from "../assets/main_profile.png";
import main_forest from "../assets/main_forest.png";
import ProfileMain from "../components/Profile/ProfileMain";
import { useDispatch, useSelector } from "react-redux";
import {
  getStoreInfo,
  getSearchItem,
  getItemInfo,
} from "../_action/store_action";
import { getForestList } from "../_action/forest_action";

const Main = () => {
  const { access } = useSelector((state) => ({
    access : state.user.access,
  }));

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileOpen, setProfileOpen] = useState(false);
  const moveToAnywhere = (loca) => {
    if (loca == "/shop") {
      dispatch(getSearchItem(0));
      dispatch(getItemInfo(1));
      dispatch(getStoreInfo(access)).then(() => {
        navigate(loca);
      });
    } else if (loca == "/forestroad") {
      dispatch(getForestList()).then(() => {
        navigate(loca);
      });
    } else {
      navigate(loca);
    }
  };

  return (
    <div className="main">
      <div className="main-back"></div>
      <div className="main-move-btn-con">
        <div
          className="main-move-btn main-move-shop"
          onClick={() => moveToAnywhere("/shop")}
        >
          <div className="main-move-banner">
            <img src={main_shop} />
          </div>
        </div>
        <div
          className="main-move-btn main-move-exchange"
          onClick={() => moveToAnywhere("/exchange")}
        >
          <div className="main-move-banner">
            <img src={main_exchange} />
          </div>
        </div>
        <div
          className="main-move-btn main-move-forest"
          onClick={() => moveToAnywhere("/forestroad")}
        >
          <div className="main-move-banner">
            <img src={main_forest} />
          </div>
        </div>
        <div
          className="main-move-btn main-move-profile"
          onClick={() => setProfileOpen(true)}
        >
          <div className="main-move-banner">
            <img src={main_profile} />
          </div>
        </div>
      </div>
      <ProfileMain profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
    </div>
  );
};

export default Main;
