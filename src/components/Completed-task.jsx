// CompletedTask.jsx
import "./main-Task/Task.css"; // reusing same styles
// import { useTasks } from "../store/Context";
import { useState, useEffect } from "react";
import axios from "axios";

const CompletedTask = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);

  // Fetch ALL tasks and filter completed ones locally
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://task-backend-sgnw.onrender.com/tasks/completed"
        );
        // Filter only completed tasks
        const completedOnly = response.data.filter(
          (task) => task.isCompleted === true
        );
        setCompletedTasks(completedOnly);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch completed tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter completed tasks based on search and priority
  const filteredTasks = completedTasks.filter((task) => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesPriority =
      priorityFilter === "all" ||
      task.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return (
      <div className="task">
        <div className="task-container">
          <p>Loading completed tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task">
      <div className="task-container">
        {/* Header Section */}
        <div className="task-header-section">
          <h2 className="task-header text-center">Completed Tasks✅</h2>
          <span className="task-count">
            {filteredTasks.length} of {completedTasks.length} completed
          </span>
        </div>

        {/* Filters */}
        <div className="task-filters">
          <input
            type="text"
            className="task-search"
            placeholder="Search completed tasks..."
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

        {/* Empty State */}
        {filteredTasks.length === 0 ? (
          <p className="task-empty">
            {completedTasks.length === 0
              ? "No completed tasks yet. Complete some tasks first!"
              : "No completed tasks match your filters."}
          </p>
        ) : (
          /* Grid - show as completed */
          <div className="items-grid">
            {filteredTasks.map((item) => (
              <div key={item._id || item.id} className="item completed">
                <div className="task-header-content">
                  <div>
                    <h3 className="task-title completed ">{item.taskName}</h3>
                    <p className="task-subtitle">{item.taskDescription}</p>
                  </div>
                  <span
                    className={`priority-badge priority-${item.priority.toLowerCase()}`}
                  >
                    {item.priority}
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={true}
                    disabled // can't uncheck completed tasks here
                  />
                </div>

                <div className="task-footer">
                  <span className="task-date">
                    ✅ Completed on:{" "}
                    {new Date(
                      item.updatedAt || item.dueDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTask;
