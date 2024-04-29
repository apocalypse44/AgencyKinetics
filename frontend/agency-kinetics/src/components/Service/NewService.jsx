import React, {useEffect, useState} from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { clearErrors, createService, getService } from '../../actions/serviceAction'
import { useAlert } from 'react-alert';
import { NEW_SERVICE_RESET } from '../../constants/serviceConstant';
import MetaData from '../layout/MetaData';
import { addNotification, createNotification } from '../../actions/notificationAction';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Autocomplete, Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { Editor } from 'primereact/editor';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const NewService = ({handleClose}) => {
const dispatch = useDispatch();
const alert = useAlert();
const history = useHistory()
const {loading, error, success} = useSelector((state)=>state.newService)
console.log("su", success)

const [service_name , setService_name]=useState("");
const [value, setValue] = useState('')
const [unit, setUnit] = useState('Days')

const [service_desc , setService_desc]=useState("");
const [service_amount , setService_amount]=useState("");
const [service_pricing_type , setService_pricing_type]=useState("One-Time");
const [service_cover_img, setService_cover_img] = useState(null);

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


  useEffect(() => {
    if (error) {
      handleClose()
      // history.push("/clients");
      history.push({
        pathname: "/services",
        state: {
          snackbar: {
            message: `New Service Creation Failed as: ${error}`,
            severity: "error"
          }
        }
      });
      dispatch({ type: NEW_SERVICE_RESET });
      dispatch(getService());

      dispatch(clearErrors());
      // dispatch(addNotification({ message: `New Service Creation Failed`}));
    }
    if(success) {
      // alert.success("Service Created Successfully");
      handleClose()
      // history.push("/services");
      history.push({
        pathname: "/services",
        state: {
          snackbar: {
            message: "New Service Created Successfully",
            severity: "success"
          }
        }
      });
      dispatch({ type: NEW_SERVICE_RESET });
    dispatch(getService());

      // dispatch(addNotification({ message: `New Service ${service_name} Created Successfully`}));
      dispatch(createNotification(combined.user._id, ` New Service ${service_name} Created Successfully`));

    }
  }, [dispatch, alert, error, history, success]);

  const createServiceSubmitHandler = (e) => {
    e.preventDefault();
    console.log(service_cover_img)
    const myForm = new FormData();
    myForm.set("service_name", service_name);
    myForm.set("service_amount", service_amount);
    myForm.set("service_desc", service_desc);
    myForm.set("service_pricing_type", service_pricing_type);
    myForm.set("value", value);
    myForm.set("unit", unit);

    if (service_cover_img) {
      myForm.set('service_cover_img', service_cover_img);
    }
  //   else {
  //     const emptyBuffer = new Uint8Array(0); // Empty array-like object
  //   const defaultImage = new File([emptyBuffer], "default.jpg", { type: "image/jpeg" });
  //   myForm.set('service_cover_img', defaultImage);
  // }
    // console.log('herere', service_cover_img)
    dispatch(createService(myForm));
  };
  

  const handleImageChange = (e) => {
    const service_cover_img = e.target.files[0];
    setService_cover_img(service_cover_img);
  };

  return (
    <div>
        <MetaData title ="Create Service  -- Test"/>

        {/* <div className="newProductContainer"> */}
          <form
            className="createServiceForm"
            encType="multipart/form-data"
            onSubmit={createServiceSubmitHandler}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <InputLabel id="serviceName-label" style={{marginTop:'20px'}}>Service Name</InputLabel>

                  <TextField
                    type="text"
                    label="Service Name"
                    placeholder="Service Name"
                    required
                    value={service_name}
                    onChange={(e) => setService_name(e.target.value)}
                    fullWidth
                    variant="filled"
                    margin="none"
                  />
                </Grid>

              <Grid item xs={12} sm={6}>
                <InputLabel id="serviceAmount-label">Amount</InputLabel>

                  <TextField
                    type="number"
                    label="Service Amount"
                    placeholder="Service Amount"
                    required
                    value={service_amount}
                    onChange={(e) => setService_amount(e.target.value)}
                    fullWidth
                    variant="filled"
                    margin="none"
                  />
                </Grid>


              <Grid item xs={12} sm={6}>
                <InputLabel id="service-price-type">Select Pricing Type</InputLabel>
                <Autocomplete  
                  fullWidth
                  disablePortal
                  value={service_pricing_type}
                  onChange={(event, newValue) => {
                    setService_pricing_type(newValue);
                  }}
                  id="service_pricing_type"
                  options={['One-Time', 'Recurring']}
                  noOptionsText="Select Pricing Type"
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      label="Select Pricing Type"
                      variant="filled"
                    />
                  )}
                />
                </Grid>

                <Grid item xs={12} sm={6}>
                <InputLabel id="service-value">Value</InputLabel>
                  <TextField
                    type="number"
                    label="Select Value"
                    placeholder="Value"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth
                    variant="filled"
                    margin="none"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                <InputLabel id="service-unit">Select Unit</InputLabel>
                <Autocomplete  
                  fullWidth
                  disablePortal
                  value={unit}
                  onChange={(event, newValue) => {
                    setUnit(newValue);
                  }}
                  id="service_unit"
                  options={['Days', 'Months', 'Weeks']}
                  noOptionsText="Select Unit"
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      label="Select Unit"
                      variant="filled"
                    />
                  )}
                />
                </Grid>

                
                
                <Grid item xs={12} sm={12}>
                <InputLabel id="service-cover-img">Service Cover Image</InputLabel>

                <Button
                fullWidth
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  endIcon={service_cover_img ? <FileDownloadDoneIcon /> : null}
                  style={{ backgroundColor: 'rgb(105, 56, 239)' }}

                >
                   <Tooltip title={service_cover_img ? "Image uploaded" : ""} placement="top">
                   <span>{service_cover_img ? "Uploaded file " + service_cover_img.name : "Upload file"}</span>
                  </Tooltip>
                  <VisuallyHiddenInput type="file" accept='image/*' onChange={handleImageChange}   />
                </Button>
                {/* <FormControl fullWidth variant="filled">
                  <Input
                    id="cover-image-input"
                    type="file"
                    inputProps={{ accept: 'image/*' }}
                    onChange={handleImageChange}
                    
                  />
                </FormControl> */}
                </Grid>

                <Grid item xs={12} sm={12}>
                <InputLabel id="service-desc">Description</InputLabel>

                <Editor value={service_desc} onTextChange={(e) => setService_desc(e.htmlValue)} headerTemplate={header} style={{ height: '320px' }} />
                  {/* <TextField
                    type="text"
                    label="Service Description"
                    placeholder="Service Description"
                    required
                    value={service_desc}
                    onChange={(e) => setService_desc(e.target.value)}
                    fullWidth
                    multiline
                    rowsMax={10}
                    variant="filled"
                    margin="normal"
                  /> */}
                </Grid>

                
              

              </Grid>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                  id="createOrderBtn"
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: 'rgb(105, 56, 239)' }}
                >
                  Create
                </Button>
              </div>
          </form>
        </div>
    // </div>
  )
}

export default NewService