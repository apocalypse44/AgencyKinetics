import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Link, Divider } from '@mui/material';
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

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ListIcon from '@mui/icons-material/List';
import AppsIcon from '@mui/icons-material/Apps';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TaskBoard from './TaskBoard';
import TaskList from './TaskList';


import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(127, 86, 217)', // Set your custom color here
    },
  },
});

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

const Tasks = ({match}) => {
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
  const { error: deleteError, isDeleted } = useSelector((state) => state.taskDU);
  const combined = useSelector((state) => state.logMember.combined);

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

  // Fetch tasks based on the id
  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const response = await fetch(`/test/v1/task/order/${id}`);
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch tasks: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log('Tasks data:', data);
  //       setTasks(data.tasks);
  //     } catch (error) {
  //       console.error('Error fetching tasks:', error.message);
  //     }
  //   };

  //   fetchTasks();
  // }, [id]);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  return (
    <div>
      <MetaData title="Task -- Test" />
      <div className="task-dashboard-container">
          <div className='btn'>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
             <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none', color: 'rgb(127, 86, 217)'}}>
             Orders
             </Button>
             <Typography style={{ color: 'rgb(127, 86, 217)' }}>Tasks</Typography>

           </Breadcrumbs>

           <ThemeProvider theme={theme}>
             <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="none"
              textColor="primary"
              variant="fullWidth" // Ensure tabs fill the container
              sx={{
                height:'50px',
                alignItems:'center',
                display:'flex',
                justifyContent:'center',
                borderRadius: '10px', // Apply border-radius to all sides of the tabs
                overflow: 'hidden', // Hide overflow to prevent content from leaking out
               
              }}
            >
              <Tab
                label="LIST"
                icon={<ListIcon />}
                iconPosition="start"
                sx={{
                  '&.Mui-selected': {
                    background: theme.palette.primary.main, // Change color of selected tab
                    color: 'white', // Change text color of selected tab
                  },
                  minWidth: 'none', // Adjust tab width
                  minHeight: '30px', // Adjust tab height
                  // height:'40px',
                  borderRadius:'10px'
                }}
              />
              <Tab
                label="BOARD"
                icon={<AppsIcon />}
                iconPosition="start"
                sx={{
                  '&.Mui-selected': {
                    background: theme.palette.primary.main, // Change color of selected tab
                    color: 'white', // Change text color of selected tab
                  },
                  minWidth: 'none', // Adjust tab width
                  minHeight: '30px', // Adjust tab height
                  height:'40px',
                  borderRadius:'10px'
                }}
              />
            </Tabs>
        </ThemeProvider>

        {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT" ? (
        <Button style={{ backgroundColor: 'rgb(127, 86, 217)', marginLeft: 'auto', color: 'white' }} onClick={handleOpen} variant="contained" type="submit">
             Create Task
          </Button>
        ) : null}

          </div>

        {tabValue === 0 ? <TaskList /> : <TaskBoard />}


        
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
 
      </div>
    </div>


  )
//   return (
//     <div>
//       <MetaData title="Task -- Test" />
//       <div className="task-dashboard-container">
//         <div className="btn">
//         <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
//             <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none', color: 'rgb(127, 86, 217)'}}>
//             Orders
//             </Button>
//             <Typography style={{ color: 'rgb(127, 86, 217)' }}>Tasks</Typography>

//           </Breadcrumbs>
//           <ThemeProvider theme={theme}>
            
//             <Tabs
//               value={tabValue}
//               onChange={handleTabChange}
//               // indicatorColor="none"
//               textColor="primary"
//               variant="fullWidth" // Ensure tabs fill the container
//               sx={{
//                 height:'50px',
//                 alignItems:'center',
//                 display:'flex',
//                 justifyContent:'center',
//                 borderRadius: '10px', // Apply border-radius to all sides of the tabs
//                 overflow: 'hidden', // Hide overflow to prevent content from leaking out
//                 '& .MuiTabs-indicator': {
//                   display: 'none', // Remove bottom navigation line
//                 },
//                 '& .MuiTabs-scrollerMuiTabs-scroller': {
//                   display: 'flex', // Use flexbox layout
//                   justifyContent: 'center', // Align items in the center horizontally
//                 },
//               }}
//             >
//               <Tab
//                 label="LIST"
//                 icon={<ListIcon />}
//                 iconPosition="start"
//                 sx={{
//                   '&.Mui-selected': {
//                     background: theme.palette.primary.main, // Change color of selected tab
//                     color: 'white', // Change text color of selected tab
//                   },
//                   minWidth: 'none', // Adjust tab width
//                   minHeight: '30px', // Adjust tab height
//                   // height:'40px',
//                   borderRadius:'10px'
//                 }}
//               />
//               <Tab
//                 label="BOARD"
//                 icon={<AppsIcon />}
//                 iconPosition="start"
//                 sx={{
//                   '&.Mui-selected': {
//                     background: theme.palette.primary.main, // Change color of selected tab
//                     color: 'white', // Change text color of selected tab
//                   },
//                   minWidth: 'none', // Adjust tab width
//                   minHeight: '30px', // Adjust tab height
//                   height:'40px',
//                   borderRadius:'10px'
//                 }}
//               />
//             </Tabs>
//         </ThemeProvider>
//             {/* <ThemeProvider theme={theme}>
//               <Tabs  sx={{ height: '40px', minHeight:'none'}} value={tabValue} onChange={handleTabChange}  indicatorColor="primary" textColor="primary">
//                 <Tab  label="LIST" icon={<ListIcon />} iconPosition="start"/>
//                 <Tab label="BOARD" icon={<AppsIcon />} iconPosition="start"/>
//               </Tabs>
//             </ThemeProvider> */}

//           <Button style={{ backgroundColor: 'rgb(127, 86, 217)', marginLeft: 'auto', color: 'white' }} onClick={handleOpen} variant="contained" type="submit">
//             Create Task
//           </Button>
//         </div>

//         <Modal
//             open={openModal}
//             onClose={handleClose}
//             aria-labelledby="modal-modal-title"
//             aria-describedby="modal-modal-description"
//           >
//             <Box sx={style}>
//               <Typography id="modal-modal-title" variant="h6" component="h2"  style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>
//                 Create New Task
//               </Typography>
//               <NewTask handleClose={handleClose} orderId={id}/>
//             </Box>
//           </Modal>

//           <Modal
//             open={openUpdateModal}
//             onClose={handleUpdateClose}
//             aria-labelledby="modal-modal-title"
//             aria-describedby="modal-modal-description"
//           >
//             <Box sx={updateStyle}>
//               <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>
//                 Update Task
//               </Typography>
//               <UpdateTask handleUpdateClose={handleUpdateClose} selectedTaskId={selectedTaskId} orderId={id}/>
//             </Box>
//           </Modal>
//         <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
//           <DialogTitle style={{ color: 'rgb(127, 86, 217)' }}>Confirm Delete</DialogTitle>
//           <DialogContent>
//             Are you sure you want to delete this task?
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
//             <Button
//               onClick={handleDeleteTask}
//               variant="contained"
//               color="error"
//               style={{ backgroundColor: 'rgb(127, 86, 217)', color: 'white' }}
//             >
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>
        


//         <Grid container spacing={3} style={{ padding: '11px', marginBottom: '10px', marginLeft: '10px', marginRight: '10px' }}>
//           {tasks.length === 0 ? ( // Check if tasks array is empty
//              <Grid item xs={9} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//              <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                <SentimentVeryDissatisfiedIcon style={{ fontSize: 64, color: 'rgb(127, 86, 217)' }} />
//                <Typography variant="h6" style={{ color: 'rgb(127, 86, 217)' }}>
//                  Empty, Please Create.
//                </Typography>
//              </Box>
                 
          

//            </Grid>
//           ) : (
//             <>
//               <Grid item xs={3}>
//           <div style={{ textAlign: 'center' }}>
//             <Typography variant="h5" component="h2" gutterBottom style={{ color: 'rgb(127, 86, 217)' }}>
//               Review 
//             </Typography>
//           </div>
//             <Grid container spacing={2}>
//               {tasks.map((task) => (
//                 task.status === 'Review' && (
//                   <Grid item xs={12} key={task._id}>
//                     <Card style={{ maxWidth: '100%', height:'100%' }}>
//                       <CardHeader
//                         title={task.task_name}
//                       action={
//                           <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="top" title={'Task Information'}>
//                           <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleInfoClick(task)}>
//                             <InfoIcon />
//                           </IconButton>
//                         </Tooltip>
//                             }
//                       />
//                       <CardContent>
//                         <Typography variant="body2" color="textSecondary">
//                           Assigned To: {assignedToNamesMap[task.assigneeId]}
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                           Description: {task.description}
//                         </Typography>
//                         <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="top" title={'Edit Task'}>
//                           <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleUpdateOpen(task._id)}>
//                             <EditIcon />
//                           </IconButton>
//                         </Tooltip>
//                         <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(task._id)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 )
//               ))}
//             </Grid>

//           </Grid>

//           <Grid item xs={3}>
//           <div style={{ textAlign: 'center' }}>
//             <Typography variant="h5" component="h2" gutterBottom style={{ color: 'rgb(127, 86, 217)' }}>
//               Progress 
//             </Typography>
//           </div>
//             <Grid container spacing={2}>
//             {tasks.map((task) => (
//               task.status === 'Progress' && (
//                 <Grid item xs={12} key={task._id}>
//                 <Card style={{ maxWidth: '100%', height:'100%' }}>
//                 <CardHeader
//                         title={task.task_name}
//                       action={
//                           <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="top" title={'Task Information'}>
//                           <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleInfoClick(task)}>
//                             <InfoIcon />
//                           </IconButton>
//                         </Tooltip>
//                             }
//                       />
//                   <CardContent>
//                     <Typography variant="body2" color="textSecondary">
//                       Assigned To: {assignedToNamesMap[task.assigneeId]}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       Description: {task.description}
//                     </Typography>

//                     <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="top" title={'Edit Task'}>
//                       <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleUpdateOpen(task._id)}>
//                         <EditIcon />
//                       </IconButton>
//                     </Tooltip>
//                     <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(task._id)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </CardContent>
//                 </Card>
//                 </Grid>

//               )
//             ))}
//             </Grid>

//           </Grid>

//           <Grid item xs={3}>
//           <div style={{ textAlign: 'center' }}>
//             <Typography variant="h5" component="h2" gutterBottom style={{ color: 'rgb(127, 86, 217)' }}>
//               Done 
//             </Typography>
//           </div>
//             <Grid container spacing={2} >
//             {tasks.map((task) => (
//               task.status === 'Done' && (
//                 <Grid item xs={12} key={task._id}>
//                 <Card style={{ maxWidth: '100%', height:'100%' }}>
//                 <CardHeader
//                         title={task.task_name}
//                       action={
//                           <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement="top" title={'Task Information'}>
//                           <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleInfoClick(task)}>
//                             <InfoIcon />
//                           </IconButton>
//                         </Tooltip>
//                             }
//                       />
//                   <CardContent>
                  
//                     <Typography variant="body2" color="textSecondary">
//                       Assigned To: {assignedToNamesMap[task.assigneeId]}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       Description: {task.description}
//                     </Typography>

//                     <Tooltip
//                     TransitionComponent={Fade}
//                     TransitionProps={{ timeout: 600 }}
//                     placement="top" 
//                     title={'Task Is Done!'}

//                   >
//                     <span>
//                     <IconButton  disabled style={{ color: 'rgb(127, 86, 217)' }}>
//                         <EditOffIcon />
//                       </IconButton>
//                     </span>
//                   </Tooltip>

//                     <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(task._id)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </CardContent>
//                 </Card>
//                 </Grid>

//               )
//             ))}
//           </Grid>
//           </Grid>
//             </>
//           )}
          
//           <Divider></Divider>
//            <Grid item xs={3} style={{ height: '100vh', backgroundColor: 'white' }}>
//   <div style={{ textAlign: 'center' }}>
//     <Typography variant="h5" component="h2" gutterBottom style={{ color: 'rgb(127, 86, 217)' }}>
//       Order Details
//     </Typography>
//   </div>
//   {/* <Grid container spacing={2} style={{ height: '100%', backgroundColor: 'white', padding: '20px' }}> */}
//     <Grid item xs={12}>
//       <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Quantity:</Typography>
//       <Typography variant="body1">{order.quantity}</Typography>
//     </Grid>
//     <Grid item xs={12}>
//       <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Status:</Typography>
//       <Typography variant="body1">{order.status}</Typography>
//     </Grid>
//     <Grid item xs={12}>
//       <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Budget:</Typography>
//       <Typography variant="body1">{order.budget}</Typography>
//     </Grid>
//     <Grid item xs={12}>
//       <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Order ID:</Typography>
//       <Typography variant="body1">{order.orderId}</Typography>
//     </Grid>
//     <Grid item xs={12}>
//       <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Service Name:</Typography>
//       <Typography variant="body1">{serviceNamesMap[order.serviceId] ? serviceNamesMap[order.serviceId] : '-'}</Typography>
//     </Grid>
//     <Grid item xs={12}>
//       <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Client Name:</Typography>
//       <Typography variant="body1">{clientNamesMap[order.clientId] ? clientNamesMap[order.clientId] : '-'}</Typography>
//     </Grid>
//     <Grid item xs={12}>
//       <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Total Cost:</Typography>
//       <Typography variant="body1">{order.budget * order.quantity}</Typography>
//     </Grid>
//     <Grid item xs={12}>
//       <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>Kick-Off Date:</Typography>
//       <Typography variant="body1">{new Date(order.kick_off_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</Typography>
//     </Grid>
//     <Grid item xs={12}>
//       <Typography variant="subtitle1" style={{ color: 'rgb(127, 86, 217)' }}>End Date:</Typography>
//       <Typography variant="body1">{new Date(order.end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</Typography>
//     </Grid>
//   </Grid>
// </Grid>

//         {/* </Grid> */}
        


//       </div>
//     </div>
//   );
};

export default Tasks;
