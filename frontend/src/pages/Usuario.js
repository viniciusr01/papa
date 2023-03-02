import styles from './Usuario.module.css'

import React from 'react';
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Button from '@mui/material/Button';



import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


function Usuario(){

    const { username } = useParams()

    const [usuario, setUsuario] = useState([])

    const [open, setOpen] = React.useState(false);

    function deletarUsuario(username){

        fetch(`http://localhost:5000/user`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "usertodelete": username,
            })
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
            })
            .catch((error)=> console.log(error))

            window.location.replace(`http://localhost:3000/usuarios`);
    }


    function criarUsuarioIpaGitlab(username){
        fetch(`http://localhost:5000/user/create`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
            })
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
            })
            .catch((error)=> console.log(error))

            window.location.replace(`http://localhost:3000/usuario/${username}`);
    }
   

    const handleClose = () => {
      setOpen(false);
    };


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

        <div>
       
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText sx = {{color: 'black', fontWeight:'500'}}id="alert-dialog-description">
                      Você tem certeza que deseja excluir o usuário <b>{usuario.username}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button sx= {{ backgroundColor: 'white', color: 'black', '&:hover': {backgroundColor: 'grey', color: 'white'} }} onClick={handleClose} variant="contained" >Cancelar</Button>
                    <Button sx= {{ backgroundColor: 'white', color: 'red', '&:hover': {backgroundColor: 'red', color: 'white'} }} onClick={() => deletarUsuario(usuario.username)} variant="contained"> Excluir</Button>
                </DialogActions>
            </Dialog>
        </div>


            <h1> {usuario.fullname} </h1>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} >Username&nbsp;</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} align="center">Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} align="center">Já cadastrado no FreeIPA?</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} align="center">Já cadastrado no GitLab?</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                        <TableCell component="th" scope="row">
                            {usuario.username}
                        </TableCell>
                        <TableCell align="center">{usuario.email}</TableCell>
                        <TableCell align="center">{usuario.iscreatedipa === false ? 'Não' : 'Sim'}</TableCell>
                        <TableCell align="center">{usuario.iscreatedgitlab  === false ? 'Não' : 'Sim'}</TableCell>
                        
                    </TableRow>

                    <TableRow>
                    </TableRow>
                    
            
                </TableBody>
            </Table>

                <div className={styles.usuario_buttonsAction}>

                <p> Ações </p>
                <br></br>
                <Button sx={{ color:'green', borderColor: 'green' }} component={Link} to={`/usuario/${usuario[0]}`} variant="outlined" startIcon={<EditIcon />}>
                    Alterar
                </Button>
                &ensp;
                <Button sx={{ color:'red', borderColor: 'red' }} onClick={() => (setOpen(true))} variant="outlined" startIcon={<DeleteIcon />}>
                    Deletar
                </Button>
                &ensp;

                {usuario.iscreatedgitlab  === true 
                ? 
                
                <Button  onClick={() => (criarUsuarioIpaGitlab(usuario.username))} variant="outlined" startIcon={<GroupAddIcon />} disabled>
                    Criar usuário no IPA e no GitLab
                </Button>
                
                : 

                <Button  onClick={() => (criarUsuarioIpaGitlab(usuario.username))} variant="outlined" startIcon={<GroupAddIcon />}>
                    Cadastrar usuário no FreeIPA e no GitLab
                </Button>
                
                }
                
                &ensp;

                <Button sx={{ color:'green', borderColor: 'green' }} component={Link} to={`/usuario/${usuario[0]}`} variant="outlined" startIcon={<EditIcon />}>
                    Editar
                </Button>
                &ensp;
                <Button sx={{ color:'red', borderColor: 'red' }} onClick={() => (setOpen(true))} variant="outlined" startIcon={<DeleteIcon />}>
                    Excluir
                </Button>
                &ensp;

                
                <br></br>
                <br></br>
                </div>


            </TableContainer>
        </div>
        //Botão para alterar dados do usuário ainda  sem funcionamento. Inserir logo após a linha 159 quando funcional. 
        /* <Button sx={{ color:'green', borderColor: 'green' }} component={Link} to={`/usuario/${usuario[0]}`} variant="outlined" startIcon={<EditIcon />}>
                    Alterar
                </Button> */
     
    )
}

export default Usuario;