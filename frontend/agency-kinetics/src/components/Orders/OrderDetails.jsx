import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData.jsx";
import { getOrderDetails, clearErrors, deleteOrder, getOrders } from "../../actions/orderAction.jsx";
import { addNotification } from "../../actions/notificationAction.jsx";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import { Box, Breadcrumbs, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fade, Grid, Modal, Tooltip, Typography } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { DELETE_ORDER_RESET } from "../../constants/orderConstants.jsx";
import UpdateOrder from "./UpdateOrder.jsx";
import { getTasks } from "../../actions/taskAction.jsx";

const updateStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 400,
  // backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '5px 5px 5px 5px rgba(255, 177, 0, 0.9)',
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid rgb(127, 86, 217)',
  borderRadius: 5, 
  boxShadow: 24,
  overflow:'auto',
  p: 4,
  
};

const OrderDetails = ({ match }) => {
  const history = useHistory()
  const dispatch = useDispatch();
  const alert = useAlert();
  const { order, error:orderDetailError } = useSelector(state => state.orderDetails);
  console.log(order)
  const combined = useSelector((state) => state.logMember.combined);

  const { error: deleteError, isDeleted } = useSelector((state) => state.orderDU);
  const {error, loading, orders} = useSelector((state)=>state.orders)

  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleUpdateOpen = (orderId) => {
    // Store the selected orderId in the state or perform any other actions you need
    setSelectedOrderId(orderId);
  
    // Open the update modal
    setOpenUpdateModal(true);
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);

  const handleDeleteConfirmation = (orderId) => {
    setOrderIdToDelete(orderId);
    setOpenConfirmDialog(true);
  };

  const handleDeleteOrder = () => {
    dispatch(deleteOrder(orderIdToDelete));
    setOrderIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setOrderIdToDelete(null);
    setOpenConfirmDialog(false);
  };



  const handleTaskClick = (order) => {
    dispatch(getTasks(order._id))
    history.push(`/task/order/${order._id}`)
     {/*component={Link} to={/task/${order._id}}*/}

    console.log(order);
  };

  const handleBreadcrumbClick = () => {
    history.push('/orders');
  };

  const [serviceNamesMap, setServiceNamesMap] = useState({});
  const [clientNamesMap, setClientNamesMap] = useState({});

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await fetch(`/test/v1/services`);
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`);
        }
        const data = await response.json();
        console.log('Services data:', data);

        const serviceMap = {};
        data.services.forEach((service) => {
          serviceMap[service._id] = service.service_name;
        });
        console.log(serviceMap)
        setServiceNamesMap(serviceMap);
      } catch (error) {
        console.error('Error fetching services:', error.message);
      }
    };

    fetchServiceData();
  }, []);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch('/test/v1/combined/getAllClient');
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status}`);
        }
        const data = await response.json();
        console.log('Clients data:', data);

        const clientMap = {};
        data.combined.forEach((combined) => {
          clientMap[combined._id] = combined.fname;
        });

        setClientNamesMap(clientMap);
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };

    fetchClientData();
  }, []);

  useEffect(() => {

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      // alert.error(deleteError);
      history.push({
        pathname: "/orders",
        state: {
          snackbar: {
            message: `Order Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });      
      dispatch({ type: DELETE_ORDER_RESET });
      dispatch(addNotification({ message: 'Order Deletion Failed'}));
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert('Team Member deleted successfully');
      // history.push('/orders');
      history.push({
        pathname: "/orders",
        state: {
          snackbar: {
            message: "Order Deleted Successfully",
            severity: "success"
          }
        }
      });  
      // setSnackbarMessage('Order Deleted Successfully');
      // setSnackbarOpen(true);
      // setSeverity('success'); 
      dispatch({ type: DELETE_ORDER_RESET });
      dispatch(addNotification({ message: 'Order Deleted Successfully'}));
    }

    dispatch(getOrders());
  }, [dispatch, error, alert, isDeleted, deleteError, history]);


  useEffect(() => {
      if(orderDetailError){
      //  alert.error(orderDetailError)
       dispatch(clearErrors())
    }
    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, match.params.id, orderDetailError , alert]);
  return (
    <div>
        <MetaData title ="OrderDetails  -- Test"/>
        <div className="btn">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none', color:"rgb(127, 86, 217)" }}>
            Orders
            </Button>
            <Typography color="rgb(127, 86, 217)">Order Details</Typography>
          </Breadcrumbs>
          </div>

          <Modal
            open={openUpdateModal}
            onClose={handleUpdateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={updateStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>
                Update Order
              </Typography>
              <UpdateOrder handleUpdateClose={handleUpdateClose} selectedOrderId={selectedOrderId} />
            </Box>
          </Modal>


          <Grid container spacing={2} style={{marginTop:'10px', marginLeft:'10px', paddingRight:'50px', paddingBottom:'10px'}}>
        <Grid item xs={12}>
          <Card style={{backgroundColor:'rgb(245, 245, 245)'}}>
            <CardHeader
                title={<div style={{ display: 'flex', alignItems: 'center' }}>
                Order
                <Chip
                            label={order.status}
                            variant="outlined"
                            size="medium"
                            color={
                              order.status === 'Cancelled' ? 'error' :
                              order.status === 'Ongoing' ? 'warning' :
                              order.status === 'Review' ? 'primary' :
                              order.status === 'Completed' ? 'success' :
                              'default' // Default color if none of the above conditions match
                            }
                      style={{ marginLeft: '8px' }} 
                    />
              </div>}
                subheader={order.orderId}
                action={
                  <>
                  <Tooltip TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="top" 
                            title={'Tasks'}>
                              <Button style={{backgroundColor:'rgb(127, 86, 217)', marginRight: '8px'}} onClick={() => handleTaskClick(order) } variant="contained" type="submit">
                              Tasks
                            </Button>
                            </Tooltip>

                          {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
                          
                          <Tooltip 
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="top" 
                            title={order.status === 'Cancelled' || order.status === 'Completed' ? `Can't Edit as Order is ${order.status}` : ''}
                          >
                            <span>
                              <Button
                              variant="contained" type="submit"
                                style={{ backgroundColor: 'rgb(127, 86, 217)' }}
                                onClick={() => handleUpdateOpen(order._id)}
                                disabled={order.status === 'Cancelled' || order.status === 'Completed' || loading}
                              >
                                Edit
                              </Button>
                            </span>
                          </Tooltip>
                        ) : null}

                </>
                }
              />
                
  
            <CardContent>
                <Grid container spacing={2} style={{ padding: '10px', paddingRight:'10px' }}>
                  
                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      For Service
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                    {serviceNamesMap[order.serviceId] ? serviceNamesMap[order.serviceId] : '-'}

                    </Typography>
                  </Grid>
                  <Grid item xs={3} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginLeft: '5px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Created On
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                    {/* {order.kick_off_date?.replace(/(\d{2}) (\d{4})/, '$1, $2').slice(4, 16) ? order.kick_off_date.replace(/(\d{2}) (\d{4})/, '$1, $2').slice(4, 16) : '-'} */}
              {new Date(order.kick_off_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}

                    </Typography>
                  </Grid>
                  <Grid item xs={3} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginLeft: '5px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Due
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                    {/* {order.end_date?.replace(/(\d{2}) (\d{4})/, '$1, $2').slice(4, 16) ? order.end_date.replace(/(\d{2}) (\d{4})/, '$1, $2').slice(4, 16) : '-'} */}
                    {new Date(order.end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </Typography>
                  </Grid>

                </Grid>
                
              </CardContent>


            <Divider></Divider>

            <CardHeader
            title={'To'}
            />
              <CardContent>
              <Grid container spacing={2} style={{ padding: '10px', paddingRight:'10px' }}>

              <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '5px' }}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Client Name
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                    {clientNamesMap[order.clientId] ? clientNamesMap[order.clientId] : '-'}

                    </Typography>
                  </Grid>
                  {/* <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '5px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Address
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                      {invoice.country}, {invoice.state}, {invoice.city}, {invoice.zip}
                    </Typography>
                  </Grid> */}
                  </Grid>
              </CardContent>
              

              <Divider></Divider>
            

            <CardHeader
                title={'Amount Details'}  
            />
            <CardContent >
            <Grid
              container
              spacing={2}
              style={{
                borderRadius: '10px',
                paddingRight: '60px',
                marginRight: '5px',
                marginBottom: '5px',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgb(127, 86, 217)',
                  borderRadius: '10px',
                  padding: '10px',
                  marginLeft: '10px',
                  width: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    Budget
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    {order.budget}
                  </Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    Quantity
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    {order.quantity} 
                  </Typography>
                </div>
                
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    Total
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    {order.budget * order.quantity} 
                  </Typography>
                </div>

              </div>
            </Grid>

            {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT" ? (

            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button style={{ backgroundColor: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(order._id)} variant="contained" type="submit">
                      Delete
                    </Button>
            </div>
            ) : null}

            </CardContent>
          </Card>
        </Grid>
      </Grid>


          <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle style={{ color: 'rgb(127, 86, 217)' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteOrder}
            variant="contained"
            color="error"
            style={{ backgroundColor: 'rgb(127, 86, 217)', color: 'white' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};




export default OrderDetails