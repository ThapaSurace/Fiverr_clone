import React, { useState, useMemo, useReducer } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import countryList from "react-select-country-list";
import { courses, skills, languageOptions } from "../data";
import { INITIAL_STATE, profileReducer } from "../reducer/profileReducer";
import { useMutation } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { useNavigate } from "react-router-dom";
import Loading from "../utils/loading";
import Layout from "../utils/Layout";
import { useAuth } from "../context/AuthContext";
import { validateAndUpdateErrors } from "../utils/profileFormValidate";
import { updateFormErrorState } from "../utils/gigValidate";

const animatedComponents = makeAnimated();

const SellerForm = () => {
  const [state, dispatch] = useReducer(profileReducer, INITIAL_STATE);
  const navigate = useNavigate();
  const { user } = useAuth();
  // certificate
  const [selectedYear, setSelectedYear] = useState("");
  const [certificate, setCertificate] = useState("");
  const [from, setFrom] = useState("");

  //education
  const [selectedEducationYear, setSelectedEducationYear] = useState("");
  const [country, setCountry] = useState("");
  const [major, setMajor] = useState("");
  const [collegeName, setCollegeName] = useState("");

  // list of year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index);
  const educationYears = Array.from(
    { length: 10 },
    (_, index) => currentYear - index
  );

  // list of country
  const countryOptions = useMemo(() => countryList().getData(), []);

  const [formErrors, setFormErrors] = useState({
    display_name: "",
    desc: "",
    skills: "",
    languages: "",
  });

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateAndUpdateErrors(name, value, setFormErrors);

    // Perform validation based on the input field's name
    if (name === "skills") {
      updateFormErrorState(
        "skills",
        state.skills.length === 0,
        "Please select at least one skill."
      );
    } else if (name === "languages") {
      updateFormErrorState(
        "languages",
        state.languages.length === 0,
        "Please select at least one language."
      );
    }
  };

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name, value },
    });
    validateAndUpdateErrors(name, value, setFormErrors);
  };

  // handle skill
  const handleSkillChange = (selectedOptions) => {
    // Get an array of selected skill labels
    const selectedSkillLabels = selectedOptions.map((option) => option.label);

    console.log(selectedSkillLabels);
    // Dispatch an action to add the selected skill labels to the skill array
    dispatch({ type: "ADD_SKILLS", payload: selectedSkillLabels });

    updateFormErrorState(
      "skills",
      selectedSkillLabels.length === 0,
      "Please select at least one skill.",
      setFormErrors
    );
  };

  // handle language
  const handleLanguage = (value) => {
    const langlabels = value.map((option) => option.label);
    dispatch({ type: "ADD_LANGUAGES", payload: langlabels });
    updateFormErrorState(
      "languages",
      langlabels.length === 0,
      "Please select at least one language.",
      setFormErrors
    );
  };

  // handle certificate
  const handleCertificate = (event) => {
    event.preventDefault();
    if (!certificate || !from || !selectedYear) {
      // Handle the case where any field is empty (you can show an error message)
      return;
    }

    // Create a new certificate object
    const newCertificate = {
      certificate: certificate,
      from: from,
      year: selectedYear,
    };

    dispatch({
      type: "ADD_CERTIFICATE",
      payload: newCertificate,
    });

    // Reset the form fields
    setCertificate("");
    setFrom("");
    setSelectedYear("");
  };

  // handle education
  const handleEducation = (e) => {
    e.preventDefault();
    if (!country || !major || !collegeName || !selectedEducationYear) {
      // Handle the case where any field is empty (you can show an error message)
      return;
    }

    const newEducation = {
      country,
      major,
      collegeName,
      selectedEducationYear,
    };

    dispatch({
      type: "ADD_EDUCATION",
      payload: newEducation,
    });
    //reset the field
    setCountry("");
    setMajor("");
    setCollegeName("");
    setSelectedEducationYear("");
  };

  const handleCountry = (value) => {
    setCountry(value.label);
  };

  const handleCourse = (value) => {
    setMajor(value.label);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (profile) => {
      return newRequest.post(`/freelancer`, profile);
    },
    onSuccess: () => {
      navigate(`/profile/${user?._id}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger validation and update errors for all fields
    for (const fieldName in state) {
      if (state.hasOwnProperty(fieldName)) {
        validateAndUpdateErrors(fieldName, state[fieldName], setFormErrors);
      }
    }

    // Perform additional validations for skills and languages
    updateFormErrorState(
      "skills",
      state.skills.length === 0,
      "Please select at least one skill.",
      setFormErrors
    );
    updateFormErrorState(
      "languages",
      state.languages.length === 0,
      "Please select at least one language.",
      setFormErrors
    );

    // Check if there are any errors in the form
    if (Object.values(formErrors).some((error) => error !== "")) {
      // There are errors, don't submit the form
      return;
    }

    // No errors, proceed with form submission
    mutate(state);

    console.log(state);
  };

  return (
    <>
      <Layout>
        <div className="container py-10 px-5">
          <div>
            <h1 className="text-2xl text-gray font-extrabold mb-4">
              Personal Info
            </h1>
            <div className="flex justify-between mb-4">
              <p className="text-lightgray max-w-lg font-bold tracking-wide">
                Tell us a bit about yourself. This information will appear on
                your public profile, so that potential buyers can get to know
                you better.
              </p>
              <span className="text-lightgray italic font-bold tracking-wide">
                <span className="text-maroon">*</span> Mandatory fields
              </span>
            </div>
          </div>
          <div className="border-t border-[#dadbdd]">
            <div className="flex items-center mb-10 pt-10 ">
              <label htmlFor="display_name" className="label basis-1/3">
                Display Name<span className="text-maroon">*</span>
              </label>
              <div className="basis-2/3 max-w-2xl">
                <input
                  type="text"
                  id="display_name"
                  name="display_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={` w-full border border-[#c5c6c9] ${
                    formErrors.display_name && "border-red-500"
                  }`}
                />
                {formErrors.display_name && (
                  <p className="text-red-500 mt-2">{formErrors.display_name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center mb-10 pt-10">
              <label htmlFor="description" className="label basis-1/3">
                Description<span className="text-maroon">*</span>
              </label>
              <div className="basis-2/3 max-w-2xl">
                <textarea
                  name="desc"
                  id="description"
                  cols="4"
                  rows="5"
                  className={`w-full border border-[#c5c6c9] ${
                    formErrors.desc && "border-red-500"
                  }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></textarea>
                <div className="flex justify-between items-center">
                  {formErrors.desc && (
                    <p className="text-red-500">{formErrors.desc}</p>
                  )}
                  <p className=" text-stone-500 text-sm">
                    {state.desc.length} / 200 characters
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-10">
              <label htmlFor="skills" className="label basis-1/3">
                Skills<span className="text-maroon">*</span>
              </label>
              <div className=" basis-2/3 max-w-2xl">
                <Select
                  id="skills"
                  name="skills"
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={skills}
                  onChange={handleSkillChange}
                  className={`${formErrors.skills && "border-red-500"}`}
                />
                {formErrors.display_name && (
                  <p className="text-red-500 mt-2">{formErrors.skills}</p>
                )}
              </div>
            </div>

            <div className="flex items-center mb-10">
              <label htmlFor="language" className="label basis-1/3">
                Language<span className="text-maroon">*</span>
              </label>
              <div className=" basis-2/3 max-w-2xl">
                <Select
                  id="language"
                  name="languages"
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={languageOptions}
                  onChange={handleLanguage}
                  className={`${formErrors.languages && "border-red-500"}`}
                />
                {formErrors.display_name && (
                  <p className="text-red-500 mt-2">{formErrors.languages}</p>
                )}
              </div>
            </div>

            <div className="flex items-center mb-10">
              <label htmlFor="website" className="label basis-1/3">
                Personal website
              </label>
              <input
                name="personal_website"
                type="text"
                className=" basis-2/3 max-w-2xl  border border-[#c5c6c9]"
                onChange={handleChange}
              />
            </div>

            {/* certificate */}

            <div className="flex items-center mb-10">
              <span className="label label basis-1/3">Certification</span>
              <div className="basis-2/3  max-w-2xl">
                <form onSubmit={handleCertificate}>
                  <div className="grid grid-cols-5 gap-2 ">
                    <input
                      type="text"
                      name="certificate"
                      placeholder="Award or Certificate"
                      className="border border-[#c5c6c9] w-full col-span-2"
                      value={certificate}
                      onChange={(e) => setCertificate(e.target.value)}
                    />

                    <input
                      type="text"
                      name="from"
                      placeholder="Certificate from (e.g. Adobe)"
                      className="border border-[#c5c6c9] w-full col-span-2"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />

                    <select
                      value={selectedYear}
                      className="border border-[#c5c6c9]"
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <button
                      disabled={!certificate || !from || !selectedYear}
                      className="mt-2 bg-teal text-white px-4 py-2 font-bold rounded-md 
                      hover:bg-darkteal disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </form>

                {state.certificates?.length > 0 && (
                  <div className=" border border-[#c5c6c9] rounded-md mt-4 p-2">
                    <table className="table-auto w-full  ">
                      <thead>
                        <tr className="h-12">
                          <th className="text-left text-darkteal text-[18px] font-semibold tracking-wide">
                            Certificate
                          </th>
                          <th className="text-left text-darkteal text-[18px] font-semibold tracking-wide">
                            Year
                          </th>
                          <th className="text-left text-darkteal text-[18px] font-semibold tracking-wide">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.certificates.map((cer, i) => (
                          <tr className="h-12" key={i}>
                            <td>{cer.certificate}</td>
                            <td className="text-sm font-semibold tracking-wide">
                              {cer.year}
                            </td>
                            <td className="text-sm font-semibold text-maroon cursor-pointer">
                              <span
                                onClick={() =>
                                  dispatch({
                                    type: "REMOVE_CERTIFICATE",
                                    payload: cer,
                                  })
                                }
                              >
                                delete
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* education */}
            <div className="flex items-center mb-10">
              <span className="label label basis-1/3">Education</span>
              <div className="basis-2/3  max-w-2xl">
                <form onSubmit={handleEducation}>
                  <div className="grid grid-cols-2 gap-2 ">
                    <Select
                      classNamePrefix="custom-select"
                      options={countryOptions}
                      onChange={handleCountry}
                    />

                    <select
                      value={selectedEducationYear}
                      className="border border-[#c5c6c9]"
                      onChange={(e) => setSelectedEducationYear(e.target.value)}
                    >
                      <option value="">Year</option>
                      {educationYears.map((eyear) => (
                        <option key={eyear} value={eyear}>
                          {eyear}
                        </option>
                      ))}
                    </select>

                    <Select
                      classNamePrefix="custom-select"
                      options={courses}
                      onChange={handleCourse}
                    />

                    <input
                      type="text"
                      placeholder="Name of your college/university"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                    />
                  </div>
                  <button
                    disabled={
                      !country ||
                      !major ||
                      !collegeName ||
                      !selectedEducationYear
                    }
                    className="mt-2 bg-teal text-white px-4 py-2 font-bold rounded-md hover:bg-darkteal 
                    disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </form>
                {state.educations?.length > 0 && (
                  <div className=" border border-[#c5c6c9] rounded-md mt-4 p-2">
                    <table className="table-auto w-full  ">
                      <thead>
                        <tr className="h-12">
                          <th className="text-left text-darkteal text-[18px] font-semibold tracking-wide">
                            Degree
                          </th>
                          <th className="text-left text-darkteal text-[18px] font-semibold tracking-wide">
                            Year
                          </th>
                          <th className="text-left text-darkteal text-[18px] font-semibold tracking-wide">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.educations.map((edu, i) => (
                          <tr className="h-12" key={i}>
                            <td>{edu.major}</td>
                            <td className="text-sm font-semibold tracking-wide">
                              {edu.selectedEducationYear}
                            </td>
                            <td className="text-sm font-semibold text-maroon cursor-pointer">
                              <span
                                onClick={() =>
                                  dispatch({
                                    type: "REMOVE_EDUCATION",
                                    payload: edu,
                                  })
                                }
                              >
                                delete
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className=" text-center">
              <button
                className="btn px-6 py-2 disabled:cursor-not-allowed bg-darkteal"
                type="submit"
                disabled={
                  isLoading ||
                  Object.values(formErrors).some((error) => error !== "")
                }
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Loading
                        type={"spin"}
                        color={"white"}
                        height={20}
                        width={20}
                      />
                      <span>processing</span>
                    </div>
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SellerForm;
