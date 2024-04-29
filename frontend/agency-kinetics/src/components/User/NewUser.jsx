import React, {useEffect, useState, Fragment} from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { clearErrors, createUser } from '../../actions/userAction';
import { NEW_USER_RESET } from '../../constants/userConstant';
import {TextField , Button, Typography, FormLabel, Input, Icon, IconButton, InputAdornment, Checkbox, FormControlLabel} from '@mui/material';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import {Box, Container, Divider, Grid, Paper} from '@mui/material';
import { makeStyles } from "@material-ui/core";
import signup from '../../Images/signup.svg'
import AK from '../../Images/agencyKinetics.jpg'
import agencyKineticsLogo from '../../Images/agencyKineticsLogo.svg'

import Loader from "../../components/layout/Loader/Loader";

const useStyles = makeStyles((theme) => ({
  divider: {
      // Theme Color, or use css color in quote
      background: 'rgb(255, 255, 255)',
  }

}));

const NewUser = ({history}) => {
const dispatch = useDispatch();
const alert = useAlert();
const classes = useStyles();

const {loading, error, success} = useSelector((state)=>state.newUser)
console.log("su", success)

const [fname , setfname]=useState("");
const [lname, setlname] = useState("");
const [email , setemail]=useState("");
const [password , setpassword]=useState("");
const [workspace , setWorkspace]=useState("");
// const [password, setpassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user, linkClicked } = useSelector((state) => state.newUser);
  console.log("LC", linkClicked)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleCheckboxChange = () => {
    setAgreeTerms(!agreeTerms);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if(success) {
      if (linkClicked) {
        history.push('/services')
      }
      alert.success("User Created Successfully");

      // history.push("/services");
      dispatch({ type: NEW_USER_RESET });
    }
  }, [dispatch, alert, error, history, success]);

  const NewUserSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("fname", fname);
    myForm.set("lname", lname);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("workspace_name", workspace);
    dispatch(createUser(myForm));
    console.log([...myForm])
    alert.success('Verification Mail Sent')
    history.push('/verifyingPage')

  };
  

return (
  <div>
    <MetaData title=" Create User  -- Test" />


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
                  marginTop: '20px',
                  marginRight: '60px',
                  marginBottom: '0px',
                  alignItems: "center", // Center items horizontally
                  justifyContent: "center",
                }}
              >
                <img
                  src={agencyKineticsLogo}
                  alt="AgencyKinetics"
                  style={{ height:'50%', width:'50%', marginBottom: "10px" }}

                />

                <Typography variant="h5" style={{ color: "rgb(0, 0, 0)", marginBottom: "20px" }}>
                  Sign Up
                </Typography>

                {/* <GLogin/>
                <div style={{ marginBottom: "20px" }}></div> */}

                <form className="Form" onSubmit={NewUserSubmitHandler}>
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
                      // inputProps={{ readOnly: readOnly }}
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
                      onChange={(e) => setlname(e.target.value)}
                      // inputProps={{ readOnly: readOnly }}
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
                    onChange={(e) => setpassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton size="small" onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />

                  <FormLabel style={{ color: "rgb(3, 2, 41)" }}>
                      Email
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
                      onChange={(e) => setemail(e.target.value)}
                      // inputProps={{ readOnly: readOnly }}
                    />

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
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                      // inputProps={{ readOnly: readOnly }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                          @agencykinetics
                        </InputAdornment>
                        ),
                      }}
                    />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={agreeTerms}
                            onChange={handleCheckboxChange}
                            inputProps={{ 'aria-label': 'agree to terms and conditions' }}
                          />
                        }
                        label="I agree to the Terms and Conditions"
                      />
                  

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!agreeTerms}
                    style={{ backgroundColor: "rgb(127, 86, 217)", marginTop: "16px" }}
                  >
                    Sign Up
                  </Button>

                </form>
                <Button style={{color:'rgb(127, 86, 217)'}} onClick={() => history.push(`/combined/login`)}>Already Registered? Sign In</Button>

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
                  src={signup}
                  alt="signup"
                  style={{ maxWidth: "80%", maxHeight: "80%" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      )}
    </Fragment>
    
   </div>
);
};
export default NewUser
