// CompletedTask.jsx
import "./main-Task/Task.css";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_URL = "https://task-backend-sgnw.onrender.com/tasks/completed";

const CompletedTask = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [error, setError] = useState("");

  // =============================
  // FETCH COMPLETED TASKS
  // =============================
  useEffect(() => {
    let isMounted = true;

    const fetchCompletedTasks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/tasks/completed`);

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        // extra safety filter
        const completedOnly = data.filter((task) => task?.isCompleted === true);

        if (isMounted) {
          setCompletedTasks(completedOnly);
        }
      } catch (err) {
        console.error("Failed to fetch completed tasks:", err);
        if (isMounted) {
          setError("Failed to load completed tasks.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCompletedTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  // =============================
  // FILTER TASKS (MEMOIZED)
  // =============================
  const filteredTasks = useMemo(() => {
    return completedTasks.filter((task) => {
      const title = task?.taskName?.toLowerCase() || "";
      const description = task?.taskDescription?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchTerm.toLowerCase()) ||
        description.includes(searchTerm.toLowerCase());

      const matchesPriority =
        priorityFilter === "all" ||
        task?.priority?.toLowerCase() === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [completedTasks, searchTerm, priorityFilter]);

  // =============================
  // LOADING STATE
  // =============================
  if (loading) {
    return (
      <div className="task">
        <div className="task-container">
          <p>Loading completed tasks...</p>
        </div>
      </div>
    );
  }

  // =============================
  // ERROR STATE
  // =============================
  if (error) {
    return (
      <div className="task">
        <div className="task-container">
          <p className="task-error">{error}</p>
        </div>
      </div>
    );
  }

  // =============================
  // UI
  // =============================
  return (
    <div className="task">
      <div className="task-container">
        {/* Header */}
        <div className="task-header-section">
          <h2 className="task-header">Completed Tasks</h2>
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
          <div className="items-grid">
            {filteredTasks.map((item) => (
              <div key={item._id} className="item completed">
                <div className="task-header-content">
                  <div>
                    <h3 className="task-title completed">{item.taskName}</h3>
                    {item.taskDescription && (
                      <p className="task-subtitle">{item.taskDescription}</p>
                    )}
                  </div>

                  <span
                    className={`priority-badge priority-${item.priority?.toLowerCase()}`}
                  >
                    {item.priority}
                  </span>

                  <input
                    type="checkbox"
                    className="checkbox"
                    checked
                    disabled
                  />
                </div>

                <div className="task-footer">
                  <span className="task-date">
                    ✅ Completed on:{" "}
                    {new Date(
                      item.updatedAt || item.completedAt || Date.now()
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
