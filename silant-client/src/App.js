import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Machines from './components/Machines';
import Maintenances from './components/Maintenances';
import Reclamations from './components/Reclamations';
import AddClient from './components/AddClient';
import SearchMachine from './components/SearchMachine';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/home" element={<HomePage />} /> */}
          <Route path="/machines" element={<Machines />} />
          <Route path="/maintenances" element={<Maintenances />} />
          <Route path="/reclamations" element={<Reclamations />} />
          <Route path="/add-client" element={<AddClient />} />
          <Route path="/search-machine" element={<SearchMachine />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Login from './components/Login';
// import HomePage from './components/HomePage';
// import Machines from './components/Machines';
// import Maintenances from './components/Maintenances';
// import Reclamations from './components/Reclamations';
// import AddClient from './components/AddClient';
// import SearchMachine from './components/SearchMachine';
// import Dashboard from './components/Dashboard';
// import { AuthProvider } from './contexts/AuthContext';

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/machines" element={<Machines />} />
//           <Route path="/maintenances" element={<Maintenances />} />
//           <Route path="/reclamations" element={<Reclamations />} />
//           <Route path="/add-client" element={<AddClient />} />
//           <Route path="/search-machine" element={<SearchMachine />} />
//           <Route path="/dashboard" element={<Dashboard />} />
          
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;