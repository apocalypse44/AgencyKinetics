import React, { Fragment, useState, useEffect } from "react";
import "./UpdatePassword.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "../constants/userConstant";
import { updatePassword,clearErrors } from "../actions/userAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {Visibility, VisibilityOff} from '@material-ui/icons';
import { Button, Grid, IconButton, InputLabel, TextField } from "@mui/material";
import MetaData from "../components/layout/MetaData";
import { createNotification } from "../actions/notificationAction";


const UpdatePassword = ({ handleUpdateClose, combined }) => {
  const userId = combined.user._id
  const history = useHistory()
  const dispatch = useDispatch();
  const alert = useAlert();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const { error, isUpdated, loading } = useSelector((state) => state.userDU);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      // alert.error(error);

      console.log(error)
      handleUpdateClose()
      // alert.success("Client Created Successfully");
      // history.push("/clients");
      history.push({
        pathname: "/profile",
        state: {
          snackbar: {
            message: `Password Updation Failed as: ${error}`,
            severity: "error"
          }
        }
      });
      dispatch({ type: UPDATE_PASSWORD_RESET });
      dispatch(clearErrors());
    }

    if (isUpdated) {
      handleUpdateClose()
      // alert.success("Service Updated Successfully");
      // history.push("/services");
      history.push({
        pathname: "/profile",
        state: {
          snackbar: {
            message: "Password Updated Successfully",
            severity: "success"
          }
        }
      });
      // alert.success("Profile Updated Successfully");
      dispatch({type: UPDATE_PASSWORD_RESET});
    dispatch(createNotification(userId, `Password Updated Successfully`));

    }

  }, [dispatch, error, alert, history, isUpdated]);

  return (
    <div>
      <MetaData title="Update Password -- Test" />
  
      {/* <div className="newProductContainer"> */}
        <form
          className="updatePasswordForm"
          encType="multipart/form-data"
          onSubmit={updatePasswordSubmit}
        >
  
  <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <InputLabel id="oldPassword-label" style={{marginTop:'20px'}}>Old Password</InputLabel>
            <TextField
              label="Old Password"
              placeholder="Old Password"
              type={showOldPassword ? "text" : "password"}
              variant="filled"
              margin='none'
              required
              fullWidth
              style={{  marginBottom: "10px" }}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton size="small" onClick={() => togglePasswordVisibility('old')}>
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <InputLabel id="newPassword-label">New Password</InputLabel>
            <TextField
              label="New Password"
              placeholder="New Password"
              type={showNewPassword ? "text" : "password"}
              variant="filled"
              margin='none'
              required
              fullWidth
              style={{  marginBottom: "10px" }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton size="small" onClick={() => togglePasswordVisibility('new')}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <InputLabel id="confirmPassword-label">Confirm New Password</InputLabel>
            <TextField
              label="Confirm New Password"
              placeholder="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="filled"
              margin='none'
              required
              fullWidth
              style={{  marginBottom: "10px" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton size="small" onClick={() => togglePasswordVisibility('confirm')}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Grid>
        </Grid>
  
          <div style={{ textAlign: 'center', marginTop: '20px', justifyContent:'center', alignItems:'center', display:'flex' }}>
            <Button
              id="updatePassBtn"
              type="submit"
              disabled={loading ? true : false}
              variant="contained"
              color="primary"
              style={{ backgroundColor: 'rgb(105, 56, 239)' }}
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    // <Fragment>

    //     <Fragment>
    //       <div className="updatePasswordContainer">
    //         <div className="updatePasswordBox">
    //           <h2 className="updatePasswordHeading">Update Password</h2>

    //           <form
    //             className="updatePasswordForm"
    //             onSubmit={updatePasswordSubmit}
    //           >
    //             <div className="loginPassword">
    //               <input
    //                 type="password"
    //                 placeholder="Old Password"
    //                 required
    //                 value={oldPassword}
    //                 onChange={(e) => setOldPassword(e.target.value)}
    //               />
    //             </div>

    //             <div className="loginPassword">
    //               <input
    //                 type="password"
    //                 placeholder="New Password"
    //                 required
    //                 value={newPassword}
    //                 onChange={(e) => setNewPassword(e.target.value)}
    //               />
    //             </div>
    //             <div className="loginPassword">
    //               <input
    //                 type="password"
    //                 placeholder="Confirm Password"
    //                 required
    //                 value={confirmPassword}
    //                 onChange={(e) => setConfirmPassword(e.target.value)}
    //               />
    //             </div>
    //             <input
    //               type="submit"
    //               value="Change"
    //               className="updatePasswordBtn"
    //             />
    //           </form>
    //         </div>
    //       </div>
    //     </Fragment>
    // </Fragment>
  );
};


export default UpdatePassword