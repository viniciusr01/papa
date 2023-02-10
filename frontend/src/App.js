import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import FormularioCadastro from './pages/FormCadastro';
import Usuarios from './pages/Usuarios';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer'
import Grupos from './pages/Grupos';
import CriarGrupo from './pages/CriarGrupo';
import PermissoesGrupo from './pages/PermissoesGrupo';


function App() {
  return (
    <div>


      <Router>
       
        <Navbar />

        <Routes>
          <Route path="/" index element={<Home/>} ></Route>
          <Route path="cadastro" element={<FormularioCadastro/>}></Route>
          <Route path="usuarios" element={<Usuarios/>}></Route>
          <Route path="grupos" element={<Grupos/>}></Route>
          <Route path="criargrupo" element={<CriarGrupo/>}></Route>
          <Route path="permissoesgrupo" element={<PermissoesGrupo/>}></Route>

        </Routes>

        <Footer />

      </Router>
    </div>
  );
}

export default App;
