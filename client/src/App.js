import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage"
import LoginPage from "./components/views/LoginPage/LoginPage"
import RegisterPage from "./components/views/RegisterPage/RegisterPage"

/* 경로 설정해 줄 때 element 말고 components 사용해도 될 듯 */
function App() {
  return ( 
    <Router> 
      <div>
        <Routes> 
          <Route exact path="/" element={<LandingPage />} /> 
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;