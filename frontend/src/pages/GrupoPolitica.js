import styles from './GrupoPolitica.module.css'

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

import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Button from '@mui/material/Button';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


function GrupoPolitica(){

    const { policyID } = useParams()

    const [gpPolitica, setGpPolitica] = useState([])

    const [glProjects, setGLProjects] = useState([])

    const [open, setOpen] = React.useState(false);

    
    function deletarGrupoPolitica(policyID){

        fetch(`http://localhost:5000/policy`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "policytodelete": policyID,
                "teste": 'teste',
            })
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
            })
            .catch((error)=> console.log(error))

            window.location.replace(`http://localhost:3000/politicas`);
    }


 

    const handleClose = () => {
      setOpen(false);
    };


    useEffect(() => {
        
        fetch(`http://localhost:5000/policy?policyid=${policyID}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
                setGpPolitica(data)
                setGLProjects(data.projectsgitlab)
            })
            .catch((error)=> console.log(error))

    }, [])


    return (
    
        <div className={styles.gpPolitica_container}>

        <div>
       
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText sx = {{color: 'black', fontWeight:'500'}}id="alert-dialog-description">
                      Você tem certeza que dejesa deletar o grupo de política <b>{gpPolitica.name}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button sx= {{ backgroundColor: 'white', color: 'black', '&:hover': {backgroundColor: 'grey', color: 'white'} }} onClick={handleClose} variant="contained" >Cancelar</Button>
                    <Button sx= {{ backgroundColor: 'white', color: 'red', '&:hover': {backgroundColor: 'red', color: 'white'} }} onClick={() => deletarGrupoPolitica(gpPolitica.policyid)} variant="contained"> Deletar</Button>
                </DialogActions>
            </Dialog>
        </div>


            <h1> {gpPolitica.name} </h1>

            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} >Projetos do GitLab&nbsp;</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} align="center">Grupo do FreeIPA</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                        <TableCell component="th" scope="row">
                            {Object.keys(glProjects).map((item) => 
                                    <li key={item}>{item}</li>
                            )}
                        </TableCell>
                        <TableCell align="center">{gpPolitica.groupipa}</TableCell>
                        
                        
                    </TableRow>

                    <TableRow>
                    </TableRow>
                    
            
                </TableBody>
            </Table>

                <div className={styles.gpPolitica_buttonsAction}>

                <p> Ações </p>
                <br></br>
               
                <Button sx={{ color:'red', borderColor: 'red' }} onClick={() => (setOpen(true))} variant="outlined" startIcon={<DeleteIcon />}>
                    Deletar
                </Button>
                &ensp;

                <Button onClick={() => (console.log('button member'))} variant="outlined" startIcon={<GroupAddIcon />}>
                    Adicionar Membros
                </Button>
                &ensp;

               
                <br></br>
                <br></br>
                </div>


            </TableContainer>
            
        </div>
     
    )
}

export default GrupoPolitica;