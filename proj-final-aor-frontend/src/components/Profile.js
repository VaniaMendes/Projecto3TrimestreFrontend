import React, { useEffect, useState } from 'react';
import './Profile.css';
import logo from './assets/profile_pic_default.png';
import photo from './assets/profile_pic_default.png';
import { IntlProvider, useIntl } from "react-intl";
import languages from "../translations";
import { userStore } from "../stores/UserStore";
import {getUserInfo} from '../services/users';

function Profile() {
    // Get the locale from the userStore
  const locale = userStore((state) => state.locale);
  const token = userStore((state) => state.token); 
  console.log(token);

  const intl = useIntl();

  //State variables
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser(){
        const data = await getUserInfo(token);
        setUser(data);
    }
    fetchUser();
    }, [token]);

 
console.log(user);

    return (
        <div className="profile-container">
             <IntlProvider locale={locale} messages={languages[locale]}>
            <div className="profile-header">
                <div className="profile-image">
                    {user && user.photo ? <img src={user.photo} alt=" Photo" /> : <img src={logo} alt="Logo" />}
                </div>
                <div className="profile-info">
            {user && <div className="user-name">{user.firstName} {user.lastName}</div>}
            {user && <div className="user-email">{user.email}</div>}
            {user && <div className = "user-lab">{user.lab.name}</div>}
        </div>
            </div>
              {/* Conteúdo da biografia */}
            <div className="profile-biography">
                <div className="input-profile">
                <label className="label-profile" htmlFor="biography">
                            {intl.formatMessage({ id: "biography"})}
                        </label>
                </div>
                

            </div>
            <div className="profile-keywords">
                {/* Conteúdo das palavras-chave */}
                <div className="input-profile">
                <label className="label-profile" htmlFor="skills">
                            {intl.formatMessage({ id: "skills"})}
                        </label>
                        </div>
            </div>
            <div className="profile-interests">
                {/* Conteúdo dos interesses */}
                <div className="input-profile">
                <label className="label-profile" htmlFor="interests">
                            {intl.formatMessage({ id: "interests"})}
                        </label>
                        </div>
            </div>
            <div className="profile-projects">
                {/* Conteúdo dos projetos */}
                <div className="input-profile">
                <label className="label-profile" htmlFor="myProjects">
                            {intl.formatMessage({ id: "myProjects"})}
                        </label>
                        </div>
            </div>
            </IntlProvider>
        </div>
    );
}

export default Profile;
