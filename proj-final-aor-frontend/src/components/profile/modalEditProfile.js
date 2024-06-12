import React, { useState } from "react";
import { IntlProvider, useIntl } from "react-intl";
import languages from "../../translations";
import { userStore } from "../../stores/UserStore";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { updateUser, updateBiography } from "../../services/users";
import { toast } from "react-toastify";
import logo from "../assets/profile_pic_default.png";
import LabSelection from "../LabSelection";


function EditProfile({ onClose, modalType }) {
  // Get the locale from the userStore
  const locale = userStore((state) => state.locale);
  const token = userStore((state) => state.token);
  const userId = userStore((state) => state.userId);

  // State variables
  const [editUser, setEditUser] = useState({});

  const [photo, setPhoto] = useState(null);
  const [biography, setBiography] = useState(null);
 
  const intl = useIntl();

  const handleEditProfile = async (type) => {
    if (type === "profile") {
      const result = await updateUser(token, userId, editUser);
      if (result === 200) {
        toast.success("User updated successfully");
        onClose();
      } else {
        toast.warning("This nickname already exists. Please choose another one.");
      }
    } else if (type === "biography") {
      const result = await updateBiography(userId, token, biography);
      if (result === 200) {
        toast.success("Biography updated successfully");
        onClose();
      } else {
        toast.warning("Something went wrong. Please try again.");
      }
    }
  };
  

 

  // Handle change in input fields
  // Update the state variable with the new value
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("lab.")) {
        const labField = name.split(".")[1];
        setEditUser((prevState) => ({
          ...prevState,
          lab: {
            ...prevState.lab,
            [labField]: value
          }
        }));
      } else {
        // Caso contrário, atualize-o diretamente no objeto editUser
        setEditUser((prevState) => ({
          ...prevState,
          [name]: value
        }));
      }
    };
    
    const handleChangePhoto = (event) => {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          const photoURL = URL.createObjectURL(file);
          setPhoto(photoURL);
          editUser.photo = photoURL;
        }
      };
      

      const handleChangeNBiography = (event) => {
        const { value } = event.target;
        setBiography(value);
      };
  
  return (
    <div className="modal-skill-container">
      <IntlProvider locale={locale} messages={languages[locale]}>
        <div className="modal-close" onClick={onClose}>
          <IoIosCloseCircleOutline />
        </div>
        <h1 className="editProfile-title">
          {modalType === "biography"
            ? intl.formatMessage({ id: "editBiography" })
            : intl.formatMessage({ id: "editProfile" })}
        </h1>
        {modalType === "profile" && (
          <div className="edit-profile">
            <div className="edit-photo">
              <div className="inputs-editPhoto">
                {/* Photo display */}
                <div className="confirm-photo">
                  <img src={logo} alt="Logo" />
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

            <div className="input-container">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={editUser.firstName || ""}
                onChange={handleChange}
              />
               <label className="label-description" htmlFor="firstName">
                           {intl.formatMessage({ id: "firstName" })}
                        </label>
            </div>
            <div className="input-container">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={editUser.lastName || ""}
                onChange={handleChange}
              />
               <label className="label-description" htmlFor="lastName">
                           {intl.formatMessage({ id: "lastName" })}
                        </label>
            </div>
            <div className="input-container">
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={editUser.nickname || ""}
                onChange={handleChange}
              />
               <label className="label-description" htmlFor="nickname">
                           {intl.formatMessage({ id: "nickname" })}
                        </label>
            </div>
            <LabSelection selectedLab={editUser.lab} handleChangeLab={handleChange} />
          </div>
        )}

        {modalType === "biography" && (
          <div className="edit-biography">
            <input
              type="text"
              id="biography"
              name="biography"
              value={biography || ""}
              onChange={handleChangeNBiography}
            />
             <label className="label-description" htmlFor="biography">
                           {intl.formatMessage({ id: "biography" })}
                        </label>
          </div>
        )}
       <button className="save-button" onClick={() => handleEditProfile(modalType)}>
  {intl.formatMessage({ id: "save" })}
</button>
      </IntlProvider>
    </div>
  );
}

export default EditProfile;
