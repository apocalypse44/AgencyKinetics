import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { UPDATE_INVOICE_RESET } from '../../constants/invoicesConstants';
import { updateInvoice , clearErrors, getInvoiceDetails, getInvoice, } from '../../actions/invoiceAction';
import { addNotification, createNotification } from '../../actions/notificationAction';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';


const UpdateInvoice = ({handleUpdateClose, match, selectedInvoiceId}) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const {loading, error:updateError, isUpdated} = useSelector((state)=>state.invoiceDU)
  // const { error, invoice } = useSelector((state) => state.invoiceDetails);
  const { invoice, error:invoiceDetailError } = useSelector(state => state.invoiceDetails);

  console.log("or",invoice)
  const [status , setStatus]=useState({});


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

  const invoiceId = selectedInvoiceId;
  const [selectedClientFromInvoice, setselectedClientFromInvoice] = useState('')
  const getClientId = async (invoiceId) => {
    try {
      const response = await fetch(`/test/v1/invoice/${invoiceId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.status}`);
      }
      const data = await response.json();
      console.log('Invoices data:', data);
      // setselectedOrderName(data.order.orderId)
      setselectedClientFromInvoice(data.invoice.client_name)

    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };
  getClientId(invoiceId)


  useEffect(() => {
    if(invoiceDetailError){
     dispatch(clearErrors)
  }
  dispatch(getInvoiceDetails(invoiceId));
}, [dispatch, invoiceId, invoiceDetailError , alert]);

  useEffect(() => {
    // console.log(invoice, invoice._id !==invoiceId)
    // if(invoice && invoice._id !==invoiceId){
    //     dispatch(getInvoiceDetails(invoiceId));
    // }else{
        setStatus(invoice.status);
    // }

    if (invoiceDetailError) {
      // alert.error(error);
      history.push({
        pathname: "/invoices",
        state: {
          snackbar: {
            message: "Invoice Details Not Found",
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
        pathname: "/invoices",
        state: {
          snackbar: {
            message: "Invoice Updation Failed",
            severity: "error"
          }
        }
      });
      dispatch({ type: UPDATE_INVOICE_RESET });
      dispatch(getInvoice());

      dispatch(addNotification({ message: `Invoice Updation Failed as:  ${updateError}`}));
      dispatch(clearErrors());
    }

    if (isUpdated) {
      // alert.success("Invoice Updated Successfully");
      handleUpdateClose()
      // history.push("/invoices");
      history.push({
        pathname: "/invoices",
        state: {
          snackbar: {
            message: "Invoice Updated Successfully",
            severity: "success"
          }
        }
      });
      dispatch({ type: UPDATE_INVOICE_RESET });
    dispatch(getInvoice());

      // dispatch(addNotification({ message: `Invoice ${invoice.invoiceId} Updated to ${status} Successfully` }));
      dispatch(createNotification(combined.user._id, `Invoice ${invoice.invoiceId} Updated to ${status} Successfully`));
      dispatch(createNotification(selectedClientFromInvoice, `Invoice ${invoice.invoiceId} Updated to ${status}  By ${role}: ${name}`));

    }

  }, [dispatch, alert, invoiceDetailError, history, isUpdated, updateError, invoice, invoiceId]);

  const updateInvoiceSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);


    dispatch(updateInvoice( invoiceId,myForm));
  };
  return (
    <div>
        <MetaData title ="Update Invoice  -- Test"/>

        {/* <div className="newProductContainer"> */}
          <form
            // className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateInvoiceSubmitHandler}
          >
            <InputLabel id="status-label" style={{marginTop:'20px'}}>Status</InputLabel>
            <Autocomplete 
                  fullWidth
                  disablePortal
                  value={status}
                  onChange={(event, newValue) => {
                    setStatus(newValue);
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
            {/* <FormControl fullWidth variant="filled" sx={{ minWidth: 120, marginTop:'20px' }}>
              <InputLabel id="status-label">Select Invoice Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                style={{ width: '100%' }} // Adjust width as needed
              >
                <MenuItem value="" disabled>
                  <em>Select Invoice Status</em>
                </MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Void">Void</MenuItem>
                <MenuItem value="Uncollectable">Uncollectable</MenuItem>

              </Select>
            </FormControl> */}
              <div style={{ textAlign: 'center', marginTop: '150px' }}>
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



export default UpdateInvoice