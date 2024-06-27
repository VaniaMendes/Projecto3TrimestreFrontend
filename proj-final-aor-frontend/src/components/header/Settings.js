import React, {useState, useEffect} from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { userStore } from '../../stores/UserStore';
import { IntlProvider, useIntl } from "react-intl";
import languages from "../../translations";
import {updateSettingsSystem, getSettingsInfo} from "../../services/AppSettings";
import {toast} from 'react-toastify';

function Settings({onClose}){
  const {locale, token, userId} = userStore();
  const intl = useIntl();

  const [settings, setSettings] = useState({ });

  console.log(token);

  useEffect(() => {
    async function fecthInfoSettings() {
      const result = await getSettingsInfo(token);
      setSettings(result);
    }
    fecthInfoSettings();
    }, [token, userId]);

    const handleChange = (event) => {
      const { name, value } = event.target;
      // Convert value to integer if it's a number field
      const newValue = name === 'sessionTimeout' || name === 'maxUsersPerProject' ? parseInt(value, 10) : parseInt(value, 10);
      setSettings({ ...settings, [name]: newValue });
    };


  const handleUpdateSettings = async () => {
    try {
      const result = await updateSettingsSystem(token, settings);
      if (result === 200) {
        toast.success(intl.formatMessage({ id: "settingsUpdated" }));
        onClose();
      } else {
        toast.error(intl.formatMessage({ id: "errorUpdatingSettings" }));
      }
    } catch (error) {
      toast.error(intl.formatMessage({ id: "errorUpdatingSettings" }));
    }
  };

  console.log(settings);
    
    return(
        <div className='modal-overlay'>
           <IntlProvider locale={locale} messages={languages[locale]}>
      <div className="modal-settings"> 
        <div className = "title-settings">
        

        <div className="modal-close" onClick={onClose}>
          <IoIosCloseCircleOutline />
        </div>
        <div className="title-modal-settings">  <p className = "title-modal"> {intl.formatMessage({ id: "settings" })}</p></div>
      
        </div>

        <div className="content-settings">

        <div className="input-container-settings">
           

            <input className="input-settings"
              type="number"
              name="sessionTimeout"
              value={settings.sessionTimeout || ""}
              onChange={handleChange}
              placeholder={settings.sessionTimeout || ""}
        
            />
            <label className="label-description-settings" htmlFor="sessiontimeout">
            {intl.formatMessage({ id: "sessiontimeout" })}
            </label>
          </div>


          <div className="input-container-settings">
            

          <input
              type="number"
              name="maxUsersPerProject"
              value={settings.maxUsersPerProject || ""}
              onChange={handleChange}
              placeholder={settings.maxUsersPerProject || ""}
            
            />
            <label className="label-description-settings" htmlFor="maxUserProjects">
            {intl.formatMessage({ id: "maxUserProjects" })}
            </label>
          </div>

        </div>


        <div className="buttons-settings">
        <button className="save-button" onClick={handleUpdateSettings}>{intl.formatMessage({ id: "save" })}</button>
        <button className="save-button" onClick={onClose}>{intl.formatMessage({ id: "back" })}</button>
        </div>
        
        {/* Adicione aqui os conteúdos e funcionalidades do modal de configurações */}
      </div>
      </IntlProvider>
    </div>
  );
}
export default Settings;