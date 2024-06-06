import React, { useState, useEffect } from "react";
import { IntlProvider, FormattedMessage,  useIntl } from "react-intl";
import languages from "../../translations";
import { userStore } from "../../stores/UserStore";
import { confirmAccount } from "../../services/users";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import queryString from "query-string";
import './FormStyle.css';
import logo from '../assets/profile_pic_default.png';


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

  const handleSubmit = async (event) => {
    event.preventDefault();



    try {
      const responseStatus = await confirmAccount(tokenConfirmation, user, lab);
      if (responseStatus === 200) {
        toast.success("Conta confirmada com sucesso!");
        navigate("/login");
      } else {
        toast.warning(" Falha ao confirmar conta.");
      }
    } catch (error) {
      console.error("Erro ao confirmar usuário:", error);
      
    }
  };

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
    user.photo = photoURL;
  }
};
  

  const handleChangeLab = (event) => {
    const { value } = event.target;
    setLab(value);
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
<div className="radio-buttonsConfirm">
  <div className="radio-item">
    <input type="radio" id="option1" name="lab" value="LISBOA" onChange={handleChangeLab} />
    <label className="radio-description" htmlFor="option1">Lisboa</label>
  </div>
  
  <div className="radio-item">
    <input type="radio" id="option2" name="lab" value="COIMBRA" onChange={handleChangeLab} />
    <label className="radio-description" htmlFor="option2">Coimbra</label>
  </div>
  
  <div className="radio-item">
    <input type="radio" id="option3" name="lab" value="PORTO" onChange={handleChangeLab} />
    <label className="radio-description" htmlFor="option3">Porto</label>
  </div>
  
  <div className="radio-item">
    <input type="radio" id="option4" name="lab" value="TOMAR" onChange={handleChangeLab} />
    <label className="radio-description" htmlFor="option4">Tomar</label>
  </div>
  
  <div className="radio-item">
    <input type="radio" id="option5" name="lab" value="VISEU" onChange={handleChangeLab} />
    <label className="radio-description" htmlFor="option5">Viseu</label>
  </div>
  
  <div className="radio-item">
    <input type="radio" id="option6" name="lab" value="VILA_REAL" onChange={handleChangeLab} />
    <label className="radio-description" htmlFor="option6">Vila-Real</label>
  </div>
</div>

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
