import {useState} from 'react'
import { useNavigate } from 'react-router-dom'


import Input from '../components/form/Input';
import Select from '../components/form/Select';
import SubmitButton from '../components/form/SubmitButton';
import styles from './FormCadastro.module.css'

function FormularioCadastro(){

    
    const groups = [
              {"id": 1, "name": "A01"}, 
              {"id": 2, "name": "A02"}, 
              {"id": 3, "name": "C01"}, 
              {"id": 4, "name": "D01"}
             ]
    
    const history = useNavigate()

    
    const [user, SetUser] = useState()

    function sendRequestForAddUser(user){
        
        console.log(user)
        
        
        fetch('http://localhost:5000/user', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
            .then( (resp) => resp.json())
            .then( (data) => { 
                console.log(data)
                history('/cadastro', { message: 'Solicitação enviada com sucesso!' })
            })
            .catch((err)  => console.log(err))
        
    }

    
    const submit = (e) => {
        e.preventDefault()
        sendRequestForAddUser(user)
    }
   

   
    function handleChange(e){
        SetUser({ ...user, [e.target.name]: e.target.value})
        console.log(user)
    }

    function handleGroup(e){
        SetUser({ ...user, group: { id: e.target.value, name: e.target.options[e.target.selectedIndex].text}})
        console.log(user)
    }
 
    
    
    return (

     
        <div className={styles.form_container}>
            
            <h1>Solicitação de acesso</h1>
            <p> Formulário para solicitar criação de usuário para acesso ao ambiente do GSI/MPMG</p>

            <form onSubmit={submit} className={styles.form}>    

                <Input type="text" 
                        text="Primeiro nome"
                        name="firstName"
                        placeholder=" Insira seu primeiro nome"
                        handleOnChange={handleChange}
                />

                <Input type="text" 
                        text="Sobrenome"
                        name="lastName"
                        placeholder="Insira seu sobrenome"
                        handleOnChange={handleChange}
                />

                <Input type="text" 
                        text="Email"
                        name="email"
                        placeholder="Insira seu email"
                        handleOnChange={handleChange}
                />

                <Input type="text" 
                        text="Username"
                        name="username"
                        placeholder="Insira um username"
                        handleOnChange={handleChange}
                />

                <Select name="grupo_id" 
                        text="Selecione o grupo"
                        options={groups}
                        handleOnChange={handleGroup}
                        
                />

                <SubmitButton text="Enviar solicitação" />
            </form>

        </div>
      
    )
}

export default FormularioCadastro;
