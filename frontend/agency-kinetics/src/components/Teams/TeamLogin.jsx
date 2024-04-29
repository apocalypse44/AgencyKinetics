import React, { Fragment,  useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import {  clearErrors, loginTeam } from "../../actions/teamAction";

const TeamLogin = ({ history, location }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.teamlog
  );



  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [workspace, setWorkspace] = useState("");

  const Submit = (e) => {
    e.preventDefault();
    dispatch(loginTeam(Email, Password, workspace));
  };


  const redirect = location.search ? location.search.split("=")[1] : "/home";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
       if (isAuthenticated) {
        console.log("team", redirect)
      history.push(redirect);
    }
  }, [dispatch, error, alert, history, isAuthenticated , redirect]);



  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
          <div className="SignUpContainer">
            <div className="SignUpBox">

              <form className="Form"  onSubmit={Submit}>
                  {/* <div className="Email">
                  <input
                    type="workspace"
                    placeholder="workspace"
                    required
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                  />
                </div> */}

                <div className="Email">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="Password">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <input type="submit" value="" className="Btn" />
              </form>
            
            </div>
          </div>
      )}
    </Fragment>
  );
};

export default TeamLogin

// import React from 'react'

// const TeamLogin = () => {
//   return (
//     <div>TeamLogin</div>
//   )
// }

// export default TeamLogin