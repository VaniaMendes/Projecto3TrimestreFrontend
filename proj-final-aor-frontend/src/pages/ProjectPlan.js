import React, {useState} from 'react';
import Header from "../components/header/Header";
import './ProjectPlan.css';
import {GoPlusCircle} from 'react-icons/go';
import { IntlProvider, useIntl } from "react-intl";
import { userStore } from "../stores/UserStore";
import languages from "../translations";
import ModalNewTask from '../components/ModalNewTask';

const ProjectPlan = () => {
    const {locale} = userStore();
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const closeModal = () => setIsModalOpen(false);
    const handleNewTask = () => setIsModalOpen(true);

    

    return (
        <div>
            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="project-plan-container">
                    <Header />
                    <div className="project-plan-separator"><p className="separator-description">GANT</p></div>
                    <div className="project-plan-exterior-container">
                        <TaskAdder handleNewTask={handleNewTask} />
                    </div>
                </div>
                {isModalOpen && (<ModalNewTask  onClose={closeModal}/>)}
            </IntlProvider>
        </div>
    );
}

// Componente interno que usa useIntl
const TaskAdder = ({handleNewTask}) => {
    const intl = useIntl(); // Agora useIntl é usado corretamente dentro do contexto do IntlProvider

    return (
        <div className="add-task" onClick={handleNewTask}>
            <GoPlusCircle /> <p>{intl.formatMessage({ id: "addTask" })}</p>
        </div>
    );
};

export default ProjectPlan;