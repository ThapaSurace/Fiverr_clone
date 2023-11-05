import React, { useState, useReducer, useContext, useEffect } from "react";
import { INITIAL_STATE, gigReducer } from "../../reducer/gigReducer";
import upload from "../../utils/upload";
import { TiDelete } from "react-icons/ti";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import Loading from "../../utils/loading";
import { cats } from "../../data";
import Layout from "../../utils/Layout";
import { GigContext } from "../../context/GigContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { RxCross2 } from "react-icons/rx";
import {
  validateAndUpdateErrors,
} from "../../utils/gigValidate";

const AddNewGig = () => {
  const [coverImage, setCoverImage] = useState(undefined);
  const [multipleImages, setMultipleImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const gigContext = useContext(GigContext);
  const selectedGig = gigContext.selectedGig;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({
    title: "",
    cat: "",
    desc: "",
    images: "",
    price: "",
    deliveryTime: "",
    revisionNumber: "",
    features: "",
  });

  useEffect(() => {
    if (selectedGig) {
      // Dispatch an action to prepopulate form fields
      dispatch({
        type: "PREPOPULATE_FORM",
        payload: selectedGig,
      });
    }
  }, [selectedGig]);

  //handling input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name, value },
    });

    validateAndUpdateErrors(name, value, setFormErrors);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateAndUpdateErrors(name, value, setFormErrors);
  };

  //handling features
  const handleFeatures = (e) => {
    e.preventDefault();
    const newFeature = e.target[0].value.trim();
  
    // Check if the new feature is empty
    if (newFeature === "") {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        features: "Feature cannot be empty",
      }));
    } else {
      // Clear the features error when a valid feature is added
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        features: "",
      }));
  
      // Add the new feature and clear the input field
      dispatch({
        type: "ADD_FEATURE",
        payload: newFeature,
      });
      e.target[0].value = "";
    }
  };
  
  //handling file inputs
  const handleUploads = async () => {
    setUploading(true);
    try {
      const cover = await upload(coverImage);

      const newImages = await Promise.all(
        [...multipleImages].map(async (img) => {
          if (img.size <= 2 * 1024 * 1024) {
            const url = await upload(img);
            return url;
          } else {
            console.log("Image size exceeds 5MB:", img.name);
            setFormErrors((prevErrors) => ({
              ...prevErrors,
              images: "Image size should be 5MB or less",
            }));
            console.log(images);
            return null;
          }
        })
      );

      const validImages = newImages.filter((url) => url !== null);
      const images = [...state.images, ...validImages];
      setUploading(false);
      dispatch({
        type: "ADD_IMAGES",
        payload: { cover, images },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (gig) => {
      return newRequest.post(`/gig`, gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mygigs"]);
      navigate("/giglist");
    },
  });

  const { mutate: updateMutate, isLoading: updateIsLoading } = useMutation({
    mutationFn: (updatedgig) => {
      return newRequest.put(`/gig/${selectedGig._id}`, updatedgig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mygigs"]);
      navigate("/giglist");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedGig) {
      updateMutate(state);
    } else {
        mutate(state);
      }
  };

  const handleImageDelete = (image) => {
    dispatch({
      type: "REMOVE_IMAGE",
      payload: image,
    });
  };

  const handleCoverImageDelete = () => {
    dispatch({
      type: "REMOVE_COVER_IMAGE",
    });
  };

  console.log(state);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto my-10  px-4">
        <span className="text-3xl font-bold text-darkteal">Add gig</span>
        <div className="flex gap-10 mt-6">
          <div className="flex-1 flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g i am good at something"
                value={state.title}
                onChange={handleChange}
                className={`${formErrors.title && "border-red-500"}`}
                onBlur={handleBlur}
              />
              {formErrors.title && (
                <p className="text-red-500">{formErrors.title}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="category">
                Category
              </label>
              <select
                name="cat"
                id="category"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${
                  formErrors.cat && "border-red-500"
                } cursor-pointer`}
              >
                <option value={state.cat}>Select a category</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
              {formErrors.cat && (
                <p className="text-red-500">{formErrors.cat}</p>
              )}
            </div>

            <div className="border border-gray p-2 rounded-md">
              <div className="images flex flex-col gap-4 ">
                <div className="flex flex-col gap-1">
                  <label className="label" htmlFor="cover">
                    Cover image
                  </label>
                  <input
                    className="focus:outline-none cursor-pointer file:border-none file:hover:border-2 file:font-bold file:bg-teal fil file:text-white file:hover:bg-[#5f9ea0]  file:cursor-pointer w-min file:rounded-lg file:px-2 file:py-1 "
                    type="file"
                    id="cover"
                    onChange={(e) => setCoverImage(e.target.files[0])}
                  />
                </div>

                {state?.cover && (
                  <div className="relative w-16 h-16 rounded-sm">
                    <LazyLoadImage
                      src={state?.cover}
                      className="w-full h-full rounded-sm object-cover object-center"
                    />
                    <RxCross2
                      className="absolute top-1 right-1 bg-black text-white font-bold object-cover object-center cursor-pointer"
                      onClick={handleCoverImageDelete}
                    />
                  </div>
                )}

                <div>
                  <div className="flex flex-col gap-1">
                    <label className="label" htmlFor="images">
                      Upload an images
                    </label>
                    <input
                      className="border-none focus:outline-none cursor-pointer file:border-none file:hover:border-2 file:font-bold file:bg-teal fil file:text-white file:hover:bg-[#5f9ea0]  file:cursor-pointer w-min file:rounded-lg file:px-2 file:py-1 "
                      type="file"
                      id="images"
                      multiple
                      onChange={(e) => setMultipleImages(e.target.files)}
                    />
                  </div>
                  {formErrors.images && (
                    <p className="text-red-500">{formErrors.images}</p>
                  )}

                  <div className="flex gap-4 mt-4">
                    {state?.images &&
                      state?.images.map((img, i) => (
                        <div className="relative" key={i}>
                          <LazyLoadImage
                            src={img}
                            className="w-16 h-16 rounded-sm object-cover object-center"
                          />
                          <RxCross2
                            className="absolute top-1 right-1 bg-black text-white font-bold object-cover object-center cursor-pointer"
                            onClick={() => handleImageDelete(img)}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleUploads}
                className="btn bg-teal mt-4 py-2 px-4 text-sm"
              >
                {uploading ? "uploading..." : "Upload Images"}
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="desc">
                Description
              </label>
              <textarea
                name="desc"
                id="desc"
                cols="30"
                rows="6"
                placeholder="write description about your service to your customer"
                className={`${formErrors.desc && "border-red-500"}`}
                value={state.desc}
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
            <button
              disabled={
                isLoading ||
                updateIsLoading ||
                Object.values(formErrors).some((error) => error !== "") ||
                Object.values(state).some((value) => value === "")
              }
              type="submit"
              onClick={handleSubmit}
              className="btn bg-teal hover:bg-darkteal py-2 flex justify-center items-center gap-2 disabled:cursor-not-allowed"
            >
              {isLoading || updateIsLoading ? (
                <>
                  <Loading
                    type={"spin"}
                    color={"white"}
                    height={20}
                    width={20}
                  />
                  <span>processing</span>
                </>
              ) : selectedGig ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="shortTitle">
                Service Title
              </label>
              <input
                type="text"
                id="shortTitle"
                name="shortTitle"
                placeholder="e.g one-page web design"
                value={state.shortTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${formErrors.shortTitle && "border-red-500"}`}
              />
              {formErrors.shortTitle && (
                <p className="text-red-500">{formErrors.shortTitle}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="shortDesc">
                Short Description
              </label>
              <textarea
                name="shortDesc"
                id="shortDesc"
                cols="30"
                rows="4"
                placeholder="short dec about your service"
                value={state.shortDesc}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${formErrors.shortDesc && "border-red-500"}`}
              ></textarea>
              {formErrors.shortDesc && (
                <p className="text-red-500">{formErrors.shortDesc}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="deliveryTime">
                Delevery time
              </label>
              <input
                type="number"
                name="deliveryTime"
                min={1}
                id="deliveryTime"
                value={state.deliveryTime}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${formErrors.deliveryTime && "border-red-500"}`}
              />
              {formErrors.deliveryTime && (
                <p className="text-red-500">{formErrors.deliveryTime}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="revisionNumber">
                Revision time
              </label>
              <input
                type="number"
                name="revisionNumber"
                min={1}
                id="revisionNumber"
                value={state.revisionNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${formErrors.revisionNumber && "border-red-500"}`}
              />
              {formErrors.revisionNumber && (
                <p className="text-red-500">{formErrors.revisionNumber}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="features">
                Add features
              </label>
              <form onSubmit={handleFeatures}>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="e.g page design" />
                  <button className="btn bg-teal p-2">Add</button>
                </div>
              </form>
              {formErrors.features && (
                <p className="text-red-500">{formErrors.features}</p>
              )}

              <div className="mt-2 flex flex-col gap-1">
                {state?.features
                  ?.filter((f) => f.trim() !== "") // Filter out empty features
                  .map((f) => (
                    <button
                      key={f}
                      className="border border-maroon text-maroon px-2 py-1 rounded-md flex gap-2 items-center w-fit"
                      onClick={() =>
                        dispatch({ type: "REMOVE_FEATURE", payload: f })
                      }
                    >
                      <span>{f}</span>{" "}
                      <span className="text-maroon text-xl">
                        <TiDelete />
                      </span>
                    </button>
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="label" htmlFor="price">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={state.price}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${formErrors.price && "border-red-500"}`}
              />
              {formErrors.price && (
                <p className="text-red-500">{formErrors.price}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddNewGig;
