import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { addNotification, createNotification } from '../../actions/notificationAction';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Grid, InputLabel, TextField, Tooltip, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { clearErrors, getUser, getUserDetails, updateUserLoggedIn } from '../../actions/userAction';
import { UPDATE_USER_RESET } from '../../constants/userConstant';

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


const UpdateUser = ({handleUpdateClose, match, selectedUserId}) => {
const dispatch = useDispatch();
const alert = useAlert();
const history = useHistory()
console.log(handleUpdateClose, selectedUserId)
const {loading, error:updateError, isUpdated} = useSelector((state)=>state.userDU)
const { error:userDetailError, combined } = useSelector((state) => state.userDetails);
console.log("UC for User",combined)

const combinedLog = useSelector((state) => state.logMember.combined);
  const name = combinedLog.user.fname + ' ' + combinedLog.user.lname
  console.log("name from UC", name)
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
const [isUser , setisUser]=useState(true);
const [fname , setFname]=useState("");
const [lname , setLname]=useState("");
const [profileImg , setProfileImg]=useState("");



  const userId = selectedUserId;
console.log(userId, combined)
  const [userDetailsFetched, setUserDetailsFetched] = useState(false);
  
  const handleImageChange = (e) => {
    console.log('ininin')

    const profile_img = e.target.files[0];
    console.log(profile_img)
    if (profile_img) {
      console.log('ininin')
      setProfileImg(profile_img);
    }
  };

  useEffect(() => {
    if(userDetailError){
     dispatch(clearErrors)
  }
  dispatch(getUserDetails(userId));
}, [dispatch, userId, userDetailError , alert]);

  useEffect(() => {
  //   if (combined && combined._id !== userId) {
  //     dispatch(getUserDetails(userId));
  //     setUserDetailsFetched(true);
  // } else  {
      setFname(combinedLog.user.fname);
      setLname(combinedLog.user.lname);
      setProfileImg(combinedLog.user.profile_img);

  // }
    if (userDetailError) {
      history.push({
        pathname: "/profile",
        state: {
          snackbar: {
            message: "User Details Not Found",
            severity: "error"
          }
        }
      });
      dispatch(clearErrors());
    }
     if (updateError) {
      handleUpdateClose()
      history.push({
        pathname: "/profile",
        state: {
          snackbar: {
            message: "User Details Updation Failed",
            severity: "error"
          }
        }
      });
      dispatch({ type: UPDATE_USER_RESET });
      dispatch(getUser());


      dispatch(clearErrors());
    }

    if (isUpdated) {
      handleUpdateClose()
      history.push({
        pathname: "/profile",
        state: {
          snackbar: {
            message: "Details Updated Successfully and Will be Rendered After Fresh Log-in",
            severity: "success"
          }
        }
      });
      dispatch({ type: UPDATE_USER_RESET });
    dispatch(getUser());
    dispatch(getUserDetails(combinedLog.user._id));
      dispatch(createNotification(combinedLog.user._id, `Details Updated Successfully and Will be Rendered After Fresh Log-in`));
    }
  }, [dispatch, alert, userDetailError, history, isUpdated, updateError, combinedLog, userId, userDetailsFetched]);
  const updateUserSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    console.log(profileImg)
    myForm.set("fname", fname);
    myForm.set("lname", lname);
    myForm.set("isUser", isUser);
    // if (profileImg instanceof File) {
    //   myForm.append('profile_img', profileImg);
    // }
    console.log(profileImg)

    if (profileImg){
    console.log(profileImg)

      myForm.append('profile_img', profileImg)
    console.log([...myForm])
      
    } 
    dispatch(updateUserLoggedIn( userId,myForm));
  };
  return (
    <div>
      <MetaData title="Update Client -- Test" />
        <form
          className="updateClientForm"
          encType="multipart/form-data"
          onSubmit={updateUserSubmitHandler}
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




export default UpdateUser
