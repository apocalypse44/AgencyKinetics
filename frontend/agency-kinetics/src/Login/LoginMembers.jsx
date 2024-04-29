import React, { Fragment, useState, useEffect } from "react";
import Loader from "../components/layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { clearErrors, loginMember, logoutMember } from "../actions/loginAction";
import "./Login.css";
import { useHistory, useLocation, useParams } from "react-router-dom/cjs/react-router-dom.min";
import {TextField , Button, Typography, FormLabel, Input, Icon, IconButton} from '@mui/material';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import {Box, Container, Divider, Grid, Paper} from '@mui/material';
import { makeStyles } from "@material-ui/core";
import login from '../Images/login.png'
import GLogin from "../GoogleLogin";
import axios from "axios";
import AK from '../Images/agencyKinetics.jpg'
import agencyKineticsLogo from '../Images/agencyKineticsLogo.svg'

const useStyles = makeStyles((theme) => ({
  divider: {
      // Theme Color, or use css color in quote
      background: 'rgb(255, 255, 255)',
  }

}));

const LoginMembers = ({ history, location }) => {
  // const location = useLocation();
  // const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();
  const classes = useStyles();
  const { error, loading, isAuthenticated, showSidebar, combined } = useSelector(
    (state) => {
      console.log('lm', state.logMember)
      return state.logMember
    }
  );
  console.log("LMD", error, isAuthenticated, showSidebar, combined)
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [workspace_name, setWorkspace_name] = useState("");

  // State to control the visibility of the sidebar
  // const [showSideBar, setShowSidebar] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    console.log('useffect',error, isAuthenticated, showSidebar, combined)
    if (error) {
      console.log('ERORORORRO')
      console.log(error, isAuthenticated, showSidebar)
      if(error.message === 'Network Error'){

        alert.error('Network Error');
      }
      else{
      alert.error("Wrong Credential");
    }
      history.push('/combined/login')

      dispatch(clearErrors());

    }
    if (isAuthenticated) {
      // alert.success('fwfwfe')
      // If authentication is successful, set showSidebar to true
      console.log('hereisAuth')
      // setShowSidebar(true);
      history.push('/dashboard');
    }
    

    const queryParams = new URLSearchParams(location.search);
    console.log(location)
    const workspace = queryParams.get('workspace_name');
    console.log(workspace, readOnly)
    if (workspace != null) {
      setWorkspace_name(workspace);
      setReadOnly(true);
    }
    // dispatch(clearErrors())
  }, [dispatch, error, alert, history, location.search]);

  const Submit =  (e) => {
    e.preventDefault();
    //  dispatch(loginMember(Email, Password, workspace_name)).then(() => {
    //   console.log(error, loading, isAuthenticated, showSidebar)

    // });
    dispatch(loginMember(Email, Password, workspace_name));
    // history.push('/')
    // setShowSidebar(true);
    // history.push('/dashboard');
  };

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
                  marginTop: '120px',
                  marginRight: '60px',
                  marginBottom: '0px',
                  alignItems: "center", // Center items horizontally
                  justifyContent: "center",
                }}
              >
                <img
                src={agencyKineticsLogo}
                alt="AgencyKinetics"
                style={{ height:'50%', width:'50%',marginBottom: "10px" }}

              />

                <Typography variant="h5" style={{ color: "rgb(0, 0, 0)", marginBottom: "20px" }}>
                  Login
                </Typography>

                {/* <GLogin/>
                <div style={{ marginBottom: "20px" }}></div> */}

                <form className="Form" onSubmit={Submit}>
                  <FormLabel style={{ color: "rgb(3, 2, 41)" }}>
                    Workspace Name
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
                    value={workspace_name}
                    onChange={(e) => setWorkspace_name(e.target.value)}
                    inputProps={{ readOnly: readOnly }}
                  />

                  <FormLabel style={{ color: "rgb(3, 2, 41)" }}>
                    Email Address
                  </FormLabel>
                  <TextField
                    hiddenLabel
                    // id="filled-hidden-label-small"
                    variant="filled"
                    size="small"
                    // color="rgb(247, 247, 248)"
                    type="email"
                    required
                    fullWidth
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <FormLabel style={{ color: "rgb(3, 2, 41)" }}>Password</FormLabel>
                  <TextField
                    hiddenLabel
                    type={showPassword ? "text" : "password"}
                    // id="filled-hidden-label-small"
                    variant="filled"
                    size="small"
                    // color="rgb(247, 247, 248)"
                    required
                    fullWidth
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <Button style={{color:'rgb(127, 86, 217)'}} onClick={() => history.push(`/password/forgot`)}>Forgot Password</Button>
                <Button style={{color:'rgb(127, 86, 217)'}} onClick={() => history.push(`/combined/newUser`)}>New User? Sign Up</Button>
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
      {/* {isAuthenticated && <UserSideBar workspace_name={workspace_name} />} */}
    </Fragment>
  );
};

export default LoginMembers;
