// Task.jsx – Optimized & Production Ready
import "./Task.css";
import { useTasks } from "../../store/Context";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Task = () => {
  const { tasks, setTasks } = useTasks();

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [togglingTasks, setTogglingTasks] = useState(new Set());
  const [showCompleted, setShowCompleted] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  /* =============================
     FETCH TASKS
  ============================== */
  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/tasks`);
        if (isMounted) setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTasks();
    return () => {
      isMounted = false;
    };
  }, [setTasks]);

  /* =============================
     AUTO-HIDE POPUPS
  ============================== */
  useEffect(() => {
    if (!showCompleted && !showDeleted) return;

    const timer = setTimeout(() => {
      setShowCompleted(false);
      setShowDeleted(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showCompleted, showDeleted]);

  /* =============================
     TOGGLE TASK COMPLETION
  ============================== */
  const toggleTask = async (id, isCompleted) => {
    setTogglingTasks((prev) => new Set(prev).add(id));

    try {
      const { data } = await axios.put(`${API_URL}/tasks/${id}/toggle`, {
        isCompleted: !isCompleted,
      });

      setTasks((prev) => prev.map((task) => (task._id === id ? data : task)));

      if (!isCompleted) setShowCompleted(true);
    } catch (err) {
      console.error("Failed to toggle task:", err);
    } finally {
      setTogglingTasks((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };

  /* =============================
     DELETE TASK
  ============================== */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setShowDeleted(true);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* =============================
     FILTER TASKS (MEMOIZED)
  ============================== */
  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task?.isCompleted),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    return pendingTasks.filter((task) => {
      const title = task?.taskName?.toLowerCase() || "";
      const desc = task?.taskDescription?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchTerm.toLowerCase()) ||
        desc.includes(searchTerm.toLowerCase());

      const matchesPriority =
        priorityFilter === "all" ||
        task?.priority?.toLowerCase() === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [pendingTasks, searchTerm, priorityFilter]);

  /* =============================
     LOADING STATE
  ============================== */
  if (loading) {
    return (
      <div className="task">
        <div className="task-container">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  /* =============================
     UI
  ============================== */
  return (
    <>
      {/* Popups */}
      {showCompleted && <div className="popUp">Task completed ✅</div>}
      {showDeleted && <div className="popUp">Task deleted 🗑️</div>}

      <div className="task">
        <div className="task-container">
          {/* Header */}
          <div className="task-header-section">
            <h2 className="task-header">Your Tasks</h2>
            <span className="task-count">
              {filteredTasks.length} of {pendingTasks.length} pending
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

          {/* Empty / List */}
          {filteredTasks.length === 0 ? (
            <p className="task-empty">
              {pendingTasks.length === 0
                ? "No pending tasks 🎉"
                : "No tasks match your filters"}
            </p>
          ) : (
            <div className="items-grid">
              {filteredTasks.map((item) => {
                const id = item._id;
                const isSaving = togglingTasks.has(id);

                return (
                  <div key={id} className="item">
                    <div className="task-header-content">
                      <div>
                        <h3 className="task-title">{item.taskName}</h3>
                        {item.taskDescription && (
                          <p className="task-subtitle">
                            {item.taskDescription}
                          </p>
                        )}
                      </div>

                      <span
                        className={`priority-badge priority-${item.priority.toLowerCase()}`}
                      >
                        {item.priority}
                      </span>
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
                          disabled={isSaving}
                          onClick={() => toggleTask(id, item.isCompleted)}
                        >
                          {isSaving ? "Saving…" : "Complete"}
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
