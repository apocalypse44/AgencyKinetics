import axios from "axios";
import {
  ALL_TASK_FAIL,
  ALL_TASK_REQUEST,
  ALL_TASK_SUCCESS,
  TASK_DETAILS_FAIL,
  TASK_DETAILS_REQUEST,
  TASK_DETAILS_SUCCESS,
  NEW_TASK_REQUEST,
  NEW_TASK_SUCCESS,
  NEW_TASK_FAIL,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAIL,
  ADMIN_TASK_REQUEST,
  ADMIN_TASK_SUCCESS,
  ADMIN_TASK_FAIL,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  CLEAR_ERRORS,
} from "../constants/taskConstants";


//get Order
export const getTasks = (orderId)=> async(dispatch)=>{
    try {
        dispatch({type:ALL_TASK_REQUEST});
        const {data} = await axios.get(`/test/v1/task/order/${orderId}`);
        console.log(data)
        dispatch({
            type:ALL_TASK_SUCCESS,
            payload:data,
        })
    } catch (error) {
        dispatch({
            type:ALL_TASK_FAIL,
            payload:error.response.data.message,
        })
    }
};



//get one Order
export const getTaskDetails = (id)=> async(dispatch)=>{
    try {
        dispatch({type:TASK_DETAILS_REQUEST});
        const {data} = await axios.get(`/test/v1/task/${id}`);
        dispatch({
            type:  TASK_DETAILS_SUCCESS,
            payload:data.task
        })
        console.log("ord", data)
    } catch (error) {
        dispatch({
            type:TASK_DETAILS_FAIL,
            payload:error.response.data.message,
        })
    }
};

//create
  export const createTask = (taskData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_TASK_REQUEST });
  
      const config = {
        headers: { "Content-Type": "application/json" },
      };
  
      const { data } = await axios.post("/test/v1/task/new", taskData, config);
  console.log(data)
  console.log(taskData)
      dispatch({
        type: NEW_TASK_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NEW_TASK_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //get admin service
    export const getAdminTask = () => async (dispatch) => {
    try {
      dispatch({ type: ADMIN_TASK_REQUEST });
  
      const { data } = await axios.get("/test/v1/admin/tasks");
  
      dispatch({
        type: ADMIN_TASK_SUCCESS,
        payload: data.tasks,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_TASK_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  //update
  export const updateTask = (id , taskData) => async (dispatch)=>{
  try{ 
    dispatch({type:UPDATE_TASK_REQUEST});
    const config = {
      headers: { "Content-Type": "application/json"},
    };
    console.log("or",taskData)

    const {data} =await axios.put(`/test/v1/task/update/${id}`,
    taskData,
      config
    );
    dispatch({
      type: UPDATE_TASK_SUCCESS,
      payload: data.success,
    });
  } catch (error){
dispatch({
  type: UPDATE_TASK_FAIL,
  payload: error.response.data.message,
});
  }
  };

  //delete
  export const deleteTask= (id) => async (dispatch) => {
    try {
      dispatch({ type:DELETE_TASK_REQUEST  });
  
      const { data } = await axios.delete(`/test/v1/task/delete/${id}`);
  
      dispatch({
        type: DELETE_TASK_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: DELETE_TASK_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const clearErrors = () => async(dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
};