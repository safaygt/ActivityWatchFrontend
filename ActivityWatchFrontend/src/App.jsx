import React from 'react';
import Dashboard from './pages/dashboard';
import './assets/css/app.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (

    <div className='app'>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<><Dashboard /></>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
