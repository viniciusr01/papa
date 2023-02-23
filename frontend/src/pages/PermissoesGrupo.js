import styles from './InfoUsuario.module.css'
import React, { useState, useEffect } from 'react';
import MultipleSelect from 'react-select'
import SubmitButton from '../components/form/SubmitButton';

function PermissoesGrupo(){
    const [users, setUsers] = useState([]);
    const [usernames, setUsernames] = useState([]);
    const [policyid, setPolicyID] = useState();
    const [data, setData] = useState([]);


    function getUsers(){
        const response =  fetch ('http://localhost:5000/user', {method: 'GET'})
        .then(response => response.json()
        .then(data => setUsers(data)));
    }
    

    function sendRequestForAddUserstoPolicy(data){
        console.log(data)
        
        
        fetch('http://localhost:5000/user/policy', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then( (resp) => resp.json())
            .then( (data) => { 
                console.log(data)
            })
            .catch((err)  => console.log(err))
        
    }

    const submit = (e) => {
        e.preventDefault()
       
        setUsers({ ...data, usernames: usernames, policyid: policyid})
        sendRequestForAddUserstoPolicy(data) 
        console.log(users, policyid, "onsubmit")
    }

    function handleUserOptions(e){
        console.log("handlUsers", usernames);
        this.setData({ ...data, usernames: usernames});
    }

  /*users?.map((user) => {
            const useroptions.label= {user[0]};
  })*/

    return (      

        <form onSubmit={submit} className={styles.form}>

            <h1>Adicionar usuários ao grupo/política</h1>
            <p> Formulário para selecionar os usuários que terão acesso a este grupo</p>
                
                    <MultipleSelect
                    className={styles.form_control}
                    name="usernames"
                    onChange={this.handleUserOptions}
                    isMulti 
                    isClearable={true}
                    isSearchable={true}
                    isDisabled={false}
                    isLoading={false}
                    isRtl={false}>
                    {users.map((user) => ( 
                        <option>{user.username}</option>

))}                    </MultipleSelect>


                    <SubmitButton text="Adicionar usuários" />

        </form>
    )}

export default PermissoesGrupo;
