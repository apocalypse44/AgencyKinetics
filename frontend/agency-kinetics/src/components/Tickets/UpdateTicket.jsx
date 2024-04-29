import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { UPDATE_TICKET_RESET } from '../../constants/ticketConstants';
import { getTicketDetails,clearErrors, updateTicket, getTickets } from '../../actions/ticketAction';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { addNotification, createNotification } from '../../actions/notificationAction';
import { Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';


const UpdateTicket = ({handleUpdateClose, match, selectedTicketId}) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const {loading, error:updateError, isUpdated} = useSelector((state)=>state.ticketDU)
  const { error:ticketDetailError, ticket } = useSelector((state) => state.ticketDetails);
  const [status , setStatus]=useState("");
  const [priority, setPriority] = useState("");
  const history = useHistory()
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('');

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

  const ticketId = selectedTicketId;

  const [selectedClientFromTicket, setselectedClientFromTicket] = useState('')
  const getClientId = async (ticketId) => {
    try {
      const response = await fetch(`/test/v1/ticket/${ticketId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tickets: ${response.status}`);
      }
      const data = await response.json();
      console.log('Tickets data:', data);
      // setselectedOrderName(data.order.orderId)
      setselectedClientFromTicket(data.ticket.client_name)

    } catch (error) {
      console.error('Error fetching tickets:', error.message);
    }
  };
  getClientId(selectedTicketId)

  useEffect(() => {
    if(ticketDetailError){
     dispatch(clearErrors)
  }
      
  dispatch(getTicketDetails(ticketId));
}, [dispatch, ticketId, ticketDetailError , alert]);

  useEffect(() => {
    // console.log(ticket, ticket._id, ticketId)
    // if(ticket && ticket._id !==ticketId){
    //     dispatch(getTicketDetails(ticketId));
    // }else if (ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority)
  // }
    if (ticketDetailError) {
      // alert.error(error);
      history.push({
        pathname: "/tickets",
        state: {
          snackbar: {
            message: "Ticket Details Not Found",
            severity: "error"
          }
        }
      });
      dispatch(clearErrors());
    }
     if (updateError) {
      // alert.error(updateError);
      handleUpdateClose()
      // alert.success("Client Created Successfully");
      // history.push("/clients");
      history.push({
        pathname: "/tickets",
        state: {
          snackbar: {
            message: "Ticket Updation Failed",
            severity: "error"
          }
        }
      });
      dispatch({ type: UPDATE_TICKET_RESET });
      dispatch(getTickets());

      // dispatch(addNotification({ message: `Ticket Updation Failed as:  ${updateError}`}));
      dispatch(clearErrors());
    }

    if (isUpdated) {
      // alert.success("Ticket Updated1 Successfully");
      handleUpdateClose()
      // history.push("/tickets");
      history.push({
        pathname: "/tickets",
        state: {
          snackbar: {
            message: "Ticket Updated Successfully",
            severity: "success"
          }
        }
      });
      dispatch({ type: UPDATE_TICKET_RESET });
    dispatch(getTickets())
    
      // dispatch(addNotification({ message: `Ticket #${ticket._id.slice(-4)} Updated to ${status} and ${priority} Successfully` }));
      dispatch(createNotification(combined.user._id, `Ticket #${ticket._id.slice(-4)} Updated to ${status} and ${priority} Successfully`));
      dispatch(createNotification(selectedClientFromTicket, `Ticket #${ticket._id.slice(-4)} Updated to ${status} and ${priority} By ${role}: ${name}`));
      console.log(selectedClientFromTicket)
    }

  }, [dispatch, alert, ticketDetailError, history, isUpdated, updateError, ticket, ticketId]);

  const createServiceSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);
    myForm.set("priority", priority);


    dispatch(updateTicket( ticketId,myForm));
  };
  return (
    <div>
        <MetaData title ="Update Ticket  -- Test"/>

        {/* <div className="newProductContainer"> */}
          <form
            // className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createServiceSubmitHandler}
          >
            <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
            <InputLabel id="status-label" style={{marginTop:'20px'}}>Status</InputLabel>
            <Autocomplete
                    fullWidth
                    disablePortal
                    value={status}
                    onChange={(event, newValue) => {
                      setStatus(newValue);
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
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id="priority-label" style={{marginTop:'20px'}}>Priority</InputLabel>

              <Autocomplete 
                  fullWidth
                  disablePortal
                  value={priority}
                  onChange={(event, newValue) => {
                    setPriority(newValue);
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
            </Grid>
            </Grid>

            <div style={{ textAlign: 'center', marginTop: '160px' }}>
                <Button
                  id="createOrderBtn"
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: 'rgb(105, 56, 239)' }}
                >
                  Update
                </Button>
              </div>
          </form>
        </div>
    // </div>
  )
}

export default UpdateTicket