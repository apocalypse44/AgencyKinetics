import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  LOGIN_MEMBER_REQUEST,
  LOGIN_MEMBER_SUCCESS,
  LOGIN_MEMBER_FAIL,
  LOGOUT_MEMBER_SUCCESS,
  LOGOUT_MEMBER_FAIL,
  ALL_COMBINED_FAIL,
  ALL_COMBINED_REQUEST,
  ALL_COMBINED_SUCCESS,
  ADMIN_COMBINED_REQUEST,
  ADMIN_COMBINED_SUCCESS,
  ADMIN_COMBINED_FAIL,
  LOAD_MEMBER_REQUEST,
  LOAD_MEMBER_SUCCESS,
  LOAD_MEMBER_FAIL,
  CLEAR_ERRORS,
  SET_SIDEBAR_VISIBILITY,
  SET_USER_ROLE,
  SET_AUTHENTICATION,
} from "../constants/loginConstants";
 import axios from "axios";

 
export const loginMember = (email, password, workspace_name) => async (dispatch) => {
  try {
      dispatch({ type: LOGIN_MEMBER_REQUEST });
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post( "/test/v1/combined/login", { email, password, workspace_name },config);
  console.log("sas",data)
      
        dispatch({ type: SET_USER_ROLE, payload: data.user.role });
        dispatch({ type: SET_SIDEBAR_VISIBILITY, payload: true })
        dispatch({ type: SET_AUTHENTICATION, payload: true })
        dispatch({ type: LOGIN_MEMBER_SUCCESS, 
          payload: {...data, workspace_name }});
          
    } catch (error) {
      console.log(error)
      dispatch({ type: LOGIN_MEMBER_FAIL, 
        payload: error.message });
        dispatch({ type: SET_SIDEBAR_VISIBILITY, payload: false })
        dispatch({ type: SET_AUTHENTICATION, payload: false })


    }; 
  };

    export const logoutMember = () => async (dispatch) => {
    try {  
      const logs = await axios.get(`/test/v1/combined/logout`);
      console.log('LOGGED OUT', logs)
      dispatch({ type: LOGOUT_MEMBER_SUCCESS, payload: false});
      dispatch({ type: SET_SIDEBAR_VISIBILITY, payload: false })
      dispatch({ type: SET_AUTHENTICATION, payload: false })

    } catch (error) {
      dispatch({ type: LOGOUT_MEMBER_FAIL, payload: error });
      dispatch({ type: SET_SIDEBAR_VISIBILITY, payload: false })
      dispatch({ type: SET_AUTHENTICATION, payload: false })
    };
  };

  export const setSidebarVisibility = (isVisible) => (dispatch) => {
    dispatch({
      type: SET_SIDEBAR_VISIBILITY,
      payload: isVisible,
    });
  };
  export const setAuthentication = (isAuthenticated) => (dispatch) => {
    dispatch({
      type: SET_AUTHENTICATION,
      payload: isAuthenticated,
    });
  };

  export const clearErrors = () => async(dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
};

//get all
export const getCombined = ()=> async(dispatch)=>{
    try {
        dispatch({type:ALL_COMBINED_REQUEST});
        const {data} = await axios.get("/test/v1/getAll");
        dispatch({
            type:ALL_COMBINED_SUCCESS,
            payload:data,
        })
    } catch (error) {
        dispatch({
            type:ALL_COMBINED_FAIL,
            payload:error.response.data.message,
        })
    }
};