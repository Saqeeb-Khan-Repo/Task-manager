import React from "react";

const SignUp = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      {" "}
      <div className="login">
        <h1>Register User</h1>
        <form onSubmit={handleSubmit}>
          <label>UserName:</label>
          <input type="text" placeholder="enter your UserName" />
          <label>Email:</label>
          <input type="email" placeholder="enter your Email" />
          <label>Password:</label>
          <input type="password" placeholder="enter your Password" />

          <button onClick={handleSubmit}>SignUp</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
