import axios from "axios";
import {
  ALL_QUOTE_FAIL,
  ALL_QUOTE_REQUEST,
  ALL_QUOTE_SUCCESS,
  QUOTE_DETAILS_FAIL,
  QUOTE_DETAILS_REQUEST,
  QUOTE_DETAILS_SUCCESS,
  NEW_QUOTE_REQUEST,
  NEW_QUOTE_SUCCESS,
  NEW_QUOTE_FAIL,
  DELETE_QUOTE_REQUEST,
  DELETE_QUOTE_SUCCESS,
  DELETE_QUOTE_FAIL,
  ADMIN_QUOTE_REQUEST,
  ADMIN_QUOTE_SUCCESS,
  ADMIN_QUOTE_FAIL,
  UPDATE_QUOTE_REQUEST,
  UPDATE_QUOTE_SUCCESS,
  UPDATE_QUOTE_FAIL,
  CLEAR_ERRORS,
} from "../constants/quoteConstants";

export const getQuote = ()=> async(dispatch)=>{
    try {
        dispatch({type:ALL_QUOTE_REQUEST});
        const {data} = await axios.get("/test/v1/quotes");
        dispatch({
            type:ALL_QUOTE_SUCCESS,
            payload:data,
        })
    } catch (error) {
        dispatch({
            type:ALL_QUOTE_FAIL,
            payload:error.response.data.message,
        })
    }
};

export const getQuoteDetails = (id)=> async(dispatch)=>{
  try {
      dispatch({type:QUOTE_DETAILS_REQUEST});
      const {data} = await axios.get(`/test/v1/quote/${id}`);
      dispatch({
          type:QUOTE_DETAILS_SUCCESS,
          payload:data.quote
      })
  } catch (error) {
      dispatch({
          type:QUOTE_DETAILS_FAIL,
          payload:error.response.data.message,
      })
  }
};

//create
  export const createQuote = (quoteData) => async (dispatch) => {
    try {
  console.log(...quoteData)

      dispatch({ type: NEW_QUOTE_REQUEST });
  
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
  
      const { data } = await axios.post("/test/v1/new/quote", quoteData, config);
  console.log(data)
      dispatch({
        type: NEW_QUOTE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NEW_QUOTE_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //get admin service
    export const getAdminservice = () => async (dispatch) => {
    try {
      dispatch({ type: ADMIN_QUOTE_REQUEST });
  
      const { data } = await axios.get("/test/v1/admin/quote");
  
      dispatch({
        type: ADMIN_QUOTE_SUCCESS,
        payload: data.quotes,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_QUOTE_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //update
  export const updateQuote = (id , quoteData) => async (dispatch)=>{
    try{ 
      dispatch({type:UPDATE_QUOTE_REQUEST});
      const config = {
        headers: { "Content-Type": "application/json"},
      };
      console.log("sa",quoteData)
  
      const {data} = await axios.put(`/test/v1/quote/update/${id}`,
        quoteData,
        config
      );
      dispatch({
        type: UPDATE_QUOTE_SUCCESS,
        payload: data.success,
      });
      console.log(quoteData)
    } catch (error){
  dispatch({
    type: UPDATE_QUOTE_FAIL,
    payload: error.response.data.message,
  });
    }
    };

  //delete
  export const deleteQuote = (id) => async (dispatch) => {
    try {
      dispatch({ type:DELETE_QUOTE_REQUEST  });
  
      const { data } = await axios.delete(`/test/v1/quote/delete//${id}`);
  
      dispatch({
        type: DELETE_QUOTE_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: DELETE_QUOTE_FAIL,
        payload: error.response.data.message,
      });
    }
  };
export const clearErrors = () => async(dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
};