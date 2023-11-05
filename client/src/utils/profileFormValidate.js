export const validateField = (fieldName, fieldValue, setErrorFunction) => {
    if (fieldName === "display_name") {
      if (fieldValue.trim() === "") {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          display_name: "Title is required",
        }));
      } else if (!/^[A-Za-z][A-Za-z0-9\s]{2,}$/.test(fieldValue)) {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          display_name: "name should start with a letter and contain at least 3 characters",
        }));
      } else {
        setErrorFunction((prevErrors) => ({
          ...prevErrors,
          display_name: "",
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
      }
    // Add more field validations as needed
  };
  

  export const validateAndUpdateErrors = (name, value, setErrorFunction,state) => {
    switch (name) {
      case "display_name":
      case "desc":  
        validateField(name, value, setErrorFunction);
        break;

      // Add more cases as needed
      default:
        break;
    }
  };