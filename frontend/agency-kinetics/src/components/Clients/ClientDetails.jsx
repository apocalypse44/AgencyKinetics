import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData.jsx";
import { getClientDetails, clearErrors, deleteClient, getClient} from "../../actions/clientAction.jsx";
import car from "../../Images/car.jpg"
import "./Client.css";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Breadcrumbs, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fade, Grid, Modal, Tooltip, Typography } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import { addNotification } from "../../actions/notificationAction.jsx";
import { DELETE_CLIENT_RESET } from "../../constants/clientsConstants.jsx";
import UpdateClient from "./UpdateClient.jsx";


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

const ClientDetails = ({ match }) => {
  const history = useHistory()
  const dispatch = useDispatch();
  const alert = useAlert();
  const { combined: client, error:clientDetailError } = useSelector(state => state.clientDetails);
  console.log(client)
  const { error, loading, combined: clients } = useSelector((state) => state.clients);
  const { error: deleteError, isDeleted } = useSelector((state) => state.clientDU);
  const combined = useSelector((state) => state.logMember.combined);


  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('')

  const handleUpdateOpen = (clientId) => {
    // Store the selected clientId in the state or perform any other actions you need
    if (!clients.find(client => client._id === clientId)) {
      // Dispatch action to get client details
      dispatch(getClientDetails(clientId));
    }
    setSelectedClientId(clientId);
  
    // Open the update modal
    setOpenUpdateModal(true);
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);

  const handleDeleteConfirmation = (clientId) => {
    console.log(clientId)
    setClientIdToDelete(clientId);
    setOpenConfirmDialog(true);
  };

  const handleDeleteClient = () => {
    dispatch(deleteClient(clientIdToDelete));
    setClientIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setClientIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleBreadcrumbClick = () => {
    history.push('/clients');
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      // alert.error(deleteError);
      history.push({
        pathname: "/clients",
        state: {
          snackbar: {
            message: `Client Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });      
      dispatch({ type: DELETE_CLIENT_RESET });
      dispatch(addNotification({ message: 'Client Deletion Failed'}));
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert('Team Member deleted successfully');
      // history.push('/clients');

      history.push({
        pathname: "/clients",
        state: {
          snackbar: {
            message: "Client Deleted Successfully",
            severity: "success"
          }
        }
      });      
      dispatch({ type: DELETE_CLIENT_RESET });
      dispatch(addNotification({ message: 'Client Deleted Successfully'}));

    }
    dispatch(getClient());
  }, [dispatch, error, alert, isDeleted, deleteError, history]);


    // const modifiedOrders = client.map((order) => ({
    //   ...order,
    //       createdAt: client.createdAt ? client.createdAt.slice(0, 15) : '',
    // }))

  useEffect(() => {
      if(clientDetailError){
      //  alert.error(error)
       dispatch(clearErrors())
    }
    dispatch(getClientDetails(match.params.id));
  }, [dispatch, match.params.id, clientDetailError , alert]);

  return (
    <div>
        <MetaData title ="Client Details  -- Test"/>
        <div className="btn">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none', color:'rgb(127, 86, 217)' }}>
            Clients
            </Button>
            <Typography color="rgb(127, 86, 217)">Client Details</Typography>
          </Breadcrumbs>
          </div>

          <Modal
            open={openUpdateModal}
            onClose={handleUpdateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={updateStyle}>
              <Typography id="modal-modal-title" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }} variant="h6" component="h2">
                Update Client
              </Typography>
              <UpdateClient handleUpdateClose={handleUpdateClose} selectedClientId={selectedClientId} />
            </Box>
          </Modal>

          {/* <div className="user-profile-container">
      <div className="left">
        <img src={car} alt="User" className="user-image" />
        <div className="info">
          <p>Email: {client.email}</p>
        </div>
      </div>
      <div className="right">
        <div className="info">
          <p className="user-name">Name: {client.fname} {client.lname}</p>
          <p>Email: {client.email}</p>
          <p>Address: {client.country}, {client.state} ,{client.city} ,{client.postalCode}</p>
          <p>Created On: {client.createdAt}</p>
        </div>
      </div>
    </div> */}

<Grid container spacing={2} style={{marginTop:'10px', marginLeft:'10px', paddingRight:'50px', paddingBottom:'10px'}}>
        <Grid item xs={12}>
          <Card style={{backgroundColor:'rgb(245, 245, 245)'}}>
            <CardHeader
                title={<div style={{ display: 'flex', alignItems: 'center' }}>
                Client
                {/* <Chip
                      label={invoice.status}
                      variant="outlined"
                      size="medium"
                      color={
                        invoice.status === 'Void' ? 'error' :
                          invoice.status === 'Open' ? 'primary' :
                          invoice.status === 'Draft' ? 'warning' :
                          invoice.status === 'Paid' ? 'success' :
                          invoice.status === 'Uncollectable' ? 'secondary' :
                        'default' // Default color if none of the above conditions match
                      }
                      style={{ marginLeft: '8px' }} 
                    /> */}
              </div>}
                action={
                  <>
                  {/* <Button style={{ backgroundColor: 'rgb(127, 86, 217)', marginRight: '8px' }} variant="contained" type="submit"
                    >
                    Download File
                  </Button> */}
              
                    {/* <Button style={{ backgroundColor: 'rgb(127, 86, 217)' }} onClick={() => handleUpdateOpen(client._id)} variant="contained" type="submit" 
                    >
                      Edit
                    </Button> */}
                </>
                }
              />
                
            <CardContent>
                <Grid container spacing={2} style={{ padding: '10px', paddingRight:'10px' }}>
                  
                <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Name
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                    {client.fname} {client.lname}

                    </Typography>
                  </Grid>

                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginLeft: '5px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Email
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                    {client.email}

                    </Typography>
                  </Grid>
                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginTop: '5px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Created On
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                      {new Date(client.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
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

                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '5px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Address
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                    {`${client.country ? client.country + ', ' : ''}`}
                    {`${client.state ? client.state + ', ' : ''}`}
                    {`${client.city ? client.city + ', ' : ''}`}
                    {`${client.zip ? client.zip : '-'}`}
                    </Typography>
                  </Grid>
                  </Grid>
                 
                  {combined.user.role === "SUPERADMIN"  ? (
                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{ backgroundColor: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(client._id)} variant="contained" type="submit">
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
          Are you sure you want to delete this Client?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteClient}
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
export default ClientDetails