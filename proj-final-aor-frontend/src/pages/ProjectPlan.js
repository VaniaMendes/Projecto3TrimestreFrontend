import React, { useState, useEffect } from 'react';
import Header from "../components/header/Header";
import './ProjectPlan.css';
import { GoPlusCircle } from 'react-icons/go';
import { IntlProvider, useIntl } from "react-intl";
import { userStore } from "../stores/UserStore";
import languages from "../translations";
import ModalNewTask from '../components/ModalNewTask';
import { useParams } from 'react-router';
import { getProjectTasks } from '../services/TaskService';
import GanttComponent from '../components/GanttChart';
import Visibility from '../components/profile/Visibility';

const ProjectPlan = () => {
    const { locale, token } = userStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { projectId } = useParams();
    const [availableTasks, setAvailableTasks] = useState([]);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [showList, setShowList] = useState(false);
    const [viewMode, setViewMode] = useState('Week'); // Estado para controlar o modo de visualização

    const closeModal = () => setIsModalOpen(false);
    const handleNewTask = () => setIsModalOpen(true);

    const fetchTasks = async () => {
        try {
            if (!token || !projectId) {
                console.warn("Missing token or projectId.");
                return;
            }

            const data = await getProjectTasks(token, projectId);
            setAvailableTasks(data);
            setIsPageLoaded(true);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId, token]);

    const showTasksList = () => {
        setShowList(!showList);
    }

    return (
        <div>
            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="project-plan-container">
                    <Header />
                    <div className="project-plan-separator"><p className="separator-description">GANT</p></div>
                    {isPageLoaded && (<Visibility project={true} showTasksList={showTasksList}/>)}
                    <Buttons setViewMode={setViewMode} /> {/* Passar setViewMode como prop */}

                    <div className="project-plan-exterior-container">
                        <div className="project-plan-chart">
                            {isPageLoaded && <GanttComponent availableTasks={availableTasks} showList={showList} viewMode={viewMode} />}
                        </div>
                        <TaskAdder handleNewTask={handleNewTask} />
                    </div>
                </div>
                {isModalOpen && (<ModalNewTask onClose={closeModal} />)}
            </IntlProvider>
        </div>
    );
};

// Componente interno que usa useIntl
const TaskAdder = ({ handleNewTask }) => {
    const intl = useIntl();

    return (
        <div className="add-task" onClick={handleNewTask}>
            <GoPlusCircle /> <p>{intl.formatMessage({ id: "addTask" })}</p>
        </div>
    );
};

const Buttons = ({ setViewMode }) => {
    const intl = useIntl();

    return (
        <div className="date-buttons-container">
            <button className="date-button" onClick={() => setViewMode('Day')}>{intl.formatMessage({ id: "days" })}</button>
            <button className="date-button" onClick={() => setViewMode('Week')}>{intl.formatMessage({ id: "week" })}</button>
            <button className="date-button" onClick={() => setViewMode('Month')}>{intl.formatMessage({ id: "month" })}</button>
        </div>
    )
}

export default ProjectPlan;
