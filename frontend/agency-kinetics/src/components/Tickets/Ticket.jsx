import{useSelector, useDispatch} from "react-redux";
import React, { useEffect, useState } from 'react'
import MetaData from "../layout/MetaData";
import { useHistory } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min.js";
import "./Ticket.css"
import { deleteTicket,clearErrors, getTickets } from "../../actions/ticketAction";
import { DELETE_TICKET_RESET } from "../../constants/ticketConstants";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NewTicket from "./NewTicket";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Container, CircularProgress } from '@mui/material';
import CustomizedSnackbars from "../../snackbarToast";
import { addNotification, createNotification } from "../../actions/notificationAction";
import UpdateTicket from "./UpdateTicket";
import InfoIcon from '@mui/icons-material/Info';
import { Fade, IconButton, TableFooter, TablePagination, Tooltip } from "@material-ui/core";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs } from "@material-ui/core";
import DOMPurify from 'dompurify';
import empty from '../../Images/empty-folder.png'
import { DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';

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

const Ticket = () => {
  const history = useHistory();
const dispatch = useDispatch()
const {error, loading,tickets} = useSelector((state)=>state.tickets)
  const { error: deleteError, isDeleted } = useSelector((state) => state.ticketDU);
  // console.log(tickets)
  const [orderNamesMap, setOrderNamesMap] = useState({});
  const [clientNamesMap, setClientNamesMap] = useState({});
  const [teamNamesMap, setTeamNamesMap] = useState({});


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

  const [selectedClientFromTicket, setselectedClientFromTicket] = useState('')

  const getName = async (ticketId) => {
    try {
      const response = await fetch(`/test/v1/ticket/${ticketId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tickets: ${response.status}`);
      }
      const data = await response.json();
      console.log('Tickets data:', data);
      setselectedClientFromTicket(data.ticket.client_name)

    } catch (error) {
      console.error('Error fetching tickets:', error.message);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  
  const [selectedTicketId, setSelectedTicketId] = useState('')
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const handleUpdateOpen = (ticketId) => {
    // Store the selected ticketId in the state or perform any other actions you need
    setSelectedTicketId(ticketId);
  
    // Open the update modal
    setOpenUpdateModal(true);
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [ticketIdToDelete, setTicketIdToDelete] = useState(null);
  const [deletedTicket, setDeletedTicket] = useState(null);

  const handleDeleteConfirmation = (ticketId) => {
    setTicketIdToDelete(ticketId);
    setOpenConfirmDialog(true);
    setDeletedTicket(ticketId)
    getName(ticketId)
  };

  const handleDeleteTicket = () => {
    dispatch(deleteTicket(ticketIdToDelete));
    setTicketIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setTicketIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  // const deleteTicketHandler = (id) => {
  //   dispatch(deleteTicket(id));
  // };

  const originalRows = tickets
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
  //   { id: 'ticketId', label: 'Ticket ID', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'subjectId', label: 'Subject', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'client', label: 'Client', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'assignedTo', label: 'Assigned To', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'orderId', label: 'Order ID', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'status', label: 'Status', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'priority', label: 'Priority', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'issuedAt', label: 'Issued At', minWidth: 100, align: 'center', fontWeight: 'bold' },
  // ];

  const columns = [
    { field: 'ticketId', headerName: 'Ticket ID', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'subject', headerName: 'Subject', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'client', headerName: 'Client', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'assignedTo', headerName: 'Assigned To', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'orderId', headerName: 'Order ID', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'status', headerName: 'Status', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center',
    renderCell:(params)=> {
      const isOpen = params.value === "Open";
      const isHold = params.value === "Hold";
      const isClose = params.value === "Close";

      return (
        <Chip
      label={params.value}
      variant="outlined"
      size="large"
      color={
        isHold ? "warning" :
        isOpen ? "success" :
        isClose ? "error" :
        "default"
      }
    />
      )
    }
    },
    { field: 'priority', headerName: 'Priority', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center',
    renderCell:(params)=> {
      const isHighest = params.value === "Highest";
      const isHigh = params.value === "High";
      const isNormal = params.value === "Normal";
      const isLow = params.value === "Low";
      const isLowest = params.value === "Lowest";

      return (
        <Chip
      label={params.value}
      variant="outlined"
      size="large"
      color={
        isHighest ? "error" :
        isHigh ? "warning" :
        isNormal ? "primary" :
        isLow ? "success" :
        isLowest ? "default" :
        "default"
      }
    />
      )
    }
    },
    { field: 'issuedAt', headerName: 'Issued At', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
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
        
        <Tooltip 
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          placement="top" 
          title={'Ticket Information'}
        >
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
        const isClosed = row.status === 'Close';
        
        return canEdit ? (
          <Tooltip 
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            placement="top" 
            title={isClosed ? `Can't Edit as Ticket Status is ${row.status}` : 'Edit Invoice'}
          >
            <span>
              <IconButton
                style={{ color: 'rgb(127, 86, 217)' }}
                onClick={() => handleUpdateOpen(row.id)}
                disabled={isClosed || loading}
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
        const canDelete = combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER";
    
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
    { field: 'ticketId', headerName: 'Ticket ID', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'subject', headerName: 'Subject', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'client', headerName: 'Client', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'assignedTo', headerName: 'Assigned To', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'orderId', headerName: 'Order ID', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'status', headerName: 'Status', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center',
    renderCell:(params)=> {
      const isOpen = params.value === "Open";
      const isHold = params.value === "Hold";
      const isClose = params.value === "Close";

      return (
        <Chip
      label={params.value}
      variant="outlined"
      size="large"
      color={
        isHold ? "warning" :
        isOpen ? "success" :
        isClose ? "error" :
        "default"
      }
    />
      )
    }
    },
    { field: 'priority', headerName: 'Priority', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center',
    renderCell:(params)=> {
      const isHighest = params.value === "Highest";
      const isHigh = params.value === "High";
      const isNormal = params.value === "Normal";
      const isLow = params.value === "Low";
      const isLowest = params.value === "Lowest";

      return (
        <Chip
      label={params.value}
      variant="outlined"
      size="large"
      color={
        isHighest ? "error" :
        isHigh ? "warning" :
        isNormal ? "primary" :
        isLow ? "success" :
        isLowest ? "default" :
        "default"
      }
    />
      )
    }
    },
    { field: 'issuedAt', headerName: 'Issued At', width: 140, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    {
      sortable: false, 
      filterable: false, 
      disableColumnMenu: true,
      field: 'infoButton',
      headerName: '',
      headerAlign:'center',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        
        <Tooltip 
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          placement="top" 
          title={'Ticket Information'}
        >
          <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleInfoClick(params.row)}>
            <InfoIcon />    
          </IconButton>
        </Tooltip>
      )
    },
    

  ];

  const rows = originalRows.map((row, index) => ({
    id: row._id,
    ticketId: `#${row._id.slice(-4)}`,
    subject: row.subject,
    client: clientNamesMap[row.client_name],
    assignedTo: teamNamesMap[row.assignee] || '',
    orderId: orderNamesMap[row.orderId] || '', // Map client name using client name map
    status: row.status,
    priority: row.priority,
    issuedAt: new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
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

  const handleBreadcrumbClick = () => {
    history.push('/tickets');
  };

  const [breadcrumbs, setBreadcrumbs] = React.useState([
    <Button color="inherit" href="/tickets" onClick={() => history.push('/tickets')}>
      Quotes
    </Button>
  ]);

  const handleInfoClick = (row) => {
    console.log("row", row);
    history.push(`/ticket/${row.id}`)
    setBreadcrumbs([
      <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
        Tickets
      </Button>,
      <Typography color="textPrimary">Ticket Details</Typography>
    ]);
  };

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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


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
        // console.log(clientMap)
        setClientNamesMap(clientMap);
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };
    fetchClientData();
  }, []);


  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch('/test/v1/orders');
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status}`);
        }
        const data = await response.json();
        console.log('Orders data:', data);

        const orderMap = {};
        data.orders.forEach((order) => {
          orderMap[order._id] = order.orderId;
        });
        // console.log(orderMap)
        setOrderNamesMap(orderMap);
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };
    fetchOrderData();
  }, []);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch('/test/v1/combined/getAllTeam');
        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.status}`);
        }
        const data = await response.json();
        console.log('Teams data:', data);

        const teamMap = {};
        data.combined.forEach((combined) => {
          teamMap[combined._id] = combined.fname + " " + combined.lname;
        });
        // console.log(clientMap)
        setTeamNamesMap(teamMap);
      } catch (error) {
        console.error('Error fetching teams:', error.message);
      }
    };
    fetchTeamData();
  }, []);


  useEffect(() => {

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      // alert.error(deleteError);
      history.push({
        pathname: "/tickets",
        state: {
          snackbar: {
            message: `Ticket Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });      
      dispatch({ type: DELETE_TICKET_RESET });
      // dispatch(addNotification({ message: 'Ticket Deletion Failed'}));
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert('Ticket deleted successfully');
      history.push('/tickets');
      // history.push('/tickets');
      dispatch({ type: DELETE_TICKET_RESET });
      // dispatch(addNotification({ message: `Ticket #${deletedTicket.slice(-4)} Deleted Successfully`}));
      dispatch(createNotification(combined.user._id, `Ticket #${deletedTicket.slice(-4)} Deleted Successfully`));
      dispatch(createNotification(selectedClientFromTicket, `Ticket #${deletedTicket.slice(-4)} Deleted By ${role}: ${name}`));
      setSnackbarMessage("Ticket Deleted Successfully");
      setSeverity('success');
      setSnackbarOpen(true);
    }

    dispatch(getTickets());
  }, [dispatch, error, alert, isDeleted, deleteError, history]);
  return (
    <div>
        <CustomizedSnackbars
            open={snackbarOpen}
            handleClose={handleCloseSnackbar}
            message={snackbarMessage}
            severity={severity}
          />
      <MetaData title="Ticket -- Test" />
      <div className="ticket-dashboard-container">
        <div className="btn">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
        <Typography color="rgb(127, 86, 217)">Tickets</Typography>
      </Button>
      </Breadcrumbs>
          {/* <Link to="/new/ticket" className="createbtn">Create</Link> */}
          
          {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT" ? (
            <Button 
              style={{backgroundColor:'rgb(127, 86, 217)', marginLeft: 'auto'}}
              onClick={handleOpen} 
              variant="contained"  
              type="submit"
            >
              Create Ticket
            </Button>
          ) : null}
        </div>


        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>
                Create New Ticket
              </Typography>
              <NewTicket handleClose={handleClose} />
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
                Update Ticket
              </Typography>
              <UpdateTicket handleUpdateClose={handleUpdateClose} selectedTicketId={selectedTicketId} />
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
              <Typography variant="h5" >Please Create A Ticket</Typography>
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
              {/* <TableContainer component={Paper} style={{ backgroundColor: 'rgb(233, 230, 251)'}}>
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
              {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} style={{borderBottom:'1px solid black'}}>
                        <TableCell style={{ textAlign: 'center' }}>#{row._id.slice(-4)}</TableCell>

                        <TableCell style={{ textAlign: 'center' }}>{row.subject}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{clientNamesMap[row.client_name]}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{teamNamesMap[row.assignee]}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{orderNamesMap[row.orderId]}</TableCell>

                    <TableCell style={{ textAlign: 'center' }}>
                      <Chip
                        label={row.status}
                        variant="outlined"
                        size="medium"
                        color={
                          row.status === 'Open' ? 'success' :
                          row.status === 'Hold' ? 'warning' :
                          row.status === 'Close' ? 'error' :
                          'default' // Default color if none of the above conditions match
                        }
                      />
                    </TableCell>

                    <TableCell style={{ textAlign: 'center' }}>
                      <Chip
                        label={row.priority}
                        variant="outlined"
                        size="medium"
                        color={
                          row.priority === 'High' ? 'warning' :
                          row.priority === 'Highest' ? 'error' :
                          row.priority === 'Low' ? 'default' :
                          row.priority === 'Lowest' ? 'success' :
                          row.priority === 'Normal' ? 'primary' :

                          'default' // Default color if none of the above conditions match
                        }
                      />
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                    {new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell>
                    <Tooltip TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="top" 
                            title={'Ticket Information'}>
                            <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleInfoClick(row)}>
                              <InfoIcon />    
                            </IconButton>
                    </Tooltip>
                    
                    {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
                      <Tooltip 
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              placement="top" 
                              title={row.status === 'Close' ? `Can't Edit as Ticket is ${row.status}` : ''}
                            >
                              <span>
                                <IconButton
                                  style={{ color: 'rgb(127, 86, 217)' }}
                                  onClick={() => handleUpdateOpen(row._id)}
                                  disabled={row.status === 'Close' || loading}
                                >
                                  <EditIcon />
                                </IconButton>
                              </span>
                      </Tooltip>
                      ) : null}

                    {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (

                      <IconButton style={{color:'rgb(127, 86, 217)'}}onClick={() => handleDeleteConfirmation(row._id)}>
                        <DeleteIcon />
                      </IconButton>
                    ) : null}


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
        <DialogTitle  style={{ color: 'rgb(127, 86, 217)' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this ticket?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteTicket}
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
export default Ticket;



