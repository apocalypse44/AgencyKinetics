import axios from "axios";
import {
  ALL_ORDER_FAIL,
  ALL_ORDER_REQUEST,
  ALL_ORDER_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  NEW_ORDER_REQUEST,
  NEW_ORDER_SUCCESS,
  NEW_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  ADMIN_ORDER_REQUEST,
  ADMIN_ORDER_SUCCESS,
  ADMIN_ORDER_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  CLEAR_ERRORS,
} from "../constants/orderConstants";


//get Order
export const getOrders = ()=> async(dispatch)=>{
    try {
        dispatch({type:ALL_ORDER_REQUEST});
        const {data} = await axios.get("/test/v1/orders");
        console.log(data)
        dispatch({
            type:ALL_ORDER_SUCCESS,
            payload:data,
        })
    } catch (error) {
        dispatch({
            type:ALL_ORDER_FAIL,
            payload:error.response.data.message,
        })
    }
};

//get one Order
export const getOrderDetails = (id)=> async(dispatch)=>{
    try {
        dispatch({type:ORDER_DETAILS_REQUEST});
        const {data} = await axios.get(`/test/v1/order/${id}`);
        dispatch({
            type:  ORDER_DETAILS_SUCCESS,
            payload:data.order
        })
        console.log("ord", data)
    } catch (error) {
        dispatch({
            type:ORDER_DETAILS_FAIL,
            payload:error.response.data.message,
        })
    }
};

//create
  export const createOrder = (orderData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_ORDER_REQUEST });
  
      const config = {
        headers: { "Content-Type": "application/json" },
      };
  
      const { data } = await axios.post("/test/v1/new/order", orderData, config);
  console.log(data)
  console.log(orderData)
      dispatch({
        type: NEW_ORDER_SUCCESS,
        payload: data,
      });
      console.log(orderData)
    } catch (error) {
      dispatch({
        type: NEW_ORDER_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //get admin service
    export const getAdminOrder = () => async (dispatch) => {
    try {
      dispatch({ type: ADMIN_ORDER_REQUEST });
  
      const { data } = await axios.get("/test/v1/admin/orders");
  
      dispatch({
        type: ADMIN_ORDER_SUCCESS,
        payload: data.orders,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_ORDER_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //update
  export const updateOrder = (id , orderData) => async (dispatch)=>{
  try{ 
    dispatch({type:UPDATE_ORDER_REQUEST});
    const config = {
      headers: { "Content-Type": "application/json"},
    };
    console.log("or",orderData)

    const {data} =await axios.put(`/test/v1/order/update/${id}`,
      orderData,
      config
    );
    dispatch({
      type: UPDATE_ORDER_SUCCESS,
      payload: data.success,
    });
  } catch (error){
dispatch({
  type: UPDATE_ORDER_FAIL,
  payload: error.response.data.message,
});
  }
  };

  //delete
  export const deleteOrder= (id) => async (dispatch) => {
    try {
      dispatch({ type:DELETE_ORDER_REQUEST  });
  
      const { data } = await axios.delete(`/test/v1/order/delete/${id}`);
  
      dispatch({
        type: DELETE_ORDER_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: DELETE_ORDER_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const clearErrors = () => async(dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
};