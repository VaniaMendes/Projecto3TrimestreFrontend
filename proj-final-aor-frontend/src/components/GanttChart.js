import React, { useEffect, useState } from "react";
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const GanttComponent = ({ availableTasks, showList, viewMode }) => {
  const [tasksList, setTasksList] = useState(availableTasks);

  useEffect(() => {
    setTasksList(availableTasks); // Update local tasks when availableTasks changes
  }, [availableTasks]);

  let tasks = [];
  try {
    tasks = tasksList
      .filter(task => task.startDate && task.deadline) // Check for startDate and deadline
      .map(task => {
        let start, end;

        try {
          start = new Date(task.startDate);
          end = new Date(task.deadline);
        } catch (error) {
          console.error("Invalid date format for task:", task);
          return null; // Skip this task if dates are invalid
        }

        // Check if the date objects are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.error("Invalid date for task:", task);
          return null; // Skip this task if date conversion failed
        }

        return {
          id: task.id?.toString() || '',
          name: task.title || 'Untitled Task',
          start: start,
          end: end,
          dependencies: task.dependencies ? task.dependencies.map(dep => dep.id.toString()) : [],
          isDisabled: true,
          styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' }
        };
      })
      .filter(task => task !== null); // Filter out null tasks
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
