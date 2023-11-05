export const INITIAL_STATE = {
  title: "",
  desc: "",
  cat: "",
  cover: "",
  images: [],
  features: [],
  shortTitle: "",
  shortDesc: "",
  price: null,
  revisionNumber: null,
  deliveryTime: null,
};

export const gigReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };
    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],
      };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter(
          (feature) => feature !== action.payload
        ),
      };
    case "PREPOPULATE_FORM":
      return {
        ...state,
        title: action.payload.title,
        price: action.payload.price,
        desc: action.payload.desc,
        cat: action.payload.cat,
        cover: action.payload.cover,
        images: action.payload.images,
        features: action.payload.features,
        shortDesc: action.payload.shortDesc,
        shortTitle: action.payload.shortTitle,
        revisionNumber: action.payload.revisionNumber,
        deliveryTime: action.payload.deliveryTime,
        // ...prepopulate other fields similarly
      };
    case "REMOVE_COVER_IMAGE":
      return {
        ...state,
        cover: "",
      };  
    case "REMOVE_IMAGE":
      return {
        ...state,
        images: state.images.filter((image) => image !== action.payload),
      };
    case "RESET_FORM":
      return INITIAL_STATE;
    default:
      return state;
  }
};
