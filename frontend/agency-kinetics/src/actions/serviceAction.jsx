import axios from "axios";
import {
ALL_SERVICE_FAIL,
ALL_SERVICE_REQUEST,
ALL_SERVICE_SUCCESS,
SERVICE_DETAILS_FAIL,
SERVICE_DETAILS_REQUEST,
SERVICE_DETAILS_SUCCESS,
NEW_SERVICE_REQUEST,
NEW_SERVICE_SUCCESS,
NEW_SERVICE_FAIL,
ADMIN_SERVICE_REQUEST,
ADMIN_SERVICE_SUCCESS,
ADMIN_SERVICE_FAIL,
  DELETE_SERVICE_REQUEST,
  DELETE_SERVICE_SUCCESS,
  DELETE_SERVICE_FAIL,
  UPDATE_SERVICE_REQUEST,
  UPDATE_SERVICE_SUCCESS,
  UPDATE_SERVICE_FAIL,
CLEAR_ERRORS,
} from "../constants/serviceConstant";

// //get all
export const getService = ()=> async(dispatch)=>{
    try {
        dispatch({type:ALL_SERVICE_REQUEST});
        const {data} = await axios.get("/test/v1/services");
        dispatch({
            type:ALL_SERVICE_SUCCESS,
            payload:data,
        })
    } catch (error) {
        dispatch({
            type:ALL_SERVICE_FAIL,
            payload:error.response.data.message,
        })
    }
};

// //get one
export const getServiceDetails = (id)=> async(dispatch)=>{
    try {
        dispatch({type:SERVICE_DETAILS_REQUEST});
        const {data} = await axios.get(`/test/v1/get/service/${id}`);

        dispatch({
            type:SERVICE_DETAILS_SUCCESS,
            payload:data.service
        });
        console.log('gsd', data)

    } catch (error) {
        dispatch({
            type:SERVICE_DETAILS_FAIL,
            payload:error.response.data.message,
        });
    }

};

//create
  export const createService = (serviceData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_SERVICE_REQUEST });
      console.log('sc',serviceData)
      const config = {
        headers: { "Content-Type": "multipart/form-data"},
      };
      const { data } = await axios.post("/test/v1/new/service", serviceData, config);
  console.log("data", data)
      dispatch({
        type: NEW_SERVICE_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: NEW_SERVICE_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //get admin service
    export const getAdminservice = () => async (dispatch) => {
    try {
      dispatch({ type: ADMIN_SERVICE_REQUEST });
  
      const { data } = await axios.get("/test/v1/admin/services");
  
      dispatch({
        type: ADMIN_SERVICE_SUCCESS,
        payload: data.products,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_SERVICE_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //update
  export const updateService = (id , serviceData) => async (dispatch)=>{
  try{ 
    dispatch({type:UPDATE_SERVICE_REQUEST});
    const config = {
      headers: { "Content-Type": "multipart/form-data"},
    };
    // console.log("sa",serviceData)

    const {data} =await axios.put(`/test/v1/service/update/${id}`,
      serviceData,
      config
    );
    dispatch({
      type: UPDATE_SERVICE_SUCCESS,
      payload: data.success,
    });
    // console.log("updated sa", serviceData)
  } catch (error){
dispatch({
  type: UPDATE_SERVICE_FAIL,
  payload: error.response.data.message,
});
  }
  };

  //delete
  export const deleteService = (id) => async (dispatch) => {
    try {
      dispatch({ type:DELETE_SERVICE_REQUEST  });
  
      const { data } = await axios.delete(  `/test/v1/service/delete/${id} ` );
  
      dispatch({
        type: DELETE_SERVICE_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: DELETE_SERVICE_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const clearErrors = () => async(dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
};