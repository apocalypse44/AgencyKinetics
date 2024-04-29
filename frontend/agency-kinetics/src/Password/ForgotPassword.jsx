import React, { Fragment, useState, useEffect } from "react";
import "./ForgotPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { forgotPassword , clearErrors} from "../actions/userAction";
import login from '../Images/login.png'
import agencyKineticsLogo from '../Images/agencyKineticsLogo.svg'

import {TextField , Button, Typography, FormLabel, Input, Icon, IconButton} from '@mui/material';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import {Box, Container, Divider, Grid, Paper} from '@mui/material';
import { makeStyles } from "@material-ui/core";
import Loader from "../components/layout/Loader/Loader";
import { FORGOT_PASSWORD_RESET } from "../constants/userConstant";

const useStyles = makeStyles((theme) => ({
  divider: {
      // Theme Color, or use css color in quote
      background: 'rgb(255, 255, 255)',
  }

}));

const ForgotPassword = ({history}) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, message, loading } = useSelector(
    (state) => state.forgotpassword
  );
console.log("message", message)
  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

      if (message) {
        // alert.success(message);
        history.push('/forgotMailSent')
         dispatch({ type: FORGOT_PASSWORD_RESET });
      }
  }, [dispatch, error, alert, message]);

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

                <Typography variant="h5" style={{ color: "rgb(0, 0, 0)", marginBottom: "40px" }}>
                  Forgot Password
                </Typography>

                <form className="Form"
                onSubmit={forgotPasswordSubmit} >

                  <FormLabel style={{ color: "rgb(3, 2, 41)" }}>
                    Email Address
                  </FormLabel>
                  <TextField
                    hiddenLabel
                    // id="filled-hidden-label-small"
                    variant="filled"
                    size="small"
                    // color="rgb(247, 247, 248)"
                    required
                    fullWidth
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />


                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ backgroundColor: "rgb(127, 86, 217)", marginTop: "16px" }}
                  >
                    Send Mail
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

            </Grid>
          </Grid>
        </Container>
      )}
    </Fragment>
    // <Fragment>

    //     <Fragment>
    //       <div className="forgotPasswordContainer">
    //         <div className="forgotPasswordBox">
    //           <h2 className="forgotPasswordHeading">Forgot Password</h2>

    //           <form
    //             className="forgotPasswordForm"
    //             onSubmit={forgotPasswordSubmit}
    //           >
    //             <div className="forgotPasswordEmail">
    //               <input
    //                 type="email"
    //                 placeholder="Email"
    //                 required
    //                 name="email"
    //                 value={email}
    //                 onChange={(e) => setEmail(e.target.value)}
    //               />
    //             </div>

    //             <input
    //               type="submit"
    //               value="Send"
    //               className="forgotPasswordBtn"
    //             />
    //           </form>
    //         </div>
    //       </div>
    //     </Fragment>
    // </Fragment>
  );
};

export default ForgotPassword;