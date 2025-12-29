// TaskContext.jsx
import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => setTasks((prev) => [...prev, task]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTask }}>
      {" "}
      {/* Added setTasks */}
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
};
