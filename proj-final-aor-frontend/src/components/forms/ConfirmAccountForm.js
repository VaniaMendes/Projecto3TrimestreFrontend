import React, { useState, useEffect } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import languages from "../../translations";
import { userStore } from "../../stores/UserStore";
import { confirmAccount } from "../../services/users";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import queryString from "query-string";


function Confirmation() {
  //State variables
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    photo: null,
    lab: "",
    biography: "",
    visibilityState: ""
  });
  const navigate = useNavigate();
  const [tokenConfirmation, setTokenConfirmation] = useState("");
  const location = useLocation();


  // Get the locale from the userStore
  const locale = userStore((state) => state.locale);

  // Get the resetPassToken from the URL params
  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    const resetPassToken = queryParams.token;
    if (resetPassToken) {
      setTokenConfirmation(resetPassToken);
    }
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const { photo, ...userData } = user; 
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("userData", JSON.stringify(userData)); 

    try {
      const responseStatus = await confirmAccount(tokenConfirmation, formData);
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
    const { name, value, files } = event.target;
    if (name === 'photo' && files.length > 0) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        setUser(url);
    } else {
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
}


  return (
    <div className="confirmation-container">
      <IntlProvider locale={locale} messages={languages[locale]}>
        <h2>
          <FormattedMessage id="confirmationAccount">
            {(message) => <span>{message}</span>}
          </FormattedMessage>
        </h2>
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <br />

          <div className="inputs-bottom">
            <div className = "inputs-left">
          {/* FirstName input */}
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          {/* LastName input */}
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />

          {/* Nickname input */}
          <input
            type="text"
            name="nickname"
            value={user.nickname}
            onChange={handleChange}
            placeholder="Nickname"
          />
          </div>

          <div className = "inputs-right">

            {/* Photo input*/}

           <div className="confirm-photo">           </div>

          <div className="change-photo">  
            <input type="file" id="photo" name="photo" accept="image/*" value={user.photo}  style={{ display: 'none' }}
            onChange={handleChange}/>

            <button type="button" onClick={() => document.getElementById('photo').click()}>  <FormattedMessage id="uploadPhoto">
            {(message) => <span>{message}</span>}
          </FormattedMessage></button>
            </div> 
          

            </div>
</div>
          {/* Workplace input */}
          <div className="radio-buttons">
            <input type="radio" id="option1" name="lab" value="LISBOA"  onChange={handleChange} />
            <label htmlFor="option1">Lisboa</label>

            <input type="radio" id="option2" name="lab" value="COIMBRA"  onChange={handleChange} />
            <label htmlFor="option2">Coimbra</label>

            <input type="radio" id="option3" name="lab" value="PORTO"   onChange={handleChange}/>
            <label htmlFor="option3">Porto</label>

            <input type="radio" id="option4" name="lab" value="TOMAR"  onChange={handleChange}/>
            <label htmlFor="option4">Tomar</label>

            <input type="radio" id="option5" name="lab" value="VISEU"  onChange={handleChange} />
            <label htmlFor="option5">Viseu</label>

            <input type="radio" id="option6" name="lab" value="VILA_REAL"  onChange={handleChange} />
            <label htmlFor="option6">Vila-Real</label>
          </div>

          {/* Biography input */}
          <input
            type="text"
            name="biography"
            value={user.biography}
            onChange={handleChange}
            placeholder="Biography"
          />

          
          {/* Visibility input */}
          <div className="radio-buttons">
            <p>Visibilidade do perfil:</p>
            <input type="radio" id="option1" name="visibilityState" value="LISBOA"  onChange={handleChange} />
            <label htmlFor="option1">Privado</label>

            <input type="radio" id="option2" name="visibilityState" value="COIMBRA"  onChange={handleChange} />
            <label htmlFor="option2">Público</label>

           
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
