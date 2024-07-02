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
    const [isPageLoaded, setIsPageLoaded] = useState(false); // Variável de estado para controlar o carregamento da página

    const closeModal = () => setIsModalOpen(false);
    const handleNewTask = () => setIsModalOpen(true);

    const [showList, setShowList] = useState(false);

    const fetchTasks = async () => {
        try {
            if (!token || !projectId) {
                console.warn("Missing token or projectId.");
                return;
            }

            const data = await getProjectTasks(token, projectId);
            setAvailableTasks(data);
            setIsPageLoaded(true); // Marca a página como carregada assim que os dados são obtidos com sucesso
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        console.log("useEffect triggered");

        fetchTasks();
    }, [projectId, token]); // useEffect depende de projectId e token

    // Certifique-se de que o useEffect seja acionado quando isPageLoaded mudar
    useEffect(() => {
        if (isPageLoaded) {
            console.log("Page is loaded, do something here...");
            // Qualquer outra lógica que você precise executar quando a página estiver carregada
        }
    }, [isPageLoaded]);

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

                    <div className="project-plan-exterior-container">
                        <div className="project-plan-chart">
                            {isPageLoaded && <GanttComponent availableTasks={availableTasks} showList={showList} />}
                        </div>
                        <TaskAdder handleNewTask={handleNewTask}  />
                    </div>
                </div>
                {isModalOpen && (<ModalNewTask onClose={closeModal} />)}
            </IntlProvider>
        </div>
    );
};

// Componente interno que usa useIntl
const TaskAdder = ({ handleNewTask }) => {
    const intl = useIntl(); // Agora useIntl é usado corretamente dentro do contexto do IntlProvider

    return (
        <div className="add-task" onClick={handleNewTask}>
            <GoPlusCircle /> <p>{intl.formatMessage({ id: "addTask" })}</p>
        </div>
    );
};

export default ProjectPlan;
