import logo from './logo.svg';
import './App.css';
import Form from './components/Form';
import Nav from './components/Nav';
import Data from './components/Data';
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditButton from './components/EditButton';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/form' element={<Form />} />
        <Route path='/data' element={<Data />} />
        <Route path='/edit' element={<EditButton />} />
        
      </Routes> 
    </Router>
  );
}

export default App;
