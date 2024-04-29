

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData.jsx";
import { addNotification } from "../../actions/notificationAction.jsx";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min.js";
import { LazyLoadImage } from "react-lazy-load-image-component";
import car from "../../Images/car.jpg";
import { Box, Breadcrumbs, Button, CardContent, CardHeader, Dialog, DialogActions, DialogContent, Divider, Grid, Modal } from "@mui/material";
import { Card, DialogTitle, Typography } from "@material-ui/core";
import { logoutMember, setAuthentication, setSidebarVisibility } from '../../actions/loginAction';
import DOMPurify from 'dompurify';
import logoAK from "../../Images/logoAK.svg";
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import UpdatePassword from "../../Password/UpdatePassword.jsx";
import CustomizedSnackbars from "../../snackbarToast.jsx";
import UpdateClient from "../Clients/UpdateClient.jsx";
import { getUser, getUserDetails } from "../../actions/userAction.jsx";
import UpdateUser from "./UpdateUser.jsx";

const updateStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  boxShadow: '5px 5px 5px 5px rgba(255, 177, 0, 0.9)',
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid rgb(127, 86, 217)',
  borderRadius: 5, // Set border radius to 0 for rectangular border
  boxShadow: 24,
  overflow:'auto',
  p: 4,
  
};

const UserProfile = ({ match }) => {
  const history = useHistory()
  const dispatch = useDispatch();
  // const alert = useAlert();
  const [imageSrc, setImageSrc] = useState(null);

  const { combined} = useSelector((state) => state.logMember);
    console.log("user logged", combined)
  
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

  const name = combined.user.fname + ' ' + combined.user.lname
  const email = combined.user.email
  const role = formatRole(combined.user.role)
  const loggedInid = combined.user._id
  console.log(loggedInid)
  const createdOn = new Date(combined.user.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

  const location = useLocation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('');
  

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedId, setSelectedId] = useState('')
  const handleUpdateOpen = () => {
    setOpenUpdateModal(true);
  
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);

  const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);
  const handleUpdateProfile = (loggedin_id) => {
    setSelectedId(loggedin_id);
    console.log(loggedin_id, selectedId)
    setOpenUpdateProfileModal(true);
  };
  const handleUpdateProfileClose = () => setOpenUpdateProfileModal(false);

  
  const handleLogout = () => {
    // setActiveLink(index);
    dispatch(setSidebarVisibility(false));
    dispatch(setAuthentication(false));

    dispatch(logoutMember({ isAuthenticated: false }));
        alert("Logout Successfully");
        history.push('/');
        // window.location.href = '/'
  };


  const loadImages = async () => {
    var updatedImageSrcs = null;
    // console.log(combined.profile_img.data.data.length)
    console.log(combined.user)
    
      if (combined.user.profile_img.data.data.length > 0) {
        try {
          console.log(combined.user.profile_img.data.data.length)

          const response = await fetch(`data:${combined.user.profile_img.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(combined.user.profile_img.data.data)))}`);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          updatedImageSrcs = url;
        } catch (error) {
          console.error('Error fetching image:', error);
          updatedImageSrcs = null;
        }
      } else {
        updatedImageSrcs = null;
      }
    setImageSrc(updatedImageSrcs);
    console.log(imageSrc)

  };

  useEffect(() => {

    loadImages();
  }, [dispatch,  combined]);
  // useEffect(() => {
  //   dispatch(getUserDetails(combined.user._id));
  // }, [dispatch, combined.user.profile_img]);
  

  useEffect(() => {
    const snackbar = location.state?.snackbar;
    if (snackbar) {
      setSnackbarMessage(snackbar.message);
      setSeverity(snackbar.severity);
      setSnackbarOpen(true);
    }
    // Clear the state to avoid showing the Snackbar again on subsequent renders
    history.replace({ ...location, state: undefined });
  }, [location.state, history]);

  
  return (
    <div>
        <MetaData title ="User Details  -- Test"/>

        <CustomizedSnackbars
          open={snackbarOpen}
          handleClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          severity={severity}
        />

          <Modal
            open={openUpdateProfileModal}
            onClose={handleUpdateProfileClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={updateStyle}>
              {role === 'Client' ? (
                <>
                  <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center' }}>
                    Update Your Details
                  </Typography>
                  <UpdateClient handleUpdateClose={handleUpdateProfileClose} selectedClientId={selectedId} />
                </>
              ): (
                <>
                  <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center' }}>
                    Update Your Details
                  </Typography>
                  <UpdateUser handleUpdateClose={handleUpdateProfileClose} selectedUserId={selectedId} />
                </>
              )}
              </Box>
          </Modal>

        <Modal
            open={openUpdateModal}
            onClose={handleUpdateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={updateStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'}}>
                Update Password
              </Typography>

              <UpdatePassword handleUpdateClose={handleUpdateClose} combined={combined} />
            </Box>
          </Modal>

          <Grid container spacing={2} style={{marginTop: '0px', marginLeft: '10px', paddingRight: '50px', marginBottom: '10px' }}>
          <Grid item xs={12} >
      
          <Card style={{backgroundColor:'rgb(245, 245, 245)', height:'600px'}}>
          <CardHeader
            title={'User'}
            action={
              <>
              <Button startIcon={<EditIcon/>} style={{ backgroundColor: 'rgb(127, 86, 217)', marginRight:'8px' }} onClick={() => handleUpdateProfile(loggedInid)} variant="contained" type="submit"  
                >
                  Edit
                </Button>
              <Button startIcon={<LogoutIcon/>} style={{ backgroundColor: 'rgb(127, 86, 217)' }}  variant="contained" type="submit" onClick={handleLogout}>
                      Logout
                    </Button>
            </>
            }
          />
          <CardContent>
          <Grid container spacing={2} style={{ padding: ' 0px 20px 10px 10px', height:'250px'}}>
              {/* Left section with image */}
              <Grid item xs={5} style={{  borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '0px', display: 'flex',
                justifyContent: 'center', // Horizontally center
                alignItems: 'center', }}>
              {imageSrc ? (
              <LazyLoadImage
                    src={imageSrc}
                    alt={combined.user.fname}
                    effect="blur"
                    style={{ objectFit: 'cover', width: '75%', height: '75%', justifyContent:'center' }}
                  />
                  
              ):(
                <img
                        src={logoAK}
                        alt="AgencyKinetics"
                        height={140}
                        style={{ objectFit: 'cover', height: '140px', width: '100%' }}
                      />
              )}

                  </Grid>


                  <Grid
                    item
                    xs={6}
                    style={{
                      backgroundColor: 'rgb(127, 86, 217)',
                      borderRadius: '10px',
                      padding: '10px',
                      marginLeft: '5px',
                      marginBottom: '5px',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ flex: '1' }}>
                      <Typography variant="subtitle1" component="div" >
                         Name
                      </Typography>
                      <Typography variant="body1" component="div" style={{ overflowWrap: 'break-word' }}>
                         {name}
                      </Typography>
                    </div>
                    <Divider overlap="rectangular" flexItem style={{ background: 'rgb(255, 255, 255)' }} />
                    <div style={{ flex: '1' }}>
                      <Typography variant="subtitle1" component="div">
                        Created On
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {createdOn}
                      </Typography>
                    </div>
                    <Divider overlap="rectangular" flexItem style={{ background: 'rgb(255, 255, 255)' }} />
                    <div style={{ flex: '1' }}>
                      <Typography variant="subtitle1" component="div">
                        Role
                      </Typography>
                      <Typography variant="body1" gutterBottom>{role}</Typography>
                    </div>
                    
                  </Grid>
                
                  </Grid>
                  
          </CardContent>

          <CardHeader
            title={'Credentials'}
            action={
              <>
              <Button startIcon={<ChangeCircleIcon/>} style={{ backgroundColor: 'rgb(127, 86, 217)', marginRight:'8px' }} onClick={() => handleUpdateOpen(combined._id)} variant="contained" type="submit"  
                >
                  Change Password
                </Button>
            </>
            }
          />
          <CardContent>
            <Grid container spacing={2} style={{ padding: ' 0px 20px 10px 10px'}}>
                  <Grid
                    item
                    xs={12}
                    style={{
                      backgroundColor: 'rgb(127, 86, 217)',
                      borderRadius: '10px',
                      padding: '10px',
                      marginLeft: '5px',
                      marginBottom: '5px',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center', height:'150px'
                    }}
                  >
                    <div style={{ flex: '1' }}>
                      <Typography variant="subtitle1" component="div">
                        Email
                      </Typography>
                      <Typography variant="body1" gutterBottom>{email}</Typography>
                    </div>
                    
                    <Divider overlap="rectangular" flexItem style={{ background: 'rgb(255, 255, 255)' }} />
                    <div style={{ flex: '1' }}>
                    <Typography variant="subtitle1" component="div" >
                        Workspace Name
                      </Typography>
                    <Typography gutterBottom variant="body1"><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(combined.workspace_name) }} /></Typography>
                    </div>
                    
                  </Grid>
            </Grid>
                  
          </CardContent>
      </Card>
      </Grid>
    </Grid>  
     
    </div>
  );
};



export default UserProfile;