import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from 'react';
import MetaData from "../layout/MetaData";
import { deleteClient, clearErrors, getClient, getClientDetails } from "../../actions/clientAction";
import { useHistory } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { DELETE_CLIENT_RESET } from "../../constants/clientsConstants";
import "./Client.css";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NewClient from './NewClient'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { addNotification, createNotification } from "../../actions/notificationAction";
import InfoIcon from '@mui/icons-material/Info';
import ListIcon from '@mui/icons-material/List';
import { Breadcrumbs, Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableFooter, TablePagination, Tooltip, Fade, CircularProgress, Container } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import empty from '../../Images/empty-folder.png'
import { DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';


import UpdateClient from "./UpdateClient";
import CustomizedSnackbars from "../../snackbarToast";
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
  width: 800,
  height: 600,
  boxShadow: '5px 5px 5px 5px rgba(255, 177, 0, 0.9)',
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid rgb(127, 86, 217)',
  borderRadius: 5, // Set border radius to 0 for rectangular border
  boxShadow: 24,
  overflow:'auto',
  p: 4,
  
};

const Client = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { error, loading, combined: clients } = useSelector((state) => state.clients);
  const { error: deleteError, isDeleted } = useSelector((state) => state.clientDU);
    console.log(clients)
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

  const [selectedClientName, setselectedClientName] = useState('')
  const getName = async (clientId) => {
    try {
      const response = await fetch(`/test/v1/get/client/${clientId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch client: ${response.status}`);
      }
      const data = await response.json();
      console.log('Client data:', data);
      setselectedClientName(data.combined.fname + ' ' + data.combined.lname)
      console.log(selectedClientName)
    } catch (error) {
      console.error('Error fetching Client:', error.message);
    }
  };
  

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('')

  const handleUpdateOpen = (clientId) => {
    // // Store the selected clientId in the state or perform any other actions you need
    // if (!clients.find(client => client._id === clientId)) {
    //   // Dispatch action to get client details
    //   dispatch(getClientDetails(clientId));
    // }
    setSelectedClientId(clientId);
  
    // Open the update modal
    setOpenUpdateModal(true);
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);

  const handleDeleteConfirmation = (clientId) => {
    console.log(clientId)
    setClientIdToDelete(clientId);
    setOpenConfirmDialog(true);
    getName(clientId)
  };

  const handleDeleteClient = () => {
    dispatch(deleteClient(clientIdToDelete));
    setClientIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setClientIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  // const deleteClientHandler = (id) => {
  //   dispatch(deleteClient(id));
  // };

    // const modifiedOrders = clients.map((order) => ({
    //   ...order,
    //   createdAt: clients.createdAt ? clients.createdAt.slice(0, 15) : '',
    // }))

    const handleBreadcrumbClick = () => {
      history.push('/clients');
    };
  
    const [breadcrumbs, setBreadcrumbs] = React.useState([
      <Button color="inherit" href="/clients" onClick={() => history.push('/clients')}>
        Clients
      </Button>
    ]);
  
    const handleInfoClick = (row) => {
      console.log(row)
      history.push(`/client/${row.id}`)
      setBreadcrumbs([
        <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
          Clients
        </Button>,
        <Typography color="textPrimary">Client Details</Typography>
      ]);
    };


    const originalRows = clients
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { field: 'clientId', headerName: 'Client ID', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'clientEmail', headerName: 'Client Email', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'clientName', headerName: 'Client Name', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'address', headerName: 'Address', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'createdAt', headerName: 'Created On', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
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
        title={'Client Information'}>
        <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleInfoClick(params.row)}>
          <InfoIcon />    
        </IconButton>
        </Tooltip>
      )
    },
    // {
  //     sortable: false, 
  // filterable: false, 
  // disableColumnMenu: true,
    //   field: 'editButton',
    //   headerAlign:'center',
    //   headerName: '',
    //   width: 10,
    //   align: 'center',
    //   renderCell: (params) => {
    //     const { row } = params;
    //     console.log(row)
    //     const canEdit = combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER";
    //     const isPaidOrVoid = row.status === 'Paid' || row.status === 'Void';
        
    //     return canEdit ? (
    //       <Tooltip 
    //         TransitionComponent={Fade}
    //         TransitionProps={{ timeout: 600 }}
    //         placement="top" 
    //         title={isPaidOrVoid ? `Can't Edit as Invoice is ${row.status}` : 'Edit Invoice'}
    //       >
    //         <span>
    //           <IconButton
    //             style={{ color: 'rgb(127, 86, 217)' }}
    //             onClick={() => handleUpdateOpen(row.id)}
    //             disabled={isPaidOrVoid || loading}
    //           >
    //             <EditIcon />
    //           </IconButton>
    //         </span>
    //       </Tooltip>
    //     ) : null;
    //   }
    // },
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
        const canDelete = combined.user.role === "SUPERADMIN"
    
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
    clientId: `#${row._id.slice(-4)}`,
    clientEmail: row.email,
    clientName: row.fname + ' ' + row.lname, 
    address: `${row.city}, ${row.state}, ${row.country}`,
    createdAt: new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
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
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      // alert.error(deleteError);
      history.push({
        pathname: "/clients",
        state: {
          snackbar: {
            message: `Client Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });      
      dispatch({ type: DELETE_CLIENT_RESET });
      // dispatch(addNotification({ message: 'Client Deletion Failed'}));
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert('Client deleted successfully');
      history.push('/clients');
      dispatch({ type: DELETE_CLIENT_RESET });
      // dispatch(addNotification({ message: 'Client Deleted Successfully'}));
      dispatch(createNotification(combined.user._id, `Client ${selectedClientName} Deleted Successfully`));
      
      setSnackbarMessage("Client Deleted Successfully");
      setSeverity('success');
      setSnackbarOpen(true);
    }

    dispatch(getClient());
  }, [dispatch, error, alert, isDeleted, deleteError, history]);

  
  

  return (
    <div>
      <CustomizedSnackbars
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={severity}
      />
      <MetaData title="Client -- Test" />
      <div className="client-container">
        <div className="btn">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
          <Typography color="rgb(127, 86, 217)">Clients</Typography>
        </Button>
        </Breadcrumbs>
        
        {combined.user.role === "SUPERADMIN"  ? (
        <Button style={{backgroundColor:'rgb(127, 86, 217)',marginLeft: 'auto',}}onClick={handleOpen} variant="contained"  type="submit" >
            Create Client
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
            <Typography id="modal-modal-title" variant="h6" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }} component="h2">
              Create New Client
            </Typography>
            <NewClient handleClose={handleClose} />
          </Box>
        </Modal>

        <Modal
            open={openUpdateModal}
            onClose={handleUpdateClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={updateStyle}>
              <Typography id="modal-modal-title" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }} variant="h6" component="h2">
                Update Client
              </Typography>
              <UpdateClient handleUpdateClose={handleUpdateClose} selectedClientId={selectedClientId} />
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
              <Typography variant="h5" >Please Create A Client</Typography>
            </Container>
            ) : (
              <> 
              <div style={{ height: 577, width: '100%', '& .bold-header': {
          backgroundColor: 'rgba(255, 7, 0, 0.55)',
        }, }}>
              <DataGrid
              rows={rows}
              columns={columns}
              pageSize={rowsPerPage}
                slots={{ toolbar:  CustomToolbar }}
                pagination
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
        {/* <TableContainer component={Paper} style={{ backgroundColor: 'rgb(233, 230, 251)' }}>
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

            {originalRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} style={{borderBottom:'1px solid black'}}>

                    <TableCell style={{ textAlign: 'center' }}>#{row._id && row._id.slice(19, 23)}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.email}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.fname} {row.lname}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.country}, {row.state}, {row.city}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                    {new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</TableCell>

                    <TableCell>

                    <Tooltip TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="top" 
                            title={'Client Information'}>
                            <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleInfoClick(row)}>
                              <InfoIcon />    
                            </IconButton>
                            </Tooltip> */}
                    {/* <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleUpdateOpen(row._id) }>  
                      <EditIcon />
                    </IconButton> */}
                  
                  {/* {combined.user.role === "SUPERADMIN"  ? (

                      <IconButton style={{color:'rgb(127, 86, 217)'}}onClick={() => handleDeleteConfirmation(row._id)}>
                        <DeleteIcon />
                      </IconButton>
                  ) : null}
                    
                    </TableCell>
                  </TableRow>
                    )
                  })}

            </TableBody>
          </Table>
        </TableContainer>
        <TableFooter style={{ display: 'flex', justifyContent: 'flex-end', borderTop:'none' }}>
              <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20]}
              component="div"
              count={originalRows.length}
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
          Are you sure you want to delete this Client?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteClient}
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
  );

}

export default Client;
