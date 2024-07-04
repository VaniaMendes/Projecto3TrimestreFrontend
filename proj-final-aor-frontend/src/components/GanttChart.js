import React, {useEffect, useState} from "react";
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";


const GanttComponent = ({ availableTasks, showList, viewMode }) => {

  const [tasksList, setTasksList]= useState(availableTasks);
  
  useEffect(() => {
    setTasksList(availableTasks); // Atualiza localmente as tarefas quando listTasks (availableTasks) mudar
}, [availableTasks]);



let tasks = [];
  try {
    tasks = tasksList
      .filter(task => task.startDate && task.deadline) // Existing check for startDate and deadline
      .map(task => {
        return {
          id: task.id?.toString() || '',
          name: task.title || 'Untitled Task',
          start: new Date(task.startDate), // Convert to Date object
          end: new Date(task.deadline), // Convert to Date object
          dependencies: task.dependencies ? task.dependencies.map(dep => dep.id.toString()) : [],
          isDisabled: true,
          styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
        };
      })
      .filter(task => task !== null);
  } catch (error) {
    console.error("Error mapping tasks:", error);
  }


  const view = ViewMode[viewMode] || ViewMode.Week;



  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Gantt
            tasks={tasks}
            viewMode={view} 
            listCellWidth={showList ? undefined : ''}   
                 
        />
       
    </div>
);
};

export default GanttComponent;
