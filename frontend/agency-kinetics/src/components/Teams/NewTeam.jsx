import React, {useEffect, useState} from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { createTeam,clearErrors, getTeams } from '../../actions/teamAction';
import { NEW_TEAM_RESET } from '../../constants/teamConstants';
import "./Team.css"
import {TextField , Button, Grid} from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem,Input,  OutlinedInput, CardContent, Autocomplete } from '@mui/material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { addNotification, createNotification } from '../../actions/notificationAction';
import { resetState } from '../../reducers/teamReducer';


const NewTeam = ({ handleClose }) => {
const dispatch = useDispatch();
const alert = useAlert();
const {loading, error, success} = useSelector((state)=>state.newTeam)
console.log("su", success)
const history = useHistory()
const [isTeamMember , setisTeamMember]=useState(true);
const [email , setemail]=useState("");
const [role, setrole] = useState("");
// const [workspace_name , setworkspace_name]=useState("");
const workspace_name = useSelector((state) => state.logMember.workspace_name);


const combined = useSelector((state) => state.logMember.combined);
  const name = combined.user.fname + ' ' + combined.user.lname
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
  const userRole = formatRole(combined.user.role)
  console.log(userRole) 

  useEffect(() => {
    if (error) {
      handleClose()
      // history.push("/clients");
      history.push({
        pathname: "/teams",
        state: {
          snackbar: {
            message: `New Member Creation Failed as: ${error}`,
            severity: "error"
          }
        }
      });
      dispatch({ type: NEW_TEAM_RESET });
      dispatch(getTeams());

      dispatch(clearErrors());
      // dispatch(addNotification({ message: `New Member Creation Failed`}));
    }

    if(success) {
      handleClose()
      // alert.success("Team Created Successfully");
      // history.push("/teams");
      history.push({
        pathname: "/teams",
        state: {
          snackbar: {
            message: "New Member Invited Successfully",
            severity: "success"
          }
        }
      });
      dispatch({ type: NEW_TEAM_RESET });
      dispatch(getTeams())

      // dispatch(addNotification({ message: `New Member ${email} with Role ${role} Invited Successfully`}));
      dispatch(createNotification(combined.user._id, `New Member ${email} with Role ${role} Invited Successfully`));

    }
  }, [dispatch, alert, error, history, success]);

  const createTeamMemberSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("email", email);
    myForm.set("role", role.toUpperCase().replace(/\s/g, ''));
    myForm.set("workspace_name", workspace_name);
    myForm.set("isTeamMember", true);
    console.log([...myForm])

    dispatch(createTeam(myForm));
  };
  
  return (
    <div>
        <MetaData title =" Create Team  -- Test"/>
        {/* <div className="newProductContainer"> */}
          <form
            className="createTeamForm"
            encType="multipart/form-data"
            onSubmit={createTeamMemberSubmitHandler}
          >
            {/* <h1>Create Team</h1> */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
              <InputLabel id="email-label" style={{marginTop:'20px'}}>Email</InputLabel>

                  <TextField
                    type="email"
                    label="Email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    fullWidth
                    variant="filled"
                    margin="none"
                    required
                  />
              </Grid>

              <Grid item xs={12}>
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

                {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={role}
                    required
                    onChange={(e) => setrole(e.target.value)}
                  >
                    <MenuItem value="" disabled>
                      Select Role
                    </MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="PROJECTMANAGER">Project Manager</MenuItem>
                    <MenuItem value="ASSIGNEE">Assignee</MenuItem>
                  </Select>
                </FormControl> */}
              </Grid>

              {/* <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Workspace"
                    type="text"
                    placeholder="workspace"
                    readOnly
                    value={workspace_name}
                    // onChange={(e) => setworkspace_name(e.target.value)}
                  />
                </Grid> */}

            </Grid>

            <div style={{ textAlign: 'center', marginTop: '80px' }}>
                <Button
                  id="createOrderBtn"
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: 'rgb(105, 56, 239)' }}
                >
                  Create
                </Button>
              </div>
                                                {/* <div>
              <input
                type="boolean"
                placeholder="isTeamMember"
                required
                value={isTeamMember}
                onChange={(e) => setisTeamMember(e.target.value)}
              />
            </div> */}
            {/* <div>
              <input
                type="text"
                placeholder="email"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div> */}
{/* <div>
  <select
    value={role}
    required
    onChange={(e) => setrole(e.target.value)}
  >
    <option value="" disabled>Select Role</option>
    <option value="ADMIN">Admin</option>
    <option value="PROJECTMANAGER">Project Manager</option>
    <option value="ASSIGNEE">Assignee</option>
  </select>
</div> */}

            {/* <div>
              <input
                type="string"
             placeholder="workspace"
                value={workspace_name}
                required
                onChange={(e) => setworkspace_name(e.target.value)}
              />
            </div>
      <br />
            <button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Create
            </button> */}
          </form>
        </div>
    // </div>
  )
}

export default NewTeam