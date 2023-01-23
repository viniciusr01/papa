import styles from './Footer.module.css'

function Footer(){
    return(
        <footer className={styles.footer}>
            <ul className={styles.list}> 
                <p>Protótipo PAPA</p>
            </ul>
        </footer>
    )
}

export default Footer