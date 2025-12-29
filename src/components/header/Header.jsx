import "./Header.css";

import { Link } from "react-router-dom";
// import { CgProfile } from "react-icons/cg";

const Header = () => {
  return (
    <div className="Header">
      <h1 className="head">
        <Link to="/">TASK FLOW</Link>
      </h1>
      {/* <div className="log-container">
        <p className="login-link">
          <Link to="/login">
            <CgProfile />
          </Link>
        </p>
      </div> */}
    </div>
  );
};

export default Header;
