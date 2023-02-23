import styles from './InfoUsuario.module.css'
import React, { useState, useEffect } from 'react';
import MultipleSelect from 'react-select'
import SubmitButton from '../components/form/SubmitButton';


function InfoUsuario({username}) {
    const [user, setUser] = useState();

    useEffect(() => {
      const response =  fetch (`http://localhost:5000/user/user?username=${username}`, {method: 'GET'})
      .then(response => response.json()
      .then(data => setUser(data)));
    });
    
  
      return (
        <div className={styles.Usuarios}>
          {user?.map((user) => 
              <div className={styles.Usuario}>
                <h3>Username: {user[0]}</h3> 
                <h3>Email: {user[5]}</h3> 
                <h3>Data de criação do usuário: {user[9]}</h3> 
            </div>)}
        </div>
      )
  }
export default InfoUsuario;