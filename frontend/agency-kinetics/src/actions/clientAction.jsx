import axios from "axios";
import {
  ALL_CLIENT_FAIL,
  ALL_CLIENT_REQUEST,
  ALL_CLIENT_SUCCESS,
  CLIENT_DETAILS_FAIL,
  CLIENT_DETAILS_REQUEST,
  CLIENT_DETAILS_SUCCESS,
  NEW_CLIENT_REQUEST,
  NEW_CLIENT_SUCCESS,
  NEW_CLIENT_FAIL,
  DELETE_CLIENT_REQUEST,
  DELETE_CLIENT_SUCCESS,
  DELETE_CLIENT_FAIL,
  ADMIN_CLIENT_REQUEST,
  ADMIN_CLIENT_SUCCESS,
  ADMIN_CLIENT_FAIL,
  UPDATE_CLIENT_REQUEST,
  UPDATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_FAIL,
  LOGIN_CLIENT_REQUEST,
  LOGIN_CLIENT_SUCCESS,
  LOGIN_CLIENT_FAIL,
  LOGOUT_CLIENT_SUCCESS,
  LOGOUT_CLIENT_FAIL,
  LOAD_CLIENT_REQUEST,
  LOAD_CLIENT_SUCCESS,
  LOAD_CLIENT_FAIL,
  CLEAR_ERRORS,
} from "../constants/clientsConstants";

export const getClient = ()=> async(dispatch)=>{
    try {
        dispatch({type:ALL_CLIENT_REQUEST});
        const {data} = await axios.get("/test/v1/combined/getAllClient");
        console.log("data com", data)
        dispatch({
            type:ALL_CLIENT_SUCCESS,
            payload:data,
        })
    } catch (error) {
        dispatch({
            type:ALL_CLIENT_FAIL,
            payload:error.response.data.message,
        })
    }
};

//get one
export const getClientDetails = (id)=> async(dispatch)=>{
    try {
        dispatch({type:CLIENT_DETAILS_REQUEST});
        const {data} = await axios.get(`/test/v1/get/client/${id}`);
        dispatch({
            type:CLIENT_DETAILS_SUCCESS,
            payload:data.combined
        })
    } catch (error) {
        dispatch({
            type:CLIENT_DETAILS_FAIL,
            payload:error.response.data.message,
        })
    }
};

//create
  export const createClient = (clientData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_CLIENT_REQUEST });
  
      const config = {
        headers: { "Content-Type": "application/json" },
      };
  
      const { data } = await axios.post("/test/v1/combined/newClient", clientData, config);

      dispatch({
        type: NEW_CLIENT_SUCCESS,
        payload: data,
      });
      console.log("dataclient", data)
    } catch (error) {
      dispatch({
        type: NEW_CLIENT_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //get admin Client
    export const getAdminClient = () => async (dispatch) => {
    try {
      dispatch({ type: ADMIN_CLIENT_REQUEST });
  
      const { data } = await axios.get("/test/v1/admin/client");
  
      dispatch({
        type: ADMIN_CLIENT_SUCCESS,
        payload: data.client,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_CLIENT_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //update
  export const updateClient = (id , clientData) => async (dispatch)=>{
  try{ 
    dispatch({type:UPDATE_CLIENT_REQUEST});
    const config = {
      headers: { "Content-Type": "multipart/form-data"},
    };
    console.log("sa",clientData)

    const {data} =await axios.put(`/test/v1/client/update/${id}`,
      clientData,
      config
    );
    dispatch({
      type: UPDATE_CLIENT_SUCCESS,
      payload: data.success,
    });
    console.log(clientData)
  } catch (error){
dispatch({
  type: UPDATE_CLIENT_FAIL,
  payload: error.response.data.message,
});
  }
  };

  //delete
  export const deleteClient = (id) => async (dispatch) => {
    try {
      dispatch({ type:DELETE_CLIENT_REQUEST  });
  
      const { data } = await axios.delete(`/test/v1/member/delete/${id}`);
  
      dispatch({
        type: DELETE_CLIENT_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: DELETE_CLIENT_FAIL,
        payload: error.response.data.message,
      });
    }
  };
export const clearErrors = () => async(dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
};

//login
export const loginClient = (client_email, client_password, createdUnder) => async (dispatch) => {
    try {
      dispatch({ type: LOGIN_CLIENT_REQUEST });
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post( "/test/v1/login/client", { client_email, client_password, createdUnder },config);
  console.log("sas",data)
      dispatch({ type: LOGIN_CLIENT_SUCCESS, 
        payload: data });
    } catch (error) {
      dispatch({ type: LOGIN_CLIENT_FAIL, 
        payload: error.response.data.message });
    };
  };

    export const logout = () => async (dispatch) => {
    try {  
await axios.get(`/test/v1/client/logout`);
  
      dispatch({ type: LOGOUT_CLIENT_SUCCESS});
    } catch (error) {
      dispatch({ type: LOGOUT_CLIENT_FAIL, payload: error.response.data.message });
    };
  };