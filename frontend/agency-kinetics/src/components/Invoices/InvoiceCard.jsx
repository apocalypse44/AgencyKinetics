import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Link} from "react-router-dom";
import { useAlert } from 'react-alert';
import { clearErrors, deleteInvoice } from '../../actions/invoiceAction';
import { DELETE_INVOICE_RESET } from '../../constants/invoicesConstants';



const InvoiceCard = ({invoice, history}) => {

const alert = useAlert();
const dispatch = useDispatch();

const {error} = useSelector(state=>state.invoices)
const {error : deleteError , isDeleted} = useSelector(state=>state.invoiceDU)

const deleteInvoiceHandler =(id)=>{
  dispatch(deleteInvoice(id));
}
  useEffect(() => {
if(error){
  alert.error(error);
  dispatch(clearErrors())
}
if (deleteError){
  alert.error(deleteError);
  dispatch(clearErrors());
}
if(isDeleted){
  alert.success("Invoice deleted Succeccfully")
 history.push("/invoices");
  dispatch({type:DELETE_INVOICE_RESET})
}
  }, [dispatch, alert, error, isDeleted, history , deleteError])
  return (
    <div>
    <Link className='invoiceCard' to ={`/invoice/${invoice._id}`}>
      {invoice.client_name}</Link>
      <p> {invoice.orderId}</p>
      <p> {invoice.status}</p>

        <p>{invoice.order_details.amount}</p>
                <button>
 <Link to={`/invoice/update/${invoice._id}`}>
          Update
            </Link>
        </button>
                    <button
              onClick={() =>
                   deleteInvoiceHandler(invoice._id)
              }
            >
              Delete 
            </button>
  <hr></hr>
    
    </div>
  )
}

export default InvoiceCard