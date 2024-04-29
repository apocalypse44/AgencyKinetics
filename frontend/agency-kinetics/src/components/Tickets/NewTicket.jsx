import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { NEW_TICKET_RESET } from '../../constants/ticketConstants';
import './Ticket.css'
import { clearErrors, createTicket, getTickets } from '../../actions/ticketAction';
import {TextField , Button, Grid} from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, CardContent, Autocomplete } from '@mui/material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import CustomizedSnackbars from '../../snackbarToast';
import { addNotification, createNotification } from '../../actions/notificationAction';
import { Editor } from 'primereact/editor';


const NewTicket = ({ handleClose }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, success } = useSelector((state) => state.newTicket);
  console.log(success)
  const history = useHistory()
  const [client_name, setclient_name] = useState(null);
  const [orderId, setorderId] = useState(null);
  const [assignee, setassignee] = useState(null);   
  const [subject, setsubject] = useState('');  
  const [description, setdescription] = useState('');
  const [status, setstatus ] = useState('Open');
  const [priority, setpriority] = useState('Normal');
  const [orderIdsList, setOrderIdsList] = useState([]);
  const [clientIdsList, setClientIdsList] = useState([]);
  const [teamIdsList, setTeamIdsList] = useState([]);


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
    const fetchTeamIds = async () => {
      try {
        const response = await fetch('/test/v1/combined/getAllTeam');
        if (!response.ok) {
          throw new Error(`Failed to fetch teams IDs: ${response.status}`);
        }
        const data = await response.json();
        console.log('Team IDs data:', data);
        setTeamIdsList(data.combined || []); 
      } catch (error) {
        console.error('Error fetching team IDs:', error.message);
      }
    };
    fetchTeamIds();
  }, []);



  useEffect(() => {
    if (error) {
      handleClose()
      // history.push("/clients");
      history.push({
        pathname: "/tickets",
        state: {
          snackbar: {
            message: `New Ticket Creation Failed as: ${error}`,
            severity: "error"
          }
        }
      });
      dispatch({ type: NEW_TICKET_RESET });
      dispatch(getTickets());

      dispatch(clearErrors());
      // dispatch(addNotification({ message: `New Ticket Creation Failed`}));
      
    }

    if (success) {
      // console.log('yes')
      handleClose()
      
      // alert.success('Ticket Created Successfully');
      // history.push('/tickets');history.push({
      history.push({
          pathname: "/tickets",
          state: {
            snackbar: {
              message: "New Ticket Created Successfully",
              severity: "success"
            }
          }
        });
      dispatch({ type: NEW_TICKET_RESET });
    dispatch(getTickets())

      // dispatch(addNotification({ message: 'New Ticket Created Successfully'}));
      dispatch(createNotification(combined.user._id, ` New Ticket Created Successfully`));
      dispatch(createNotification(client_name._id, ` New Ticket Created Successfully`));
    }

  }, [dispatch, alert, error, history, success]);

  const createTicketSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    console.log(assignee)
    myForm.set('client_name', client_name._id);
    myForm.set('orderId', orderId._id);
    myForm.set('subject', subject);
    myForm.set('assignee', assignee._id);
    myForm.set('description', description);
    myForm.set('status', status);
    myForm.set('priority', priority);

    // myForm.set('serviceId', serviceId);
    
    dispatch(createTicket(myForm));
  };

  return (
    
    <div>
      <MetaData title="Create Ticket -- Test" />

      {/* <div className="NewTicketContainer"> */}
        <form
          className="createTicketForm"
          encType="multipart/form-data"
          onSubmit={createTicketSubmitHandler}
        >
          

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
            <InputLabel id="client-label" style={{marginTop:'20px'}}>Client</InputLabel>
            <Autocomplete
                    fullWidth
                    disablePortal
                    value={client_name}
                    onChange={(event, newValue) => {
                      // console.log(newValue)
                      setclient_name(newValue);
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
              {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                <InputLabel id="client-name-label">Select Client</InputLabel>
                <Select
                  labelId="client-name-label"
                  value={client_name}
                  onChange={(e) => setclient_name(e.target.value)}
                  required
                >
                  <MenuItem value="" disabled>
                    Select Client
                  </MenuItem>
                  {clientIdsList.map((client) => (
                    <MenuItem key={client._id} value={client._id}>
                      {client.fname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
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
                    id="clientId"
                    options={orderIdsList}
                    getOptionLabel={(option) => option.orderId.toString()}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                    
                    noOptionsText="Select Order"
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
              {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                <InputLabel id="order-id-label">Select Order Id</InputLabel>
                <Select
                  labelId="order-id-label"
                  value={orderId}
                  onChange={(e) => setorderId(e.target.value)}
                  required

                >
                  <MenuItem value="" disabled>
                    Select Order Id
                  </MenuItem>
                  {orderIdsList.map((order) => (
                    <MenuItem key={order._id} value={order._id}>
                      {order.orderId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
            </Grid>

            <Grid item xs={12} >
            <InputLabel id="team-label" >Assignee</InputLabel>
            <Autocomplete
                    fullWidth
                    disablePortal
                    value={assignee}
                    onChange={(event, newValue) => {
                      setassignee(newValue);
                    }}
                    id="teamId"
                    options={teamIdsList}
                    getOptionLabel={(option) => option.fname}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                    
                    noOptionsText="Select Team"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        label="Select Team"
                        variant="filled"
                      />
                    )}
                  />
            </Grid>

            <Grid item xs={12}>
            <InputLabel id="subject-label">Subject</InputLabel>

                  <TextField
                    type="text"
                    label="Subject"
                    placeholder="Subject"
                  required

                    value={subject}
                    onChange={(e) => setsubject(e.target.value)}
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
                    options={['Open', 'Hold', 'Close']}
                    getOptionLabel={(option) => option}
                  // isOptionEqualToValue={(option, value) => option._id === value._id}
                    
                    noOptionsText="Select Status"
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
              {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                <InputLabel id="status-label">Select Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  onChange={(e) => setstatus(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Select Status
                  </MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Hold">Hold</MenuItem>
                  <MenuItem value="Close">Close</MenuItem>
                </Select>
              </FormControl> */}
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id="priority-label">Priority</InputLabel>

              <Autocomplete 
                  fullWidth
                  disablePortal
                  value={priority}
                  onChange={(event, newValue) => {
                    setpriority(newValue);
                  }}
                  id="priority"
                  options={['Low', 'Lowest', 'Normal', 'High', 'Highest']}
                  getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                  
                  noOptionsText="Select Priority"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      label="Select Priority"
                      variant="filled"
                    />
                  )}
              />
              
              {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                <InputLabel id="priority-label">Select Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  value={priority}
                  onChange={(e) => setpriority(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Select Priority
                  </MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Highest">Highest</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Lowest">Lowest</MenuItem>
                </Select>
              </FormControl> */}
            </Grid>

            <Grid item xs={12} sm={12}>
                <InputLabel id="ticket-desc">Description</InputLabel>

                <Editor value={description} onTextChange={(e) => setdescription(e.htmlValue)} headerTemplate={header} style={{ height: '320px' }} />
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

          <div style={{ textAlign: 'center', marginTop: '90px' }}>
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
          {/* <h1>Create Ticket</h1>
            <div>
                    <select
                    value={client_name}
                    onChange={(e) => setclient_name(e.target.value)}
                    >
                    <option value="" disabled>
                        Select Client
                    </option>
                    {clientIdsList.map((client) => (
                        <option key={client._id} value={client._id}>
                        {client.fname}
                        </option>
                    ))}
                    </select>

            </div>

            <div>
                <select
                value={orderId}
                onChange={(e) => setorderId(e.target.value)}
                >
                <option value="" disabled>
                    Select Order Id
                </option>
                {orderIdsList.map((order) => (
                    <option key={order._id} value={order._id}>
                    {order.orderId}
                    </option>
                ))}
                </select>

            </div>
            <div>
              <textarea
                placeholder="Subject"
                value={subject}
                onChange={(e) => setsubject(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div>
              <select
                placeholder="Status"
                value={status}
                onChange={(e) => setstatus(e.target.value)}
              >
                    <option value="" disabled>Select Status</option>
    <option value="Open">Open</option>
    <option value="Hold">Hold</option>
    <option value="Close">Close</option>
              </select>
            </div>

            <div>
              <select
                placeholder="Priority"
                value={priority}
                onChange={(e) => setpriority(e.target.value)}
              >
<option value="" disabled>Select Priority</option>
    <option value="Normal">Normal</option>
    <option value="High">High</option>
    <option value="Highest">Highest</option>
    <option value="Low">Low</option>
    <option value="Lowest">Lowest</option>

              </select>
            </div>



          <button
            id="createTicketBtn"
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

export default NewTicket;