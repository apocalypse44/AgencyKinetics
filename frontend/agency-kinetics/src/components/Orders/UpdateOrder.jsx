import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert';
import { UPDATE_SERVICE_RESET } from '../../constants/serviceConstant';
import MetaData from '../layout/MetaData';
import { clearErrors, getOrderDetails, getOrders, updateOrder } from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import CustomizedSnackbars from "../../snackbarToast";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { addNotification, createNotification } from '../../actions/notificationAction';


const UpdateOrder = ({handleUpdateClose, match, selectedOrderId}) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory()
  const {loading, error:updateError, isUpdated} = useSelector((state)=>state.orderDU)
  const { error:orderDetailError, order } = useSelector((state) => state.orderDetails);
  console.log("or",order)
  const [status , setStatus]=useState("");

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
    const role = formatRole(combined.user.role)
    console.log(role) 

  const orderId = selectedOrderId;
  console.log(orderId)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('');

  const [selectedClientFromOrder, setselectedClientFromOrder] = useState('')
  const getClientId = async (orderId) => {
    try {
      const response = await fetch(`/test/v1/order/${orderId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      const data = await response.json();
      console.log('Orders data:', data);
      // setselectedOrderName(data.order.orderId)
      setselectedClientFromOrder(data.order.clientId)

    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };
  getClientId(selectedOrderId)
  

  useEffect(() => {
    if(orderDetailError){
     dispatch(clearErrors)
  }
      
  dispatch(getOrderDetails(orderId));
}, [dispatch, orderId, orderDetailError , alert]);

  useEffect(() => {
    if(order && order._id !==orderId){
        dispatch(getOrderDetails(orderId));
    }else{
        setStatus(order.status);
    }
    
    if (orderDetailError) {
      // alert.error(error);
      history.push({
        pathname: "/orders",
        state: {
          snackbar: {
            message: "Order Details Not Found",
            severity: "error"
          }
        }
      });
      dispatch(clearErrors());
    }
     if (updateError) {
      handleUpdateClose()
      history.push({
        pathname: "/orders",
        state: {
          snackbar: {
            message: "Order Updation Failed",
            severity: "error"
          }
        }
      });
      // alert.error(updateError);
      dispatch({ type: UPDATE_ORDER_RESET });
    dispatch(getOrders());

    // dispatch(addNotification({ message: `Order Updation Failed as:  ${updateError}`}));

      dispatch(clearErrors());
    }

    if (isUpdated) {
      handleUpdateClose()
      // alert.success("Order Updated Successfully");
      history.push({
        pathname: "/orders",
        state: {
          snackbar: {
            message: "Order Updated Successfully",
            severity: "success"
          }
        }
      });


      dispatch({ type: UPDATE_ORDER_RESET });
    dispatch(getOrders());

      // dispatch(addNotification({ message: `Order ${order.orderId} Updated to ${status} Successfully` }));
      dispatch(createNotification(combined.user._id, `Order ${order.orderId} Updated to ${status} Successfully`));
      dispatch(createNotification(selectedClientFromOrder, `Order ${order.orderId} Updated to ${status}  By ${role}: ${name}`));
      
    }
  }, [dispatch, alert, orderDetailError, history, isUpdated, updateError, order, orderId]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);


    dispatch(updateOrder( orderId,myForm));
  };
  return (
    <div>
        <MetaData title ="Update Order  -- Test"/>

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
            onSubmit={updateOrderSubmitHandler}
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
              options={["Review", "Ongoing", "Cancelled", "Completed"]}
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


export default UpdateOrder