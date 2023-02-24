import styles from './Usuarios.module.css'
import { Navigate, useNavigate } from 'react-router-dom'  
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useReducer } from 'react';

import { makeStyles } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { fontWeight } from '@mui/system';



function Usuarios(){

    
    const [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        
        fetch('http://localhost:5000/user',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data[0][0])
                setUsuarios(data)
            })
            .catch((error)=> console.log(error))

    }, [])
    

    return (

        <div className={styles.usuarios_container}>
          <h1> Usuários </h1>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} >Nome</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} align="center">Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} align="center">Username&nbsp;</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} align="center">Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((row) => (
                  <TableRow
                    key={row[3]}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row[4]}
                    </TableCell>
                    <TableCell align="center">{row[5]}</TableCell>
                    <TableCell align="center">{row[0]}</TableCell>
                    <TableCell align="center">
                        <Button component={Link} to={`/usuario/${row[0]}`} variant="outlined" startIcon={<EditIcon />}>
                          Alterar
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );



}



export default Usuarios;