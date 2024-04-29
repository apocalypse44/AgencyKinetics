import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['memberLogin'], // Specify the reducers you want to persist
};

export default persistConfig;