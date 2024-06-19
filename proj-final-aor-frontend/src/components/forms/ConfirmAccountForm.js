import React, { useState, useEffect } from "react";
import { IntlProvider, FormattedMessage,  useIntl } from "react-intl";
import languages from "../../translations";
import { userStore } from "../../stores/UserStore";
import { confirmAccount, uploadPhoto } from "../../services/users";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import queryString from "query-string";
import './FormStyle.css';
import logo from '../assets/profile_pic_default.png';
import LabSelection from "../LabSelection";



function Confirmation() {
  //State variables
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    biography: "",
    visibilityState: "",
    photo: null
  });
  
  const [lab, setLab] = useState({});
  const navigate = useNavigate();
  const [tokenConfirmation, setTokenConfirmation] = useState("");
  const location = useLocation();
  const [photo, setPhoto]= useState(null);
  const intl = useIntl();
  const [photoFile, setPhotoFile] = useState(null);


  // Get the locale from the userStore
  const locale = userStore((state) => state.locale);

  // Get the tokenConfirmation from the URL params
  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    const tokenConfirmationURL = queryParams.token;
    if (tokenConfirmationURL) {
      setTokenConfirmation(tokenConfirmationURL);
    }
  }, [location.search]);

 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevState => ({
      ...prevState, 
      [name]: value 
    }));
  };
  
  function handleChangeVisibility(event) {
    const { name, value } = event.target;

    // Convert 'true' e 'false' for booleans
    const newValue = (value === 'true' || value === 'false') ? value === 'true' : value;

    setUser(prevState => ({
        ...prevState,
        [name]: newValue
    }));
}

const handleChangePhoto = (event) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];
    const photoURL = URL.createObjectURL(file);
    setPhoto(photoURL);
    setPhotoFile(file);
    
  }
};
  

  const handleChangeLab = (event) => {
    const { value } = event.target;
    setLab(value);
  };
  
 
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user.firstName || !user.lastName || !user.nickname || !lab || !photoFile) {
        toast.warning("Por favor, preencha todos os campos e selecione uma foto.");
        return;
    }

    try {
        // Upload the photo and get the URL
        const photoUrl = await uploadPhoto(photoFile);
        if (photoUrl) {
            // Update user state with photo URL
            const updatedUser = { ...user, photo: photoUrl };

            // Confirm account with user data and photo URL
            const responseStatus = await confirmAccount(tokenConfirmation, updatedUser, lab);
            if (responseStatus === 200) {
                toast.success("Conta confirmada com sucesso!");
                navigate("/login");
            } else {
                toast.warning("Falha ao confirmar conta.");
            }
        }
    } catch (error) {
        console.error("Erro ao confirmar usuário:", error);
        toast.error("Erro ao confirmar usuário.");
    }
};




  return (
    <div className="confirmation-container">
      <IntlProvider locale={locale} messages={languages[locale]}>
        <h2 className="title-forms" >
          <FormattedMessage id="confirmationAccount">
            {(message) => <span>{message}</span>}
          </FormattedMessage>
        </h2>
        {/* Login form */}
        <form className="form" onSubmit={handleSubmit}>
          <br />

          <div className="inputs-bottom">
            <div className = "inputs-left">
            <div className = "input-container">
          {/* FirstName input */}
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            placeholder={intl.formatMessage({ id: "firstName"})}
            required
          />
          <label className="label-description" htmlFor="firstName">
                            <FormattedMessage id="firstName">
                                {(message) => <span>{message}</span>}
                            </FormattedMessage>
                        </label>
          </div>
          <div className = "input-container">
          {/* LastName input */}
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            placeholder={intl.formatMessage({ id: "lastName"})}
            required
          />

<label className="label-description" htmlFor="lastName">
                            <FormattedMessage id="lastName">
                                {(message) => <span>{message}</span>}
                            </FormattedMessage>
                        </label>
          </div>
          <div className="input-container">
          {/* Nickname input */}
          <input
            type="text"
            name="nickname"
            value={user.nickname}
            onChange={handleChange}
            placeholder={intl.formatMessage({ id: "nickname"})}
          />
          <label className="label-description" htmlFor="nickname">
                            <FormattedMessage id="nickname">
                                {(message) => <span>{message}</span>}
                            </FormattedMessage>
                        </label>
          </div>
          </div>

          <div className = "inputs-right">
            {/* Photo display */}
            <div className="confirm-photo">
            {photo ? <img src={photo} alt="User Photo" /> : <img src={logo} alt="Logo" />}
              </div>


            {/* Photo input*/}
          <div className="change-photo">  
            <input type="file" id="photo" name="photo" accept="image/*"   style={{ display: 'none' }} onChange={handleChangePhoto}/>

            <button type="button" onClick={() => document.getElementById('photo').click()}>  <FormattedMessage id="uploadPhoto">
            {(message) => <span>{message}</span>}
          </FormattedMessage></button>
            </div> 
          

            </div>
</div>
       {/* Workplace input */}
       <p className="lab-title" htmlFor="lab">
          {intl.formatMessage({ id: "lab"})}*</p>
       <LabSelection selectedLab={lab} handleChangeLab={handleChangeLab} />

          {/* Biography input */}
          <div className="biography">
          <input 
            type="text"
            name="biography"
            value={user.biography}
            onChange={handleChange}
            placeholder={intl.formatMessage({ id: "biography"})}
          />
          <label className="label-description" htmlFor="biography">
          {intl.formatMessage({ id: "biography"})}</label>
          </div>
                        
          {/* Visibility input */}
          <div className="radio-buttonsConfirm">
            <p className="visibility-description" > <FormattedMessage id="perfilVisibility">
                                {(message) => <span>{message}</span>}
                            </FormattedMessage></p>
            <input type="radio" id="option1" name="visibilityState" value="false"  onChange={handleChangeVisibility} />
            <label className="visibility-description" htmlFor="option1">Privado</label>

            <input type="radio" id="option2" name="visibilityState" value="true"  onChange={handleChangeVisibility} />
            <label className="visibility-description"  htmlFor="option2">Público</label>

           
          </div>

          
          {/* Submit button */}
          <button type="submit">
            <FormattedMessage id="confirm">
              {(message) => <span>{message}</span>}
            </FormattedMessage>
          </button>
          {/* Back button */}
        </form>
      </IntlProvider>
    </div>
  );
}

export default Confirmation;
