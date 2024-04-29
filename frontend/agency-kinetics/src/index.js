import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
// import store from "./store";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { reducer } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import {loadState, saveState} from './localStorage'
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import {thunk} from "redux-thunk";

const persistedState = loadState()
const middleware = [thunk];

const store = createStore(
  reducer, 
  persistedState,
  composeWithDevTools(applyMiddleware(...middleware))

)

store.subscribe(() => {
  saveState(store.getState())
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <GoogleOAuthProvider clientId='391871481974-hdf5pjcd9ggqf0ps6lmq693u5g3i98av.apps.googleusercontent.com'>
  <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <App />
      {/* </PersistGate> */}
  </Provider>
  // </GoogleOAuthProvider>
);


