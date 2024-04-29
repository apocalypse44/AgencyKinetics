import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, deleteTicket, getTicketDetails, getTickets } from "../../actions/ticketAction.jsx";
import { addNotification } from "../../actions/notificationAction.jsx";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Divider from '@mui/material/Divider';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import { Dialog, DialogTitle, DialogContent, DialogActions, Chip, Button, Breadcrumbs, Typography, Box, Modal, Grid, Card, CardHeader, Tooltip, Fade, CardContent } from '@mui/material';
import UpdateTicket from "./UpdateTicket.jsx";
import { DELETE_TICKET_RESET } from "../../constants/ticketConstants.jsx";
import DOMPurify from 'dompurify';


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

const TicketDetails = ({ match }) => {
  const history = useHistory()
  const dispatch = useDispatch();
  const alert = useAlert();
  const { ticket, error:ticketDetailError } = useSelector(state => state.ticketDetails);
  const {error, loading,tickets} = useSelector((state)=>state.tickets)
  const { error: deleteError, isDeleted } = useSelector((state) => state.ticketDU);
  console.log(ticket)
  const combined = useSelector((state) => state.logMember.combined);


  const [orderNamesMap, setOrderNamesMap] = useState({});
  const [clientNamesMap, setClientNamesMap] = useState({});

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  
  const handleBreadcrumbClick = () => {
    history.push('/tickets');
  };

  const [selectedTicketId, setSelectedTicketId] = useState('')
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const handleUpdateOpen = (ticketId) => {
    // Store the selected ticketId in the state or perform any other actions you need
    setSelectedTicketId(ticketId);

    // Open the update modal
    setOpenUpdateModal(true);
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [ticketIdToDelete, setTicketIdToDelete] = useState(null);

  const handleDeleteConfirmation = (ticketId) => {
    setTicketIdToDelete(ticketId);
    setOpenConfirmDialog(true);
  };

  const handleDeleteTicket = () => {
    dispatch(deleteTicket(ticketIdToDelete));
    setTicketIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setTicketIdToDelete(null);
    setOpenConfirmDialog(false);
  };

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
        // console.log(clientMap)
        setClientNamesMap(clientMap);
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };
    fetchClientData();
  }, []);


  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch('/test/v1/orders');
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status}`);
        }
        const data = await response.json();
        console.log('Orders data:', data);

        const orderMap = {};
        data.orders.forEach((order) => {
          orderMap[order._id] = order.orderId;
        });
        // console.log(orderMap)
        setOrderNamesMap(orderMap);
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };
    fetchOrderData();
  }, []);

  useEffect(() => {

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      // alert.error(deleteError);
      history.push({
        pathname: "/tickets",
        state: {
          snackbar: {
            message: `Ticket Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });      
      dispatch({ type: DELETE_TICKET_RESET });
      dispatch(addNotification({ message: 'Ticket Deletion Failed'}));
      dispatch(clearErrors());
    }

    if (isDeleted) {
      // alert('Ticket deleted successfully');
      // history.push('/tickets');
      history.push({
        pathname: "/tickets",
        state: {
          snackbar: {
            message: "Ticket Deleted Successfully",
            severity: "success"
          }
        }
      });      
      dispatch({ type: DELETE_TICKET_RESET });
      dispatch(addNotification({ message: 'Ticket Deleted Successfully'}));

    }

    dispatch(getTickets());
  }, [dispatch, error, alert, isDeleted, deleteError, history]);

  useEffect(() => {
      if(ticketDetailError){
       alert.error(ticketDetailError)
       dispatch(clearErrors)
    }
    dispatch(getTicketDetails(match.params.id));
  }, [dispatch, match.params.id, ticketDetailError , alert]);
  
  
  return (
    <div>
        <MetaData title ="TicketDetails  -- Test"/>

        <div className="btn">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none', color:'rgb(127, 86, 217)' }}>
            Tickets
            </Button>
            <Typography color="rgb(127, 86, 217)">Ticket Details</Typography>
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
                Update Ticket
              </Typography>
              <UpdateTicket handleUpdateClose={handleUpdateClose} selectedTicketId={selectedTicketId} />
            </Box>
          </Modal>

          <Grid container spacing={2} style={{marginTop:'10px', marginLeft:'10px', paddingRight:'50px'}}>
        <Grid item xs={12}>
          <Card style={{backgroundColor:'rgb(245, 245, 245)'}}>
            <CardHeader
                title={<div style={{ display: 'flex', alignItems: 'center' }}>
                Ticket
                <Chip
                      label={ticket.status}
                      variant="outlined"
                      size="medium"
                      color={
                        ticket.status === 'Open' ? 'success' :
                        ticket.status === 'Hold' ? 'warning' :
                        ticket.status === 'Close' ? 'error' :
                        'default' // Default color if none of the above conditions match
                      }
                      style={{ marginLeft: '8px' }} 
                    />
              </div>}
                action={
                  <>
                  <Button style={{ backgroundColor: 'rgb(127, 86, 217)', marginRight: '8px' }} variant="contained" type="submit"
                    >
                    Download File
                  </Button>

                  {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    placement="top" 
                    title={ticket.status === 'Close' ? `Can't Edit as Order is ${ticket.status}` : ''}

                  >
                    <span>
                    <Button style={{ backgroundColor: 'rgb(127, 86, 217)' }} onClick={() => handleUpdateOpen(ticket._id)} variant="contained" type="submit" 
                    disabled={ticket.status === 'Close'}
                    >
                      Edit
                    </Button>
                    </span>
                  </Tooltip>
                      ) : null}

                </>
                }
              />
                
  
            <CardContent>
                <Grid container spacing={2} style={{ padding: '10px', paddingRight:'10px' }}>

                  
                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Order Id
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                    {orderNamesMap[ticket.orderId] ? orderNamesMap[ticket.orderId] : '-'}

                    </Typography>
                  </Grid>
                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginLeft: '5px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Created On
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </Typography>
                  </Grid>

                </Grid>
                
              </CardContent>


            <Divider></Divider>

            <CardHeader
            title={'To'}
            action={
              <>
                  <Chip
                        label={ticket.priority}
                        variant="filled"
                        size="medium"
                        color={
                          ticket.priority === 'High' ? 'warning' :
                          ticket.priority === 'Highest' ? 'error' :
                          ticket.priority === 'Low' ? 'default' :
                          ticket.priority === 'Lowest' ? 'success' :
                          ticket.priority === 'Normal' ? 'primary' :

                          'default' // Default color if none of the above conditions match
                        }
                        />
                </>
            }
            />
              <CardContent>
              <Grid container spacing={2} style={{ padding: '10px', paddingRight:'10px' }}>

              <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '5px' }}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Client Name
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                      {clientNamesMap[ticket.client_name] ? clientNamesMap[ticket.client_name] : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '5px' }}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Subject
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                      {ticket.subject ? ticket.subject : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '5px' }}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Description
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                    <span
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ticket.description ? ticket.description : "-") }}
                      style={{ color: '#fff' }}
                    />
                      {/* {ticket.description ? ticket.description : "-"} */}
                    </Typography>
                  </Grid>
                  </Grid>
                  {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (

                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{ backgroundColor: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(ticket._id)} variant="contained" type="submit">
                        Delete
                      </Button>

                    </div>
                  ) : null}

              </CardContent>
              

              <Divider></Divider>


          </Card>
        </Grid>
      </Grid>

          <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle  style={{ color: 'rgb(127, 86, 217)' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this ticket?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteTicket}
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


export default TicketDetails