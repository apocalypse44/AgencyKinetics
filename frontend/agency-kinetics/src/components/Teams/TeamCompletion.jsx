import React, { Fragment, useState, useEffect } from "react";
import "./TeamCompletion.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { verifyTeamEmail, clearErrors} from "../../actions/teamAction";
import {Box, Container, Divider, Grid, Paper} from '@mui/material';
import {TextField , Button, Typography, FormLabel, Input, Icon, IconButton} from '@mui/material';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import AK from '../../Images/agencyKinetics.jpg'
import login from '../../Images/login.png'


import Loader from "../layout/Loader/Loader";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  divider: {
      // Theme Color, or use css color in quote
      background: 'rgb(255, 255, 255)',
  }

}));

const Teamcompletion = ({ history, match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const classes = useStyles();

  const { error, success, loading } = useSelector((state) => state.newTeam);
  const [lname, setLname] = useState("");
  const [fname, setfname] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("password", password);
    myForm.set("fname",fname );
    myForm.set("lname",lname );
    dispatch(verifyTeamEmail(match.params.token, fname, lname, password));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Details Uploaded Successfully");
      history.push("/combined/login");
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
                src={AK}
                alt="AgencyKinetics"
                style={{ width: "50px", height: "50px", marginBottom: "10px" }}

              />

              <Typography variant="h5" style={{ color: "rgb(0, 0, 0)", marginBottom: "20px" }}>
                Enter Your Details
              </Typography>

              {/* <GLogin/>
              <div style={{ marginBottom: "20px" }}></div> */}

              <form className="Form" onSubmit={resetPasswordSubmit}>
                <FormLabel style={{ color: "rgb(3, 2, 41)" }}>
                  First Name
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
                  value={fname}
                  onChange={(e) => setfname(e.target.value)}
                />

                <FormLabel style={{ color: "rgb(3, 2, 41)" }}>
                  Last Name
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
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
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

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ backgroundColor: "rgb(127, 86, 217)", marginTop: "16px" }}
                >
                  Submit
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
    {/* {isAuthenticated && <UserSideBar workspace_name={workspace_name} />} */}
  </Fragment>
//     <Fragment>

//         <Fragment>
//           <div className="resetPasswordContainer">
//             <div className="resetPasswordBox">
//               <h2 className="resetPasswordHeading">Details</h2>
//               <form
//                 className="resetPasswordForm"
//                 onSubmit={resetPasswordSubmit}
//               >
//                 <div>
//                   <input
//                     type="name"
//                     placeholder="First Name"
//                     required
//                     value={fname}
//                     onChange={(e) => setfname(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <input
//                     type="name"
//                     placeholder="Last Name"
//                     required
//                     value={lname}
//                     onChange={(e) => setLname(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <input
//                     type="password"
//                     placeholder="New Password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
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

export default Teamcompletion