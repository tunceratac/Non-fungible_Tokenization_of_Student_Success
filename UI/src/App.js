import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import StudentInfo from './StudentInfo';
import CsvUpload from './CsvUploader';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app-container">
          <div className="login-page-container">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/upload" element={<CsvUpload />} />
            </Routes>
          </div>
          <StudentInfo />
        </div>
      </Router>
    );
  }
}

export default App;
