import axios from 'axios';
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, RESET_NOTIFICATIONS } from '../constants/notificationConstants';

export const addNotification = (notification) => ({
  type: ADD_NOTIFICATION,
  payload: notification
});

export const removeNotification = (data, index) => ({
  type: REMOVE_NOTIFICATION,
  payload: index
});

export const resetNotifications = () => ({
  type: RESET_NOTIFICATIONS
});

export const createNotification = (userId, message) => async (dispatch) => {
  try {
    console.log(userId, message)
    const { data } = await axios.post('/test/v1/notification/create', { userId, message });
    dispatch(addNotification(data.notification));
  } catch (error) {
    console.error(error);
  }
};

export const deleteNotification = (id, index) => async (dispatch) => {
  try {
    console.log(id)
    const { data } = await axios.delete(`/test/v1/notification/delete/${id}`);
    dispatch(removeNotification(data, index));
  } catch (error) {
    console.error(error);
  }
};

export const getNotificationsByUserId = (userId) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/test/v1/notification/getByUserId/${userId}`);
    // Assuming data.notifications contains an array of notifications
    data.notifications.forEach(notification => dispatch(addNotification(notification)));
  } catch (error) {
    console.error(error);
  }
};

export const getNotificationsByWorkspace = (workspaceName) => async (dispatch) => {
  try {
    const { data } = await axios.get(`test/v1/notification/workspace/${workspaceName}`);
    // Assuming data.notifications contains an array of notifications
    data.notifications.forEach(notification => dispatch(addNotification(notification)));
  } catch (error) {
    console.error(error);
  }
};

export const deleteNotificationForUser = (id) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`test/v1/notification/deleteAll/${id}`);
    // Dispatch RESET_NOTIFICATIONS action with the user ID as payload
    dispatch({
      type: RESET_NOTIFICATIONS,
      payload: id
    });
    // Assuming data.notifications contains an array of notifications
    // data.notifications.forEach(notification => dispatch(addNotification(notification)));
  } catch (error) {
    console.error(error);
  }
};