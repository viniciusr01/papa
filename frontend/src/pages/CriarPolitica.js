import React, { useState, useEffect } from 'react';
import Input from '../components/form/Input';
import SubmitButton from '../components/form/SubmitButton';
import styles from './CriarPolitica.module.css';
import MultipleSelect from 'react-select';
import Select from '../components/form/Select';


function CriarPolítica(){

    const projects = [
        {"value": 1, "label": "Monitoring"}, 
        {"value": 2, "label": "lemonade"}, 
        {"value": 3, "label": "lins"}, 
        {"value": 4, "label": "pipa"}
       ] 

       const groups = [
        {"id": 1, "name": "A01"}, 
        {"id": 2, "name": "A02"}, 
        {"id": 3, "name": "C01"}, 
        {"id": 4, "name": "D01"}
       ]

    const [selectedProjectsgitlab, setSelectedProjectsgitlab] = useState([]);
    const [projectsgitlab, setProjectsgitlab] = useState([]);
    const [groupsipa, setGroupsipa] = useState([]);
    const [selectedGroupipa, setSelectedGroupipa] = useState([]);
    const [policy, setPolicy] = useState([]);

    /*const projects = projectsgitlab?.map((project) => [
        {"label": `${project[0]}`, "value": `${project[0]}`}
    ])*/

    /*const groups = groupsipa?.map((group) => [
        {"id": `${group[0]}`, "value": `${group[1]}`}
    ])*/

    /*useEffect(() => {
        const responsegitlab =  fetch ('http://localhost:5000/gitlab/project', {method: 'GET'})
        .then(responsegitlab => responsegitlab.json()
        .then(data => setProjectsgitlab(data)));

        const responseipa =  fetch ('http://localhost:5000/ipa/getGroups', {method: 'GET'})
        .then(responseipa => responseipa.json()
        .then(data => setGroupsipa(data)));
      });*/

    function sendRequestForAddPolicy(policy){
        console.log(policy)
        
        
        fetch('http://localhost:5000/policy', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(policy),
        })
            .then( (resp) => resp.json())
            .then( (data) => { 
                console.log(data)
            })
            .catch((err)  => console.log(err))
        
    }

    const submit = (e) => {
        e.preventDefault()
       
        setPolicy({ ...policy, policyname: e.target.value, projectsgitlab: [selectedProjectsgitlab], groupipa: selectedGroupipa})
        sendRequestForAddPolicy(policy) 
        console.log(selectedProjectsgitlab, selectedGroupipa, "onsubmit")
    }

    function handleChange(e){
        setPolicy({ ...policy, policyname: e.target.value})
        console.log(policy, "handlechange")
    }

    function handleGroup(e){
        setPolicy({ ...policy, groupipa: { id: e.target.value, name: e.target.options[e.target.selectedIndex].text}})
    }

    const handleProjects = (item) => {
        setSelectedProjectsgitlab(item);
        console.log("handleproj", projectsgitlab);
        setPolicy({ ...policy, projectsgitlab: selectedProjectsgitlab})
    }

    
    return (

     
        <div className={styles.form_container}>
            
            <h1>Novo Grupo</h1>
            <p> Formulário para criação de novo grupo de usuários para acesso aos serviços do ambiente do GSI/MPMG</p>

            <form onSubmit={submit} className={styles.form}>    

                <Input type="text" 
                        text="Nome do grupo"
                        name="policyname"
                        placeholder=" Insira o nome do grupo"
                        handleOnChange={handleChange}
                />

                
                <h4>Selecione os projetos do Gitlab aos quais os usuários terão acesso</h4>
                        
                <MultipleSelect 
                name="projectsgitlab"
                onChange={handleProjects}
                isMulti options={projects}
                isClearable={true}
                isSearchable={true}
                isDisabled={false}
                isLoading={false}
                isRtl={false}/>
                

                <h4>Grupo do FreeIPA ao qual os usuários terão acesso.</h4>
                        
                <Select name="grupo_id" 
                        text="Selecione o grupo"
                        options={groups}
                        handleOnChange={handleGroup}
                        
                />

            <SubmitButton text="Criar grupo" />
            </form>

        </div>
      
    )
}

export default CriarPolítica;
