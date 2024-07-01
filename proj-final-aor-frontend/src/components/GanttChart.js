import React from "react";
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const GanttComponent = ({ availableTasks }) => {
  
  // Verifique os dados de entrada
  console.log(availableTasks);

  // Mapeie os dados de availableTasks para o formato esperado pela biblioteca gantt-task-react
  let tasks = availableTasks && availableTasks.filter(task => task.startDate).map(task => ({
    id: task.id.toString(),          // ID da tarefa
    name: task.title,                // Nome da tarefa
    start: new Date(task.startDate), // Data de início da tarefa
    end: new Date(task.deadline),    // Data de término da tarefa
    progress: 0,                     // Progresso da tarefa (0 a 100)
   
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
  }));

  const view = new ViewMode({ timeStep: 1, scale: 1, primaryHeader: true, secondaryHeader: true });

  const onTaskChange = (taskId, newStart, newEnd) => {
    console.log(`Task ${taskId} changed from ${newStart} to ${newEnd}`);
  };
  const onTaskDelete = (taskId) => {
    console.log(`Task ${taskId} deleted`);
  };
  const onProgressChange = (taskId, newProgress) => {
    console.log(`Task ${taskId} progress changed to ${newProgress}`);
  };
  const onDblClick = (taskId) => {
    console.log(`Task ${taskId} double-clicked`);
  };
  const onClick = (taskId) => {
    console.log(`Task ${taskId} clicked`);
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Gantt
        tasks={tasks || []}
          viewMode={view}
  onDateChange={onTaskChange}
  onTaskDelete={onTaskDelete}
  onProgressChange={onProgressChange}
  onDoubleClick={onDblClick}
  onClick={onClick}
         
       
      />
    </div>
  );
};

export default GanttComponent;
