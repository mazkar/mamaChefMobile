import { combineReducers } from "redux";
import auth from "./auth/reducers";
import locationReducer from "./location/reducer";
import menuReducer from "./menu/reducer";

const reducer = combineReducers({
  auth,
  locationReducer,
  menuReducer,
});

export default reducer;
