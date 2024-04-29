import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { clearErrors, deleteService, getService, getServiceDetails } from "../../actions/serviceAction.jsx";
import MetaData from "../layout/MetaData.jsx";
import { addNotification } from "../../actions/notificationAction.jsx";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import { DELETE_SERVICE_RESET } from "../../constants/serviceConstant.jsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import car from "../../Images/car.jpg";
import { Box, Breadcrumbs, Button, CardContent, CardHeader, Dialog, DialogActions, DialogContent, Divider, Grid, Modal } from "@mui/material";
import { Card, DialogTitle, Typography } from "@material-ui/core";
import UpdateService from "./UpdateService.jsx";
import { CircularProgress } from '@mui/material';
import DOMPurify from 'dompurify';
import logoAK from "../../Images/logoAK.svg";


const updateStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid #000',
  borderRadius: 5, // Set border radius to 0 for rectangular border
  boxShadow: 24,
  overflow:'auto',
  p: 4,
  
};

const ServiceDetails = ({ match }) => {
  const history = useHistory()
  const dispatch = useDispatch();
  const alert = useAlert();
  const [imageSrc, setImageSrc] = useState(null);
  const combined = useSelector((state) => state.logMember.combined);

  const { service, error:serviceDetailError } = useSelector(state => state.serviceDetails);
  const { error, loader, services } = useSelector((state) => state.services);
  const { error: deleteError, isDeleted } = useSelector((state) => state.serviceDU);
  console.log(service)
  
  const handleBreadcrumbClick = () => {
    history.push('/services');
  };

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleUpdateOpen = (serviceId) => {
    // Store the selected serviceId in the state or perform any other actions you need
    setSelectedServiceId(serviceId);
  
    // Open the update modal
    setOpenUpdateModal(true);
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);


  const handleDeleteConfirmation = (serviceId) => {
    setServiceIdToDelete(serviceId);
    setOpenConfirmDialog(true);
  };

  const handleDeleteService = () => {
    dispatch(deleteService(serviceIdToDelete));
    setServiceIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setServiceIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const loadImages = async () => {
    var updatedImageSrcs = null;
    console.log(service.service_cover_img.data.data.length)

    
      if (service.service_cover_img.data.data.length > 0) {
        try {
          console.log(service.service_cover_img.data.data.length)

          const response = await fetch(`data:${service.service_cover_img.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(service.service_cover_img.data.data)))}`);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          updatedImageSrcs = url;
        } catch (error) {
          console.error('Error fetching image:', error);
          updatedImageSrcs = null;
        }
      } else {
        updatedImageSrcs = null;
      }
    setImageSrc(updatedImageSrcs);
    console.log(imageSrc)

  };

  useEffect(() => {
    loadImages();
  }, [dispatch, service]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      // alert.error(deleteError);
      history.push({
        pathname: "/services",
        state: {
          snackbar: {
            message: `Service Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });      
      dispatch({ type: DELETE_SERVICE_RESET });
      dispatch(addNotification({ message: 'Service Deletion Failed'}));
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert.success("Service deleted Succeccfully");
      // history.push("/services");
      history.push({
        pathname: "/services",
        state: {
          snackbar: {
            message: "Service Deleted Successfully",
            severity: "success"
          }
        }
      });      
      dispatch({ type: DELETE_SERVICE_RESET });
      dispatch(addNotification({ message: 'Service Deleted Successfully'}));

    }

    dispatch(getService());
    
  }, [dispatch, alert, error, isDeleted, history, deleteError, services.service_cover_img]);

  useEffect(() => {
      if(serviceDetailError){
      //  alert.error(error)
       dispatch(clearErrors())
    }
    dispatch(getServiceDetails(match.params.id));
  }, [dispatch, match.params.id, serviceDetailError , alert]);

  return (
    <div>
        <MetaData title ="ServiceDetails  -- Test"/>
        <div className="btn">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
            Services
            </Button>
            <Typography style={{color:"rgb(127, 86, 217)"}}>Service Details</Typography>
          </Breadcrumbs>
          
        </div>

        <Modal
            open={openUpdateModal}
            onClose={handleUpdateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={updateStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Update Service
              </Typography>
              <UpdateService handleUpdateClose={handleUpdateClose} selectedServiceId={selectedServiceId} />
            </Box>
          </Modal>

          <Grid container spacing={2} style={{marginTop: '0px', marginLeft: '10px', paddingRight: '50px', marginBottom: '10px' }}>
          <Grid item xs={12} >
      
          <Card style={{backgroundColor:'rgb(245, 245, 245)', height:'600px'}}>
          <CardHeader
            title={'Service'}
            subheader={service.service_name}
            action={
              <>
              {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (

              <Button style={{ backgroundColor: 'rgb(127, 86, 217)', marginRight:'8px' }} onClick={() => handleUpdateOpen(service._id)} variant="contained" type="submit"  
                >
                  Edit
                </Button>
              ) : null}

            {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (

              <Button style={{ backgroundColor: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(service._id)} variant="contained" type="submit">
                      Delete
                    </Button>
              ) : null}

                
            </>
            }
          />





          <CardContent>
          <Grid container spacing={2} style={{ padding: ' 0px 20px 10px 10px', height:'430px'}}>
              {/* Left section with image */}
              <Grid item xs={5} style={{  borderRadius: '10px', padding: '10px', marginRight: '5px', marginBottom: '0px', display: 'flex',
                justifyContent: 'center', // Horizontally center
                alignItems: 'center', }}>
              {imageSrc ? (
              <LazyLoadImage
                    src={imageSrc}
                    alt={service.service_name}
                    effect="blur"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                  
              ):(
                <img
                        src={logoAK}
                        alt="AgencyKinetics"
                        height={140}
                        style={{ objectFit: 'cover', height: '140px', width: '100%' }}
                      />
              )}

                  </Grid>


                  <Grid
                    item
                    xs={6}
                    style={{
                      backgroundColor: 'rgb(127, 86, 217)',
                      borderRadius: '10px',
                      padding: '10px',
                      marginLeft: '5px',
                      marginBottom: '5px',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ flex: '1' }}>
                      <Typography variant="subtitle1" component="div" >
                        Service Name
                      </Typography>
                      <Typography variant="body1" component="div" style={{ overflowWrap: 'break-word' }}>
                        {service.service_name}
                      </Typography>
                    </div>
                    {/* <Divider overlap="rectangular" flexItem style={{ background: 'rgb(255, 255, 255)' }} />
                    <div style={{ flex: '1' }}>
                      <Typography variant="subtitle1" component="div" >
                        Description
                      </Typography>
                      <Typography variant="body1" gutterBottom style={{ overflowWrap: 'break-word' }}>{service.service_desc}</Typography>
                    </div> */}
                    <Divider overlap="rectangular" flexItem style={{ background: 'rgb(255, 255, 255)' }} />
                    <div style={{ flex: '1' }}>
                      <Typography variant="subtitle1" component="div">
                        Created On
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {new Date(service.service_createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </Typography>
                    </div>
                    <Divider overlap="rectangular" flexItem style={{ background: 'rgb(255, 255, 255)' }} />
                    <div style={{ flex: '1' }}>
                      <Typography variant="subtitle1" component="div">
                        Amount
                      </Typography>
                      <Typography variant="body1" gutterBottom>{service.service_amount}</Typography>
                    </div>
                    <Divider overlap="rectangular" flexItem style={{ background: 'rgb(255, 255, 255)' }} />
                    <div style={{ flex: '1' }}>
                      <Typography variant="subtitle1" component="div">
                        Duration
                      </Typography>
                      <Typography variant="body1" gutterBottom>{service.value} {service.unit}</Typography>
                    </div>
                    
                  </Grid>
                  

                  <Grid xs={12} style={{
                      padding: '10px',
                      marginBottom: '5px',
                      color: 'black',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}>
                      <div style={{ flex: '1' }}>
                      <Typography variant="h6" component="div" >
                        Description
                      </Typography>
                    <Typography gutterBottom variant="body2"><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.service_desc) }} /></Typography>

                      {/* <Typography variant="subtitle1" gutterBottom style={{ overflowWrap: 'break-word' }}>{service.service_desc}</Typography> */}
                    </div>
                  </Grid>
                  </Grid>
                  
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
            onClick={handleDeleteService}
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

export default ServiceDetails;
