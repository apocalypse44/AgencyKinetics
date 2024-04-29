import{useSelector, useDispatch} from "react-redux";
import React, { useEffect, useState } from 'react'
import MetaData from "../layout/MetaData";
import { useHistory } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min.js";
import "./Invoices.css"
import { deleteInvoice,clearErrors, getInvoice } from "../../actions/invoiceAction";
import { DELETE_INVOICE_RESET } from "../../constants/invoicesConstants";
import NewInvoice from "./NewInvoice";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Tooltip, Fade, TableFooter, TablePagination, Breadcrumbs, Container, CircularProgress } from '@mui/material';
import UpdateInvoice from "./UpdateInvoice";
import { addNotification, createNotification } from "../../actions/notificationAction";
import InfoIcon from '@mui/icons-material/Info';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CustomizedSnackbars from "../../snackbarToast";
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
  boxShadow: '5px 5px 5px 5px rgba(255, 177, 0, 0.9)',
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid rgb(127, 86, 217)',
  borderRadius: 5, 
  boxShadow: 24,
  overflow:'auto',
  p: 4,
  
};

const Invoices = () => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const history = useHistory();
const dispatch = useDispatch()
  const { error: deleteError, isDeleted } = useSelector((state) => state.invoiceDU);
  const {error, loading, invoices} = useSelector((state) => state.invoices)
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

  // const deleteInvoiceHandler = (id) => {
  //   dispatch(deleteInvoice(id));
  // };
const [orderNamesMap, setOrderNamesMap] = useState({});
  const [clientNamesMap, setClientNamesMap]=useState({});
  const [serviceNamesMap, setServiceNamesMap] = useState({});


  const [selectedInvoiceId, setSelectedInvoiceId] = useState('')
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleUpdateOpen = (invoiceId) => {
    // Store the selected invoiceId in the state or perform any other actions you need
    setSelectedInvoiceId(invoiceId);
  
    // Open the update modal
    setOpenUpdateModal(true);
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);


  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState(null);

  const [selectedInvoiceID, setselectedInvoiceID] = useState('')
  const [selectedClientFromInvoiceID, setselectedClientFromInvoiceID] = useState('')

  const getName = async (invoiceId) => {
    console.log(invoiceId)
    try {
      const response = await fetch(`/test/v1/invoice/${invoiceId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.status}`);
      }
      const data = await response.json();
      console.log('Invoices data:', data);
      setselectedInvoiceID(data.invoice.invoiceId)
      setselectedClientFromInvoiceID(data.invoice.client_name)

      console.log(selectedInvoiceID)
    } catch (error) {
      console.error('Error fetching invoices:', error.message);
    }
  };

  const handleDeleteConfirmation = (invoiceId) => {
    setInvoiceIdToDelete(invoiceId);
    setOpenConfirmDialog(true);
    getName(invoiceId)

  };

  // const handleDeleteConfirmation = (invoiceId) => {
  //   setInvoiceIdToDelete(invoiceId);
  //   setOpenConfirmDialog(true);
  // };

  const handleDeleteInvoice = () => {
    dispatch(deleteInvoice(invoiceIdToDelete));
    setInvoiceIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setInvoiceIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleBreadcrumbClick = () => {
    history.push('/invoices');
  };

  const [breadcrumbs, setBreadcrumbs] = React.useState([
    <Button color="inherit" href="/invoices" onClick={() => history.push('/invoices')}>
      Invoices
    </Button>
  ]);

  const handleInfoClick = (row) => {
    console.log(row)
    history.push(`/invoice/${row.id}`)
    setBreadcrumbs([
      <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
        Invoices
      </Button>,
      <Typography color="textPrimary">Invoice Details</Typography>
    ]);
  };

  const originalRows = invoices
  console.log(originalRows)
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
  //   { id: 'invoiceId', label: 'Invoice ID', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'orderId', label: 'Order ID', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'clientName', label: 'Client Name', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'amount', label: 'Amount', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'status', label: 'Status', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'issuedAt', label: 'Issued At', minWidth: 100, align: 'center', fontWeight: 'bold' },
  // ];
  const columns = [
    { field: 'invoiceId', headerName: 'Invoice ID', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'orderId', headerName: 'Order ID', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'clientName', headerName: 'Client Name', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'amount', headerName: 'Amount', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'status', headerName: 'Status', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center', 
      renderCell:(params)=> {
      const isVoid = params.value === "Void";
      const isOpen = params.value === "Open";
      const isDraft = params.value === "Draft";
      const isPaid = params.value === "Paid";
      const isUncollectable = params.value === "Uncollectable";

      return (
        <Chip
      label={params.value}
      variant="outlined"
      size="large"
      color={
        isVoid ? "error" :
        isOpen ? "primary" :
        isDraft ? "warning" :
        isPaid ? "success" :
        isUncollectable ? "secondary" :
        "default"
      }
    />
      )
    } },
    { field: 'createdAt', headerName: 'Issued At', minWidth: 100, align: 'center', fontWeight: 'bold', headerAlign:'center' },
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
          title={'Invoice Information'}
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
        const isPaidOrVoid = row.status === 'Paid' || row.status === 'Void';
        
        return canEdit ? (
          <Tooltip 
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            placement="top" 
            title={isPaidOrVoid ? `Can't Edit as Invoice is ${row.status}` : 'Edit Invoice'}
          >
            <span>
              <IconButton
                style={{ color: 'rgb(127, 86, 217)' }}
                onClick={() => handleUpdateOpen(row.id)}
                disabled={isPaidOrVoid || loading}
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
    { field: 'invoiceId', headerName: 'Invoice ID', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'orderId', headerName: 'Order ID', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'clientName', headerName: 'Client Name', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'amount', headerName: 'Amount', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'status', headerName: 'Status', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center', 
      renderCell:(params)=> {
      const isVoid = params.value === "Void";
      const isOpen = params.value === "Open";
      const isDraft = params.value === "Draft";
      const isPaid = params.value === "Paid";
      const isUncollectable = params.value === "Uncollectable";

      return (
        <Chip
      label={params.value}
      variant="outlined"
      size="large"
      color={
        isVoid ? "error" :
        isOpen ? "primary" :
        isDraft ? "warning" :
        isPaid ? "success" :
        isUncollectable ? "secondary" :
        "default"
      }
    />
      )
    } },
    { field: 'createdAt', headerName: 'Issued At', minWidth: 100, align: 'center', fontWeight: 'bold', headerAlign:'center' },
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
          title={'Invoice Information'}
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
    invoiceId: row.invoiceId,
    orderId: orderNamesMap[row.orderId] || '', // Map order ID to its corresponding name
    clientName: clientNamesMap[row.client_name] || '', // Map client name using client name map
    amount: row.amount || '', // Assuming 'amount' is directly available
    status: row.status,
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
        console.log("OM", orderMap)
        setOrderNamesMap(orderMap);
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };
    fetchOrderData();
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
          clientMap[combined._id] = combined.fname + ' ' + combined.lname;
        });
console.log("ahjshjhajhj",clientMap)
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError)  {
      // alert.error(deleteError);
      history.push({
        pathname: "/invoices",
        state: {
          snackbar: {
            message: `Invoice Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });  
      dispatch({ type: DELETE_INVOICE_RESET });
      // dispatch(addNotification({ message: 'Invoice Deletion Failed'}));
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert('Invoice deleted successfully');
      history.push('/invoices');
      dispatch({ type: DELETE_INVOICE_RESET });
      // dispatch(addNotification({ message: `Invoice ${selectedInvoiceID} Deleted Successfully`}));
      dispatch(createNotification(selectedClientFromInvoiceID, `Invoice ${selectedInvoiceID} Deleted Successfully By ${role}: ${name}`));
      dispatch(createNotification(combined.user._id, `Invoice ${selectedInvoiceID} Deleted Successfully`));

      setSnackbarMessage("Invoice Deleted Successfully");
      setSeverity('success');
      setSnackbarOpen(true);
    }

    dispatch(getInvoice());
  }, [dispatch, error, alert, isDeleted, deleteError, history]);
  return (
<div>
      <MetaData title="Invoice -- Test" />
      <div className="invoice-dashboard-container">
      <CustomizedSnackbars
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={severity}
      />
       <div className="btn">
  <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
    <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
      <Typography color="rgb(127, 86, 217)">Invoices</Typography>
    </Button>
  </Breadcrumbs>
  
  {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
    <Button 
      style={{backgroundColor:'rgb(127, 86, 217)', marginLeft: 'auto'}}
      onClick={handleOpen} 
      variant="contained"  
      type="submit"
    >
      Create Invoice
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
                Create New Invoice
              </Typography>
              <NewInvoice handleClose={handleClose} />
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
                Update Invoice
              </Typography>
              <UpdateInvoice handleUpdateClose={handleUpdateClose} selectedInvoiceId={selectedInvoiceId} />
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
              <Typography variant="h5" >Please Create An Invoice</Typography>
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
          <Table >
            <TableHead >
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
                        <TableCell style={{textAlign:'center'}}>{row.invoiceId}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{orderNamesMap[row.orderId]}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{clientNamesMap[row.client_name]}</TableCell>
                    <TableCell style={{textAlign:'center'}}>{row.amount}</TableCell>
                    <TableCell style={{textAlign:'center'}}>
                      <Chip 
                        label={row.status}
                        variant="outlined"
                        size="medium"
                        color={
                          row.status === 'Void' ? 'error' :
                          row.status === 'Open' ? 'primary' :
                          row.status === 'Draft' ? 'warning' :
                          row.status === 'Paid' ? 'success' :
                          row.status === 'Uncollectable' ? 'secondary' :
                          'default' 
                        }
                      />
                    </TableCell>

                    <TableCell style={{textAlign:'center'}}>
                    {new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Tooltip TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="top" 
                            title={'Invoice Information'}>
                            <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleInfoClick(row)}>
                              <InfoIcon />    
                            </IconButton>
                        </Tooltip>

                        {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
                        <Tooltip 
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          placement="top" 
                          title={row.status === 'Paid' || row.status === 'Void' ? `Can't Edit as Invoice is ${row.status}` : ''}
                        >
                          <span>
                            <IconButton
                              style={{ color: 'rgb(127, 86, 217)' }}
                              onClick={() => handleUpdateOpen(row._id)}
                              disabled={row.status === 'Paid' || row.status === 'Void' || loading}
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null}
      

                    {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
                      <IconButton
                        style={{ color: 'rgb(127, 86, 217)' }}
                        onClick={() => handleDeleteConfirmation(row._id)}
                      >
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
              rowsPerPageOptions={[5, 10, 15, 20, 15, 25]}
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
          Are you sure you want to delete this invoice?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteInvoice}
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
export default Invoices;