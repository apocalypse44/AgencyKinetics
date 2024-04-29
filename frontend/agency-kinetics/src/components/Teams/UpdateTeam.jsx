import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { getTeamDetails ,clearErrors, updateTeam, getTeams} from '../../actions/teamAction';
import { UPDATE_TEAM_RESET } from '../../constants/teamConstants';
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { addNotification, createNotification } from '../../actions/notificationAction';
import { resetState } from '../../reducers/teamReducer';


const UpdateTeam = ({handleUpdateClose, match, selectedTeamId}) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const history = useHistory()
    const {loading, error:updateError, isUpdated} = useSelector((state)=>state.teamDU)
    const { error:teamDetailError, combined } = useSelector((state) => state.teamDetails);
    console.log("or",combined)
    const [role , setrole] = useState("");

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
    const userRole = formatRole(combinedLog.user.role)
    console.log(userRole) 

  const teamId = selectedTeamId;
  useEffect(() => {
    if(teamDetailError){
     dispatch(clearErrors())
  }
      
  dispatch(getTeamDetails(teamId));
}, [dispatch, teamId, teamDetailError , alert]);


  useEffect(() => {
    // if(combined && combined._id !==teamId){
    //     dispatch(getTeamDetails(teamId));
    // }else{
      var combinedRole = combined.role
      if (combinedRole === 'ASSIGNEE'){
        combinedRole = 'Assignee'
      }
      else if (combinedRole === 'PROJECTMANAGER'){
        combinedRole = 'Project Manager'
      } 
      else if (combinedRole === 'ADMIN'){
        combinedRole = 'Admin'
      }
      
        setrole(combinedRole);


    // }
    if (teamDetailError) {
      // alert.error(error);
      history.push({
        pathname: "/teams",
        state: {
          snackbar: {
            message: "Member Details Not Found",
            severity: "error"
          }
        }
      });
      dispatch(clearErrors());
    }
     if (updateError) {
      // alert.error(updateError);
      handleUpdateClose()
      // alert.success("Client Created Successfully");
      // history.push("/clients");
      history.push({
        pathname: "/teams",
        state: {
          snackbar: {
            message: "Member Updation Failed",
            severity: "error"
          }
        }
      });
      dispatch({ type: UPDATE_TEAM_RESET });
      dispatch(getTeams());

      // dispatch(addNotification({ message: `Member Updation Failed as:  ${updateError}`}));
      dispatch(clearErrors());
    }

    if (isUpdated) {
      handleUpdateClose()
      // alert.success("Team Updated Successfully");
      history.push({
        pathname: "/teams",
        state: {
          snackbar: {
            message: "Member Updated Successfully",
            severity: "success"
          }
        }
      });
      dispatch({ type: UPDATE_TEAM_RESET });
      // history.push("/teams");
      dispatch(getTeams())

      // dispatch(addNotification({ message: `Member ${combined.email} Updated Successfully to ${role}` }));
      dispatch(createNotification(combinedLog.user._id, `Member ${combined.email} Updated Successfully to ${role}`));

    }
  }, [dispatch, alert, teamDetailError, isUpdated, updateError, combined, teamId]);

  const updateTeamSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("role", role.toUpperCase().replace(/\s/g, ''));


    dispatch(updateTeam( teamId,myForm));
  };
  return (
    <div>
      <MetaData title="Update Team  -- Test" />

      {/* <div className="newProductContainer"> */}
        <form
          // className="createProductForm"
          encType="multipart/form-data"
          onSubmit={updateTeamSubmitHandler}
        >
          <InputLabel id="role-label" style={{marginTop:'20px'}}>Role</InputLabel>
          <Autocomplete
                  fullWidth
                  disablePortal
                  value={role}
                  onChange={(event, newValue) => {
                    setrole(newValue);
                  }}
                  id="Role"
                  options={['Admin', 'Project Manager', 'Assignee']}
                  noOptionsText="Select Role"
                  getOptionLabel={(option) => option}
                  // isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      label="Select Role"
                      variant="filled"
                    />
                  )}
                />
          {/* <FormControl fullWidth variant="filled" margin="normal" required>
            <InputLabel id="role-label">Select Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              onChange={(e) => setrole(e.target.value)}
              label="Select Role"
            >
              <MenuItem value="" disabled><em>Select Order Status</em></MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="ASSIGNEE">ASSIGNEE</MenuItem>
              <MenuItem value="PROJECTMANAGER">PROJECT MANAGER</MenuItem>
            </Select>
          </FormControl> */}

          <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <Button
                  id="createOrderBtn"
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
    // </div>
  )
}




export default UpdateTeam