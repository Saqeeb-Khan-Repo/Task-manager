import { useState } from "react";
import { Link } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = () => {
    if (!email && !password) return;
    alert(`Login Successful ${email} + ${password} `);
  };
  return (
    <div className="login">
      <h1>Login to Continue</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          placeholder="enter your Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="enter your Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Login</button>
      </form>
      <br />
      <p className="login-link">
        <em>New User Register..</em>

        <Link to="/SignUp">SignUp</Link>
      </p>
    </div>
  );
};

export default Login;
