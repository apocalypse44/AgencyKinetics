import{useSelector, useDispatch} from "react-redux";
import React, { useEffect, useState } from 'react'
import MetaData from "../layout/MetaData";
import { useHistory } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min.js";
import "./Order.css"
import { deleteOrder ,clearErrors, getOrders} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NewOrder from "./NewOrder";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, Fade, TablePagination, IconButton, TableFooter, Breadcrumbs, CircularProgress, Container } from '@mui/material';
import CustomizedSnackbars from "../../snackbarToast";
import { DragHandle } from "@material-ui/icons";
import UpdateOrder from "./UpdateOrder";
import { addNotification, createNotification } from "../../actions/notificationAction";
import InfoIcon from '@mui/icons-material/Info';
import ListIcon from '@mui/icons-material/List';
import { getTasks } from "../../actions/taskAction";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import empty from '../../Images/empty-folder.png'
import { DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';

// import CloseIcon from '@mui/icons-material/Close';
// import WarningIcon from '@mui/icons-material/Warning';
// import RateReviewIcon from '@mui/icons-material/RateReview';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// const statusIconMapping = {
//   Cancelled: <CloseIcon />,
//   Ongoing: <WarningIcon />,
//   Review: <RateReviewIcon />,
//   Completed: <CheckCircleIcon />,
// };

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid rgb(127, 86, 217)',
  boxShadow: '5px 5px 5px 5px rgba(255, 177, 0, 0.9)',
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

const Order = () => {
  const history = useHistory();
  const dispatch = useDispatch()

  const combined = useSelector((state) => state.logMember.combined);
  const name = combined.user.fname + ' ' + combined.user.lname
  const formatRole = (role) => {
    switch (role) {
      case 'ASSIGNEE':
        return 'Assignee';
      case 'PROJECTMANAGER':
        return 'Project Manager';
      case 'ADMIN':
        return 'Admin';
      case 'SUPERADMIN':
        return 'Super Admin';
      case 'CLIENT':
          return 'Client';
      default:
        return role;
    }
  };
  const role = formatRole(combined.user.role)
  console.log(role) 

  const {error, loading, orders} = useSelector((state)=>state.orders)
  console.log(orders)


  
  const { error: deleteError, isDeleted } = useSelector((state) => state.orderDU);
  const [serviceNamesMap, setServiceNamesMap] = useState({});
  const [clientNamesMap, setClientNamesMap] = useState({});

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleUpdateOpen = (orderId) => {
    // Store the selected orderId in the state or perform any other actions you need
    setSelectedOrderId(orderId);
  
    // Open the update modal
    setOpenUpdateModal(true);
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);


  const [selectedOrderName, setselectedOrderName] = useState('')
  const [selectedClientFromOrder, setselectedClientFromOrder] = useState('')

  const getName = async (orderId) => {
    try {
      const response = await fetch(`/test/v1/order/${orderId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      const data = await response.json();
      console.log('Orders data:', data);
      setselectedOrderName(data.order.orderId)
      setselectedClientFromOrder(data.order.clientId)

      console.log(selectedOrderName)
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  const handleDeleteConfirmation = (orderId) => {
    setOrderIdToDelete(orderId);
    setOpenConfirmDialog(true);
    getName(orderId)

  };

  // const handleDeleteConfirmation = (orderId) => {
  //   setOrderIdToDelete(orderId);
  //   setOpenConfirmDialog(true);
  // };

  const handleDeleteOrder = () => {
    dispatch(deleteOrder(orderIdToDelete));
    setOrderIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setOrderIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  // const deleteOrderHandler = (id) => {
  //   dispatch(deleteOrder(id));
  // };
  const handleBreadcrumbClick = () => {
    history.push('/orders');
  };
  const [breadcrumbs, setBreadcrumbs] = React.useState([
    <Button color="inherit" href="/orders" onClick={() => history.push('/orders')}>
      Orders
    </Button>
  ]);

  const handleInfoClick = (row) => {
    console.log(row)
    history.push(`/order/${row.id}`)
    setBreadcrumbs([
      <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
        Orders
      </Button>,
      <Typography color="textPrimary">Order Details</Typography>
    ]);
  };

  const handleTaskClick = (order) => {
    console.log(order)
    dispatch(getTasks(order.id))
    history.push(`/task/order/${order.id}`)
     {/*component={Link} to={/task/${order._id}}*/}
     setBreadcrumbs([
      <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
        Orders
      </Button>,
      <Typography color="textPrimary">Task Details</Typography>
    ]);

    console.log(order);
  };


  const originalRows = orders
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // const columns = [
  //   { id: 'orderId', label: 'Order ID', minWidth: 100, align: 'center', fontWeight:'bold' },
  //   { id: 'clientName', label: 'Client Name', minWidth: 100, align: 'center', fontWeight:'bold' },
  //   { id: 'service', label: 'Service', minWidth: 100, align: 'center', fontWeight:'bold' },
  //   { id: 'status', label: 'Status', minWidth: 100, align: 'center', fontWeight:'bold' },
  //   { id: 'kickOffDate', label: 'KickOff Date', minWidth: 100, align: 'center', fontWeight:'bold' },
  //   { id: 'endDate', label: 'End Date', minWidth: 100, align: 'center', fontWeight:'bold' },
  // ];
  
  const columns = [
    { field: 'orderId', headerName: 'Order ID', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'clientName', headerName: 'Client Name', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'service', headerName: 'Service', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'status', headerName: 'Status', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center',
      renderCell:(params)=> {
        const isOngoing = params.value === "Ongoing";
        const isReview = params.value === "Review";
        const isCompleted = params.value === "Completed";
        const isCancelled = params.value === "Cancelled";

        return (
          <Chip
        label={params.value}
        variant="outlined"
        size="large"
        color={
          isOngoing ? "warning" :
          isReview ? "primary" :
          isCompleted ? "success" :
          isCancelled ? "error" :
          "default"
        }
      />
        )
      }
    },
    { field: 'kickOffDate', headerName: 'KickOff Date', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'endDate', headerName: 'End Date', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    {
      field: 'tasks',
      headerName:'Tasks',
      sortable: false, 
      filterable: false, 
      disableColumnMenu: true,
      field: 'taskButton',
      headerAlign:'center',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        
        <Tooltip TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        placement="top" 
        title={'Tasks'}>
          <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleTaskClick(params.row)}>
          <ListIcon />
        </IconButton>
        </Tooltip>
      )
    },
    {
      sortable: false, 
      filterable: false, 
      disableColumnMenu: true,
      field: 'infoButton',
      headerName: '',
      headerAlign:'center',
      width: 10,
      align: 'center',
      renderCell: (params) => (
        
        <Tooltip TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        placement="top" 
        title={'Order Information'}>
        <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleInfoClick(params.row)}>
          <InfoIcon />    
        </IconButton>
        </Tooltip>
      )
    },
    
    { 
      sortable: false, 
      filterable: false, 
      disableColumnMenu: true,
      field: 'editButton',
      headerAlign:'center',
      headerName: '',
      width: 10,
      align: 'center',
      renderCell: (params) => {
        const { row } = params;
        console.log(row)
        const canEdit = combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER";
        const isCancelledorCompleted = row.status === 'Cancelled' || row.status === 'Completed';
        
        return canEdit ? (
          <Tooltip 
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            placement="top" 
            title={isCancelledorCompleted ? `Can't Edit as Order is ${row.status}` : 'Edit Invoice'}
          >
            <span>
              <IconButton
                style={{ color: 'rgb(127, 86, 217)' }}
                onClick={() => handleUpdateOpen(row.id)}
                disabled={isCancelledorCompleted || loading}
              >
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : null;
      }
    },
    {
      sortable: false, 
      filterable: false, 
      disableColumnMenu: true,
      field: 'deleteButton',
      headerAlign:'center',
      headerName: '',
      width: 10,
      align: 'center',
      renderCell: (params) => {
        const { row } = params;
        // console.log(row)
        const canDelete = combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT";
    
        return canDelete ? (
          <IconButton
            style={{ color: 'rgb(127, 86, 217)' }}
            onClick={() => handleDeleteConfirmation(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        ) : null;
      }
    },
  ];

  const clientColumns = [
    { field: 'orderId', headerName: 'Order ID', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'clientName', headerName: 'Client Name', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'service', headerName: 'Service', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'status', headerName: 'Status', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center',
      renderCell:(params)=> {
        const isOngoing = params.value === "Ongoing";
        const isReview = params.value === "Review";
        const isCompleted = params.value === "Completed";
        const isCancelled = params.value === "Cancelled";

        return (
          <Chip
        label={params.value}
        variant="outlined"
        size="large"
        color={
          isOngoing ? "warning" :
          isReview ? "primary" :
          isCompleted ? "success" :
          isCancelled ? "error" :
          "default"
        }
      />
        )
      }
    },
    { field: 'kickOffDate', headerName: 'KickOff Date', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'endDate', headerName: 'End Date', width: 175, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    {
      field: 'tasks',
      headerName:'Tasks',
      sortable: false, 
      filterable: false, 
      disableColumnMenu: true,
      field: 'taskButton',
      headerAlign:'center',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        
        <Tooltip TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        placement="top" 
        title={'Tasks'}>
          <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleTaskClick(params.row)}>
          <ListIcon />
        </IconButton>
        </Tooltip>
      )
    },
    {
      sortable: false, 
      filterable: false, 
      disableColumnMenu: true,
      field: 'infoButton',
      headerName: '',
      headerAlign:'center',
      width: 10,
      align: 'center',
      renderCell: (params) => (
        
        <Tooltip TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        placement="top" 
        title={'Order Information'}>
        <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleInfoClick(params.row)}>
          <InfoIcon />    
        </IconButton>
        </Tooltip>
      )
    },

    {
      sortable: false, 
      filterable: false, 
      disableColumnMenu: true,
      field: 'deleteButton',
      headerAlign:'center',
      headerName: '',
      width: 10,
      align: 'center',
      renderCell: (params) => {
        const { row } = params;
        // console.log(row)
        const canDelete = combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT";
    
        return canDelete ? (
          <IconButton
            style={{ color: 'rgb(127, 86, 217)' }}
            onClick={() => handleDeleteConfirmation(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        ) : null;
      }
    },
  ];

  const rows = originalRows.map((row, index) => ({
    id: row._id,
    orderId: row.orderId,
    clientName: clientNamesMap[row.clientId] || '', 
    service: serviceNamesMap[row.serviceId] || '',
    status: row.status,
    kickOffDate: new Date(row.kick_off_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    endDate: new Date(row.end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),

  }));
  
  function CustomToolbar() {
    return (
      <div style={{backgroundColor:'white', display: 'flex', justifyContent: 'flex-end'}}>
      <GridToolbarContainer>
        <GridToolbarColumnsButton  color= 'secondary'  />
        <GridToolbarFilterButton  color= 'secondary' />
        <GridToolbarDensitySelector  color= 'secondary' />
        <GridToolbarExport  color= 'secondary' />
      </GridToolbarContainer>
      </div>
    )
  }

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

  const location = useLocation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    const snackbar = location.state?.snackbar;
    if (snackbar) {
      setSnackbarMessage(snackbar.message);
      setSeverity(snackbar.severity);
      setSnackbarOpen(true);
    }
    // Clear the state to avoid showing the Snackbar again on subsequent renders
    history.replace({ ...location, state: undefined });
  }, [location.state, history]);

  useEffect(() => {

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      history.push({
        pathname: "/orders",
        state: {
          snackbar: {
            message: `Order Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });  
      dispatch({ type: DELETE_ORDER_RESET });
      // dispatch(addNotification({ message: 'Invoice Deletion Failed'}));
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert('Team Member deleted successfully');
      history.push('/orders');
      
      dispatch({ type: DELETE_ORDER_RESET });
      // dispatch(addNotification({ message: `Order ${selectedOrderName} Deleted Successfully`}));
      dispatch(createNotification(combined.user._id, `Order ${selectedOrderName} Deleted Successfully`));
      dispatch(createNotification(selectedClientFromOrder, `Order ${selectedOrderName} Deleted By ${role}: ${name}`));
      
      setSnackbarMessage('Order Deleted Successfully');
      setSnackbarOpen(true);
      setSeverity('success'); 
    }

    dispatch(getOrders());
  }, [dispatch, error, alert, isDeleted, deleteError, history]);
  
  
  return (
  <div>
      <MetaData title="Order -- Test" />
      <div className="order-dashboard-container" >
        <div className="btn" >
          {/* <Link to="/new/order" className="createbtn">Create</Link> */}
        
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
            <Typography color="rgb(127, 86, 217)">Orders</Typography>
          </Button>
          </Breadcrumbs>

          {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT" ? (
          
          <Button style={{backgroundColor:'rgb(127, 86, 217)',marginLeft: 'auto',}}onClick={handleOpen} variant="contained"  type="submit" >
            Create Order
          </Button>
        ) : null}

        </div>

        <CustomizedSnackbars
          open={snackbarOpen}
          handleClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          severity={severity}
        />

        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2"  style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>
                Create New Order
              </Typography>
              <NewOrder handleClose={handleClose} />
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
                Update Order
              </Typography>
              <UpdateOrder handleUpdateClose={handleUpdateClose} selectedOrderId={selectedOrderId} />
            </Box>
          </Modal>


          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </div>
          )}

          {rows.length === 0 ? (
            <Container style={{marginTop:'150px', textAlign:'center'}}>
              <img
                src={empty}
                alt="Empty Folder"
                style={{ width: "150px", height: "150px", marginBottom: "10px" }}
              />
              <Typography variant="h5" >Please Add An Order</Typography>
            </Container>
            ) : (
              <>
              {role === 'Super Admin' || role === 'Admin' || role === 'Project Manager' ? (
                <div style={{ height: 577, width: '100%' }}>
                <DataGrid
                rows={rows}
                columns={columns}
                pageSize={rowsPerPage}
                pagination
                slots={{ toolbar:  CustomToolbar }}

                // pageSizeOptions={[5]}
                initialState={{
                  // ...data.initialState,
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 15, 25]}
                onPageChange={handleChangePage}
                // rowsPerPageOptions={[5, 10, 15, 25]}
                page={page}
                loading={loading}
                disableRowSelectionOnClick
                
              />
              </div>
              ) : (
                role === 'Client' && (
                  <div style={{ height: 577, width: '100%' }}>
                <DataGrid
                rows={rows}
                columns={clientColumns}
                pageSize={rowsPerPage}
                pagination
                slots={{ toolbar:  CustomToolbar }}

                // pageSizeOptions={[5]}
                initialState={{
                  // ...data.initialState,
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 15, 25]}
                onPageChange={handleChangePage}
                // rowsPerPageOptions={[5, 10, 15, 25]}
                page={page}
                loading={loading}
                disableRowSelectionOnClick
                
              />
              </div>
                )
              )}
              
          {/* <TableContainer component={Paper} style={{ backgroundColor: 'rgb(233, 230, 251)'}} >
          <Table >
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
              {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} style={{borderBottom:'1px solid black'}}>
                        <TableCell style={{textAlign:'center'}}>{row.orderId}</TableCell>
                        <TableCell style={{textAlign:'center'}}>{clientNamesMap[row.clientId]}</TableCell>
                        <TableCell style={{textAlign:'center'}}>{serviceNamesMap[row.serviceId]}</TableCell>
                        <TableCell style={{textAlign:'center'}}>
                          <Chip
                            label={row.status}
                            variant="outlined"
                            size="medium"
                            color={
                              row.status === 'Cancelled' ? 'error' :
                              row.status === 'Ongoing' ? 'warning' :
                              row.status === 'Review' ? 'primary' :
                              row.status === 'Completed' ? 'success' :
                              'default' // Default color if none of the above conditions match
                            }
                          />
                        </TableCell>
                        <TableCell style={{textAlign:'center'}}>{new Date(row.kick_off_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</TableCell>
                        <TableCell style={{textAlign:'center'}}>{new Date(row.end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</TableCell>

                        <TableCell>
                            <Tooltip TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="top" 
                            title={'Order Information'}>
                            <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleInfoClick(row)}>
                              <InfoIcon />    
                            </IconButton>
                            </Tooltip>
                            
                            <Tooltip TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="top" 
                            title={'Tasks'}>
                              <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleTaskClick(row)}>
                              <ListIcon />
                            </IconButton>
                            </Tooltip>
                          
                          {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
                          
                          <Tooltip 
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="top" 
                            title={row.status === 'Cancelled' || row.status === 'Completed' ? `Can't Edit as Order is ${row.status}` : ''}
                          >
                            <span>
                              <IconButton
                                style={{ color: 'rgb(127, 86, 217)' }}
                                onClick={() => handleUpdateOpen(row._id)}
                                disabled={row.status === 'Cancelled' || row.status === 'Completed' || loading}
                              >
                                <EditIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : null}


                        {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT" ? (

                          <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleDeleteConfirmation(row._id)}>
                            <DeleteIcon />
                          </IconButton>
                        ) : null}

                        </TableCell>
                        
                      </TableRow>
                    );
                  })}
            </TableBody>
            
          </Table>
          
        </TableContainer>
        <TableFooter style={{ display: 'flex', justifyContent: 'flex-end', borderTop:'none' }}>
              <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            
            </TableFooter> */}
            </>
            )}

        <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle style={{ color: 'rgb(127, 86, 217)' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteOrder}
            variant="contained"
            color="error"
            style={{ backgroundColor: 'rgb(127, 86, 217)', color: 'white' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  )
}


export default Order;