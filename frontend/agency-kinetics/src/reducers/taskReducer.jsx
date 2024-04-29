import {
    ALL_TASK_FAIL,
    ALL_TASK_REQUEST,
    ALL_TASK_SUCCESS,
    TASK_DETAILS_FAIL,
    TASK_DETAILS_REQUEST,
    TASK_DETAILS_SUCCESS,
    NEW_TASK_REQUEST,
    NEW_TASK_RESET,
    NEW_TASK_SUCCESS,
    NEW_TASK_FAIL,
    DELETE_TASK_REQUEST,
    DELETE_TASK_RESET,
    DELETE_TASK_SUCCESS,
    DELETE_TASK_FAIL,
    ADMIN_TASK_REQUEST,
    ADMIN_TASK_SUCCESS,
    ADMIN_TASK_FAIL,
    UPDATE_TASK_REQUEST,
    UPDATE_TASK_SUCCESS,
    UPDATE_TASK_FAIL,
    UPDATE_TASK_RESET,
    CLEAR_ERRORS,
  
   
  } from "../constants/taskConstants";
  
  //get all
  export const taskReducer = (state = { tasks: [] }, action) => {
    switch (action.type) {
      case ALL_TASK_REQUEST:
      case ADMIN_TASK_REQUEST:
  
        return {
          loading: true,
          tasks: [],
        };
      case ALL_TASK_SUCCESS:
        return {
          loading: false,
         tasks: action.payload.tasks,
        };
      case ADMIN_TASK_SUCCESS:
        return {
          loading: false,
          tasks: action.payload,
        };
  
      case ALL_TASK_FAIL:
      case ADMIN_TASK_FAIL:
  
        return {
          loading: false,
          error: action.payload,
        };
  
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  
  //get one
  export const tasksDetailsReducer = (state = { task: {} }, action) => {
    switch (action.type) {
      case TASK_DETAILS_REQUEST:
        return {
          loading: true,
        ...state,
            };
      case TASK_DETAILS_SUCCESS:
        return {
          loading: false,
         task: action.payload,
        };
  
  
      case TASK_DETAILS_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
  
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  
  //create
    export const newTaskReducer = (state = { task: {} }, action) => {
      switch (action.type) {
        case NEW_TASK_REQUEST:
          return {
            ...state,
            loading: true,
          };
        case NEW_TASK_SUCCESS:
          return {
            loading: false,
            success: action.payload.success,
            task: action.payload.task,
          };
        case NEW_TASK_FAIL:
          return {
            ...state,
            loading: false,
            error: action.payload,
          };
        case NEW_TASK_RESET:
          return {
            ...state,
            success: false,
          };
        case CLEAR_ERRORS:
          return {
            ...state,
            error: null,
          };
        default:
          return state;
      }
    };
    
  //delete or update
      export const taskDUReducer = (state = {}, action) => {
      switch (action.type) {
        case DELETE_TASK_REQUEST:
          case UPDATE_TASK_REQUEST:
          return {
            ...state,
            loading: true,
          };
        case DELETE_TASK_SUCCESS:
          return {
            ...state,
            loading: false,
            isDeleted: action.payload,
          };   
          case UPDATE_TASK_SUCCESS:
            return {
              ...state,
              loading: false,
              isUpdated: action.payload,
            };    
        case DELETE_TASK_FAIL:
          case UPDATE_TASK_FAIL:
          return {
            ...state,
            loading: false,
            error: action.payload,
          };
        case DELETE_TASK_RESET:
          return {
            ...state,
            isDeleted: false,
          };
          case UPDATE_TASK_RESET:
            return {
              ...state,
              isUpdated: false,
            };
        case CLEAR_ERRORS:
          return {
            ...state,
            error: null,
          };
        default:
          return state;
      }
    };
  