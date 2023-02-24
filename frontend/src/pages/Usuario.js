import styles from './Usuario.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'


function Usuario(){

    const { username } = useParams()

    const [usuario, setUsuario] = useState([])

    useEffect(() => {
        
        fetch(`http://localhost:5000/user?username=${username}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
                setUsuario(data)
            })
            .catch((error)=> console.log(error))

    }, [])


    return (
        <div className={styles.usuario_container}>
            <p> <b>Nome completo:</b> {usuario[4]}</p>
            <p> <b>Username:</b> {usuario[0]}</p>
            <p> <b>Email:</b>  {usuario[5]}</p>

        </div>
    )
}

export default Usuario;