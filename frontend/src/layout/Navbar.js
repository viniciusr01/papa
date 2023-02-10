import {Link} from 'react-router-dom';
import styles from './Navbar.module.css'


function Navbar(){
    
    return (
    
    <nav className={styles.navbar}>     
        <h1 style={{color: 'white'}}>PAPA</h1>
    

    <ul className={styles.list}>
        <li className={styles.item}><Link to="/">Home</Link></li>
        <li className={styles.item}><Link to="/cadastro">Fomulário Cadastro</Link></li>
        <li className={styles.item}><Link to="/usuarios">Usuários</Link></li>
        <li className={styles.item}><Link to="/grupos">Grupos</Link></li>
    </ul>

    </ nav>

    )
}

export default Navbar