import React, { useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { userStore } from "../../stores/UserStore";
import { useIntl } from "react-intl";
import {
  updateSettingsSystem,
  getSettingsInfo,
} from "../../services/AppSettings";
import { toast } from "react-toastify";

function Settings({ onClose }) {
  //Get the token and userId from the userStore
  const { token, userId } = userStore();

  // State variable for settings, initialized as empty object
  const [settings, setSettings] = useState({});

  // Initializing useIntl for internationalization
  const intl = useIntl();

  // Fetching initial settings from the server when the component mounts or when the token or userId change
  useEffect(() => {
    async function fecthInfoSettings() {
      const result = await getSettingsInfo(token);
      // Update settings state with fetched data
      setSettings(result);
    }
    fecthInfoSettings();
  }, [token, userId]);

  // Handle change in input fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    // Convert value to integer if it's a number field
    const newValue =
      name === "sessionTimeout" || name === "maxUsersPerProject"
        ? parseInt(value, 10)
        : parseInt(value, 10);
    setSettings({ ...settings, [name]: newValue });
  };

  // Handle update settings button click
  const handleUpdateSettings = async () => {
    try {
      // Attempt to update settings using token and current settings state
      const result = await updateSettingsSystem(token, settings);
      if (result === 200) {
        toast.success(intl.formatMessage({ id: "settingsUpdated" }));
        //Close settings modal
        onClose();
      } else {
        toast.error(intl.formatMessage({ id: "errorUpdatingSettings" }));
      }
    } catch (error) {
      toast.error(intl.formatMessage({ id: "errorUpdatingSettings" }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-settings">
        <div className="title-settings">
          <div className="modal-close" onClick={onClose}>
            {" "}
            {/* Close icon with click handler to close modal */}
            <IoIosCloseCircleOutline />
          </div>
          <div className="title-modal-settings">
            {" "}
            <p className="title-modal">
              {" "}
              {intl.formatMessage({ id: "settings" })}
            </p>
          </div>
        </div>

        <div className="content-settings">
          {/* Input field for session timeout setting */}
          <div className="input-container-settings">
            <input
              className="input-settings"
              type="number"
              name="sessionTimeout"
              value={settings.sessionTimeout || ""}
              onChange={handleChange}
              placeholder={settings.sessionTimeout || ""}
            />
            <label
              className="label-description-settings"
              htmlFor="sessiontimeout"
            >
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
            <label
              className="label-description-settings"
              htmlFor="maxUserProjects"
            >
              {intl.formatMessage({ id: "maxUserProjects" })}
            </label>
          </div>
        </div>

        <div className="buttons-settings">
          {/* Button to save updated settings */}
          <button className="save-button" onClick={handleUpdateSettings}>
            {intl.formatMessage({ id: "save" })}
          </button>
          {/* Button to close settings modal */}
          <button className="save-button" onClick={onClose}>
            {intl.formatMessage({ id: "back" })}
          </button>
        </div>

        {/* Adicione aqui os conteúdos e funcionalidades do modal de configurações */}
      </div>
    </div>
  );
}
export default Settings;
