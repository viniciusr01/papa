import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom'


function Home(){

    const history = useNavigate()

    return (
        <div className={styles.Body}>
           <div className={styles.Container}>
                    <button className={styles.btn} onClick={() => history("/criargrupo")}><h1>Criar grupo de usuários</h1></button>
                </div>

                <div className={styles.Container}>
                    <button className={styles.btn} onClick={() => history("/cadastro")}><h1>Cadastrar novo usuário</h1></button>
                </div>

                <div className={styles.Container}>
                    <button className={styles.btn} onClick={() => history("/criargrupo")}><h1>Adicionar usuários a um grupo</h1></button>
                </div>

                <div className={styles.Container}>
                    <button className={styles.btn} onClick={() => history("/grupos")}><h1>Visualizar grupos vigentes</h1></button>
                </div>
        </div>
    )
}

export default Home;