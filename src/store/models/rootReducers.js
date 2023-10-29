import { combineReducers } from "redux";
import auth from "./auth/reducers";
import locationReducer from "./location/reducer";

const reducer = combineReducers({
  auth,
  locationReducer,
});

export default reducer;
