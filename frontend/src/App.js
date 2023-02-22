import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import FormularioCadastro from './pages/FormCadastro';
import Usuarios from './pages/Usuarios';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer'
import Politicas from './pages/Politicas';
import PermissoesGrupo from './pages/PermissoesGrupo';
import CriarPolítica from './pages/CriarPolitica';
import InfoUsuario from './pages/InfoUsuario';
import PoliticaEspecifica from './pages/PoliticaEspecifica';


function App() {
  return (

      <Router>
       <div className='AppContainer'>
        <Navbar />

        <Routes>
          <Route path="/" index element={<Home/>} ></Route>
          <Route path="cadastro" element={<FormularioCadastro/>}></Route>
          <Route path="usuarios" element={<Usuarios/>}></Route>
          <Route path="politicas" element={<Politicas/>}></Route>
          <Route path="criarpolitica" element={<CriarPolítica/>}></Route>
          <Route path="permissoesgrupo" element={<PermissoesGrupo/>}></Route>
          <Route path="infousuario" element={<InfoUsuario/>}></Route>
          <Route path="politicaespecifica" element={<PoliticaEspecifica/>}></Route>

        </Routes>

        <Footer />
      </div>
      </Router>
  );
}

export default App;
