  import { createStore, combineReducers, applyMiddleware } from "redux";
  import {thunk} from "redux-thunk";
  import { composeWithDevTools } from "redux-devtools-extension";
  import { newServiceReducer, serviceDUReducer, servicesDetailsReducer, servicesReducer } from "./reducers/serviceReducers";
  import { invoiceDUReducer, invoiceDetailsReducer, invoiceReducer, newInvoiceReducer } from "./reducers/invoicesReducers";
  import { newUserReducer, userDUReducer, userDetailsReducer, userLoginReducer, userPasswordReducer, userReducer } from "./reducers/userReducer";
  import { clientDUReducer, clientDetailsReducer, clientLoginReducer, clientReducer, newClientReducer } from "./reducers/clientReducers";
  import {  newOrderReducer, orderDUReducer, orderReducer, ordersDetailsReducer } from "./reducers/orderReducers";
  import {  newQuoteReducer, quoteDUReducer, quotesDetailsReducer, quotesReducer } from "./reducers/quoteReducers";
  import { newTicketReducer, ticketDUReducer, ticketDetailsReducer, ticketReducer } from "./reducers/ticketReducers";
  import { newTeamReducer, teamDUReducer, teamLoginReducer, teamsDetailsReducer, teamsReducer } from "./reducers/teamReducer";
  import {combinedReducer, memberLoginReducer } from "./reducers/loginReducers";
  import { persistReducer, persistStore } from 'redux-persist';
  import storage from 'redux-persist/lib/storage';
  import { configureStore } from "@reduxjs/toolkit";
  import logger from 'redux-logger'
  import notificationReducer from "./reducers/notificationReducer";
  import { newTaskReducer, taskDUReducer, taskReducer, tasksDetailsReducer } from "./reducers/taskReducer";

  export const reducer = combineReducers({

      logMember:memberLoginReducer,
      member:combinedReducer,
      

      services: servicesReducer,
      serviceDetails: servicesDetailsReducer,
      newService: newServiceReducer,
      serviceDU: serviceDUReducer,

      invoices:invoiceReducer,
      invoiceDetails:invoiceDetailsReducer,
      newInvoice:newInvoiceReducer,
      invoiceDU:invoiceDUReducer,

      users:userReducer,
      userDetails:userDetailsReducer,
      newUser:newUserReducer,
      userDU:userDUReducer,
      userlog:userLoginReducer,

    clients:clientReducer,
    clientDetails:clientDetailsReducer,
    clientDU:clientDUReducer,
    newClient: newClientReducer,
    clientLog:clientLoginReducer,

    orders:orderReducer,
    orderDetails:ordersDetailsReducer,
    newOrder:newOrderReducer, 
    orderDU:orderDUReducer,

    quotes:quotesReducer,
    quoteDetails:quotesDetailsReducer,
    newQuote:newQuoteReducer,
    quoteDU:quoteDUReducer,

    tickets:ticketReducer,
    ticketDetails:ticketDetailsReducer,
    ticketDU:ticketDUReducer,
    newTicket:newTicketReducer,

    teams:teamsReducer,
    teamDetails:teamsDetailsReducer,
    teamDU:teamDUReducer,
    newTeam:newTeamReducer,
    teamlog:teamLoginReducer,

    tasks:taskReducer,
    newTask:newTaskReducer,
    taskDetails:tasksDetailsReducer,
    taskDU:taskDUReducer,

    notifications: notificationReducer,
    forgotpassword:userPasswordReducer,

  });


  const persistConfig = {
    key: 'root',
    storage,
    whitelist:['logMember', 'notifications'],
    blacklist: ['newTicket', 'newOrder', 'newClient', 'newQuote', 'forgotpassword'], // Reducers to exclude from persistence
    // timeout: 1000 * 60 * 60 * 24 * 1,
  }

  // export const resettableReducer = (state, action) => {
  //   if (action.type === RESET_STATE) {
  //     return initialState; // Reset the state to the initial state
  //   }
  //   return combinedReducer(state, action);
  // };

  export const persistedReducer = persistReducer(persistConfig, reducer)

  const middleware = [thunk];
  export const store = createStore(
    reducer,
    // initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );





  // export const store = configureStore({
  //   reducer: persistedReducer,
  //   // preloadedState: initialState,
  //   devTools: process.env.NODE_ENV !== 'production',
  //   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  //   // middleware: [thunk],
  //   // composeWithDevTools(applyMiddleware(...middleware))
  // })

  // export const persistor = persistStore(store)

  export default store;