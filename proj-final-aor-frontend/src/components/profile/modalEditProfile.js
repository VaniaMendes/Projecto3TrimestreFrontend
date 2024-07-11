import React, { useState } from "react";
import { useIntl } from "react-intl";
import { userStore } from "../../stores/UserStore";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { updateUser, updateBiography, uploadPhoto } from "../../services/users";
import { toast } from "react-toastify";
import logo from "../assets/profile_pic_default.png";
import LabSelection from "../LabSelection";

const EditProfile = (props) => {
  //Destructure props
  const { onClose, modalType, user } = props;

  //Get the token and userId from the store
  const { token, userId } = userStore();

  // State variables
  const { updateName, updatePhoto } = userStore();
  const [editUser, setEditUser] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photo, setPhoto] = useState(null);

  // Internationalization hook
  const intl = useIntl();

  // Handle profile or biography edit based on type
  const handleEditProfile = async (type) => {
    if (type === "profile") {
      let photoUrl = editUser.photo; // Preserve the existing photo URL

      // Upload the photo and get the URL if a new photo is selected
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile);
      }

      // Create updated user object
      const updatedUser = { ...editUser, photo: photoUrl };

      //Update user profile
      const result = await updateUser(token, userId, updatedUser);
      if (result === 200) {
        updatePhoto(photoUrl);

        toast.success(intl.formatMessage({ id: "profileUpdated" }));
        onClose();
      } else {
        toast.warning(intl.formatMessage({ id: "errorOccurred" }));
      }
    } else if (type === "biography") {
      // Update user biography
      const result = await updateBiography(userId, token, editUser);
      if (result === 200) {
        toast.success(intl.formatMessage({ id: "biographyUpdated" }));
        onClose();
      } else {
        toast.warning(intl.formatMessage({ id: "errorOccurred" }));
      }
    }
  };

  // Handle change in input fields
  // Update the state variable with the new value
  const handleChange = (event) => {
    const { name, value } = event.target;
    // If field starts with "lab.", update nested lab object
    if (name.startsWith("lab.")) {
      const labField = name.split(".")[1];
      setEditUser((prevState) => ({
        ...prevState,
        lab: {
          ...prevState.lab,
          [labField]: value,
        },
      }));
    } else {
      // Otherwise, update directly in editUser object
      setEditUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle change in photo input field
  const handleChangePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const photoURL = URL.createObjectURL(file); // Create URL for preview
      setPhoto(photoURL); // Set photo preview
      setPhotoFile(file); // Set photo file for upload

      // Update editUser with photo URL
      setEditUser((prevState) => ({
        ...prevState,
        photo: photoURL,
      }));
    }
  };

  // Handle change in biography textarea
  const handleChangeNBiography = (event) => {
    const { value } = event.target;
    setEditUser((prevState) => ({
      ...prevState,
      biography: value,
    }));
  };

  return (
    <div>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-skill-container">
        {/* Close button */}
        <div className="modal-close" onClick={onClose}>
          <IoIosCloseCircleOutline />
        </div>
        {/* Modal title */}
        <p className="editProfile-title">
          {/* Conditional title based on modalType */}
          {modalType === "biography"
            ? intl.formatMessage({ id: "editBiography" })
            : intl.formatMessage({ id: "editProfile" })}
        </p>
        {/* Render different sections based on modalType */}
        {modalType === "profile" && (
          <div className="edit-profile">
            <div className="edit-photo">
              <div className="inputs-editPhoto">
                {/* Photo display */}
                <div className="confirm-photo">
                  {photo ? (
                    <img src={photo} alt="User Photo" />
                  ) : (
                    <img src={logo} alt="Logo" />
                  )}
                </div>

                {/* Photo input*/}
                <div className="change-photoProfile">
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleChangePhoto}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("photo").click()}
                  >
                    {intl.formatMessage({ id: "uploadPhoto" })}
                  </button>
                </div>
              </div>
            </div>

            {/* Input fields for editing user details */}
            <div className="input-container">
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder={user.firstName}
                value={editUser.firstName || ""}
                onChange={handleChange}
              />
              <label
                className="label-description-editProfile"
                htmlFor="firstName"
              >
                {intl.formatMessage({ id: "firstName" })}
              </label>
            </div>
            <div className="input-container">
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder={user.lastName}
                value={editUser.lastName || ""}
                onChange={handleChange}
              />
              <label
                className="label-description-editProfile"
                htmlFor="lastName"
              >
                {intl.formatMessage({ id: "lastName" })}
              </label>
            </div>
            <div className="input-container">
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={editUser.nickname || ""}
                placeholder={user.nickname || ""}
                onChange={handleChange}
              />
              <label
                className="label-description-editProfile"
                htmlFor="nickname"
              >
                {intl.formatMessage({ id: "nickname" })}
              </label>
            </div>
            <LabSelection
              selectedLab={editUser.lab}
              handleChangeLab={handleChange}
            />
          </div>
        )}

        {/* Section for editing biography */}
        {modalType === "biography" && (
          <div className="edit-biography">
            <textarea
              className="biography-champ"
              type="text"
              id="biography"
              name="biography"
              value={editUser.biography || ""}
              onChange={handleChangeNBiography}
            />
          </div>
        )}
        <button
          className="save-button"
          onClick={() => handleEditProfile(modalType)}
        >
          {intl.formatMessage({ id: "save" })}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
