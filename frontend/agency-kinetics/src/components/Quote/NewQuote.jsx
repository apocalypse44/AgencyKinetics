import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { NEW_QUOTE_RESET } from '../../constants/quoteConstants';
import { clearErrors, createQuote, getQuote } from '../../actions/quoteAction';
import {TextField , Button, Grid, Input} from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, CardContent, Autocomplete, Tooltip } from '@mui/material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { addNotification, createNotification } from '../../actions/notificationAction';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Editor } from 'primereact/editor';
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

const NewQuote = ({ handleClose }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, success } = useSelector((state) => state.newQuote);
  const history =useHistory()
  const [quantity, setquantity] = useState('');
  const [selected, setselected] = useState('');

  const [budget, setbudget] = useState('');
  const [order_brief, setorder_brief] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState(null);
  const [attachment, setattachment] = useState('');
  const [serviceId, setserviceId] = useState(null);
  const [serviceIdsList, setServiceIdsList] = useState([]);

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

  const handlefileChange = (e) => {
    const attachmentfile = e.target.files[0];
    setattachment(attachmentfile);
  };


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
    const fetchServiceIds = async () => {
      try {
        const response = await fetch('/test/v1/services');
        if (!response.ok) {
          throw new Error(`Failed to fetch service IDs: ${response.status}`);
        }
        const data = await response.json();
        console.log('Service IDs data:', data);

        setServiceIdsList(data.services || []); 
      } catch (error) {
        console.error('Error fetching service IDs:', error.message);
      }
    };

    fetchServiceIds();
  }, []);

  useEffect(() => {
    if (error) {
      handleClose()
      // alert.error(error);
      history.push({
        pathname: "/quotes",
        state: {
          snackbar: {
            message: `Proposal Creation Failed as: ${error}`,
            severity: "error"
          }
        }
      });
      dispatch({ type: NEW_QUOTE_RESET });
      dispatch(getQuote());

      dispatch(clearErrors());
      // dispatch(addNotification({ message: `Proposal Creation Failed`}));
    }

    if (success) {
      handleClose()
      // alert.success('Quote Created Successfully');
      // history.push('/quotes');
      history.push({
        pathname: "/quotes",
        state: {
          snackbar: {
            message: "New Proposal Created Successfully",
            severity: "success"
          }
        }
      });
      dispatch({ type: NEW_QUOTE_RESET });
    dispatch(getQuote());

      // dispatch(addNotification({ message: 'New Proposal Created successfully'}));
      dispatch(createNotification(combined.user._id, `New Proposal Created Successfully`));

    }

  }, [dispatch, alert, error, success,history ]);

  const createServiceSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    if (attachment) {
      console.log("attach", attachment)
      myForm.set('attachment', attachment);

    }
    myForm.set('quantity', quantity);
    myForm.set('order_brief', order_brief);
    myForm.set('budget', budget);
    myForm.set('value', value);
    myForm.set('unit', unit);
    myForm.set('serviceId', serviceId._id);

    dispatch(createQuote(myForm));
  };

  return (
    <div>
      <MetaData title="Create Service -- Test" />

      {/* <div className="newProductContainer"> */}
        <form
          className="createQuoteForm"
          encType="multipart/form-data"
          onSubmit={createServiceSubmitHandler}
        >

          <Grid container spacing={3}>
            <Grid item xs={12}>
            <InputLabel id="service-label" style={{marginTop:'20px'}}>Service</InputLabel>

              <Autocomplete 
                fullWidth
                disablePortal
                value={serviceId}
                onChange={(event, newValue) => {
                  setserviceId(newValue);
                }}
                id="serviceId"
                options={serviceIdsList}
                noOptionsText="Select Service"
                getOptionLabel={(option) => option.service_name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    label="Select Service"
                    variant="filled"
                  />
                )}
              />
              {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }} required>
                <InputLabel id="demo-simple-select-filled-label">Select Service</InputLabel>
                <Select
                  labelId="serviceId-label"
                  id="serviceId"
                  value={serviceId}
                  onChange={(e) => setserviceId(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Select Service
                  </MenuItem>
                  {serviceIdsList.map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.service_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
            </Grid>
            <Grid item xs={12}>
            <InputLabel id="service-label">Status</InputLabel>

              <Autocomplete 
                fullWidth
                disablePortal
                value={selected}
                onChange={(event, newValue) => {
                  setselected(newValue);
                }}
                id="selected"
                  options={['Accepted', 'Rejected', 'Pending']}
                  noOptionsText="Select Status"
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      label="Select Status"
                      variant="filled"
                  />
                )}
              />
              </Grid>

           
          
           {/* <Grid item xs={12} sm={6}>
            <InputLabel id="attachment-label">Attachment</InputLabel>
               <TextField
                type="text"
                label="Attachment"
                placeholder="Attachment"
                required
                value={attachment}
                onChange={(e) => setattachment(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              /> 
            </Grid>*/}
            <Grid item xs={12} sm={6}>
            <InputLabel id="quantity-label">Quantity</InputLabel>

              <TextField
                type="number"
                label="Quantity"
                placeholder="Quantity"
                required
                value={quantity}
                onChange={(e) => setquantity(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id="budget-label">Budget</InputLabel>

              <TextField
                type="number"
                label="Budget"
                placeholder="Budget"
                required
                value={budget}
                onChange={(e) => setbudget(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id="value-label">Value</InputLabel>

              <TextField
                type="number"
                label="Value"
                placeholder="Value"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              />
            </Grid>
            <Grid item xs={6} >
            <InputLabel id="unit-label">Unit</InputLabel>
            <Autocomplete  
                  fullWidth
                  disablePortal
                  value={unit}
                  onChange={(event, newValue) => {
                    setUnit(newValue);
                  }}
                  id="unit"
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
              {/* <FormControl fullWidth variant="filled">
                <InputLabel id="unit-label">Select Unit</InputLabel>
                <Select
                  labelId="unit-label"
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <MenuItem value="" disabled>Select Unit</MenuItem>
                  <MenuItem value="Days">Days</MenuItem>
                  <MenuItem value="Weeks">Weeks</MenuItem>
                  <MenuItem value="Months">Months</MenuItem>
                </Select>
              </FormControl> */}
            </Grid>

            <Grid item xs={12} sm={12}>
            <InputLabel id="attachment">Attachment</InputLabel>

            <Button
                fullWidth
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  endIcon={attachment ? <FileDownloadDoneIcon /> : null}
                  style={{ backgroundColor: 'rgb(105, 56, 239)' }}

                >
                   <Tooltip title={attachment ? "File uploaded" : ""} placement="top">
                   <span>{attachment ? "Uploaded file " + attachment.name : "Upload file"}</span>
                  </Tooltip>
                  <VisuallyHiddenInput type="file" accept='.docx,.csv,.pdf' onChange={handlefileChange}   />
                </Button>
          {/* <FormControl fullWidth variant="filled">
            <Input
              id="file-input"
              type="file"
              inputProps={{ accept: '.docx,.csv,.pdf,.jpg,.jpeg,.png' }}
              onChange={(e) => setattachment(e.target.files[0])}
            />
          </FormControl> */}
        </Grid>

            <Grid item xs={12} sm={12}>
            <InputLabel id="orderBrief-label" required>Order Brief</InputLabel>
            <Editor value={order_brief} onTextChange={(e) => setorder_brief(e.htmlValue)} headerTemplate={header} style={{ height: '320px' }} required />

              {/* <TextField
                type="text"
                label="Order Brief"
                placeholder="Order Brief"
                required
                multiline
                value={order_brief}
                onChange={(e) => setorder_brief(e.target.value)}
                fullWidth
                variant="filled"
                margin="none"
              /> */}
            </Grid>

          </Grid>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading}
              variant="contained"
              color="primary"
              style={{ backgroundColor: 'rgb(105, 56, 239)' }}
            >
              Create
            </Button>
          </div>


{/*           
          <h1>Create Quote</h1>
          <div>
<select
  value={serviceId}
  onChange={(e) => setserviceId(e.target.value)}
>
  <option value="" disabled>
    Select Service
  </option>
  {serviceIdsList.map((service) => (
    <option key={service._id} value={service._id}>
      {service.service_name}
    </option>
  ))}
</select>

          </div>
                            <div>
              <input
                type="text"
                placeholder="order_brief"
                value={order_brief}
                required
                onChange={(e) => setorder_brief(e.target.value)}
              />
            </div> 
                        <div>
              <input
                type="string"
                placeholder="attachment"
                required
                onChange={(e) => setattachment(e.target.value)}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Quantity "
                required
                value={quantity}
                onChange={(e) => setquantity(e.target.value)}
              />
            </div>
            <div>
              <input
              type="number"
                placeholder="Budget"
                required
                value={budget}
                onChange={(e) => setbudget(e.target.value)}
              ></input>
            </div>
            <div>
              <input
                type="number"
                placeholder="Value "
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
  <div>
  <select
    required
    value={unit}
    onChange={(e) => setUnit(e.target.value)}
  >
    <option value="" disabled>Select Unit</option>
    <option value="Days">Days</option>
    <option value="Weeks">Weeks</option>
    <option value="Months">Months</option>
  </select>
</div>




          <button
            id="createProductBtn"
            type="submit"
            disabled={loading ? true : false}
          >
            Create
          </button> */}
        </form>
      </div>
    // </div>
  );
};

export default NewQuote;