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
import TaskBoard from '../components/TaskBoard';

const ProjectPlan = () => {
    const { locale, token } = userStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { projectId } = useParams();
    const [availableTasks, setAvailableTasks] = useState([]);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [showList, setShowList] = useState(true);
    const [viewMode, setViewMode] = useState('Week'); // Estado para controlar o modo de visualização
    const [showBoard, setShowBoard] = useState(false);
    const [showGantt, setShowGantt] = useState(false);

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

    useEffect(() => {
        const WS_URL = "ws://localhost:8080/project_backend/websocket/task/";
        const websocket = new WebSocket(WS_URL + token);
        
        websocket.onopen = () => {
            console.log("WebSocket connection for task is open");
        };
    
        websocket.onmessage = (event) => {
            const taskReceived = JSON.parse(event.data);
            console.log("Task received: ", taskReceived);
    
            if(taskReceived.erased === true){
                setAvailableTasks(prevTasks =>
                    prevTasks.filter(task => task.id!== taskReceived.id)
                );
            }else{
            // Atualiza a tarefa no estado
            setAvailableTasks(prevTasks => {
                // Verifica se a tarefa recebida deve ser adicionada ou atualizada
                const index = prevTasks.findIndex(task => task.id === taskReceived.id);
                if (index !== -1) {
                    // Tarefa já existe, atualiza ela
                    return [
                        ...prevTasks.slice(0, index),
                        { ...prevTasks[index], ...taskReceived },
                        ...prevTasks.slice(index + 1)
                    ];
                } else {
                    // Tarefa é nova, adiciona ela
                    return [...prevTasks, taskReceived];
                }
            });
        }

            
        };
       
    
        websocket.onclose = (event) => {
            console.warn("WebSocket closed: ", event);
        };
    
        websocket.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };
    
        return () => {
            websocket.close();
        };
    }, [token]);
    
    

    const showTasksList = () => {
        setShowList(!showList);
    }
    
    const handleChange = () => {
        setShowBoard(false);
        setShowGantt(true);
    }
    
    const handleChangeBoard = () => {
        setShowBoard(true);
        setShowGantt(false);
    }

    return (
        <div>
            <IntlProvider locale={locale} messages={languages[locale]}>
                <div className="project-plan-container">
                    <Header />
                    <div className="project-plan-separator"><p className="separator-description" onClick={handleChange}>GANT</p></div>
                    <div className="project-plan-separator-board"><p className="separator-description" onClick={handleChangeBoard}>BOARD</p></div>
                    {!showBoard && isPageLoaded && (<Visibility project={true} showTasksList={showTasksList}/>)}
                    {!showBoard && (<Buttons setViewMode={setViewMode} />)}

                    <div className="project-plan-exterior-container">
                        <div className="project-plan-chart">
                           
                            {!showBoard && isPageLoaded && <GanttComponent availableTasks={availableTasks} showList={showList} viewMode={viewMode} />}
                    {showBoard && <TaskBoard listTasks={availableTasks} />}
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
        <div className="add-task" >
            <GoPlusCircle className= "add-task-button" onClick={handleNewTask}/> <p>{intl.formatMessage({ id: "addTask" })}</p>
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
