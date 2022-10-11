import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupUser } from "../_action/user_action";
import { useDispatch } from "react-redux";
import {
  Modal,
  Typography,
  Backdrop,
  Box,
  TextField,
  Button,
  Paper,
  Skeleton,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import zigu_logo1 from "../assets/zigu_logo1.png";
import character0 from "../assets/character1.gif";
import character1 from "../assets/character2.gif";
import prev from "../assets/prev.png";
import next from "../assets/next.png";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputId, setInputId] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordConfirm, setInputPasswordConfirm] = useState("");
  const [inputNickname, setInputNickname] = useState("");
  const [inputCharacter, setInputCharacter] = useState(0);
  const [activeBtn, setActiveBtn] = useState(false); // 아이디, 비밀번호 유효성 검사 & 비밀번호 일치 여부
  const [activeId, setActiveId] = useState(true); // 아이디 유효성 검사
  const [activePw, setActivePw] = useState(true); // 비밀번호 유효성 검사
  const [activeNic, setActiveNic] = useState(true); // 닉네임 유효성 검사
  const [open, setOpen] = useState(false); // 아이디 중복 경고 창 오픈 여부
  const handleClose = () => setOpen(false);

  // 회원가입 버튼 활성화 여부
  const onActiveBtn = () => {
    if (isSamePassword() && inputPasswordConfirm !== "") {
      if (inputId && activePw && activeId && activeNic && inputNickname) {
        setActiveBtn(true);
      } else {
        setActiveBtn(false);
      }
    } else {
      setActiveBtn(false);
    }
  };

  // 아이디 입력 감지
  const onIdChange = (event) => {
    setInputId(event.target.value.trim());
    if (
      (event.target.value.trim().length > 3 &&
        event.target.value.trim().length < 13) ||
      event.target.value.trim().length == 0
    ) {
      setActiveId(true);
    } else {
      setActiveId(false);
    }
  };

  // 비밀번호 입력 감지
  const onPasswordChange = (event) => {
    setInputPassword(event.target.value.trim());
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    if (event.target.value.trim()) {
      setActivePw(passwordRegex.test(event.target.value.trim()));
    } else {
      setActivePw(true);
    }
  };

  const onPasswordChangeConfirm = (event) => {
    setInputPasswordConfirm(event.target.value.trim());
  };

  // {비밀번호 확인}과 {비밀번호}가 같은지 검사
  const isSamePassword = () => {
    if (inputPassword === inputPasswordConfirm || inputPasswordConfirm === "") {
      return true;
    } else {
      return false;
    }
  };

  // 닉네임 입력
  const onNicChange = (event) => {
    setInputNickname(event.target.value.trim());
    if (
      (event.target.value.trim().length > 1 &&
        event.target.value.trim().length < 9) ||
      event.target.value.trim().length == 0
    ) {
      setActiveNic(true);
    } else {
      setActiveNic(false);
    }
  };

  // 회원가입 제출
  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(
      signupUser(
        inputId,
        inputPassword,
        inputPasswordConfirm,
        inputNickname,
        inputCharacter
      )
    )
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      });
  };

  // 모달 스타일 선언
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    height: "150px",
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "30px",
    boxShadow: 24,
    padding: "30px",
    opacity: "85%",
  };

  return (
    <div id="Account">
      {/* 로고 필드 */}
      <div className="account-logo" alt="로고" onClick={() => navigate("/")}>
        <img src={zigu_logo1} />
      </div>
      <div className="signup-wrap">
        {/* 회원가입 필드 */}
        <div className="input-container row">
          <Box className="col-6" component="form" noValidate autoComplete="off">
            <div className="input-fld">
              {/* 아이디 */}
              <TextField
                autoFocus
                id="input"
                label="아이디"
                value={inputId || ""}
                onChange={onIdChange}
                onKeyUp={onActiveBtn}
              />
              <span className={activeId ? "err-msg hide" : "err-msg"}>
                영문 4글자 이상, 12글자 이하
              </span>
              {/* 비밀번호 */}
              <TextField
                id="input"
                label="비밀번호"
                type="password"
                autoComplete="current-password"
                value={inputPassword || ""}
                onChange={onPasswordChange}
                onKeyUp={onActiveBtn}
              />
              <span className={activePw ? "err-msg hide" : "err-msg"}>
                영문+숫자+특수문자 8글자 이상, 16글자 이하
              </span>
              {/* 비밀번호 확인 */}
              <TextField
                id="input"
                label="비밀번호 확인"
                type="password"
                autoComplete="current-password"
                value={inputPasswordConfirm || ""}
                onChange={onPasswordChangeConfirm}
                onKeyUp={onActiveBtn}
              />
              <span className={isSamePassword() ? "err-msg hide" : "err-msg"}>
                비밀번호가 일치하지 않습니다
              </span>
              {/* 닉네임 */}
              <TextField
                id="input"
                label="닉네임"
                value={inputNickname || ""}
                onChange={onNicChange}
                onKeyUp={onActiveBtn}
              />
              <span className={activeNic ? "err-msg hide" : "err-msg"}>
                2글자 이상, 8글자 이하
              </span>
            </div>
          </Box>
          {/* 캐릭터 & 회원가입버튼 필드 */}
          <div className="character-fld col-6">
            <div className="character-title">캐릭터 선택</div>
            <div>
              <Carousel
                className="carousel"
                autoPlay={false}
                animation={"slide"}
                indicators={false}
                cycleNavigation={"true"}
                onChange={(e) => {
                  setInputCharacter(e);
                }}
                duration="1000"
                navButtonsAlwaysVisible="true"
                navButtonsProps={{
                  style: {
                    backgroundColor: "transparent",
                  },
                }}
                navButtonsWrapperProps={{
                  style: {
                    top: '-5%',
                    margin: '0 1.5vmin 0 1.5vmin',
                  },
                }}
                NextIcon={<img src={next} className="carousel-icon" />}
                PrevIcon={<img src={prev} className="carousel-icon" />}
                activeIndicatorIconButtonProps={{
                  style: {
                    backgroundColor: "#6694cc20",
                  },
                }}
              >
                <div className="carousel-item">
                  <img src={character0} className="d-block m-auto" />
                </div>
                <div className="carousel-item">
                  <img src={character1} className="d-block m-auto" />
                </div>
              </Carousel>
            </div>
            <Button
              onClick={onSubmit}
              className="submit-btn"
              style={{
                background: activeBtn
                  ? "linear-gradient(to right, #b9d1ea, #a7a1d8)"
                  : "#E5E5E5",
              }}
              disabled={!activeBtn}
              type="submit"
              variant="contained"
            >
              회원가입
            </Button>
          </div>
        </div>
        <div className="hr"></div>
        <div className="move-to-fld">
          <span>이미 계정이 있으신가요? </span>
          <Link to="/login" className="move-to">
            로그인
          </Link>
        </div>
      </div>
      {/* 모달 */}
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box style={modalStyle} className="modal-box">
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              fontFamily="Dung"
            >
              회원가입 실패
            </Typography>
            <Typography
              id="modal-modal-description"
              fontFamily="Dung"
              sx={{ mt: 2 }}
            >
              이미 가입된 아이디입니다.
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default SignUp;
