import React, { useState, useEffect } from "react";
import { userStore } from "../stores/UserStore";
import languages from "../translations";
import { useIntl } from "react-intl";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./ModalNewTask.css";
import {createTask, getProjectTasks} from "../services/TaskService";
import { useParams } from "react-router-dom";
import {toast} from 'react-toastify';

function NewTask({ onClose }) {
  // Obtem a linguagem de exibição da página
  const { locale, token } = userStore();
  const [editTask, setEditTask] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);
  const intl = useIntl();

  // Estados para guardar os dados da task para editar
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [additionalExecutors, setAdicionalExecutors] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [tasksIdList, setTasksIdList] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);

  // Obtendo o projectId da URL usando o useParams
  const { projectId } = useParams();


  const task = {
    title,
    description,
    additionalExecutors: additionalExecutors,
    deadline: deadline + "T23:59:59",
    startDate: startDate + "T00:00:00",
    priorityId: parseInt(priorityId),

  }

  const [priorityColor, setPriorityColor] = useState("");


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getProjectTasks(token, projectId); 
        setAvailableTasks(data); 
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(); 
  }, [token, projectId]); 
  
  const handleAddDependencies = (event) => {
    setShowDependencies(true);
    setTasksIdList([]);
  }


  const handlenewTask = async () => {
    const result = await createTask(token, projectId, task, tasksIdList);
    if(result===200){
      toast.success(intl.formatMessage({ id: 'taskCreatedSuccefuly' }))
      onClose();
      
    }else{
      console.error("Error creating new task");
    }
   
  };



  // Função para mudar a cor da prioridade
  const handlePriorityChange = (event) => {
    setPriorityColor(event.target.value);
    setPriorityId(parseInt(event.target.value)); // Definindo priority como número inteiro
  };
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleDeadlineChange = (event) => {
    setDeadline(event.target.value );
  };
  const handleCloseDependencies = (event) => {
    setShowDependencies(false);
  };


  return (
    <div className="new-task-external-container" >
      
      <div className={`new-task-container ${showDependencies ? 'shift-left' : ''}`}>
        <div className="modal-close-task" onClick={onClose}>
          <IoIosCloseCircleOutline />
        </div>
        
        <h2 className="task_creationTitle">
          {editTask ? (
            intl.formatMessage({ id: "taskEdition" })
          ) : (
            intl.formatMessage({ id: "addTask" })
          )}
        </h2>
      
       

        <div className="input-container">
       
            <input
              type="text"
              placeholder= {intl.formatMessage({ id: "title" })}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          
   
        <label htmlFor="title" className="label-description-editProfile">
        {intl.formatMessage({ id: "title" })}
        </label>

        </div>

       <div className="input-container">
            <textarea
              cols="30"
              rows="3"
              placeholder= {intl.formatMessage({ id: "description" })}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            ></textarea>
          
          
        <label htmlFor="description-task" className="label-description-editProfile">
        {intl.formatMessage({ id: "description" })}
        </label>
       </div>
       
        
        <div className="input-container">
            <textarea
              cols="30"
              rows="3"
              placeholder={intl.formatMessage({ id: "executors" })}
              
              value={additionalExecutors}
              onChange={(event) => setAdicionalExecutors(event.target.value)}
            ></textarea>
             <label htmlFor="description-task" className="label-description-editProfile">
        {intl.formatMessage({ id: "executors" })}
         
        </label>

</div>


<div className="dependencies" onClick={handleAddDependencies}>
        {intl.formatMessage({ id: "addDependys" })}
         
     
</div>



        <div id="date_section" className="descriptioLabelTask">
          <div>
            <p>
            {intl.formatMessage({ id: "initialDate" })}
            </p>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>


          <div id="end_date">
            <p>
            {intl.formatMessage({ id: "finalDate" })}
            </p>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={handleDeadlineChange}
            />
          </div>
        </div>

<div className="input-container">
        <div className="color-section">
        
          <div className="priority_div">
            <input
              type="radio"
              name="priorityId"
              id="low_priority"
              value="10"
              onChange={handlePriorityChange}
              checked={priorityId === 10}
            />
            <label htmlFor="low_priority">
            {intl.formatMessage({ id: "low" })}
            </label>
          </div>
          <div className="priority_div">
            <input
              type="radio"
              name="priorityId"
              id="medium_priority"
              value="20"
              onChange={handlePriorityChange}
              checked={priorityId === 20}
            />
            <label htmlFor="medium_priority">
            {intl.formatMessage({ id: "medium" })}
            </label>
          </div>
          <div className="priority_div">
            <input
              type="radio"
              name="priorityId"
              id="high_priority"
              value="30"
              onChange={handlePriorityChange}
              checked={priorityId === 30}
            />
            <label htmlFor="high_priority">
            {intl.formatMessage({ id: "high" })}
            </label>
          </div>
          <div
            id="priority_color"
            style={{
              backgroundColor:
                priorityColor === "10"
                  ? "green"
                  : priorityColor === "20"
                  ? "yellow"
                  : priorityColor === "30"
                  ? "red"
                  : "transparent",
            }}
          ></div>
        </div>
        <label htmlFor="description-task" className="label-description-editProfile">
        {intl.formatMessage({ id: "priority" })}
         
        </label>
</div>
        <div className="buttons">
          <button className="btns_task" id="task_save" onClick={handlenewTask}>
            {editTask ? (
             intl.formatMessage({ id: "update" })
            ) : (
              intl.formatMessage({ id: "save" })
            )}
          </button>
          <button className="btns_task" id="task_cancel" onClick={onClose}>
          {intl.formatMessage({ id: "back" })}
          </button>
        </div>

        <div id="error_creating_task"></div>
      </div>
      {showDependencies && (
        <div className="dependencies_modal">
           <div className="modal-close-dependencies" onClick={handleCloseDependencies}>
          <IoIosCloseCircleOutline />
        </div>
          <h2 className= "dependencies-title">{intl.formatMessage({ id: "addDependys" })}</h2>
          <div className="dependencies_list">
            {availableTasks &&  availableTasks.map((task) => (
              <div key={task.id} className="task_item">
                <div className="checkbox">
                <input
                  type="checkbox"
                  id={task.id}
                  value={task.id}
                  onChange={(event) => {
                    const newPrerequisiteTasks = [...tasksIdList];
                    if (event.target.checked) {
                      newPrerequisiteTasks.push(task.id);
                    } else {
                      newPrerequisiteTasks.splice(
                        newPrerequisiteTasks.indexOf(task.id),
                        1
                      );
                    }
                    setTasksIdList(newPrerequisiteTasks);
                  }}
                />
                </div>
                <div className="task-title">
                <label htmlFor={task.id}>{task.title}</label>
                </div>
               
              </div>
            ))}
             <button className="btns_task" id="task_save" onClick={handleCloseDependencies}>
                  {intl.formatMessage ({id: "save"})}
                </button>
          </div>
          </div>
      )}
    </div>
  );

}
export default NewTask;
