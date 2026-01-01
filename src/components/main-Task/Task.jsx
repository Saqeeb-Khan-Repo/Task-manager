// Task.jsx - Complete Fixed Version
import "./Task.css";
import { useTasks } from "../../store/Context";
import { useState, useEffect } from "react";
import axios from "axios";
const Task = () => {
  const { tasks, setTasks } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [togglingTasks, setTogglingTasks] = useState(new Set());
  const [showCompleted, setShowCompleted] = useState(false);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://task-backend-sgnw.onrender.com/tasks"
        );
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setLoading(false);
      }
    };
    fetchTasks();
  }, [setTasks]);

  // Auto-hide "Task Completed" popup
  useEffect(() => {
    if (!showCompleted) return;

    const timeoutId = setTimeout(() => {
      setShowCompleted(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [showCompleted]);

  // Toggle completion
  const toggleTask = async (taskId, currentCompleted) => {
    setTogglingTasks((prev) => new Set([...prev, taskId]));
    try {
      const response = await axios.put(
        `https://task-backend-sgnw.onrender.com/tasks/${taskId}/toggle`,
        { isCompleted: !currentCompleted }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? response.data : task))
      );

      // Show popup only when marking as completed
      if (!currentCompleted) {
        setShowCompleted(true);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setTogglingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  // ✅ FIXED: Delete handler with correct endpoint
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://task-backend-sgnw.onrender.com/tasks/${id}`); // ✅ Fixed endpoint
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      console.log(`Deleted task: ${id}`);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Pending + filtered tasks (only shows pending due to filter)
  const pendingTasks = tasks.filter((task) => !task.isCompleted);
  const filteredTasks = pendingTasks.filter((task) => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskDescription?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      priorityFilter === "all" ||
      task.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return (
      <div className="task">
        <div className="task-container">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success popup */}
      {showCompleted && <div className="popup">Task Completed ✅</div>}

      <div className="task">
        <div className="task-container">
          {/* Header */}
          <div className="task-header-section">
            <h2 className="task-header">Your Tasks</h2>
            <span className="task-count">
              {filteredTasks.length} of {pendingTasks.length} pending tasks
            </span>
          </div>

          {/* Filters */}
          <div className="task-filters">
            <input
              type="text"
              className="task-search"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="task-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Empty state or list */}
          {filteredTasks.length === 0 ? (
            <p className="task-empty">
              {pendingTasks.length === 0
                ? "No pending tasks! 🎉 Check completed tasks."
                : "No pending tasks match your filters."}
            </p>
          ) : (
            <div className="items-grid">
              {filteredTasks.map((item) => {
                const id = item._id || item.id;
                const isSaving = togglingTasks.has(id);

                return (
                  <div key={id} className="item">
                    <div className="task-header-content">
                      <div className="task-info">
                        <h3 className="task-title">{item.taskName}</h3>
                        <p className="task-subtitle">{item.taskDescription}</p>
                      </div>

                      <div className="task-actions">
                        <span
                          className={`priority-badge priority-${item.priority.toLowerCase()}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                    </div>

                    <div className="task-footer">
                      <span className="task-date">
                        📅 Due: {new Date(item.dueDate).toLocaleDateString()}
                      </span>
                      <div className="task-actions-footer">
                        <button
                          className={`complete-btn ${
                            isSaving ? "loading" : ""
                          }`}
                          onClick={() =>
                            toggleTask(id, item.isCompleted || false)
                          }
                          disabled={isSaving}
                        >
                          {isSaving ? "⏳ Saving..." : "Complete"}
                        </button>
                        <button
                          className="delete"
                          onClick={() => handleDelete(id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Task;
