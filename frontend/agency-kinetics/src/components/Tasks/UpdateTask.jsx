import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert';
import { UPDATE_SERVICE_RESET } from '../../constants/serviceConstant';
import MetaData from '../layout/MetaData';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import CustomizedSnackbars from "../../snackbarToast";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { addNotification } from '../../actions/notificationAction';
import { getTaskDetails, clearErrors, updateTask, getTasks } from '../../actions/taskAction';
import { UPDATE_TASK_RESET } from '../../constants/taskConstants';


const UpdateTask = ({handleUpdateClose, match, selectedTaskId, orderId}) => {
const dispatch = useDispatch();
const alert = useAlert();
const history = useHistory()
const {loading, error:updateError, isUpdated} = useSelector((state)=>state.taskDU)
const { error:taskDetailError, task } = useSelector((state) => state.taskDetails);
console.log("tt",task)
const [status , setStatus]=useState("");


  const taskId = selectedTaskId;
  console.log(taskId)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('');
  
  useEffect(() => {
    if(taskDetailError){
     dispatch(clearErrors)
  }
  dispatch(getTaskDetails(taskId));
}, [dispatch, taskId, taskDetailError , alert]);

  useEffect(() => {
    if(task && task._id !==taskId){
        dispatch(getTaskDetails(taskId));
    }else{
        setStatus(task.status);
    }
    
    if (taskDetailError) {
      alert.error(taskDetailError);
      dispatch(clearErrors());
    }
     if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      handleUpdateClose()
      // alert.success("Order Updated Successfully");
      setSnackbarMessage('Order Updated successful');
      setSnackbarOpen(true);
      setSeverity('success'); 
      history.push(`/task/order/${orderId}`);

      dispatch({ type: UPDATE_TASK_RESET });
      dispatch(getTasks(orderId));


      dispatch(addNotification({ message: `Task ${task._id} Updated successfully` }));
      
    }
  }, [dispatch, alert, taskDetailError, history, isUpdated, updateError, task, taskId]);

  const updateTaskSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);


    dispatch(updateTask( taskId,myForm));
  };
  return (
    <div>
        <MetaData title ="Update Task  -- Test"/>

        {/* <div className="newProductContainer"> */}
        <CustomizedSnackbars
          open={snackbarOpen}
          handleClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          severity={severity}
        />
          <form
            // className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateTaskSubmitHandler}
          >
            {/* <h1>Update Order</h1> */}
            <InputLabel id="status-label" style={{marginTop:'20px'}}>Status</InputLabel>

            <Autocomplete
            fullWidth 
            
              disablePortal
              value={status}
              onChange={(event, newValue) => {
                setStatus(newValue);
              }}
              id="controllable-states-demo"
              options={["Done", "Progress", "Review" ]}
              noOptionsText="Select Status"
              // sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} fullWidth label="Status" variant='filled' />}
            />
            {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120, marginTop:'20px' }}>
              <InputLabel id="status-label">Select Order Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                style={{ width: '100%' }} // Adjust width as needed
              >
                <MenuItem value="" disabled>
                  Select Order Status
                </MenuItem>
                <MenuItem value="Review">Review</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl> */}
              <div style={{ textAlign: 'center', marginTop: '150px' }}>
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


export default UpdateTask