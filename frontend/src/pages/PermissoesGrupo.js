import React, { useState } from 'react'
import Select from '../components/form/Select';
import SubmitButton from '../components/form/SubmitButton';
import styles from './PermissoesGrupo.module.css'

function PermissoesGrupo(project){
    
    const permissions = [
        {"id": 1, "name": "Ler"}, 
        {"id": 2, "name": "Escrever"}, 
        {"id": 3, "name": "Realizar commit"}, 
        {"id": 4, "name": "Subir modificações para a main"}
       ]
    
    return (

     
        <div className={styles.form_container}>
            
            <h1>Serviços e Permissões</h1>
            <p> `${project.name}`possui as seguintes permissões:</p>

            <form  className={styles.form}>    
            <Select name="grupo_id" 
                        text="Gitlab"
                        options={permissions}
                        
                />
            
            <SubmitButton text="Editar" />
         

            </form>

        </div>
      
    )
}

export default PermissoesGrupo;
