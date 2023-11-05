// validationUtils.js

  export const validateCategory = (category, setErrorFunction) => {
    if (!category || category === "Select a category") {
      setErrorFunction((prevErrors) => ({
        ...prevErrors,
        cat: "Please select a category",
      }));
    } else {
      setErrorFunction((prevErrors) => ({
        ...prevErrors,
        cat: "",
      }));
    }
  };

  export const validateFeatures = (features, setErrorFunction) => {
    if (!features || features.length < 3) {
      setErrorFunction((prevErrors) => ({
        ...prevErrors,
        features: "At least three features are required",
      }));
    } else {
      setErrorFunction((prevErrors) => ({
        ...prevErrors,
        features: "",
      }));
    }
  };
  

  export const validateField = (fieldName, fieldValue, setErrorFunction) => {
    if (fieldName === "title") {
      if (fieldValue.trim() === "") {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          title: "Title is required",
        }));
      } else if (!/^[A-Za-z][A-Za-z0-9\s]{19,}$/.test(fieldValue)) {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          title: "Title should start with a letter and contain at least 20 characters",
        }));
      } else {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          title: "",
        }));
      }
    } else if (fieldName === "desc") {
      if (fieldValue.trim() === "") {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          desc: "Description is required",
        }));
      } else if (fieldValue.length < 150) {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          desc: "Description should be at least 200 characters",
        }));
      } else {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          desc: "",
        }));
      }
    } else if (fieldName === "price" || fieldName === "deliveryTime" || fieldName === "revisionNumber") {
      // Validate required fields (price, deliveryTime, revisionNumber)
      if (fieldValue.trim() === "") {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          [fieldName]: "required",
        }));
      } else {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          [fieldName]: "",
        }));
      }
    } else if (fieldName === "shortTitle") {
      if (fieldValue.trim() === "") {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          shortTitle: "Service Title is required",
        }));
      } else if (fieldValue.length < 10) {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          shortTitle: "Service Title should have at least 10 characters",
        }));
      } else {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          shortTitle: "",
        }));
      }
    } else if (fieldName === "shortDesc") {
      if (fieldValue.trim() === "") {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          shortDesc: "Short Description is required",
        }));
      } else if (fieldValue.length < 20) {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          shortDesc: "Short Description should have at least 20 characters",
        }));
      } else {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          shortDesc: "",
        }));
      }
    } 
    // Add more field validations as needed
  };
  

  // handle select field
  export function updateFormErrorState(fieldName, isError, errorMessage, setFormErrors) {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: isError ? errorMessage : "",
    }));
  }
  

  export const validateAndUpdateErrors = (name, value, setErrorFunction,state) => {
    switch (name) {
      case "title":
      case "desc":
      case "shortTitle":
      case "shortDesc":
      case "price":
      case "deliveryTime":
      case "revisionNumber":
        validateField(name, value, setErrorFunction);
        break;
      case "cat":
        validateCategory(value, setErrorFunction);
        break;
      case "features":
        validateFeatures(state.features, setErrorFunction);
        break;  
      // Add more cases as needed
      default:
        break;
    }
  };
  