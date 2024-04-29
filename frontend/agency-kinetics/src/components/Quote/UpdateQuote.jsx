import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { getQuoteDetails, updateQuote, clearErrors, getQuote } from '../../actions/quoteAction';
import { UPDATE_QUOTE_RESET } from '../../constants/quoteConstants';
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { addNotification, createNotification } from '../../actions/notificationAction';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const UpdateQuote = ({ handleUpdateClose, match, selectedQuoteId }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const { loading, error: updateError, isUpdated } = useSelector((state) => state.quoteDU);
  const { error:quoteDetailError, quote } = useSelector((state) => state.quoteDetails);
  console.log("qt", quote);

  const [selected, setSelected] = useState('');

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

  console.log(selectedQuoteId);
  const quoteId = selectedQuoteId;

  useEffect(() => {
    if(quoteDetailError){
     dispatch(clearErrors)
  }
      
  dispatch(getQuoteDetails(quoteId));
}, [dispatch, quoteId, quoteDetailError , alert]);

  useEffect(() => {
    // if (quote && quote._id !== quoteId) {
    //   dispatch(getQuoteDetails(quoteId));
    // } else {
      setSelected(quote.selected);
      console.log("selectedelse", selected)
    // }
    if (quoteDetailError) {
      // alert.error(error);
      history.push({
        pathname: "/quotes",
        state: {
          snackbar: {
            message: "Proposal Details Not Found",
            severity: "error"
          }
        }
      });
      dispatch(clearErrors());
    }
    if (updateError) {
      handleUpdateClose()
      // alert.error(updateError);
      history.push({
        pathname: "/quotes",
        state: {
          snackbar: {
            message: "Proposal Updation Failed",
            severity: "error"
          }
        }
      });
      dispatch({ type: UPDATE_QUOTE_RESET });
      dispatch(getQuote());

      // dispatch(addNotification({ message: `Proposal Updation Failed as:  ${updateError}`}));
      dispatch(clearErrors());
    }

    if (isUpdated) {
      handleUpdateClose();
      // history.push("/quotes");
      history.push({
        pathname: "/quotes",
        state: {
          snackbar: {
            message: "Proposal Updated Successfully",
            severity: "success"
          }
        }
      });
      dispatch({ type: UPDATE_QUOTE_RESET });
    dispatch(getQuote());

      // dispatch(addNotification({ message: `Proposal ${quote.quoteId} Updated Successfully` }));
      dispatch(createNotification(combined.user._id, `Proposal ${quote.quoteId} Updated to ${selected} Successfully`));
    
    }

  }, [dispatch, alert, quoteDetailError, history, isUpdated, updateError, quote, quoteId]);

  const updateQuoteSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("selected", selected);

    dispatch(updateQuote(quoteId, myForm));
  };

  return (
    <div>
      <MetaData title="Update Quote  -- Test" />
      <form
            // className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateQuoteSubmitHandler}
          >
        <InputLabel id="selected-label" style={{marginTop:'20px'}}>Status</InputLabel>
        <Autocomplete 
                  fullWidth
                  disablePortal
                  value={selected}
                  onChange={(event, newValue) => {
                    setSelected(newValue);
                  }}
                  id="selected"
                  options={['Accepted', 'Pending', 'Rejected']}
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
        {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120, marginTop: '20px' }} required>
          <Select
            labelId="selected-label" // Make sure the labelId matches the id of the InputLabel
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            // required
            style={{ width: '100%' }} // Adjust width as needed
          >

            <MenuItem value="" disabled><em>Select Invoice Status</em></MenuItem>

            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
          </Select>
        </FormControl> */}
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <Button
            id="createInvoiceBtn"
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
  );
};

export default UpdateQuote;
