import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import "./Order.css"
import {TextField , Button, Typography, FormLabel, Input, Icon, IconButton, Card} from '@material-ui/core';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import {Box, Container, Divider, Grid, Paper, makeStyles} from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, CardContent, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/lab';
import CustomizedSnackbars from '../../snackbarToast'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { addNotification } from '../../actions/notificationAction';
import { CLEAR_ERRORS, NEW_TASK_RESET } from '../../constants/taskConstants';
import { createTask, getTasks } from '../../actions/taskAction';
import { Editor } from 'primereact/editor';
  

const NewTask = ({ handleClose, orderId }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory()
  const { loading, error, success } = useSelector((state) => state.newTask);
  console.log(success)
  const [assigneeId, setassigneeId] = useState(null);
  const [order_Id, setorder_Id] = useState(null);
  const [taskName, settaskName] = useState('');  //Optional
  const [status, setstatus] = useState('');   //Optional
  const [desc, setdesc] = useState('');   //Optional

  const renderHeader = () => {
    return (
      <>
      <span class="ql-formats">
      <select class="ql-font"></select>
      <select class="ql-size"></select>
      
    </span>
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-align"></select>
    </span>
    </>
    );
  };
  
  const header = renderHeader();
  
  const [assignedToNamesMap, setassignedToNamesMap] = useState({});

  useEffect(() => {
    const fetchAssigneeData = async () => {
      try {
        const response = await fetch('/test/v1/getAllExceptClient');
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status}`);
        }
        const data = await response.json();
        console.log('Assigned To data:', data);

        const assignedToMap = {};
        data.combined.forEach((combined) => {
          assignedToMap[combined._id] = combined.fname;
        });

        setassignedToNamesMap(assignedToMap);
        console.log(assignedToMap)
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };

    fetchAssigneeData();
  }, []);

  useEffect(() => {
    
    if (error) {
      dispatch(CLEAR_ERRORS());
    }
    if (success) {
      console.log('SUCCESS');
      handleClose()


      // handleClose()
      history.push(`/task/order/${orderId}`);

      dispatch({ type: NEW_TASK_RESET });
      dispatch(getTasks(orderId));


      dispatch(addNotification({ message: `New Task under Order:${orderId} Created successfully`}));

    }
    // console.log(snackbarSeverity)
  
  }, [dispatch, error, history, success]);

  const createTaskSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set('assigneeId', assigneeId);
    myForm.set('orderId', orderId);
    myForm.set('task_name', taskName);
    myForm.set('description', desc);
    myForm.set('status', status);


    console.log([...myForm])


    dispatch(createTask(myForm));
  };

  return (
    <div>
      <MetaData title="Create Task -- Test" />
{/* <div className=''></div> */}
      {/* <div className="newProductContainer"> */}

        <form
          className="createTaskForm"
          encType="multipart/form-data"
          onSubmit={createTaskSubmitHandler}
        >
          {/* <Card style={{ width: '600px' }}>
            <CardContent> */}
              {/* <Typography variant="h5" fontWeight="bold" gutterBottom>
                Create Order
              </Typography> */}

        <Grid container spacing={3}>
          {/* Add new form fields */}
          <Grid item xs={12} sm={6}>
            <InputLabel id="assigneeId-label" style={{marginTop:'20px'}}>Assignee</InputLabel>
            <Autocomplete
              fullWidth
              disablePortal
              value={assigneeId}
              onChange={(event, newValue) => {
                setassigneeId(newValue);
              }}
              id="assigneeId"
              options={Object.keys(assignedToNamesMap)}
              getOptionLabel={(option) => assignedToNamesMap[option]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  label="Select Assignee"
                  variant="filled"
                />
              )}
            />
          </Grid>

          
   
          <Grid item xs={12} sm={6}>
            <InputLabel id="taskName-label" style={{marginTop:'20px'}}>Task Name</InputLabel>
            <TextField
              type="text"
              label="Task Name"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => settaskName(e.target.value)}
              fullWidth
              variant="filled"
              margin="none"
            />
          </Grid>

          
          
          <Grid item xs={12} sm={12}>
            <InputLabel id="status-label">Status</InputLabel>
            <Autocomplete
              fullWidth
              disablePortal
              value={status}
              onChange={(event, newValue) => {
                setstatus(newValue);
              }}
              id="status"
              options={['Done', 'Progress', 'Review']}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  label="Status"
                  variant="filled"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <InputLabel id="description-label">Description</InputLabel>
            <Editor value={desc} onTextChange={(e) => setdesc(e.htmlValue)} headerTemplate={header} style={{ height: '320px' }} />
            
            {/* <TextField
              type="text"
              multiline
              label="Description"
              placeholder="Description"
              value={desc}
              onChange={(e) => setdesc(e.target.value)}
              fullWidth
              variant="filled"
              margin="none"
            /> */}
          </Grid>

        </Grid>
             
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Button
                  id="createTaskBtn"
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: 'rgb(105, 56, 239)' }}
                >
                  Create
                </Button>
              </div>

            {/* </CardContent>
          </Card> */}

        </form>
      </div>
    // </div>
  );
};

export default NewTask