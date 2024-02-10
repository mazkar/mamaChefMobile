const initialState = {
  menuList: [],
};

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    // Sign in
    case "SET_MENU_COUNT":
      return {
        ...state,
        menuList: action.payload,
      };

    default:
      return state;
  }
};

export default menuReducer;
