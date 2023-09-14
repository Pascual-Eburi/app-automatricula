import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers'
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {};

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    // applyMiddleware(...middleware)
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

/*import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from './redux/reducers';

const middleware = [...getDefaultMiddleware()];

const store = configureStore({
    reducer: rootReducer,
    middleware,
    devTools: true
});

export default store;*/
