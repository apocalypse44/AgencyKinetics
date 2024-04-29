import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import './Invoices.css'
import { NEW_INVOICE_RESET } from '../../constants/invoicesConstants';
import { createInvoice ,clearErrors, getInvoice} from '../../actions/invoiceAction';
// import Select from 'react-select';
import {Grid , Button} from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, CardContent, Autocomplete, TextField, InputAdornment } from '@mui/material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { addNotification, createNotification } from '../../actions/notificationAction';


const NewInvoice = ({ handleClose }) => {
  const combined = useSelector((state) => state.logMember.combined);
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, success } = useSelector((state) => state.newInvoice);
  const history = useHistory()
  const [client_name, setclient_name] = useState(null);
  const [orderId, setorderId] = useState(null);
  const [country, setcountry] = useState('');   
  const [state, setstate] = useState('');  
  const [zip, setzip] = useState('');
  const [city, setcity] = useState('');
  const [status, setstatus ] = useState('Open');
  const [amount, setamount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);



  const [orderIdsList, setOrderIdsList] = useState([]);
  const [clientIdsList, setClientIdsList] = useState([]);
  var [selectedCountry, setSelectedCountry] = useState(null);
  var [selectedState, setSelectedState] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  var [selectedCity, setSelectedCity] = useState(null);
  const [citiesList, setCitiesList] = useState([]);

  const currencies = [
    {
      value: 'USD',
      label: '$ - United States Dollar (USD)',
    },
    {
      value: 'EUR',
      label: '€ - Euro (EUR)',
    },
    {
      value: 'GBP',
      label: '£ - British Pound Sterling (GBP)',
    },
    {
      value: 'JPY',
      label: '¥ - Japanese Yen (JPY)',
    },
    {
      value: 'CAD',
      label: '$ - Canadian Dollar (CAD)',
    },
    {
      value: 'AUD',
      label: '$ - Australian Dollar (AUD)',
    },
    {
      value: 'CHF',
      label: 'CHF - Swiss Franc (CHF)',
    },
    {
      value: 'CNY',
      label: '¥ - Chinese Yuan (CNY)',
    },
    {
      value: 'SEK',
      label: 'kr - Swedish Krona (SEK)',
    },
    {
      value: 'NZD',
      label: '$ - New Zealand Dollar (NZD)',
    },
    {
      value: 'ZAR',
      label: 'R - South African Rand (ZAR)',
    },
    {
      value: 'INR',
      label: '₹ - Indian Rupee (INR)',
    },
    {
      value: 'BRL',
      label: 'R$ - Brazilian Real (BRL)',
    },
    {
      value: 'RUB',
      label: '₽ - Russian Ruble (RUB)',
    },
    {
      value: 'MXN',
      label: '$ - Mexican Peso (MXN)',
    },
    {
      value: 'SGD',
      label: '$ - Singapore Dollar (SGD)',
    },
    {
      value: 'HKD',
      label: '$ - Hong Kong Dollar (HKD)',
    },
    {
      value: 'NOK',
      label: 'kr - Norwegian Krone (NOK)',
    },
    {
      value: 'KRW',
      label: '₩ - South Korean Won (KRW)',
    },
    {
      value: 'TRY',
      label: '₺ - Turkish Lira (TRY)',
    },
  ];
  
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const handleChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  useEffect(() => {
    const calculateAmounts = () => {
      var discountAmount = (amount * discountPercentage) / 100;
      var totalAmount = amount - discountAmount;
      var dueAmount = paidAmount === 0 ? totalAmount : totalAmount - paidAmount;

      setDiscountAmount(discountAmount);
      setTotalAmount(totalAmount);
      setDueAmount(dueAmount);
    };

    calculateAmounts();
  }, [amount, discountPercentage, paidAmount]);

  useEffect(() => {
    const fetchClientIds = async () => {
      try {
        const response = await fetch('/test/v1/combined/getAllClient');
        if (!response.ok) {
          throw new Error(`Failed to fetch client IDs: ${response.status}`);
        }
        const data = await response.json();
        console.log('Client IDs data:', data);
        setClientIdsList(data.combined || []); 
      } catch (error) {
        console.error('Error fetching client IDs:', error.message);
      }
    };
    fetchClientIds();
  }, []);

  useEffect(() => {
    const fetchOrderIds = async () => {
      try {
        const response = await fetch('/test/v1/orders');
        if (!response.ok) {
          throw new Error(`Failed to fetch order IDs: ${response.status}`);
        }
        const data = await response.json();
        console.log('Order IDs data:', data);
        const orderMap = {};
        data.orders.forEach((order) => {
          orderMap[order._id] = order.orderId;
        });
        setOrderIdsList(data.orders || []); 
      } catch (error) {
        console.error('Error fetching order IDs:', error.message);
      }
    };

    fetchOrderIds();
  }, []);


  


  useEffect(() => {
    if (error) {
      handleClose()
      // history.push("/clients");
      history.push({
        pathname: "/invoices",
        state: {
          snackbar: {
            message: `New Invoice Creation Failed as: ${error}`,
            severity: "error"
          }
        }
      });
      dispatch({ type: NEW_INVOICE_RESET });
      dispatch(getInvoice());

      dispatch(clearErrors());
      dispatch(addNotification({ message: `New Invoice Creation Failed`}));
    }

    if (success) {
      handleClose()
      // alert.success('Invoice Created Successfully');
      // history.push('/invoices');
      history.push({
        pathname: "/invoices",
        state: {
          snackbar: {
            message: "New Invoice Created Successfully",
            severity: "success"
          }
        }
      });
      dispatch({ type: NEW_INVOICE_RESET });
    dispatch(getInvoice());
      // dispatch(addNotification({ message: `New Invoice Created Successfully`}));
      dispatch(createNotification(combined.user._id, ` New Invoice Created Successfully`));
      dispatch(createNotification(client_name._id, ` New Invoice Created Successfully`));

    }

  }, [dispatch, alert, error, history, success]);



  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/states');
        if (!response.ok) {
          throw new Error(`Failed to fetch countries: ${response.status}`);
        }
        const data = await response.json();
        const formattedCountries = data.data.map((country) => ({
          value: country.iso3,
          label: country.name,
          states: country.states,

        }));
        console.log(formattedCountries[0])
        setCountriesList(formattedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error.message);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      console.log('HERE')
      console.log(selectedCountry)
      selectedCountry = selectedCountry.label
      const selectedCountryData = countriesList.find(country => country.label === selectedCountry);
      console.log("datra", selectedCountryData.states)
      if (selectedCountryData && selectedCountryData.states) {
        const formattedStates = selectedCountryData.states.map((state) => ({
          value: state.state_code,
          label: state.name,
        }));
      console.log("datra", formattedStates)

        setStatesList(formattedStates);
      } else {
        setStatesList([]);
      }
    } else {
      setStatesList([]);
    }
  }, [selectedCountry, countriesList]);

  useEffect(() => {
    if (selectedState && selectedCountry) {
      console.log(selectedState, selectedCountry)
      const fetchCities = async () => {
        try {
          const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              country: selectedCountry.label,
              state: selectedState.label,
            }),
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch cities: ${response.status}`);
          }
          const data = await response.json();
          if (data.data) {
            const formattedCities = data.data.map((city) => ({
              value: city,
              label: city,
            }));
            setCitiesList(formattedCities);
          } else {
            setCitiesList([]);
          }
        } catch (error) {
          console.error('Error fetching cities:', error.message);
        }
      };

      fetchCities();
    } else {
      setCitiesList([]);
    }
  }, [selectedState, selectedCountry]);

  const createInvoiceSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    console.log(selectedCity, selectedCountry, selectedState)
    myForm.set('client_name', client_name._id);
    myForm.set('orderId', orderId._id);
    myForm.set('state', selectedState ? selectedState.label : '');
    myForm.set('country', selectedCountry? selectedCountry.label : '');
    myForm.set('city', selectedCity? selectedCity.value : '');
    myForm.set('zip', zip);
    myForm.set('status', status);
    myForm.set('amount', amount);
    myForm.set('discount_percentage', discountPercentage);
    myForm.set('discount_amount', discountAmount);
    myForm.set('due_amount', dueAmount);
    myForm.set('paid_amount', paidAmount);
    myForm.set('total_amount', totalAmount);
    myForm.set('currency', selectedCurrency)



    // myForm.set('serviceId', serviceId);
    
    dispatch(createInvoice(myForm));
  };

  return (
    <div>
      <MetaData title="Create Invoice -- Test" />

      {/* <div className="newInvoiceContainer"> */}
        <form
          className="createTicketForm"
          encType="multipart/form-data"
          onSubmit={createInvoiceSubmitHandler}
        >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
          <InputLabel id="client-label" style={{marginTop:'20px'}}>Client</InputLabel>
          <Autocomplete  
                  fullWidth
                  disablePortal
                  value={client_name}
                  onChange={(event, newValue) => {
                    setclient_name(newValue);
                  }}
                  id="serviceId"
                  options={clientIdsList}
                  noOptionsText="Select Client"
                  getOptionLabel={(option) => option.fname}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
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
            {/* <TextField
              label="Client Name"
              placeholder="Select Client"
              select
              fullWidth
              value={client_name}
              onChange={(e) => setclient_name(e.target.value)}
              variant="filled"
              margin="normal"
              required
            >
              {clientIdsList.map((client) => (
                <MenuItem key={client._id} value={client._id}>
                  {client.fname}
                </MenuItem>
              ))}
            </TextField> */}
          </Grid>

          <Grid item xs={12} sm={6}>
          <InputLabel id="order-label" style={{marginTop:'20px'}}>Order ID</InputLabel>

            <Autocomplete  
              fullWidth
              disablePortal
              value={orderId}
              onChange={(event, newValue) => {
                setorderId(newValue);
              }}
              id="orderId"
              options={orderIdsList}
              noOptionsText="Select Order"
              getOptionLabel={(option) => option.orderId}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  label="Select Order"
                  variant="filled"
                />
              )}
            />
            {/* <TextField
              label="Order Id"
              placeholder="Select Order Id"
              select
              fullWidth
              value={orderId}
              onChange={(e) => setorderId(e.target.value)}
              variant="filled"
              margin="normal"
              required
            >
              {orderIdsList.map((order) => (
                <MenuItem key={order._id} value={order._id}>
                  {order.orderId}
                </MenuItem>
              ))}
            </TextField> */}
          </Grid>

          <Grid item xs={12} sm={6}>
          <InputLabel id="country-label">Country</InputLabel>

            <Autocomplete  
              fullWidth
              disablePortal
              value={selectedCountry}
              onChange={(event, newValue) => {
                setSelectedCountry(newValue);
              }}
              id="country"
              options={countriesList}
              noOptionsText="Select Country"
              getOptionLabel={(option) => option.label}
              // isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  // required
                  label="Select Country"
                  variant="filled"
                />
              )}
            />
            {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
              <InputLabel id="country-label">Select Country</InputLabel>
              <Select
                labelId="country-label"
                value={selectedCountry}
                onChange={(selectedOption) => setSelectedCountry(selectedOption.target.value)}
              >
                <MenuItem value="" disabled>
                  Select Country
                </MenuItem>
                {countriesList.map((country) => (
                  <MenuItem key={country.value} value={country.label}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </Grid>

          <Grid item xs={12} sm={6}>
          <InputLabel id="state-label">State</InputLabel>
            <Autocomplete  
              fullWidth
              disablePortal
              value={selectedState}
              onChange={(event, newValue) => {
                setSelectedState(newValue);
              }}
              id="country"
              options={statesList}
              noOptionsText="Select State"
              getOptionLabel={(option) => option.label}
              // isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  // required
                  label="Select State"
                  variant="filled"
                />
              )}
            />
            {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
              <InputLabel id="state-label">Select State</InputLabel>
              <Select
                labelId="state-label"
                value={selectedState}
                onChange={(selectedOption) => setSelectedState(selectedOption.target.value)}
              >
                <MenuItem value="" disabled>
                  Select State
                </MenuItem>
                {statesList.map((state) => (
                  <MenuItem key={state.value} value={state.label}>
                    {state.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </Grid>

          <Grid item xs={12} sm={12}>
          <InputLabel id="city-label">City</InputLabel>

            <Autocomplete  
              fullWidth
              disablePortal
              value={selectedCity}
              onChange={(event, newValue) => {
                setSelectedCity(newValue);
              }}
              id="city"
              options={citiesList}
              noOptionsText="Select City"
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  // required
                  label="Select City"
                  variant="filled"
                />
              )}
            />
            {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
              <InputLabel id="city-label">Select City</InputLabel>
              <Select
                labelId="city-label"
                value={selectedCity}
                onChange={(selectedOption) => setSelectedCity(selectedOption.target.value)}
              >
                <MenuItem value="" disabled>
                  Select City
                </MenuItem>
                {citiesList.map((city) => (
                  <MenuItem key={city.value} value={city.label}>
                    {city.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </Grid>


          <Grid item xs={12} sm={6}>
          <InputLabel id="zip-label">Zip</InputLabel>
            <TextField
            type='number'
              label="Zip"
              placeholder="Zip"
              value={zip}
              onChange={(e) => setzip(e.target.value)}
              fullWidth
              variant="filled"
              margin="none"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
          <InputLabel id="status-label">Status</InputLabel>
            <Autocomplete 
                  fullWidth
                  disablePortal
                  value={status}
                  onChange={(event, newValue) => {
                    setstatus(newValue);
                  }}
                  id="status"
                  options={['Draft', 'Open', 'Paid', 'Uncollectable', 'Void']}
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

          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setamount(e.target.value)}
              fullWidth
              variant="filled"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Select
                    style={{borderColor:'none'}}
                    
                      value={selectedCurrency}
                      onChange={handleChange}
                    >
                     {currencies
                      .slice()
                      .sort((a, b) => {
                        const labelA = a.label.split(' - ')[1].toLowerCase();
                        const labelB = b.label.split(' - ')[1].toLowerCase();
                        return labelA.localeCompare(labelB);
                      })
                      .map((option) => (
                        <MenuItem key={option.value} value={option.value + option.label.split(' - ')[0]}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </InputAdornment>
                  ),
                }}
              />
          
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Discount Percentage"
              placeholder="Discount Percentage"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              fullWidth
              variant="filled"
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Discount Amount"
              type="text"
              value={discountAmount}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant="filled"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Paid Amount"
              placeholder="Paid Amount"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              fullWidth
              variant="filled"
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Amount"
              type="text"
              value={totalAmount}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant="filled"
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Amount"
              type="text"
              value={dueAmount}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant="filled"
              margin="normal"
            />
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
  );
};


export default NewInvoice