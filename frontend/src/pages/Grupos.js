import styles from './Grupos.module.css'
import { useNavigate } from 'react-router-dom'

function Grupos(){

    const history = useNavigate()
    
    return (

    <div className={styles.Body}>

        <div className={styles.AreaBotao}>
            <button 
            className={styles.btn}
            onClick={() => history("/criargrupo")}>
            <h4>Criar novo grupo</h4></button>
       </div>

       <h3> Grupos existentes:</h3>

        <div className={styles.ListaGrupos}>
            
        
        <div className={styles.ContainerGrupo}>
                <div className={styles.Grupo}>
                    <h3>Nome do Grupo</h3>
                    <h4 className = {styles.Link} onClick={() => history("/permissoesgrupo")}>Serviços e Permissões</h4>
                </div>

                <div className={styles.Grupo}>
                    <h3>A02</h3>
                    <h4 className = {styles.Link} onClick={() => history("/permissoesgrupo")}>Serviços e Permissões</h4>
                </div>

                <div className={styles.Grupo}>
                    <h3>A01</h3>
                    <h4 className = {styles.Link} onClick={() => history("/permissoesgrupo")}>Serviços e Permissões</h4>
                </div>

                <div className={styles.Grupo}>
                    <h3>Policia</h3>
                    <h4 className = {styles.Link} onClick={() => history("/permissoesgrupo")}>Serviços e Permissões</h4>
                </div>
        </div>
       
    </div>
    </div>
    )
}

export default Grupos;
