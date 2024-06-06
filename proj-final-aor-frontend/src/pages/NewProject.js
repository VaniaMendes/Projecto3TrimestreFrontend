import React, {useState} from "react";
import './NewProject.css';
import Header from "../components/header/Header";
import {userStore} from "../stores/UserStore";
import languages from "../translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const NewProject = () => {
    const {locale} = userStore();
    const [lab, setLab] = useState({});

    const handleChangeLab = (event) => {
        const { value } = event.target;
        setLab(value);
      };

    return (
        <div>
            <Header />

            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="new-project-container">
                    <div className="project-form-container">
                        <h1>New Project</h1>
                        <form className="form" >
                            <br />

                            <div className="inputs-bottom">
                                <div className = "inputs-left">
                                <div className = "input-container">
                            {/* FirstName input */}
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                required
                            />
                            <label className="label-description" htmlFor="name">
                                                <FormattedMessage id="name">
                                                    {(message) => <span>{message}</span>}
                                                </FormattedMessage>
                                            </label>
                            </div>
                            <div className = "input-container">
                            {/* LastName input */}
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
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
                                placeholder="Nickname"
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
                                    
                                </div>


                                {/* Photo input*/}
                            <div className="change-photo">  
                                <input type="file" id="photo" name="photo" accept="image/*"   style={{ display: 'none' }} />

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
                            placeholder="Biography"
                        />
                        <label className="label-description" htmlFor="biography">
                                            <FormattedMessage id="biography">
                                                {(message) => <span>{message}</span>}
                                            </FormattedMessage>
                                        </label>
                        </div>
                        

                        
                        {/* Submit button */}
                        <button type="submit">
                            <FormattedMessage id="confirm">
                            {(message) => <span>{message}</span>}
                            </FormattedMessage>
                        </button>
                        {/* Back button */}
                        </form>
                    </div>
                </div>
            </IntlProvider>
            
        </div>
    );
};

export default NewProject;