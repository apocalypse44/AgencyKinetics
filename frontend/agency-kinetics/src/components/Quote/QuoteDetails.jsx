import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { clearErrors } from "../../actions/quoteAction.jsx";
import MetaData from "../layout/MetaData.jsx";
import { deleteQuote, getQuote, getQuoteDetails } from "../../actions/quoteAction.jsx";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { Box, Breadcrumbs, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Fade, IconButton, Modal, Tooltip } from "@material-ui/core";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import Divider from '@mui/material/Divider';
import UpdateQuote from "./UpdateQuote.jsx";
import { addNotification } from "../../actions/notificationAction.jsx";
import { DELETE_QUOTE_RESET } from "../../constants/quoteConstants.jsx";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import DOMPurify from 'dompurify';

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

const QuoteDetails = ({ match }) => {
  const history = useHistory()
  const dispatch = useDispatch();
  const alert = useAlert();
  const { quote, error:quoteDetailError } = useSelector(state => state.quoteDetails);
  const {error, loading,quotes} = useSelector((state)=>state.quotes)
  const { error: deleteError, isDeleted } = useSelector((state) => state.quoteDU);
    console.log('oiqeoipwei', quote)
  const handleBreadcrumbClick = () => {
    history.push('/quotes');
  };
  const combined = useSelector((state) => state.logMember.combined);

  const [selectedQuoteId, setSelectedQuoteId] = useState('')
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleUpdateOpen = (quoteId) => {
    // Store the selected quoteId in the state or perform any other actions you need
    setSelectedQuoteId(quoteId);
  
    // Open the update modal
    setOpenUpdateModal(true);
  };

  const handleUpdateClose = () => setOpenUpdateModal(false);


  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [quoteIdToDelete, setQuoteIdToDelete] = useState(null);
  const handleDeleteConfirmation = (quoteId) => {
    setQuoteIdToDelete(quoteId);
    setOpenConfirmDialog(true);
  };

  const handleDeleteQuote = () => {
    dispatch(deleteQuote(quoteIdToDelete));
    setQuoteIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setQuoteIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleDownloadClick = (attachment) => {
    if (attachment) {
      console.log(attachment)
        const link = document.createElement('a');
        link.href = attachment;
        link.setAttribute('download', `proposal_attachment`);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
    } else {
        console.log('Document not available');
    }
};
const handlePreviewClick = (attachmentUrl) => {
  window.open(attachmentUrl, '_blank');
};


const [documentSrc, setDocumentSrc] = useState([]);
  const loadDocuments = async () => {
    const updatedDocumentSrcs = [];
    
        if (quote.attachment) {
            try {
              const { data, contentType } = quote.attachment || {};
              const byteArray = new Uint8Array(data.data);
              // console.log(byteArray)
              const blob = new Blob([byteArray], { type: contentType });
              const url = URL.createObjectURL(blob);
              // console.log(url)
              updatedDocumentSrcs.push(url);
            } catch (error) {
                console.error('Error fetching document:', error);
                updatedDocumentSrcs.push(null);
            }
        } else {
            updatedDocumentSrcs.push(null);
        }
    console.log(updatedDocumentSrcs)
    setDocumentSrc(updatedDocumentSrcs);
};

useEffect(() => {
  loadDocuments();
}, [dispatch, quotes]);

  const [serviceNamesMap, setServiceNamesMap] = useState({})
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
    // dispatch(getQuoteDetails(match.params.id));

    if (error) {
      // alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      // alert.error(deleteError);
      history.push({
        pathname: "/quotes",
        state: {
          snackbar: {
            message: `Proposal Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });      
      dispatch({ type: DELETE_QUOTE_RESET });
      dispatch(addNotification({ message: 'Proposal Deletion Failed'}));
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert('Team Member deleted successfully');
      // history.push('/quotes');
      history.push({
        pathname: "/quotes",
        state: {
          snackbar: {
            message: "Proposal Deleted Successfully",
            severity: "success"
          }
        }
      }); 
      dispatch({ type: DELETE_QUOTE_RESET });
      dispatch(addNotification({ message: 'Proposal Deleted Successfully'}));

    }
    dispatch(getQuote());
  }, [dispatch, error, alert, isDeleted, deleteError, history]);

  useEffect(() => {
    if(quoteDetailError){
      alert.error(quoteDetailError);
      dispatch(clearErrors());
    }
    console.log(match.params.id)
    dispatch(getQuoteDetails(match.params.id));
  }, [dispatch, match.params.id, quoteDetailError, alert]);

  return (
    <div>
      <MetaData title="QuoteDetails  -- Test" />
        <div className="btn">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none', color:'rgb(127, 86, 217)' }}>
            Proposals
            </Button>
            <Typography color="rgb(127, 86, 217)">Proposal Details</Typography>
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
                Update Quote
              </Typography>
              <UpdateQuote handleUpdateClose={handleUpdateClose} selectedQuoteId={selectedQuoteId} />
            </Box>
          </Modal>

        <Grid container spacing={2} style={{marginTop:'10px', marginLeft:'10px', paddingRight:'50px'}}>
        <Grid item xs={12}>
          <Card style={{backgroundColor:'rgb(245, 245, 245)'}}>
            <CardHeader
                title={<div style={{ display: 'flex', alignItems: 'center' }}>
                Proposal
                <Chip
                      label={quote.selected}
                      variant="outlined"
                      size="medium"
                      color={
                        quote.selected == 'Rejected' ? 'error' :
                        quote.selected == 'Pending' ? 'warning' :
                        quote.selected == 'Accepted' ? 'success' :
                        'default' 
                      }
                      style={{ marginLeft: '8px' }} 
                    />

              </div>}
                subheader={quote.quoteId}
                action={
                  <>
                  <Tooltip 
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    placement="top" 
                    title={quote.attachment ? 'Preview Attachment' : 'Attachment not available'}
                  >
                    <span>
                    <IconButton 
                        style={{color:'rgb(127, 86, 217)'}} 
                        disabled={!quote.attachment}
                        onClick={() =>
                            handlePreviewClick(documentSrc)}
                      >
                        {quote.attachment ? <Visibility /> : <VisibilityOff />}    
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip 
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={quote.attachment ? 'Download Attachment' : 'Attachment not available'}
                    placement="top"
                  >
                    <span>
                      <Button 
                        style={{ backgroundColor: 'rgb(127, 86, 217)', marginRight: '8px' }} 
                        variant="contained" 
                        onClick={() => handleDownloadClick(documentSrc)}
                        disabled={!quote.attachment}
                      >
                        Download File
                      </Button>
                    </span>
                  </Tooltip>

                  {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT" ? (

                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    placement="top" 
                    title={quote.selected === 'Rejected' || quote.selected === 'Accepted' ? `Can't Edit as Proposal is ${quote.selected}` : ''}
                  >
                    <span>
                    <Button style={{ backgroundColor: 'rgb(127, 86, 217)' }} onClick={() => handleUpdateOpen(quote._id)} variant="contained" type="submit" 
                    disabled={quote.selected === 'Rejected' || quote.selected === 'Accepted' }
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
                <Grid container spacing={2} style={{ padding: '10px', paddingRight:'20px' }}>
                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '5px' }}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Service Name
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                      {serviceNamesMap[quote.serviceId]}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginLeft: '5px', marginBottom: '5px' }}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Order Brief
                    </Typography>
                    <Typography variant="body1"> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quote.order_brief) }} /></Typography>

                  </Grid> */}
                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '5px' }}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Created On
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                      {new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} style={{ backgroundColor: 'rgb(127, 86, 217)', borderRadius: '10px', padding: '10px', marginTop: '5px' }}>
                    <Typography variant="subtitle1" component="div" style={{ color: '#fff' }}>
                      Duration
                    </Typography>
                    <Typography variant="body1" component="div" style={{ color: '#fff' }}>
                      {quote.value} {quote.unit}
                    </Typography>
                  </Grid>
                </Grid>
                
              </CardContent>
            
            <Divider></Divider>
            <CardHeader
                title={'Order Brief'}  
            />
            <CardContent style={{marginLeft:'-10px'}}>
            <Grid
              container
              spacing={2}
              xs={9}
              style={{
                borderRadius: '10px',
                paddingRight: '60px',
                marginRight: '5px',
                marginLeft: '5px',
                marginBottom: '5px',
                backgroundColor: 'rgb(127, 86, 217)',

              }}
            >
              <div
                style={{
                  backgroundColor: 'rgb(127, 86, 217)',
                  borderRadius: '10px',
                  padding: '10px',
                  width: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflowWrap: 'break-word'
                }}
              >
                <Typography variant="subtitle1"
                    component="div"
                    style={{ color: '#fff' }}> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quote.order_brief) }} /></Typography>
              </div>
            </Grid>

          </CardContent>
            

            <Divider></Divider>

            <CardHeader
                title={'Payment Details'}  
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
                    {quote.budget}
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
                    {quote.quantity}
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
                    {quote.budget * quote.quantity}
                  </Typography>
                </div>
              </div>
            </Grid>

            {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button style={{ backgroundColor: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(quote._id)} variant="contained" type="submit">
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
          Are you sure you want to delete this proposal?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteQuote}
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

export default QuoteDetails;
