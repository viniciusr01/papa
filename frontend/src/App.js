import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import { isAuthenticated } from './services/Auth';
import Home from './pages/Home/Home';
import FormularioCadastro from './pages/FormCadastro/FormCadastro';
import Usuarios from './pages/Usuarios/Usuarios';
import Usuario from './pages/Usuario/Usuario';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer'
import GrupoPoliticas from './pages/GrupoPoliticas/GrupoPoliticas'
import GrupoPolitica  from './pages/GrupoPolitica/GrupoPolitica'
import CriarGrupo from './pages/CriarGrupo/CriarGrupo';
import SolicitaçãoCadastramento from './pages/SolicitaçãoCadastro/SolicitaçãoCadastramento';

const PrivateRoute = ({component: Component, ...rest}) => {
  const auth = isAuthenticated()

  return auth ? <Component /> : <Navigate to="/" />
}

function App() {
  return (

      <Router>
       <div className='AppContainer'>
        <Navbar />

        <Routes>
          <Route exact path="/" index element={<SolicitaçãoCadastramento/>} ></Route>
          <Route exact path='/home' element={<PrivateRoute/>}>
            <Route path="/home" index element={<Home/>} ></Route>
          </Route>
          <Route exact path='/cadastro' element={<PrivateRoute/>}>
            <Route path="cadastro" element={<FormularioCadastro/>}></Route>
          </Route>
          <Route exact path='/usuarios' element={<PrivateRoute/>}>
            <Route path="usuarios" element={<Usuarios/>}></Route>
          </Route>
          <Route exact path='/usuario/:username' element={<PrivateRoute/>}>
            <Route path="usuario/:username" element={<Usuario/>}></Route>
          </Route>
          <Route exact path='/politicas' element={<PrivateRoute/>}>
            <Route path="politicas" element={<GrupoPoliticas/>}></Route>
          </Route>
          <Route exact path='/politica/:policyID' element={<PrivateRoute/>}>
            <Route path="politica/:policyID" element={<GrupoPolitica/>}></Route>
          </Route>
          <Route exact path='/criargrupo' element={<PrivateRoute/>}>
            <Route path="criargrupo" element={<CriarGrupo/>}></Route>
          </Route>

        </Routes>

        <Footer />
      </div>
      </Router>
  );
}

export default App;
