import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { UPDATE_CLIENT_RESET } from '../../constants/clientsConstants';
import { getClientDetails, clearErrors, updateClient, getClient } from '../../actions/clientAction';
import "./Client.css";
import { addNotification, createNotification } from '../../actions/notificationAction';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Grid, InputLabel, TextField, Tooltip, Typography } from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { getUserDetails } from '../../actions/userAction';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const UpdateClient = ({handleUpdateClose, match, selectedClientId}) => {
const dispatch = useDispatch();
const alert = useAlert();
const history = useHistory()
console.log(handleUpdateClose, selectedClientId)
const {loading, error:updateError, isUpdated} = useSelector((state)=>state.clientDU)
const { error:clientDetailError, combined } = useSelector((state) => state.clientDetails);
console.log("ucCombined",combined)

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
const [email , setEmail]=useState("");
const [fname , setFname]=useState("");
const [lname , setLname]=useState("");
const [country , setCountry]=useState("");
const [state , setState]=useState("");
const [city , setCity]=useState("");
const [postalCode , setPostalCode]=useState("");
const [profileImg , setProfileImg]=useState("");



  const clientId = selectedClientId;
console.log(clientId, combined)

  const [clientDetailsFetched, setClientDetailsFetched] = useState(false);
  
  const handleImageChange = (e) => {
    const profile_img = e.target.files[0];
    setProfileImg(profile_img);
  };

  useEffect(() => {
    if(clientDetailError){
     dispatch(clearErrors)
  }
  dispatch(getClientDetails(clientId));
}, [dispatch, clientId, clientDetailError , alert]);

  useEffect(() => {
    if (combined && combined._id !== clientId) {
      dispatch(getClientDetails(clientId));
      setClientDetailsFetched(true);
  } else  {
      setEmail(combined.email);
      setFname(combined.fname);
      setLname(combined.lname);
      setCountry(combined.country);
      setState(combined.state);
      setCity(combined.city);
      setPostalCode(combined.postalCode);
      setProfileImg(combined.profile_img);

  }
    if (clientDetailError) {
      // alert.error(error);
      history.push({
        pathname: "/clients",
        state: {
          snackbar: {
            message: "Client Details Not Found",
            severity: "error"
          }
        }
      });
      dispatch(clearErrors());
    }
     if (updateError) {
      handleUpdateClose()
      // alert.success("Client Created Successfully");
      // history.push("/clients");
      history.push({
        pathname: "/clients",
        state: {
          snackbar: {
            message: "Client Updation Failed",
            severity: "error"
          }
        }
      });
      dispatch({ type: UPDATE_CLIENT_RESET });
      dispatch(getClient());

      // dispatch(addNotification({ message: `Client Updation Failed as:  ${updateError}`}));

      // alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      handleUpdateClose()
      // alert.success("Client Updated Successfully");
      // history.push("/clients");
      history.push({
        pathname: "/profile",
        state: {
          snackbar: {
            message: "Details Updated Successfully and Will be Rendered After Fresh Log-in",
            severity: "success"
          }
        }
      });
      dispatch({ type: UPDATE_CLIENT_RESET });
    dispatch(getClient());
    dispatch(getUserDetails(combinedLog.user._id));

      // dispatch(addNotification({ message: `Client ${combined.fname + " " + combined.lname} Updated Successfully`}));
      // dispatch(createNotification(combinedLog.user._id, `Client ${combined.fname + " " + combined.lname} Updated Successfully`));
      // dispatch(createNotification(combinedLog.user._id, `Details Updated Successfully`));
      dispatch(createNotification(combinedLog.user._id, `Details Updated Successfully and Will be Rendered After Fresh Log-in`));

      
    }
  }, [dispatch, alert, clientDetailError, history, isUpdated, updateError, combined, clientId, clientDetailsFetched]);

  const updateClientSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("email", email);
    myForm.set("fname", fname);
    myForm.set("lname", lname);
    myForm.set("country", country);
    myForm.set("state", state);
    myForm.set("city", city);
    myForm.set("postalCode", postalCode);
    myForm.set("isClient", isClient);
    if (profileImg){
      myForm.append('profile_img', profileImg)
    }
    console.log([...myForm])


    dispatch(updateClient( clientId,myForm));
  };
  return (
    <div>
      <MetaData title="Update Client -- Test" />
        <form
          className="updateClientForm"
          encType="multipart/form-data"
          onSubmit={updateClientSubmitHandler}
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
                onChange={(e) => setFname(e.target.value)}
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
                onChange={(e) => setLname(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>
            
            <Grid item xs={12}>
            <InputLabel id="fname-label">Email</InputLabel>

              <TextField
                type="email"
                label="Email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id="country-label" >Country</InputLabel>

              <TextField
                type="text"
                label="Country"
                placeholder="Country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id="State-label" >State</InputLabel>

              <TextField
                type="text"
                label="State"
                placeholder="State"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
            <InputLabel id="City-label" >City</InputLabel>

              <TextField
                type="text"
                label="City"
                placeholder="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id="pcode-label" >Postal Code</InputLabel>

              <TextField
                type="number"
                label="Postal Code"
                placeholder="Postal Code"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>

            <Grid item xs={12} sm={12}>
                <InputLabel id="profile-img">Profile Image</InputLabel>
                <Button
                fullWidth
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  endIcon={profileImg ? <FileDownloadDoneIcon /> : null}
                  style={{ backgroundColor: 'rgb(105, 56, 239)' }}

                >
                   <Tooltip title={profileImg ? "Image uploaded" : ""} placement="top">
                   <span>{profileImg ? "Uploaded file " + profileImg.name : "Upload file"}</span>
                  </Tooltip>
                  <VisuallyHiddenInput type="file" accept='image/*' onChange={handleImageChange}   />
                </Button>

                </Grid>

          </Grid>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              id="updateClientBtn"
              type="submit"
              disabled={loading}
              variant="contained"
              color="primary"
              style={{ backgroundColor: 'rgb(105, 56, 239)' }}
            >
              Update
            </Button>
          </div>
        </form>
      </div>
  );
};




export default UpdateClient