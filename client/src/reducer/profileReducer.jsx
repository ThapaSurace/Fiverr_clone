export const INITIAL_STATE = {
  display_name: "",
  desc: "",
  skills: [],
  languages: [],
  personal_website: "",
  certificates: [],
  educations: [],
};

export const profileReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
      
    case "ADD_CERTIFICATE":
      return {
        ...state,
        certificates: [...state.certificates, action.payload],
      };

    case "REMOVE_CERTIFICATE":
      const certificateToRemove = action.payload;
      const updatedCertificates = state.certificates.filter(
        (certificate) => certificate !== certificateToRemove
      );
      return {
        ...state,
        certificates: updatedCertificates,
      };

    case "ADD_EDUCATION":
      return {
        ...state,
        educations: [...state.educations, action.payload],
      };

      case "REMOVE_EDUCATION":
        const educationRemove = action.payload;
        const updatedEducations = state.educations.filter(
          (certificate) => certificate !== educationRemove
        );
        return {
          ...state,
          educations: updatedEducations,
        };

    case "ADD_SKILLS":
      const newSkill = action.payload;
      if (!state.skills.includes(newSkill)) {
        return {
          ...state,
          skills: newSkill,
        };
      }

    case "ADD_LANGUAGES":
      const newLanguage = action.payload;
      if (!state.languages.includes(newLanguage)) {
        return {
          ...state,
          languages: newLanguage,
        };
      }

      // case "ADD_SKILLS":
      //   const newSkill = action.payload;
      //   if (!state.skills.includes(newSkill)) {
      //     return {
      //       ...state,
      //       skills: [...state.skills, newSkill], // Append to the existing array
      //     };
      //   }
      //   return state; // Don't forget to return state in this case

      // case "ADD_LANGUAGES":
      //   const newLanguage = action.payload;
      //   if (!state.languages.includes(newLanguage)) {
      //     return {
      //       ...state,
      //       languages: [...state.languages, newLanguage], // Append to the existing array
      //     };
      //   }

      return state;
    case "RESET_FORM":
      return INITIAL_STATE;
    default:
      return state;
  }
};
