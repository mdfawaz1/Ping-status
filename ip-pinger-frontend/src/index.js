// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import PingUI from './PingUI';

// const container = document.getElementById('root');
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <PingUI />
//   </React.StrictMode>
// );


import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import PingUI from './PingUI';
import ImageDropZone from './components/ImageDropZone';

const App = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li><Link to="/">Ping UI</Link></li>
          <li><Link to="/image-dropzone">Image Drop Zone</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<PingUI />} />
        <Route path="/image-dropzone" element={<ImageDropZone />} />
      </Routes>
    </div>
  </Router>
);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
