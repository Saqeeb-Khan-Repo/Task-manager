import Header from "./components/header/Header";
import SideBar from "./components/sideBar/SideBar";
import { Route, Routes, HashRouter as Router } from "react-router-dom";
import Home from "./components/pages/Home";
import { lazy, Suspense } from "react";
import { Loading } from "./Loading";

const App = () => {
  const Login = lazy(() => import("./components/pages/Login"));
  const SignUp = lazy(() => import("./components/pages/SignUp"));
  const Task = lazy(() => import("./components/main-Task/Task"));
  const CreateTask = lazy(() => import("./components/CreateTask/CreateTask"));
  const CompletedTask = lazy(() => import("./components/Completed-task"));
  return (
    <>
      <div className="App">
        <Router>
          <Header />
          <SideBar />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/task" element={<Task />} />
              <Route path="/createtask" element={<CreateTask />} />
              <Route path="/completed-task" element={<CompletedTask />} />
              <Route path="/login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </>
  );
};

export default App;
