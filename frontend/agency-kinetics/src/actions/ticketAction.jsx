import {
ALL_TICKET_FAIL,
ALL_TICKET_REQUEST,
ALL_TICKET_SUCCESS,
ADMIN_TICKET_REQUEST,
ADMIN_TICKET_SUCCESS,
ADMIN_TICKET_FAIL,
TICKET_DETAILS_FAIL,
TICKET_DETAILS_REQUEST,
TICKET_DETAILS_SUCCESS,
NEW_TICKET_REQUEST,
NEW_TICKET_SUCCESS,
NEW_TICKET_FAIL,
DELETE_TICKET_FAIL,
DELETE_TICKET_REQUEST,
DELETE_TICKET_SUCCESS,
UPDATE_TICKET_FAIL,
UPDATE_TICKET_REQUEST,
UPDATE_TICKET_SUCCESS,
CLEAR_ERRORS,
} from "../constants/ticketConstants";
import axios from "axios";


//get ticket
export const getTickets = ()=> async(dispatch)=>{
    try {
        dispatch({type:ALL_TICKET_REQUEST});
        const {data} = await axios.get("/test/v1/tickets");
        dispatch({
            type:ALL_TICKET_SUCCESS,
            payload:data,
        })
    } catch (error) {
        dispatch({
            type:ALL_TICKET_FAIL,
            payload:error.response.data.message,
        })
    }
};

export const getTicketDetails = (id)=> async(dispatch)=>{
    try {
        dispatch({type:TICKET_DETAILS_REQUEST});
        const {data} = await axios.get(`/test/v1/ticket/${id}`);
        console.log(data)
        dispatch({
            type:TICKET_DETAILS_SUCCESS,
            payload:data.ticket
        })
    } catch (error) {
        dispatch({
            type:TICKET_DETAILS_FAIL,
            payload:error.response.data.message,
        })
    }
};

export const clearErrors = () => async(dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
};
  //get admin ticket
    export const getAdminTicket = () => async (dispatch) => {
    try {
      dispatch({ type: ADMIN_TICKET_REQUEST });
  
      const { data } = await axios.get("/test/v1/admin/ticket");
  
      dispatch({
        type: ADMIN_TICKET_SUCCESS,
        payload: data.ticket,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_TICKET_FAIL,
        payload: error.response.data.message,
      });
    }
  };
//create
  export const createTicket = (ticketData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_TICKET_REQUEST });
  
      const config = {
        headers: { "Content-Type": "application/json" },
      };
  
      const { data } = await axios.post("/test/v1/new/ticket", ticketData, config);
      console.log(data)
      console.log(ticketData)
      dispatch({
        type: NEW_TICKET_SUCCESS,
        payload: data.success,
      });
      console.log(ticketData)
    } catch (error) {
      dispatch({
        type: NEW_TICKET_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //update
  export const updateTicket = (id , ticketData) => async (dispatch)=>{
  try{ 
    dispatch({type:UPDATE_TICKET_REQUEST});
    const config = {
      headers: { "Content-Type": "application/json"},
    };
    const {data} =await axios.put(`/test/v1/ticket/update/${id}`,
      ticketData,
      config
    );
    dispatch({
      type: UPDATE_TICKET_SUCCESS,
      payload: data.success,
    });
    console.log("Tic", ...ticketData)
  } catch (error){
dispatch({
  type: UPDATE_TICKET_FAIL,
  payload: error.response.data.message,
});
  }
  };

  //delete
  export const deleteTicket = (id) => async (dispatch) => {
    try {
      dispatch({ type:DELETE_TICKET_REQUEST  });
  
      const { data } = await axios.delete(`/test/v1/ticket/delete/${id}`);
  
      dispatch({
        type: DELETE_TICKET_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: DELETE_TICKET_FAIL,
        payload: error.response.data.message,
      });
    }
  };