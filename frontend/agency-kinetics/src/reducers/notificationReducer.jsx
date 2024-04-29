// notificationReducer.js

import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, RESET_NOTIFICATIONS } from '../constants/notificationConstants';

const initialState = {
  notifications: []
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      console.log(action.payload)
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    // Reducer
case REMOVE_NOTIFICATION:
  const updatedNotifications = [...state.notifications.slice(0, action.payload), ...state.notifications.slice(action.payload + 1)];
  console.log(action.payload, updatedNotifications)
  return {
    ...state,
    notifications: updatedNotifications
  };

    case RESET_NOTIFICATIONS:
      const userIdToRemove = action.payload;
      const filteredNotifications = state.notifications.filter(notification => notification.userId !== userIdToRemove);
      console.log(filteredNotifications.length)
      return {
        ...state,
        notifications: filteredNotifications
      };
    default:
      return state;
  }
};

export default notificationReducer;
