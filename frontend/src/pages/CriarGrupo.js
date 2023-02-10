import Input from '../components/form/Input';
import Select from '../components/form/Select';
import SubmitButton from '../components/form/SubmitButton';
import styles from './CriarGrupo.module.css'

function CriarGrupo(){

    const roles = [
        {"id": 1, "name": "Ler"}, 
        {"id": 2, "name": "Escrever"}, 
        {"id": 3, "name": "Realizar commit"}, 
        {"id": 4, "name": "Realizar commit na branch principal"}
       ]
    
    
    return (

     
        <div className={styles.form_container}>
            
            <h1>Novo Grupo</h1>
            <p> Formulário para criação de novo grupo de permissão para acesso aos serviços do ambiente do GSI/MPMG</p>

            <form  className={styles.form}>    

                <Input type="text" 
                        text="Nome do grupo"
                        name="Group name"
                        placeholder=" Insira o nome do grupo"
                />

                <Input type="text" 
                        text="Descrição"
                        name="Description"
                        placeholder="Insira uma breve descrição sobre este grupo"
                />

                <Select name="Gitlab" 
                        text="Selecione as permissões deste grupo para o Gitlab"
                        options={roles}
                        
                />

                <Select name="grupo_id" 
                        text="Selecione o grupo"
                        options={roles}
                        
                />

                <SubmitButton text="Criar grupo" />
            </form>

        </div>
      
    )
}

export default CriarGrupo;
