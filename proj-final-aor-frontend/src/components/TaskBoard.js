import React, { useState } from "react";
import { IntlProvider, useIntl } from "react-intl";
import { userStore } from "../stores/UserStore";
import languages from "../translations";
import Task from "./Task";
import { useParams } from "react-router";

import {updateTaskStatus, softDeleteTask} from "../services/TaskService";



const TaskBoard = ({listTasks})=>{
    const {locale, token} = userStore();
    const [taskId, setTaskId] = useState("");
    const {projectId} = useParams();

    const intl = useIntl();

    const [tasks, setTasks] = useState(listTasks);

      
     //Listas de tarefas classificadas pelo estado(state)
  const todoList = tasks.filter((tasks) => tasks.stateId === 10);

const doingList = tasks.filter((tasks) => tasks.stateId === 20);
const doneList = tasks.filter((tasks) => tasks.stateId === 30);

//Manipulação de eventos de arrastar e soltar
const handleDragStart = (event, taskId) => {
    event.dataTransfer.setData("taskId", taskId);
    setTaskId(taskId);
  };

  //Função para manipular o evento de soltar uma tarefa
  const handleDrop = async (event, token, taskId, newState) => {
    event.preventDefault();

    try {
      // Atualiza o estado da tarefa no servidor
     await updateTaskStatus(token, projectId, taskId, newState);
    
    // Atualiza localmente a lista de tarefas
    setTasks(tasks.map((task) => {
        if (task.id === parseInt(taskId)) {
          return { ...task, stateId: newState };
        }
        return task;
      }));
      setTaskId("");
    } catch (error) {
      console.error("Failed to update task state:", error);
    }
   
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Deleta a tarefa no servidor
      const result = await softDeleteTask(token, projectId, taskId);
      if(result === 200){
      // Atualiza localmente a lista de tarefas
      setTasks(tasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
}
const handleEdit = async (taskId) =>{
    
}

    return(
        <div className = "scrumForPhone">
    
      <IntlProvider locale={locale} messages={languages[locale]}>
        <div className="board-container" >
          <div className="column">
            <div className="title">{intl.formatMessage({ id: "planned" })}</div>
            <section
              className="task_list"
              id="toDo"
              onDrop={(event) => handleDrop(event, token, taskId, 10)}
              onDragOver={allowDrop}
            >
              {todoList.map((task) => (
               <Task
               key={task.id}
               task={task}
               handleEdit={handleEdit}
            
               handleDeleteTask={handleDeleteTask}
               handleDragStart={handleDragStart}
               //handleTaskDoubleClick={handleTaskDoubleClick}
             />
              ))}
            </section>
            
            
          </div>
          <div
            className="column"
            onDrop={(event) => handleDrop(event, token, taskId, 20)}
            onDragOver={allowDrop}
          >
            <div className="title">{intl.formatMessage({ id: "inProgress" })}</div>
            <section className="task_list" id="doing">
              {doingList.map((task) => (
                <Task
                key={task.id}
                task={task}
                handleEdit={handleEdit}
                token={token}
                handleDragStart={handleDragStart}
                handleDeleteTask={handleDeleteTask}
                //handleTaskDoubleClick={handleTaskDoubleClick}
              />
              ))}
            </section>
          </div>
          <div
            className="column"
            onDrop={(event) => handleDrop(event, token, taskId, 30)}
            onDragOver={allowDrop}
          >
            <div className="title">{intl.formatMessage({ id: "finished" })}</div>
            <section className="task_list" id="done">
              {doneList.map((task) => (
                 <Task
                 key={task.id}
                 task={task}
                 
                 handleEdit={handleEdit}
               
                 handleDragStart={handleDragStart}
                 handleDeleteTask={handleDeleteTask}
                 //handleTaskDoubleClick={handleTaskDoubleClick}
               />
              ))}
            </section>
          </div>
        </div>
      </IntlProvider>
    </div>

    )
}

export default TaskBoard;