import styles from './Politicas.module.css'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react';

function Politicas(){

    const [policies, setPolicies] = useState();
  
    useEffect(() => {
      const response =  fetch ('http://localhost:5000/policy', {method: 'GET'})
      .then(response => response.json()
      .then(data => setPolicies(data)));
    });
  //<h4 className = {styles.Link} onClick={() => navigate('/infousuario')}>Informações sobre usuário</h4>

    const navigate = useNavigate();
  
      return (
        <div>
          <div className={styles.AreaBotao}>
            <button className={styles.btn} onClick={() => navigate('/criarpolitica')}>Criar nova política</button>
          </div>

          <div className={styles.Usuarios}>
            {policies?.map((policy) => 
                <div className={styles.Usuario}>
                  <h3>{policy[1]}</h3> 
                  <h5 className = {styles.Link} onClick={() => navigate('/politicaespecifica')}>
                Informações sobre política</h5>
              </div>)}
          </div>
        </div>
      )
  }


export default Politicas;
