import React, {useEffect, useState} from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { NEW_CLIENT_RESET, NEW_RESET } from '../../constants/clientsConstants';
import { clearErrors, createClient, getClient } from '../../actions/clientAction';
import {Grid , Button, TextField, InputLabel} from '@material-ui/core';
import { addNotification, createNotification } from '../../actions/notificationAction';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import CustomizedSnackbars from '../../snackbarToast';

const NewClient = ({handleClose}) => {
const dispatch = useDispatch();
const alert = useAlert();
const history = useHistory()
const {loading, error, success, combined} = useSelector((state)=>state.newClient)
console.log("su", success, combined)

const combinedLog = useSelector((state) => state.logMember.combined);
  const name = combinedLog.user.fname + ' ' + combinedLog.user.lname
  const formatRole = (role) => {
    switch (role) {
      case 'ASSIGNEE':
        return 'Assignee';
      case 'PROJECTMANAGER':
        return 'Project Manager';
      case 'ADMIN':
        return 'Admin';
      case 'SUPERADMIN':
        return 'Super Admin';
      case 'CLIENT':
          return 'Client';
      default:
        return role;
    }
  };
  const role = formatRole(combinedLog.user.role)
  console.log(role) 


const [isClient , setisClient]=useState(true);
const [email , setemail]=useState("");
const [fname , setfname]=useState("");
const [lname , setlname]=useState("");
const [password , setpassword]=useState("");
const [country , setcountry]=useState("");
const [state , setstate]=useState("");
const [city , setcity]=useState("");
const [postalCode , setpostalCode]=useState("");


const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (error) {
      // alert.error(error);
      handleClose()
      // history.push("/clients");
      history.push({
        pathname: "/clients",
        state: {
          snackbar: {
            message: `New Client Creation Failed as: ${error}`,
            severity: "error"
          }
        }
      });
      dispatch({ type: NEW_CLIENT_RESET });
      dispatch(getClient());

      dispatch(clearErrors());
      // dispatch(addNotification({ message: `New Client Creation Failed`}));


    }
    if(success) {
      handleClose()
      // alert.success("Client Created Successfully");
      // history.push("/clients");
      history.push({
        pathname: "/clients",
        state: {
          snackbar: {
            message: "New Client Created Successfully",
            severity: "success"
          }
        }
      });
      dispatch({ type: NEW_CLIENT_RESET });
      dispatch(getClient());
      // dispatch(addNotification({ message: `New Client ${fname} ${lname} Created Successfully`}));
      dispatch(createNotification(combinedLog.user._id, `New Client ${fname} ${lname} Created Successfully`));



    }
  }, [dispatch, alert, error, history, success]);

  const createClientSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("fname", fname);
    myForm.set("lname", lname);
    myForm.set("country", country);
    myForm.set("state", state);
    myForm.set("city", city);
    myForm.set("postalCode", postalCode);
    myForm.set("isClient", isClient);
    dispatch(createClient(myForm));
    console.log("mf", myForm)
  };
  
  
  return (
    <div>
        <MetaData title =" Create Team  -- Test"/>
        {/* <div className="newProductContainer"> */}
        <form
          className="createClientForm"
          encType="multipart/form-data"
          onSubmit={createClientSubmitHandler}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
            <InputLabel id="fname-label" style={{marginTop:'20px'}}>First Name</InputLabel>

              <TextField
                type="text"
                label="First Name"
                placeholder="First Name"
                required
                value={fname}
                onChange={(e) => setfname(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id="lname-label" style={{marginTop:'20px'}}>Last Name</InputLabel>

              <TextField
                type="text"
                label="Last Name"
                placeholder="Last Name"
                required
                value={lname}
                onChange={(e) => setlname(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>

            <Grid item xs={12}>
            <InputLabel id="email-label">Email</InputLabel>

              <TextField
                type="email"
                label="Email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
              
            </Grid>
            
            <Grid item xs={12}>
            <InputLabel id="password-label">Password</InputLabel>

              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id="country-label">Country</InputLabel>

              <TextField
                type="text"
                label="Country"
                placeholder="Country"
                // required
                value={country}
                onChange={(e) => setcountry(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
            <InputLabel id="state-label">State</InputLabel>

              <TextField
                type="text"
                label="State"
                placeholder="State"
                // required
                value={state}
                onChange={(e) => setstate(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id="pcode-label">Postal Code</InputLabel>

              <TextField
                type="number"
                label="Postal Code"
                placeholder="Postal Code"
                // required
                value={postalCode}
                onChange={(e) => setpostalCode(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id="city-label">City</InputLabel>

              <TextField
                type="text"
                label="City"
                placeholder="City"
                // required
                value={city}
                onChange={(e) => setcity(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>
          </Grid>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              id="createClientBtn"
              type="submit"
              disabled={loading}
              variant="contained"
              color="primary"
              style={{ backgroundColor: 'rgb(105, 56, 239)' }}
            >
              Create
            </Button>
          </div>
        </form>
            {/* <h1>Create Team</h1>
                                    <div>
              <input
                type="boolean"
                placeholder="isClient"
                required
                value={isClient}
                onChange={(e) => setisClient(e.target.value)}
              />
            </div>
                        <div>
              <input
                type="text"
                placeholder="fname"
                required
                value={fname}
                onChange={(e) => setfname(e.target.value)}
              />
            </div>
                        <div>
              <input
                type="text"
                placeholder="lname"
                required
                value={lname}
                onChange={(e) => setlname(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="email"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>
                                    <div>
              <input
                type="text"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
                        <div>
              <input
                type="text"
                placeholder="country"
                required
                value={country}
                onChange={(e) => setcountry(e.target.value)}
              />
            </div>            <div>
              <input
                type="text"
                placeholder="state"
                required
                value={state}
                onChange={(e) => setstate(e.target.value)}
              />
            </div>            <div>
              <input
                type="text"
                placeholder="postalCode"
                required
                value={postalCode}
                onChange={(e) => setpostalCode(e.target.value)}
              />
            </div>            <div>
              <input
                type="text"
                placeholder="city"
                required
                value={city}
                onChange={(e) => setcity(e.target.value)}
              />
            </div>

      <br />
            <button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Create
            </button>
          </form>
        </div> */}
    </div>
  )
}

export default NewClient;