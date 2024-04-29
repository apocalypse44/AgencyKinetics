import React, { Fragment,  useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { clearErrors, loginUser } from "../../actions/userAction";
import UserSideBar from "../../DashBoard/UserSideBar";

const UserLogin = ({ history, location }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.userlog
  );



  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginworkspace, setLoginWorkspace] = useState("");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(loginEmail, loginPassword, loginworkspace));
  };


  const redirect = location.search ? location.search.split("=")[1] : <UserSideBar/>;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
       if (isAuthenticated) {
      history.push(redirect);
    }
  }, [dispatch, error, alert, history, isAuthenticated , redirect]);



  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">

              <form className="loginForm"  onSubmit={loginSubmit}>
                  <div className="loginEmail">
                  <input
                    type="workspace"
                    placeholder="workspace"
                    required
                    value={loginworkspace}
                    onChange={(e) => setLoginWorkspace(e.target.value)}
                  />
                </div>

                <div className="loginEmail">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
            
            </div>
          </div>
      )}
    </Fragment>
  );
};

export default UserLogin;