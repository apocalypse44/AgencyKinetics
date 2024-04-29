  import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, deleteInvoice, getInvoice, getInvoiceDetails } from "../../actions/invoiceAction.jsx";
import { DELETE_INVOICE_RESET } from "../../constants/invoicesConstants.jsx";
import { addNotification } from "../../actions/notificationAction.jsx";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import { Box, Breadcrumbs, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fade, Grid, Modal, Tooltip, Typography } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import UpdateInvoice from "./UpdateInvoice.jsx";


const updateStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 400,
  boxShadow: '5px 5px 5px 5px rgba(255, 177, 0, 0.9)',
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid rgb(127, 86, 217)',
  borderRadius: 5, 
  boxShadow: 24,
  overflow:'auto',
  p: 4,
  
};

const InvoiceDetails = ({ match }) => {
  const history = useHistory()
  const dispatch = useDispatch();
  const alert = useAlert();
  const { invoice, error:invoiceDetailError } = useSelector(state => state.invoiceDetails);
  const {error, loading,invoices} = useSelector((state)=>state.invoices)
  const { error: deleteError, isDeleted } = useSelector((state) => state.invoiceDU);
  const combined = useSelector((state) => state.logMember.combined);
  
  const handleBreadcrumbClick = () => {
    history.push('/invoices');
  };

  const [selectedInvoiceId, setSelectedInvoiceId] = useState('')
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleUpdateOpen = (invoiceId) => {
    // Store the selected invoiceId in the state or perform any other actions you need
    setSelectedInvoiceId(invoiceId);
  
    // Open the update modal
    setOpenUpdateModal(true);
  };

  const handleUpdateClose = () => setOpenUpdateModal(false);


  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState(null);

  const handleDeleteConfirmation = (invoiceId) => {
    setInvoiceIdToDelete(invoiceId);
    setOpenConfirmDialog(true);
  };

  const handleDeleteInvoice = () => {
    dispatch(deleteInvoice(invoiceIdToDelete));
    setInvoiceIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setInvoiceIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const [orderNamesMap, setOrderNamesMap] = useState({});
  const [clientNamesMap, setClientNamesMap]=useState({});

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
        console.log("OM", orderMap)
        setOrderNamesMap(orderMap);
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };
    fetchOrderData();
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
console.log("ahjshjhajhj",clientMap)
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
        pathname: "/invoices",
        state: {
          snackbar: {
            message: `Invoice Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });      
      dispatch({ type: DELETE_INVOICE_RESET });
      dispatch(addNotification({ message: 'Invoice Deletion Failed'}));
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert('Team Member deleted successfully');
      // history.push('/invoices');
      history.push({
        pathname: "/invoices",
        state: {
          snackbar: {
            message: "Invoice Deleted Successfully",
            severity: "success"
          }
        }
      });  
      dispatch({ type: DELETE_INVOICE_RESET });
      dispatch(addNotification({ message: 'Invoice Deleted Successfully'}));
      dispatch(getInvoice());

    }
  }, [dispatch, error, alert, isDeleted, deleteError, history]);


  useEffect(() => {
      if(invoiceDetailError){
       dispatch(clearErrors)
    }
    dispatch(getInvoiceDetails(match.params.id));
  }, [dispatch, match.params.id, invoiceDetailError , alert]);
  return (
    <div>
        <MetaData title ="InvoiceDetails  -- Test"/>
        <div className="btn">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none', color:'rgb(127, 86, 217)' }}>
            Invoices
            </Button>
            <Typography color="rgb(127, 86, 217)">Invoice Details</Typography>
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
                Update Invoice
              </Typography>
              <UpdateInvoice handleUpdateClose={handleUpdateClose} selectedInvoiceId={selectedInvoiceId} />
            </Box>
          </Modal>

          

          <Grid container spacing={2} style={{marginTop:'10px', marginLeft:'10px', paddingRight:'50px', paddingBottom:'10px'}}>
        <Grid item xs={12}>
          <Card style={{backgroundColor:'rgb(245, 245, 245)'}}>
            <CardHeader
                title={<div style={{ display: 'flex', alignItems: 'center' }}>
                Invoice
                <Chip
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
                    />
              </div>}
                subheader={invoice.invoiceId}
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
                      title={invoice.status === 'Paid' || invoice.status === 'Void' ? `Can't Edit as Invoice is ${invoice.status}` : ''}

                    >
                      <span>
                      <Button style={{ backgroundColor: 'rgb(127, 86, 217)' }} onClick={() => handleUpdateOpen(invoice._id)} variant="contained" type="submit" 
                      disabled={invoice.status === 'Paid' || invoice.status === 'Void'}
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
                    {orderNamesMap[invoice.orderId] ? orderNamesMap[invoice.orderId] : '-'}

                    </Typography>
                  </Grid>
                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginLeft: '5px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Created On
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                      {new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
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
                      {clientNamesMap[invoice.client_name] ? clientNamesMap[invoice.client_name] : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '5px'}}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Address
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                      {invoice.country}, {invoice.state}, {invoice.city}, {invoice.zip}
                    </Typography>
                  </Grid>
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
                    Amount
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    {invoice.amount} {invoice.currency ? invoice.currency.slice(-1): ''}
                  </Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    Discount Percentage
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    {invoice.discount_percentage} %
                  </Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    Discount Amount
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    {invoice.discount_amount}
                  </Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    Paid Amount
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    {invoice.paid_amount}
                  </Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    Due Amount
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    {invoice.due_amount}
                  </Typography>
                </div>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}
                  >
                    {invoice.total_amount} {invoice.currency.slice(-1)}
                  </Typography>
                </div>

              </div>
            </Grid>

            {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
            
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ backgroundColor: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(invoice._id)} variant="contained" type="submit">
                Delete
              </Button>
              </div>
            ) : null}

            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle style={{ color: 'rgb(127, 86, 217)' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this invoice?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteInvoice}
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

export default InvoiceDetails;
