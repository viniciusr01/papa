import styles from './GrupoPolitica.module.css'

import React from 'react';
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup';
import Button from '@mui/material/Button';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';




/* Transfer list*/
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';


function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}
  
function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}
  
function union(a, b) {
    return [...a, ...not(b, a)];
}
/* Finish Transfer List */


function GrupoPolitica(){

    //const navigate = useNavigate();


    const { policyID } = useParams()

    const [gpPolitica, setGpPolitica] = useState([])

    const [glProjects, setGLProjects] = useState([])

    const [open, setOpen] = useState(false);

    const [openAddMember, setOpenAddMember] = useState(false);



    function addMembros(policyID, usernames){
        fetch(`http://localhost:5000/user/policy`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "policyid": policyID,
                "usernames": usernames
            })
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
            })
            .catch((error)=> console.log(error))

            window.location.replace(`http://localhost:3000/politicas`);
    }
    
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

    const handleCloseAddMember = () => {
        setOpenAddMember(false);
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


    /* Transfer List */
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);

    const nomesEsquerda = not(left, right)


    /* Get Right Side Tranfer List */
    useEffect(() => {
        
        fetch(`http://localhost:5000/policy/members?policyid=${policyID}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
                data.members === null ? setRight([]) : setRight(data.members)
            })
            .catch((error)=> console.log(error))

    }, [])
    

    /* Get Left Side Tranfer List */
    useEffect(() => {
        
        fetch('http://localhost:5000/user',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                const usernames = []

                data.forEach(element => {
                    usernames.push(element.username)
                });
                console.log(usernames)

                setLeft(usernames)
            })
            .catch((error)=> console.log(error))

    }, [])

   
 
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
  
    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
    };
  
    const numberOfChecked = (items) => intersection(checked, items).length;
  
    const handleToggleAll = (items) => () => {
      if (numberOfChecked(items) === items.length) {
        setChecked(not(checked, items));
      } else {
        setChecked(union(checked, items));
      }
    };
  
    const handleCheckedRight = () => {
      setRight(right.concat(leftChecked));
      setLeft(not(left, leftChecked));
      setChecked(not(checked, leftChecked));
    };
  
    const handleCheckedLeft = () => {
      setLeft(left.concat(rightChecked));
      setRight(not(right, rightChecked));
      setChecked(not(checked, rightChecked));
    };
  

    
    const customList = (title, items) => (
        <Card>
            <CardHeader
            sx={{ px: 2, py: 1 }}
            avatar={
                <Checkbox
                onClick={handleToggleAll(items)}
                checked={numberOfChecked(items) === items.length && items.length !== 0}
                indeterminate={
                    numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                } 
                disabled={items.length === 0}
                inputProps={{
                '   aria-label': 'all items selected',
                }}
                />
            }
            title={title}
            subheader={`${numberOfChecked(items)}/${items.length} selecionados`}
            />

            <Divider />
            <List
                sx={{
                width: 200,
                height: 230,
                bgcolor: 'background.paper',
                overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
            
                {items.map((value) => {
                const labelId = `transfer-list-all-item-${value}-label`;
  
                return (
                    <ListItem
                        key={value}
                        role="listitem"
                        button
                        onClick={handleToggle(value)}
                    >
                    < ListItemIcon>
                    <Checkbox
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                    />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value} />
                    </ListItem>
                );
            })}
            </List>
        </Card>

    );
  


    /* Finish Transfer List */

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
                      Você tem certeza que deseja excluir o grupo de política <b>{gpPolitica.name}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button sx= {{ backgroundColor: 'white', color: 'black', '&:hover': {backgroundColor: 'grey', color: 'white'} }} onClick={handleClose} variant="contained" >Cancelar</Button>
                    <Button sx= {{ backgroundColor: 'white', color: 'red', '&:hover': {backgroundColor: 'red', color: 'white'} }} onClick={() => deletarGrupoPolitica(gpPolitica.policyid)} variant="contained"> Excluir grupo</Button>
                </DialogActions>
            </Dialog>
        </div>

        
        <div>
            {/* Dialog to Add Members*/}
            <Dialog
                open={openAddMember}
                onClose={handleCloseAddMember}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle sx={{color: 'white', backgroundColor: 'black'}} id="alert-dialog-title">
                    {"Associar usuários ao grupo de política"}
                </DialogTitle>
                <DialogContent>

                    <br></br>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>{customList('Não associados', nomesEsquerda)}</Grid>
                        <Grid item>
                            <Grid container direction="column" alignItems="center">
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedRight}
                                    disabled={leftChecked.length === 0}
                                    aria-label="move selected right"
                                >
                                    &gt;
                                </Button>
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedLeft}
                                    disabled={rightChecked.length === 0}
                                    aria-label="move selected left"
                                >
                                    &lt;
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item>{customList('Associados', right)}</Grid>
                    </Grid>
                </DialogContent>




                <DialogActions>
                    <Button sx= {{ backgroundColor: 'white', color: 'black', '&:hover': {backgroundColor: 'grey', color: 'white'} }} onClick={handleCloseAddMember} variant="contained" >Cancelar</Button>
                    <Button sx= {{ backgroundColor: 'green', color: 'white', '&:hover': {backgroundColor: 'white', color: 'green'} }} onClick={() => addMembros(policyID, right)} variant="contained" >Associar</Button>
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

                

                <p> Membros </p>
                <br></br>                                 

                <p> Ações </p>
                <br></br>

                <Button onClick={() => (setOpenAddMember(true))} variant="outlined" startIcon={<GroupAddIcon />}>
                    Associar usuários
                </Button>
                &ensp;

                <Button onClick={() => (setOpenAddMember(true))} variant="outlined" startIcon={<WifiProtectedSetupIcon />} disabled>
                    Associar nos serviços
                </Button>
                &ensp;

               
                <Button sx={{ color:'red', borderColor: 'red' }} onClick={() => (setOpen(true))} variant="outlined" startIcon={<DeleteIcon />}>
                    Excluir Grupo
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