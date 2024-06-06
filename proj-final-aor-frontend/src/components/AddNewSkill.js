
import React from 'react';
import { IntlProvider, useIntl } from "react-intl";
import languages from "../translations";
import { userStore } from "../stores/UserStore";

function AddNewSkill({onClose}) {
    // Get the locale from the userStore
  const locale = userStore((state) => state.locale);
    const intl = useIntl();


    return (
        <div clasName="modal-skill-container">
             <IntlProvider locale={locale} messages={languages[locale]}>
            <h1> {intl.formatMessage({ id: "addNewSkill" })}</h1>
            
            <button onClick={onClose}>Close</button>
            </IntlProvider>
        </div>
    )
}

export default AddNewSkill;