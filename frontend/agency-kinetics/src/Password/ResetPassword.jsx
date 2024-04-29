import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { resetPassword , clearErrors} from "../actions/userAction";
import login from '../Images/login.png'
import agencyKineticsLogo from '../Images/agencyKineticsLogo.svg'

import {TextField , Button, Typography, FormLabel, Input, Icon, IconButton} from '@mui/material';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import {Box, Container, Divider, Grid, Paper} from '@mui/material';
import { makeStyles } from "@material-ui/core";
import Loader from "../components/layout/Loader/Loader";
import { RESET_PASSWORD_RESET } from "../constants/userConstant";

const useStyles = makeStyles((theme) => ({
  divider: {
      // Theme Color, or use css color in quote
      background: 'rgb(255, 255, 255)',
  }

}));
const ResetPassword = ({ history, match }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const alert = useAlert();
  const { error, success, loading } = useSelector((state) => state.forgotpassword);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


const resetPasswordSubmit = (e) => {
  e.preventDefault();
  if (!password || !confirmPassword) {
    alert.error("Please enter both password fields.");
    return;
  }
  if (password !== confirmPassword) {
    alert.error("Passwords do not match.");
    return;
  }
  const myForm = new FormData();
  myForm.set("password", password);
  myForm.set("confirmPassword", confirmPassword);
  dispatch(resetPassword(match.params.resetToken, myForm));
};

  useEffect(() => {
    if (error) {
      alert.error(error);
      // dispatch(clearErrors());
      history.push('/combined/login')
      dispatch({ type: RESET_PASSWORD_RESET });
      
    }
    if (success) {
      alert.success("Password Updated Successfully");
      history.push("/");
      dispatch({ type: RESET_PASSWORD_RESET });

    }
  }, [dispatch, error, alert, history, success]);
  return (

    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Container maxWidth={false} disableGutters style={{ padding: 0}}>
          <Grid container>
            {/* Left Section with Inputs */}
            <Grid item xs={5} style={{ flex: 1 }}>
              <Box
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  // minHeight: "100vh",
                  marginLeft: '75px',
                  marginTop: '150px',
                  marginRight: '60px',
                  marginBottom: '0px',
                  alignItems: "center", // Center items horizontally
                  justifyContent: "center",
                }}
              >
                <img
                  src={agencyKineticsLogo}
                  alt="AgencyKinetics"
                  style={{ width: "50%", height: "50%", marginBottom: "10px" }}

                />

                <Typography variant="h5" style={{ color: "rgb(0, 0, 0)", marginBottom: "20px" }}>
                  Login
                </Typography>


                <form className="Form" onSubmit={resetPasswordSubmit}>
                  <FormLabel style={{ color: "rgb(3, 2, 41)" }}>
                    New Password
                  </FormLabel>
                  <TextField
                    type={showPassword ? "text" : "password"}

                    hiddenLabel
                    // id="filled-hidden-label-small"
                    variant="filled"
                    size="small"
                    // color="rgb(247, 247, 248)"
                    required
                    fullWidth
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton size="small" onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />

                  <FormLabel style={{ color: "rgb(3, 2, 41)" }}>
                    Confirm Password
                  </FormLabel>
                  <TextField
                    type={showPassword ? "text" : "password"}

                    hiddenLabel
                    // id="filled-hidden-label-small"
                    variant="filled"
                    size="small"
                    // color="rgb(247, 247, 248)"
                    required
                    fullWidth
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton size="small" onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />


                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ backgroundColor: "rgb(127, 86, 217)", marginTop: "16px" }}
                  >
                    Login
                  </Button>
                  
                </form>
              </Box>
            </Grid>


            <Divider orientation="vertical" overlap="rectangular" flexItem classes={{root: classes.divider}}/>

            {/* Right Section with Inputs */}
            <Grid item xs={12} style={{ flex: 1 }}>
            <Box
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={login}
                  alt="Login"
                  style={{ maxWidth: "75%", maxHeight: "75%" }}
                />
              </Box>

              {/* <Paper
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={login}
                  alt="Login"
                  style={{ maxWidth: "75%", maxHeight: "75%" }}
                />
              </Paper> */}
            </Grid>
          </Grid>
        </Container>
      )}
    </Fragment>
//     <Fragment>

//         <Fragment>
//           <div className="resetPasswordContainer">
//             <div className="resetPasswordBox">
//               <h2 className="resetPasswordHeading">Reset Password</h2>
//               <form
//                 className="resetPasswordForm"
//                 onSubmit={resetPasswordSubmit}
//               >
//                 <div>
//                   <input
//                     type="password"
//                     placeholder="New Password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>
//                 <div className="loginPassword">
//                   <input
//                     type="password"
//                     placeholder="Confirm Password"
//                     required
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                   />
//                 </div>
// <button>Update</button>
//               </form>
//             </div>
//           </div>
//         </Fragment>
//     </Fragment>
  );
};
export default ResetPassword;

