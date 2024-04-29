import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { NEW_ORDER_RESET } from '../../constants/orderConstants';
import { clearErrors, createOrder, getOrders } from '../../actions/orderAction';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./Order.css"
import {TextField , Button, Typography, FormLabel, Input, Icon, IconButton, Card} from '@material-ui/core';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import {Box, Container, Divider, Grid, Paper, makeStyles} from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, CardContent, Autocomplete } from '@mui/material';
import CustomizedSnackbars from '../../snackbarToast'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { addNotification, createNotification } from '../../actions/notificationAction';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


const NewOrder = ({ handleClose }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory()
  const { loading, error, success } = useSelector((state) => state.newOrder);
  console.log(success)
  const [clientId, setclientId] = useState(null);
  const [serviceId, setserviceId] = useState(null);
  const [project_manager, setproject_manager] = useState('');  //Optional
  const [note, setnote] = useState('');   //Optional
  const [quantity, setquantity] = useState('');
  const [budget, setbudget ] = useState('');
  // const [kickoff_date, setkickoff_date] = useState(Date.now);
  // const [end_date, setend_date] = useState('');
  const [kickoffDateCalendar, setKickoffDateCalendar] = useState(new Date());
  const [endDateCalendar, setEndDateCalendar] = useState(new Date());
  const [serviceIdsList, setServiceIdsList] = useState([]);
  const [clientIdsList, setClientIdsList] = useState([]);
  const [showKickoffCalendar, setShowKickoffCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('');

  // const toggleKickoffCalendar = () => {
  //   setShowKickoffCalendar(!showKickoffCalendar);
  // };

  // const toggleEndCalendar = () => {
  //   setShowEndCalendar(!showEndCalendar);
  // };

  // const handleKickoffDateChange = (date) => {
  //   setKickoffDateCalendar(date);
  //   toggleKickoffCalendar();
  // };

  // const handleEndDateChange = (date) => {
  //   setEndDateCalendar(date);
  //   toggleEndCalendar();
  // };

  const [selectedKickOffDate, setSelectedKickOffDate] = useState(dayjs());
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs());


  const handleKickOffDateChange = (date) => {
    setSelectedKickOffDate(date);
  };
  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };
  
  useEffect(() => {
    const fetchServiceIds = async () => {
      try {
        const response = await fetch('/test/v1/services');
        if (!response.ok) {
          throw new Error(`Failed to fetch service IDs: ${response.status}`);
        }
        const data = await response.json();

        // Log the entire data object
        console.log('Service IDs data:', data);

        setServiceIdsList(data.services || []); // Ensure that data is an array or set it to an empty array
      } catch (error) {
        console.error('Error fetching service IDs:', error.message);
      }
    };

    fetchServiceIds();
  }, []);


  useEffect(() => {
    const fetchClientIds = async () => {
      try {
        const response = await fetch('/test/v1/combined/getAllClient');
        if (!response.ok) {
          throw new Error(`Failed to fetch client IDs: ${response.status}`);
        }
        const data = await response.json();

        // Log the entire data object
        console.log('Client IDs data:', data);

        setClientIdsList(data.combined || []); // Ensure that data is an array or set it to an empty array
      } catch (error) {
        console.error('Error fetching client IDs:', error.message);
      }
    };

    fetchClientIds();
  }, []);

  useEffect(() => {
    
    if (error) {
      handleClose()
      history.push({
        pathname: "/orders",
        state: {
          snackbar: {
            message: `New Order Creation Failed as: ${error}`,
            severity: "error"
          }
        }
      });
      dispatch({ type: NEW_ORDER_RESET });
      dispatch(getOrders());
      dispatch(clearErrors());

    }
    if (success) {
      // console.log('SUCCESS');
      handleClose()

      // history.push('/orders');
      history.push({
        pathname: "/orders",
        state: {
          snackbar: {
            message: "New Order Created Successfully",
            severity: "success"
          }
        }
      });

      
      // handleClose()

      dispatch({ type: NEW_ORDER_RESET });
    dispatch(getOrders());

      // dispatch(addNotification({ message: 'New Order Created successfully'}));
      dispatch(createNotification(combined.user._id, ` New Order Created Successfully`));
      dispatch(createNotification(clientId._id, ` New Order Created Successfully`));
    }
    // console.log(snackbarSeverity)
  
  }, [dispatch, error, history, success]);
  

  // useEffect(() => {
  //   if (error) {
  //     alert.error(error);
  //     dispatch(clearErrors());
  //   }
  //   if (success) {
  //     alert.success('Order Created Successfully');
  //     history.push('/orders');
  //     dispatch({ type: NEW_ORDER_RESET });
  //   }
  // }, [dispatch, alert, error, history, success]);

  const createOrderSubmitHandler = (e) => {
    e.preventDefault();
    console.log(selectedEndDate, selectedKickOffDate)
    const myForm = new FormData();
    myForm.set('clientId', clientId._id);
    myForm.set('quantity', quantity);
    myForm.set('serviceId', serviceId._id);
    myForm.set('budget', budget);
    myForm.set('kick_off_date', selectedKickOffDate);
    myForm.set('end_date', selectedEndDate);
    console.log([...myForm])


    dispatch(createOrder(myForm));
  };

  return (
    <div>
      <MetaData title="Create Order -- Test" />
{/* <div className=''></div> */}
      {/* <div className="newProductContainer"> */}
      <CustomizedSnackbars
          open={snackbarOpen}
          handleClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          severity={severity}
        />
        <form
          className="createOrderForm"
          encType="multipart/form-data"
          onSubmit={createOrderSubmitHandler}
        >
          {/* <Card style={{ width: '600px' }}>
            <CardContent> */}
              {/* <Typography variant="h5" fontWeight="bold" gutterBottom>
                Create Order
              </Typography> */}

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
                </Grid> 
                {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
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
                </FormControl>
                */}

                <Grid item xs={12}>
                <InputLabel id="client-label">Client</InputLabel>

                <Autocomplete 
                    fullWidth
                    disablePortal
                    value={clientId}
                    onChange={(event, newValue) => {
                      setclientId(newValue);
                    }}
                    id="clientId"
                    options={clientIdsList}
                    getOptionLabel={(option) => option.fname}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                    
                    noOptionsText="Select Client"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        label="Select Client"
                        variant="filled"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                <InputLabel id="quantity-label">Quantity</InputLabel>

                  <TextField
                    type="number"
                    label="Quantity"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setquantity(e.target.value)}
                    fullWidth
                    variant="filled"
                    margin="none"
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                <InputLabel id="budget-label">Budget</InputLabel>

                  <TextField
                    type="number"
                    label="Budget"
                    placeholder="Budget"
                    value={budget}
                    onChange={(e) => setbudget(e.target.value)}
                    fullWidth
                    required
                    variant="filled"
                    margin="none"
                  />
                </Grid>

                {/* <Grid item xs={12} sm={6}>
        
                    <InputLabel id="kickoffDate-label">Kick-Off Date</InputLabel>
                    <TextField
                      id="kickoffDate"
                      type="text"
                      value={kickoffDateCalendar.toDateString()}
                      onClick={toggleKickoffCalendar}
                      readOnly
                      fullWidth
                      required
                      variant="filled"
                    />
                    {showKickoffCalendar && (
                      <Calendar onChange={handleKickoffDateChange} value={kickoffDateCalendar} />
                    )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputLabel id="endDate-label">End Date</InputLabel>
                    <TextField
                      id="endDate"
                      type="text"
                      value={endDateCalendar.toDateString()}
                      onClick={toggleEndCalendar}
                      readOnly
                      fullWidth
                      required
                      variant="filled"
                    />
                    {showEndCalendar && (
                      <Calendar onChange={handleEndDateChange} value={endDateCalendar} />
                    )}
                </Grid>
              </Grid> */}


                <Grid item xs={12} sm={6}>
                  <InputLabel id="kickoffDate-label">Kick-Off Date</InputLabel>
                  {/* <TextField
                    id="kickoffDate"
                    type="text"
                    value={selectedKickOffDate.format('YYYY-MM-DD')}
                    readOnly
                    fullWidth
                    required
                    variant="filled"
                  /> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                    // label="Kick-Off Date"
                      value={selectedKickOffDate}
                      onChange={handleKickOffDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{width: '100%'}}
                          onClick={handleKickOffDateChange}
                          fullWidth
                          required
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel id="endDate-label">End Date</InputLabel>
                  {/* <TextField
                    id="endDate"
                    type="text"
                    value={selectedEndDate.format('YYYY-MM-DD')}
                    readOnly
                    fullWidth
                    required
                    variant="filled"
                  /> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                    // label="End Date"
                      value={selectedEndDate}
                      onChange={handleEndDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onClick={handleEndDateChange}
                          fullWidth
                          required
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>

                
             
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
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

            {/* </CardContent>
          </Card> */}

          <CustomizedSnackbars
          open={snackbarOpen}
          handleClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          severity={severity}
        />
        </form>
      </div>
    // </div>
  );
};

export default NewOrder