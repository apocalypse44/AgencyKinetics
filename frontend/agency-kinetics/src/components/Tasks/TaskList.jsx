import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Accordion, AccordionDetails, AccordionSummary, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Link, Divider, CircularProgress, Container } from '@mui/material';
import MetaData from '../layout/MetaData';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Grid, IconButton, Modal, Tooltip, Typography, Breadcrumbs } from '@material-ui/core';
import NewTask from './NewTask';
import './Tasks.css'
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, deleteTask, getTasks } from '../../actions/taskAction';
import { DELETE_TASK_RESET } from '../../constants/taskConstants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import { addNotification } from "../../actions/notificationAction";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import UpdateTask from './UpdateTask';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { getOrderDetails } from '../../actions/orderAction';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditOffIcon from '@mui/icons-material/EditOff';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import DOMPurify from 'dompurify';
import empty from '../../Images/empty-folder.png'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid rgb(127, 86, 217)',
  // boxShadow: '5px 5px 5px 5px rgba(255, 177, 0, 0.9)',
  borderRadius: 5, // Set border radius to 0 for rectangular border
  boxShadow: 24,
  overflow:'auto',
  p: 4,
  
};

const updateStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 400,
  // backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '5px 5px 5px 5px rgba(255, 177, 0, 0.9)',
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid rgb(127, 86, 217)',
  borderRadius: 5, 
  boxShadow: 24,
  overflow:'auto',
  p: 4,
  
};

const TaskList = ({match}) => {
  // Get the id from the URL parameter
  const { id } = useParams();
console.log(id)
const { order, error:orderDetailError } = useSelector(state => state.orderDetails);
  console.log(order)
  const dispatch = useDispatch()
  const history = useHistory()
  // const [tasks, setTasks] = useState([]);
  const {error, loading, tasks} = useSelector((state)=>state.tasks)
  console.log(tasks)
  const combined = useSelector((state) => state.logMember.combined);




  const { error: deleteError, isDeleted } = useSelector((state) => state.taskDU);

  const [assignedToNamesMap, setassignedToNamesMap] = useState({});


  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('')

  const handleUpdateOpen = (taskId) => {
    setSelectedTaskId(taskId);
  
    setOpenUpdateModal(true);
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  const handleDeleteConfirmation = (taskId) => {
    setTaskIdToDelete(taskId);
    setOpenConfirmDialog(true);
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(taskIdToDelete));
    setTaskIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setTaskIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleBreadcrumbClick = () => {
    history.push('/orders');
  };
  
  const handleInfoClick = (row) => {
    console.log(row);
  };

  const columns = [
    { id: 'taskName', label: 'Task Name', minWidth: 100, align: 'center', fontWeight: 'bold' },
    { id: 'assignedTo', label: 'Assigned To', minWidth: 100, align: 'center', fontWeight: 'bold' },
    { id: 'description', label: 'Description', minWidth: 100, align: 'center', fontWeight: 'bold' },
    // { id: 'address', label: 'Address', minWidth: 100, align: 'center', fontWeight: 'bold' },
    // { id: 'createdAt', label: 'Created On', minWidth: 100, align: 'center', fontWeight: 'bold' },
  ];

  const [progressTasks, setProgressTasks] = useState([]);
const [reviewTasks, setReviewTasks] = useState([]);
const [doneTasks, setDoneTasks] = useState([]);

// Effect to update filtered lists whenever tasks or their statuses change
useEffect(() => {
  // Function to filter tasks based on status
  const filterTasksByStatus = () => {
    const progressTasks = tasks.filter(task => task.status === 'Progress');
    const reviewTasks = tasks.filter(task => task.status === 'Review');
    const doneTasks = tasks.filter(task => task.status === 'Done');
    // Update state with filtered lists
    setProgressTasks(progressTasks);
    setReviewTasks(reviewTasks);
    setDoneTasks(doneTasks);
  };

  // Call filterTasksByStatus initially and whenever tasks or their statuses change
  filterTasksByStatus();
}, [tasks]); 

  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
  };



  const [serviceNamesMap, setServiceNamesMap] = useState({});
  const [clientNamesMap, setClientNamesMap] = useState({});

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await fetch(`/test/v1/services`);
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`);
        }
        const data = await response.json();
        console.log('Services data:', data);

        const serviceMap = {};
        data.services.forEach((service) => {
          serviceMap[service._id] = service.service_name;
        });
        console.log(serviceMap)
        setServiceNamesMap(serviceMap);
      } catch (error) {
        console.error('Error fetching services:', error.message);
      }
    };

    fetchServiceData();
  }, []);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch('/test/v1/combined/getAllClient');
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status}`);
        }
        const data = await response.json();
        console.log('Clients data:', data);

        const clientMap = {};
        data.combined.forEach((combined) => {
          clientMap[combined._id] = combined.fname;
        });

        setClientNamesMap(clientMap);
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };

    fetchClientData();
  }, []);

//   useEffect(() => {
//     if(orderDetailError){
//     //  alert.error(orderDetailError)
//      dispatch(clearErrors())
//   }
//   dispatch(getOrderDetails(match.params.id));
// }, [dispatch, match.params.id, orderDetailError , alert]);


  useEffect(() => {
    const fetchAssigneeData = async () => {
      try {
        const response = await fetch('/test/v1/getAllExceptClient');
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status}`);
        }
        const data = await response.json();
        console.log('Assigned To data:', data);

        const assignedToMap = {};
        data.combined.forEach((combined) => {
          assignedToMap[combined._id] = combined.fname;
        });

        setassignedToNamesMap(assignedToMap);
        console.log(assignedToMap)
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };

    fetchAssigneeData();
  }, []);

  useEffect(() => {

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert('Team Member deleted successfully');
      history.push(`/task/order/${id}`);
      dispatch({ type: DELETE_TASK_RESET});
      dispatch(addNotification({ message: 'Task deleted successfully'}));
    }

    dispatch(getTasks(id));
  }, [dispatch, error, alert, isDeleted, deleteError, history]);

  useEffect(() => {
    if(orderDetailError){
    //  alert.error(orderDetailError)
     dispatch(clearErrors())
  }
  dispatch(getOrderDetails(id));
}, [dispatch, id, orderDetailError , alert]);

  return (
    <div>
      <MetaData title="Task -- Test" />

        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2"  style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>
                Create New Task
              </Typography>
              <NewTask handleClose={handleClose} orderId={id}/>
            </Box>
          </Modal>

          <Modal
            open={openUpdateModal}
            onClose={handleUpdateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={updateStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>
                Update Task
              </Typography>
              <UpdateTask handleUpdateClose={handleUpdateClose} selectedTaskId={selectedTaskId} orderId={id}/>
            </Box>
          </Modal>
        <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
          <DialogTitle style={{ color: 'rgb(127, 86, 217)' }}>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this task?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
            <Button
              onClick={handleDeleteTask}
              variant="contained"
              color="error"
              style={{ backgroundColor: 'rgb(127, 86, 217)', color: 'white' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </div>
          )}

        <Grid container spacing={3} style={{ paddingTop: '11px', marginBottom: '0px', marginLeft: '10px', marginRight: '10px' }}>
          {tasks.length === 0 ? ( // Check if tasks array is empty
             <Grid item xs={9} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
             <Container style={{ textAlign:'center'}}>
              <img
                src={empty}
                alt="Empty Folder"
                style={{ width: "150px", height: "150px", marginBottom: "10px" }}
              />
              <Typography variant="h5" >Please Create A Task</Typography>
            </Container>       

           </Grid>
          ) : (
            <>
            <Grid item xs={9}>
                {/* <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} style={{ marginBottom: '10px' }}> */}
                <Accordion defaultExpanded style={{ marginBottom: '10px' }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ width: '33%', flexShrink: 0}} style={{ color: 'rgb(127, 86, 217)' }}>
                            Progress
                        </Typography>
                    </AccordionSummary>
                      <AccordionDetails>
                        {progressTasks.length > 0 ? (
                           <TableContainer component={Paper}>
                           <Table>
                           <TableRow style={{borderBottom:'2px solid black', borderTop:'2px solid black'}}>
                              {columns.map((column) => (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth, fontWeight: column.fontWeight }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
   
                             <TableBody>
                                 {progressTasks.map(task => (
                                     <TableRow key={task._id} style={{borderBottom:'1px solid black'}}>
                                       <TableCell align="center">{task.task_name}</TableCell>
                                       <TableCell align="center">{assignedToNamesMap[task.assigneeId]}</TableCell>
                                        <TableCell align="center"><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }} /></TableCell>

                                       <TableCell>
                                        
                                    {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER"|| combined.user.role === "CLIENT" || combined.user.role === "ASSIGNEE" ? (

                                       <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="top" title={'Edit Task'}>
                                         <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleUpdateOpen(task._id)}>
                                           <EditIcon />
                                         </IconButton>
                                       </Tooltip>
                                    ) : null} 
                                    
                                      {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (

                                       <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(task._id)}>
                                         <DeleteIcon />
                                       </IconButton>
                                        ) : null}

                                       </TableCell>
                                       {/* Add other task details as needed */}
                                     </TableRow>
                                 ))
                               }
                             </TableBody>
                           </Table>
                         </TableContainer>
                        ) : (
                          <Typography>No Tasks with Status Progress, Please Create</Typography>

                        )}
                     
                      </AccordionDetails>

                </Accordion>

                {/* <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} style={{ marginBottom: '10px' }}> */}
                <Accordion defaultExpanded style={{ marginBottom: '10px' }}>

                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                    >
                        <Typography sx={{ width: '33%', flexShrink: 0 }} style={{ color: 'rgb(127, 86, 217)' }}>Review</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {reviewTasks.length > 0 ? (
                           <TableContainer component={Paper}>
                           <Table>
                             <TableHead>
                             <TableRow style={{borderBottom:'2px solid black', borderTop:'2px solid black'}}>
                              {columns.map((column) => (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth, fontWeight: column.fontWeight }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
                             </TableHead>
   
                             <TableBody>
                                 {reviewTasks.map(task => (
                                     <TableRow key={task._id} style={{borderBottom:'1px solid black'}}>
                                       <TableCell align="center">{task.task_name}</TableCell>
                                       <TableCell align="center">{assignedToNamesMap[task.assigneeId]}</TableCell>
                                       <TableCell align="center"><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }} /></TableCell>

                                       <TableCell>

                                      {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER"|| combined.user.role === "CLIENT" || combined.user.role === "ASSIGNEE" ? (
                                        
                                        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="top" title={'Edit Task'}>
                                          <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleUpdateOpen(task._id)}>
                                            <EditIcon />
                                          </IconButton>
                                        </Tooltip>
                                        ) : null}

                                       {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (

                                      <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(task._id)}>
                                        <DeleteIcon />
                                      </IconButton>
                                      ) : null}
                                       </TableCell>
                                       {/* Add other task details as needed */}
                                     </TableRow>
                                 ))
                               }
                             </TableBody>
                           </Table>
                         </TableContainer>
                        ) : (
                          <Typography>No Tasks with Status Review, Please Create</Typography>

                        )}
                     
                      </AccordionDetails>
                </Accordion>

                {/* <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} style={{ marginBottom: '10px' }}> */}
                <Accordion defaultExpanded style={{ marginBottom: '10px' }}>

                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                    >
                        <Typography sx={{ width: '33%', flexShrink: 0 }} style={{ color: 'rgb(127, 86, 217)' }}>
                            Done
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {doneTasks.length > 0 ? (
                           <TableContainer component={Paper}>
                           <Table>
                             <TableHead>
                             <TableRow style={{borderBottom:'2px solid black', borderTop:'2px solid black'}}>
                              {columns.map((column) => (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth, fontWeight: column.fontWeight }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
                             </TableHead>
   
                             <TableBody>
                                 {doneTasks.map(task => (
                                     <TableRow key={task._id} style={{borderBottom:'1px solid black'}}>
                                       <TableCell align="center">{task.task_name}</TableCell>
                                       <TableCell align="center">{assignedToNamesMap[task.assigneeId]}</TableCell>
                                        <TableCell align="center"><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }} /></TableCell>
                                       <TableCell>
                        
                                    {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER"|| combined.user.role === "CLIENT" || combined.user.role === "ASSIGNEE" ? (
                                       <Tooltip
                                          TransitionComponent={Fade}
                                          TransitionProps={{ timeout: 600 }}
                                          placement="top" 
                                          title={'Task Is Done!'}

                                        >
                                          <span>
                                          <IconButton  disabled style={{ color: 'rgb(127, 86, 217)' }}>
                                              <EditOffIcon />
                                            </IconButton>
                                          </span>
                                        </Tooltip>
                                    ) : null}


                                        {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (

                                        <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(task._id)}>
                                          <DeleteIcon />
                                        </IconButton>
                                        ) : null}
                                       </TableCell>
                                       {/* Add other task details as needed */}
                                     </TableRow>
                                 ))
                               }
                             </TableBody>
                           </Table>
                         </TableContainer>
                        ) : (
                          <Typography>No Tasks with Status Done, Please Create</Typography>

                        )}
                     
                      </AccordionDetails>
                </Accordion>
            </Grid>

            </> 
          )}
          
          <Divider></Divider>
           <Grid item xs={3} style={{backgroundColor: 'white' }}>
  <div style={{ textAlign: 'center' }}>
    <Typography variant="h5" component="h2" gutterBottom style={{ color: 'rgb(127, 86, 217)' }}>
      Order Details
    </Typography>
  </div>
  {/* <Grid container spacing={2} style={{ height: '100%', backgroundColor: 'white', padding: '20px' }}> */}
    <Grid item xs={12} style={{marginTop:'10px'}}>
      <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Quantity:</Typography>
      <Typography variant="body1">{order.quantity}</Typography>
    </Grid>
    <Grid item xs={12} style={{marginTop:'10px'}}>
      <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Status:</Typography>
      <Typography variant="body1">{order.status}</Typography>
    </Grid>
    <Grid item xs={12} style={{marginTop:'10px'}}>
      <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Budget:</Typography>
      <Typography variant="body1">{order.budget}</Typography>
    </Grid>
    <Grid item xs={12} style={{marginTop:'10px'}}>
      <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Order ID:</Typography>
      <Typography variant="body1">{order.orderId}</Typography>
    </Grid>
    <Grid item xs={12} style={{marginTop:'10px'}}>
      <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Service Name:</Typography>
      <Typography variant="body1">{serviceNamesMap[order.serviceId] ? serviceNamesMap[order.serviceId] : '-'}</Typography>
    </Grid>
    <Grid item xs={12} style={{marginTop:'10px'}}>
      <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Client Name:</Typography>
      <Typography variant="body1">{clientNamesMap[order.clientId] ? clientNamesMap[order.clientId] : '-'}</Typography>
    </Grid>
    <Grid item xs={12} style={{marginTop:'10px'}}>
      <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Total Cost:</Typography>
      <Typography variant="body1">{order.budget * order.quantity}</Typography>
    </Grid>
    <Grid item xs={12} style={{marginTop:'10px'}}>
      <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Kick-Off Date:</Typography>
      <Typography variant="body1">{new Date(order.kick_off_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</Typography>
    </Grid>
    <Grid item xs={12} style={{marginTop:'10px'}}>
      <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>End Date:</Typography>
      <Typography variant="body1">{new Date(order.end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</Typography>
    </Grid>
  </Grid>
</Grid>

        {/* </Grid> */}
        


      </div>
  );
};

export default TaskList;
