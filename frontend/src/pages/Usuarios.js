import styles from './Usuarios.module.css'
import { Navigate, useNavigate } from 'react-router-dom'  
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useReducer } from 'react';


import { styled } from '@material-ui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

/*
const MyTableContainer = styled(TableContainer)({
    width: '80%',
    margin: '0 auto',
    padding: '0.5em'
});
*/


function Usuarios2(){

    
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

        <div className={styles.table_container}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead >
                <TableRow  >
                  <TableCell>Nome</TableCell>
                  <TableCell align="right">email</TableCell>
                  <TableCell align="right">Username&nbsp;</TableCell>
                  <TableCell align="right">Ação</TableCell>
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
                    <TableCell align="right">{row[5]}</TableCell>
                    <TableCell align="right">{row[0]}</TableCell>
                    <TableCell align="right">
                        <Button component={Link} to={`/usuario/${row[0]}`} variant="outlined" startIcon={<EditIcon />}>
                          Editar
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



export default Usuarios2;