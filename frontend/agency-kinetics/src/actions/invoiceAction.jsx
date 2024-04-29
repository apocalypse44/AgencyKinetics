import axios from "axios";
import {
  ALL_INVOICE_FAIL,
  ALL_INVOICE_REQUEST,
  ALL_INVOICE_SUCCESS,
  INVOICE_DETAILS_FAIL,
  INVOICE_DETAILS_SUCCESS,
  INVOICE_DETAILS_REQUEST,
  NEW_INVOICE_REQUEST,
  NEW_INVOICE_SUCCESS,
  NEW_INVOICE_FAIL,
  DELETE_INVOICE_REQUEST,
  DELETE_INVOICE_SUCCESS,
  DELETE_INVOICE_FAIL,
  ADMIN_INVOICE_REQUEST,
  ADMIN_INVOICE_SUCCESS,
  ADMIN_INVOICE_FAIL,
  UPDATE_INVOICE_REQUEST,
  UPDATE_INVOICE_SUCCESS,
  UPDATE_INVOICE_FAIL,
  CLEAR_ERRORS,
} from "../constants/invoicesConstants";


//get all invoice
export const getInvoice = ()=> async(dispatch)=>{
    try {
        dispatch({type:ALL_INVOICE_REQUEST});
        const {data} = await axios.get("/test/v1/invoices");
        console.log(data)
        dispatch({
            type:ALL_INVOICE_SUCCESS,
            payload:data,
        })
    } catch (error) {
        dispatch({
            type:ALL_INVOICE_FAIL,
            payload:error.response.data.message,
        })
    }
};
//get one
export const getInvoiceDetails = (id)=> async(dispatch)=>{
    try {
        dispatch({type:INVOICE_DETAILS_REQUEST});
        const {data} = await axios.get(`/test/v1/invoice/${id}`);
        dispatch({
            type:INVOICE_DETAILS_SUCCESS,
            payload:data.invoice
        })
    } catch (error) {
        dispatch({
            type:INVOICE_DETAILS_FAIL,
            payload:error.response.data.message,
        })
    }
};


//create
  export const createInvoice = (invoiceData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_INVOICE_REQUEST });
  
      const config = {
        headers: { "Content-Type": "application/json" },
      };
  console.log([...invoiceData])

  
      const { data } = await axios.post("/test/v1/new/invoice", invoiceData, config);
  console.log("ID",data)
      dispatch({
        type: NEW_INVOICE_SUCCESS,
        payload: data.success,
      });
      console.log(invoiceData)
    } catch (error) {
      dispatch({
        type: NEW_INVOICE_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //get admin Invoice
    export const getAdminInvoice = () => async (dispatch) => {
    try {
      dispatch({ type: ADMIN_INVOICE_REQUEST });
  
      const { data } = await axios.get("/test/v1/admin/invoices");
  
      dispatch({
        type: ADMIN_INVOICE_SUCCESS,
        payload: data.invoice,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_INVOICE_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //update
  export const updateInvoice = (id , invoiceData) => async (dispatch)=>{
  try{ 
    dispatch({type:UPDATE_INVOICE_REQUEST});
    const config = {
      headers: { "Content-Type": "application/json"},
    };
    console.log("iv",invoiceData)

    const {data} =await axios.put(`/test/v1/invoice/update/${id}`,
      invoiceData,
      config
    );
    dispatch({
      type: UPDATE_INVOICE_SUCCESS,
      payload: data,
    });
    console.log(invoiceData)
  } catch (error){
dispatch({
  type: UPDATE_INVOICE_FAIL,
  payload: error.response.data.message,
});
  }
  };

  //delete
  export const deleteInvoice = (id) => async (dispatch) => {
    try {
      dispatch({ type:DELETE_INVOICE_REQUEST  });
  
      const { data } = await axios.delete(`/test/v1/invoice/delete/${id}`);
      dispatch({
        type: DELETE_INVOICE_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: DELETE_INVOICE_FAIL,
        payload: error.response.data.message,
      });
    }
  };
export const clearErrors = () => async(dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
};