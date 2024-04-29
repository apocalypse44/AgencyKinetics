import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { getService } from "../../actions/serviceAction.jsx";
import ServiceCard from "./ServiceCard.jsx";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { clearErrors, deleteService } from "../../actions/serviceAction";
import { useAlert } from "react-alert";
import { DELETE_SERVICE_RESET } from "../../constants/serviceConstant";
import "./ServiceCard.css";
import logoAK from "../../Images/logoAK.svg";
import useImagePreload from './imagePreload.jsx'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NewService from "./NewService.jsx";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import { Dialog, DialogActions, DialogContent, DialogTitle, Breadcrumbs, CardHeader, Fade, IconButton, Tooltip, Container } from "@mui/material";
import { addNotification, createNotification } from "../../actions/notificationAction.jsx";
import UpdateService from "./UpdateService.jsx";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CustomizedSnackbars from "../../snackbarToast.jsx";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min.js";
import { CircularProgress } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DOMPurify from 'dompurify';
import empty from '../../Images/empty-folder.png'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  boxShadow: '5px 5px 5px 5px rgba(255, 177, 0, 0.9)',
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid rgb(127, 86, 217)',
  borderRadius: 5, 
  boxShadow: 24,
  overflow:'auto',
  p: 4,
  
  
};

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
  borderRadius: 5, 
  boxShadow: 24,
  overflow:'auto',
  p: 4,
  
};

const Service = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { error, loading, services } = useSelector((state) => state.services);
  const { error: deleteError, isDeleted } = useSelector((state) => state.serviceDU);
  const [openModal, setOpenModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

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


  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

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

  const [selectedServiceName, setselectedServiceName] = useState('')
  const getName = async (serviceId) => {
    try {
      const response = await fetch(`/test/v1/get/service/${serviceId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }
      const data = await response.json();
      console.log('Services data:', data);
      setselectedServiceName(data.service.service_name)
      console.log(selectedServiceName)
    } catch (error) {
      console.error('Error fetching services:', error.message);
    }
  };

  const handleDeleteConfirmation = (serviceId) => {
    setServiceIdToDelete(serviceId);
    setOpenConfirmDialog(true);
    getName(serviceId)

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

  // const deleteServiceHandler = (id) => {
  //   dispatch(deleteService(id));
  // };

  const handleBreadcrumbClick = () => {
    history.push('/services');
  };

  const [breadcrumbs, setBreadcrumbs] = React.useState([
    <Button color="inherit" href="/services" onClick={() => history.push('/services')}>
      Services
    </Button>
  ]);

  const handleLearnMore = (id) => {
    console.log("row", id);
    history.push(`/service/${id}`)
    setBreadcrumbs([
      <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
        Services
      </Button>,
      <Typography color="textPrimary">Quote Details</Typography>
    ]);
  };

  const loadImages = async () => {
    const updatedImageSrcs = [];
    
    for (const service of services) {
      if (service.service_cover_img.data.data.length > 0) {
        try {
          // console.log(service.service_cover_img.data.data.length)
          const response = await fetch(`data:${service.service_cover_img.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(service.service_cover_img.data.data)))}`);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          updatedImageSrcs.push(url);
        } catch (error) {
          console.error('Error fetching image:', error);
          updatedImageSrcs.push(null);
        }
      } else {
        updatedImageSrcs.push(null);
      }
    }
    // console.log(updatedImageSrcs)
    setImageSrc(updatedImageSrcs);

  };

  const location = useLocation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    const snackbar = location.state?.snackbar;
    if (snackbar) {
      setSnackbarMessage(snackbar.message);
      setSeverity(snackbar.severity);
      setSnackbarOpen(true);
    }
    // Clear the state to avoid showing the Snackbar again on subsequent renders
    history.replace({ ...location, state: undefined });
  }, [location.state, history]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };



  
  useEffect(() => {
    loadImages();
  }, [dispatch, services]);

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
      // dispatch(addNotification({ message: 'Service Deletion Failed'}));  
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert.success("Service deleted Succeccfully");
      history.push("/services");
      dispatch({ type: DELETE_SERVICE_RESET });
      // dispatch(addNotification({ message: `Service ${selectedServiceName} Deleted Successfully`}));
      dispatch(createNotification(combined.user._id, `Service ${selectedServiceName} Deleted Successfully`));
      
      setSnackbarMessage(`Service Deleted Successfully`);
      setSeverity('success');
      setSnackbarOpen(true);
    }

    dispatch(getService());
    
  }, [dispatch, alert, error, isDeleted, history, deleteError, services.service_cover_img]);



  // const handleUpdate = (id) => {
  //   history.push(`/service/update/${id}`);
  // };

  return (
    <div>
      <CustomizedSnackbars
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={severity}
      />
      <MetaData title="Service -- Test" />

      <div className="btn">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
          <Typography color="rgb(127, 86, 217)">Services</Typography>
        </Button>
        </Breadcrumbs>
        {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (

          <Button style={{backgroundColor:'rgb(127, 86, 217)',marginLeft: 'auto',}}onClick={handleOpen} variant="contained"  type="submit" >
            Create Service
          </Button>
        ) : null}
        
      </div>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>

            Create New Service
          </Typography>
          <NewService handleClose={handleClose} />
        </Box>
      </Modal>

      <Modal
            open={openUpdateModal}
            onClose={handleUpdateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={updateStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>

                Update Service
              </Typography>
              <UpdateService handleUpdateClose={handleUpdateClose} selectedServiceId={selectedServiceId} />
            </Box>
          </Modal>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </div>
          )}
          

          {services.length === 0 ? (
            <Container style={{marginTop:'150px', textAlign:'center'}}>
              <img
                src={empty}
                alt="Empty Folder"
                style={{ width: "150px", height: "150px", marginBottom: "10px" }}
              />
              <Typography variant="h5" >Please Add A Service</Typography>
            </Container>
            ) : (
              <>
          <div className="main-content">
        <Grid container spacing={4} style={{ paddingLeft:'20px', paddingTop:'20px', paddingRight:'20px', paddingBottom:'20px' }}>
          {services &&
            services.map((service, index) => (
              <Grid item key={service._id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  title={
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {service.service_name.length > 20 ? `${service.service_name.slice(0, 15)}...` : service.service_name}
                    </div>
                  }
                  action={
                    <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="top" title={'Service Information'}>
                      <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleLearnMore(service._id)}>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  }
/>

                  <CardContent style={{ flex: '1 0 auto' }}>
                    {imageSrc && imageSrc[index] ? (
                      <LazyLoadImage
                        src={imageSrc[index]}
                        alt={service.service_name}
                        height={140}
                        style={{ objectFit: 'cover', height: '140px', width: '100%' }}
                      />
                    ) : (
                      <img
                        src={logoAK}
                        alt="AgencyKinetics"
                        height={140}
                        style={{ objectFit: 'cover', height: '140px', width: '100%' }}
                      />
                      // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 140 }}>
                      //   <CircularProgress color="primary" />
                      // </div>
                    )}
                    <div className="details">
                    <Typography variant="body2">Description: <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.service_desc) }} /></Typography>
                    {/* <Typography variant="body2">Description: <span style={{ overflowWrap: 'break-word', color: 'inherit' }}>{service.service_desc.length > 40 ? `${service.service_desc.slice(0, 40)}...` : service.service_desc}</span></Typography> */}
                    <Typography variant="body2">Amount: ${service.service_amount}</Typography>
                    <Typography variant="body2">Pricing Type: {service.service_pricing_type}</Typography>


                    </div>
                  </CardContent>
                  <CardActions style={{ justifyContent: 'space-between' }}>
                  {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
                    
                    <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="top" title={'Edit Service'}>
                      <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleUpdateOpen(service._id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                    {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
                      
                    <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(service._id)}>
                      <DeleteIcon />
                    </IconButton>
                  ) : null}

                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </div>
      </>
            )}


      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle style={{ color: 'rgb(127, 86, 217)' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this service?
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

export default Service;
