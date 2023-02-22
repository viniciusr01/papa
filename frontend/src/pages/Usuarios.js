import styles from './Usuarios.module.css'
import { Navigate, useNavigate } from 'react-router-dom'  
import React, { useState, useEffect, useReducer } from 'react';



function Usuarios(){
  const [users, setUsers] = useState();

  useEffect(() => {
    const response =  fetch ('http://localhost:5000/user', {method: 'GET'})
    .then(response => response.json()
    .then(data => setUsers(data)));
  });
  
  const navigate = useNavigate();

    return (
      <div className={styles.Usuarios}>
        {users?.map((user) => 
            <div className={styles.Usuario}>
              <h3>{user[0]}</h3> 
              <h5 className = {styles.Link} onClick={() => navigate('/infousuario')}>
                Informações sobre usuário</h5>
          </div>)}
      </div>
    )
}

export default Usuarios;