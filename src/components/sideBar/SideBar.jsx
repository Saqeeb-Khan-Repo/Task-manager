import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="SideBar">
      <nav>
        <ul>
          <li>
            <Link to="/task">Task</Link>
          </li>
          <li>
            <Link to="/createtask">Create Tasks</Link>
          </li>
          <li>
            <Link to="/CompletedTask">Completed Task</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
