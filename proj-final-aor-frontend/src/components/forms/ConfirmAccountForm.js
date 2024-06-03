import React, { useState } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import languages from "../../translations";
import { userStore } from "../../stores/UserStore";

function Confirmation() {
  //State variables
  const [user, setUser] = useState({});

  // Get the locale from the userStore
  const locale = userStore((state) => state.locale);

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
};

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
