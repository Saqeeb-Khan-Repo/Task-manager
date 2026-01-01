// CreateTask.jsx
import "./CreateTask.css";
import { useState } from "react";
import { useTasks } from "../../store/Context";
import axios from "axios";
// import Swal from "sweetalert2";

const CreateTask = () => {
  const { addTask } = useTasks(); // keep for local state sync
  const [showAlert, setShowAlert] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium"); // lowercase for backend
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setDueDate("");
    setPriority("medium");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName.trim() || !dueDate.trim()) {
      setError("Task name and due date are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send to backend API
      // In CreateTask.jsx handleSubmit
      const response = await axios.post(
        "https://task-backend-sgnw.onrender.com/create",
        {
          taskName: taskName.trim(),
          taskDescription: taskDescription.trim(),
          dueDate,
          priority: priority.toLowerCase(),
          isCompleted: false, // ✅
        }
      );

      // Add returned task to local state (sync with backend)
      addTask(response.data);
      console.log(response.data);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task");
    } finally {
      setLoading(false);
    }
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);

    // Swal.fire({
    //   title: "Task created",
    //   text: "your task has been added successfully",
    //   icon: "success",

    // });
  };

  return (
    <>
      {showAlert && <div className="popUp">Task Added successfully</div>}
      <div className="create-task-container">
        <h2>Create New Task</h2>

        {error && <p className="form-error">{error}</p>}

        <form className="create-task-form" onSubmit={handleSubmit}>
          <label htmlFor="taskName">Task Name:</label>
          <input
            id="taskName"
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter your task name"
            required
            disabled={loading}
          />

          <label htmlFor="taskDescription">Task Description:</label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            disabled={loading}
          />

          <label htmlFor="dueDate">Due Date:</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            disabled={loading}
          />

          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateTask;
