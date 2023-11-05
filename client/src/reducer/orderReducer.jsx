export const INITIAL_STATE = {
  quantity: 1,
  extras: false
};

export const OrderReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUANTITY":
      return { ...state, quantity: action.payload };
    case "TOGGLE_EXTRAS":
      return { ...state, extras: !state.extras };
    default:
      return state;
  }
};
