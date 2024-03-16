const initialState = {
  token: null,
  // 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJBZG1pbmlzdHJhdG9yIiwicm9sZSI6IkFkbWluIiwidXNlcl9pZCI6MTQ1LCJ1c2VyX25hbWUiOiJ0ZXN0aW5nMTIyM0BnbWFpbC5jb20iLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiLCJ0cnVzdCJdLCJ2ZW5kb3JfaWQiOm51bGwsInBvc2l0aW9uIjoibWFuYWdlciIsImV4cCI6MTY0ODQ0ODA0OSwiYXV0aG9yaXRpZXMiOlsiQWRtaW4iXSwianRpIjoiMjkyNTEyNDctNWEyOC00MTk0LTlkYWYtMTU4NDJlZmI3MWI4IiwiY2xpZW50X2lkIjoic2VjdXJpdHktY2xpZW50In0.NB9Mf3lxDcYq2U8ZKEp38_bmCjK5qGF28ucRokC08eTuYWbiJs6J4h4yirLq8HIBZtvZlafisbWEOPOT4a6R-1014YrAssqlsncSdw8bKeCTEehs6ZsNUkrZhywnX_NicmE28O50UDpbCoHMaqIb-i2UUuymRxEAMLB0q1C2N1KjpnENjG88al89s-SdAfUGJL99TERLqWhXNH98Cs5xQAHnHISguowQHRtc_jqDeaIZkr0WrNxOPhPNActF8nGpcafWnhl5PrFXhgv7tRdX0e-s4CtFQ4qC6mSXrOCYeA-eVPekWCrBa_Nwsg6nD1dAptm0zqFSTjkfGEmzRKyqDA',
  isLoading: false,
  message: null,
  userData: null,
  tokenExpired: null,
  user: null,
  deviceID: null,
  userId: null,
  apkVersion: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Sign in
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "RESET_REDUCER":
      return {
        ...initialState,
      };

    case "SET_USER_ID":
      return {
        ...state,
        userId: action.payload,
      };
    case "SET_APK_VERSION":
      return {
        ...state,
        apkVersion: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
