import React from "react";
import { Chart } from "react-google-charts";

const Gantt = ({ availableTasks }) => {

  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  const rows = availableTasks ? availableTasks.map((task) => [
    task.id.toString(),
    task.title,
    '', // Resource
    new Date(task.startDate),
    new Date(task.deadline),
    null, // Duration
    0, // Percent Complete
    null // Dependencies
  ]) : [];

  const data = [columns, ...rows];

  const options = {
    height: availableTasks.length * 50,
    gantt: {
      trackHeight: 30,
      barColor: '#DA737B', // Custom color for the bars
      criticalPathEnabled: true,
      criticalPathStyle: {
        stroke: '#e64a19',
        strokeWidth: 5,
      },
    },
  };

  return (
    <Chart
      chartType="Gantt"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
};

export default Gantt;
