import{useSelector, useDispatch} from "react-redux";
import React, { useEffect, useState } from 'react'
import MetaData from "../layout/MetaData";
import { useHistory } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min.js";
// import "./Quote.css"
import { deleteQuote, clearErrors, getQuote } from "../../actions/quoteAction";
import { DELETE_QUOTE_RESET } from "../../constants/quoteConstants";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NewQuote from "./NewQuote";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Tooltip, Fade, TableFooter, TablePagination, Container, CircularProgress } from '@mui/material';
import { addNotification, createNotification } from "../../actions/notificationAction";
import UpdateQuote from "./UpdateQuote";
import InfoIcon from '@mui/icons-material/Info';
import { Breadcrumbs } from "@material-ui/core";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CustomizedSnackbars from "../../snackbarToast";
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import empty from '../../Images/empty-folder.png'
import { DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';

// import CloseIcon from '@mui/icons-material/Close';
// import WarningIcon from '@mui/icons-material/Warning';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// const statusIconMapping = {
//   Rejected: <CloseIcon />,
//   Pending: <WarningIcon />,
//   Accepted: <CheckCircleIcon />,
// };

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  height: 650,
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

const Quotes = () => {
  const handleBreadcrumbClick = () => {
    history.push('/quotes');
  };
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

  const {error, loading,quotes} = useSelector((state)=>state.quotes)
  console.log('QQQ', quotes)
  
  // const { quote } = useSelector((state) => state.quoteDetails);
  // console.log("qt", quote);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [selectedQuoteId, setSelectedQuoteId] = useState('')
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleUpdateOpen = (quoteId) => {
    // Store the selected quoteId in the state or perform any other actions you need
    setSelectedQuoteId(quoteId);
  
    // Open the update modal
    setOpenUpdateModal(true);
  };
  const handleUpdateClose = () => setOpenUpdateModal(false);

  const [serviceNamesMap, setServiceNamesMap] = useState({})
  const { error: deleteError, isDeleted } = useSelector((state) => state.quoteDU);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [quoteIdToDelete, setQuoteIdToDelete] = useState(null);
  const handleDeleteConfirmation = (quoteId) => {
    setQuoteIdToDelete(quoteId);
    setOpenConfirmDialog(true);
  };

  const handleDeleteQuote = () => {
    dispatch(deleteQuote(quoteIdToDelete));
    setQuoteIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setQuoteIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  // const deleteQuoteHandler = (id) => {
  //   dispatch(deleteQuote(id));
  // };
  const [breadcrumbs, setBreadcrumbs] = React.useState([
    <Link color="inherit" href="/quotes" onClick={() => history.push('/quotes')}>
      Quotes
    </Link>
  ]);

  const handleInfoClick = (row) => {
    console.log("row", row);
    history.push(`/quote/${row.id}`)
    setBreadcrumbs([
      <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
        Quotes
      </Button>,
      <Typography color="textPrimary">Quote Details</Typography>
    ]);
  };

  
  
  const originalRows = quotes
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
  //   { id: 'proposalId', label: 'Proposal ID', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'service', label: 'Service', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'selected', label: 'Selected', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'createdAt', label: 'Created At', minWidth: 100, align: 'center', fontWeight: 'bold' },
  //   { id: 'budget', label: 'Budget', minWidth: 100, align: 'center', fontWeight: 'bold' },
  // ];

  const columns = [
    { field: 'proposalId', headerName: 'Proposal ID', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'service', headerName: 'Service', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'status', headerName: 'Status', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center',
        renderCell:(params)=> {
          const isRejected = params.value === "Rejected";
          const isPending = params.value === "Pending";
          const isAccepted = params.value === "Accepted";

          return (
            <Chip
          label={params.value}
          variant="outlined"
          size="large"
          color={
            isRejected ? "error" :
            isPending ? "primary" :
            isAccepted ? "success" :
            "default"
          }
        />
          )
        }  
    },
    { field: 'createdAt', headerName: 'Created At', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'budget', headerName: 'Budget', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
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
          title={'Proposal Information'}>
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
      field: 'downloadButton',
      headerName: '',
      headerAlign:'center',
      width: 10,
      align: 'center',
      renderCell: (params) => {
        const { row } = params;
        // console.log("Row index:", row.rowIndex);
        return (
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            placement="top"
            title={documentSrc[row.rowIndex] ? 'Download Attachment' : 'Attachment not available'}
          >
            <span>
              <IconButton
                style={{ color: 'rgb(127, 86, 217)' }}
                onClick={() => handleDownloadClick(row.rowIndex)}
                disabled={!documentSrc[row.rowIndex]}
              >
                {documentSrc[row.rowIndex] ? <DownloadIcon /> : <FileDownloadOffIcon />}
              </IconButton>
            </span>
          </Tooltip>
        );
        },
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
        // console.log(row)
        const canEdit = combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT";
        const isRejectedorAccepted = row.selected === 'Rejected' || row.selected === 'Accepted';
        
        return canEdit ? (
          <Tooltip 
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            placement="top" 
            title={isRejectedorAccepted ? `Can't Edit as Invoice is ${row.status}` : 'Edit Invoice'}
          >
            <span>
              <IconButton
                style={{ color: 'rgb(127, 86, 217)' }}
                onClick={() => handleUpdateOpen(row.id)}
                disabled={isRejectedorAccepted || loading}
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
    { field: 'proposalId', headerName: 'Proposal ID', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'service', headerName: 'Service', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'status', headerName: 'Status', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center',
        renderCell:(params)=> {
          const isRejected = params.value === "Rejected";
          const isPending = params.value === "Pending";
          const isAccepted = params.value === "Accepted";

          return (
            <Chip
          label={params.value}
          variant="outlined"
          size="large"
          color={
            isRejected ? "error" :
            isPending ? "primary" :
            isAccepted ? "success" :
            "default"
          }
        />
          )
        }  
    },
    { field: 'createdAt', headerName: 'Created At', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'budget', headerName: 'Budget', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
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
          title={'Proposal Information'}>
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
      field: 'downloadButton',
      headerName: '',
      headerAlign:'center',
      width: 10,
      align: 'center',
      renderCell: (params) => {
        const { row } = params;
        // console.log("Row index:", row.rowIndex);
        return (
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            placement="top"
            title={documentSrc[row.rowIndex] ? 'Download Attachment' : 'Attachment not available'}
          >
            <span>
              <IconButton
                style={{ color: 'rgb(127, 86, 217)' }}
                onClick={() => handleDownloadClick(row.rowIndex)}
                disabled={!documentSrc[row.rowIndex]}
              >
                {documentSrc[row.rowIndex] ? <DownloadIcon /> : <FileDownloadOffIcon />}
              </IconButton>
            </span>
          </Tooltip>
        );
        },
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
        // console.log(row)
        const canEdit = combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT";
        const isRejectedorAccepted = row.selected === 'Rejected' || row.selected === 'Accepted';
        
        return canEdit ? (
          <Tooltip 
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            placement="top" 
            title={isRejectedorAccepted ? `Can't Edit as Invoice is ${row.status}` : 'Edit Invoice'}
          >
            <span>
              <IconButton
                style={{ color: 'rgb(127, 86, 217)' }}
                onClick={() => handleUpdateOpen(row.id)}
                disabled={isRejectedorAccepted || loading}
              >
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
        ) : null;
      }
    },
   
  ];

  const rows = originalRows.map((row, index) => ({
    rowIndex: index,
    id: row._id,
    proposalId: row.quoteId,
    service: serviceNamesMap[row.serviceId] || '', 
    status: row.selected,
    budget: row.budget,
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

  const handleDownloadClick = (rowIndex) => {
    // console.log(rowIndex)
    if (documentSrc[rowIndex]) {
        const link = document.createElement('a');
        link.href = documentSrc[rowIndex];
        link.setAttribute('download', `document_${rowIndex}`);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
    } else {
        console.log('Document not available');
    }
  };


  const [documentSrc, setDocumentSrc] = useState([]);
  const loadDocuments = async () => {
    const updatedDocumentSrcs = [];
    
    for (const q of quotes) {
        if (q.attachment) {
            try {
              const { data, contentType } = q.attachment || {};
              const byteArray = new Uint8Array(data.data);
              // console.log(byteArray)
              const blob = new Blob([byteArray], { type: contentType });
              const url = URL.createObjectURL(blob);
              // console.log(url)
              updatedDocumentSrcs.push(url);

                // const response = await fetch(data:${q.attachment.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(q.attachment.data.data)))});
                // const blob = await response.blob();
                // const url = URL.createObjectURL(blob);
                // updatedDocumentSrcs.push(byteArray);
            } catch (error) {
                console.error('Error fetching document:', error);
                updatedDocumentSrcs.push(null);
            }
        } else {
            updatedDocumentSrcs.push(null);
        }
    }
    console.log(updatedDocumentSrcs)
    setDocumentSrc(updatedDocumentSrcs);
};

useEffect(() => {
  loadDocuments();
}, [dispatch, quotes]);


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
    dispatch(getQuote())
    
  }, [dispatch])

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      // alert.error(deleteError);
      history.push({
        pathname: "/quotes",
        state: {
          snackbar: {
            message: `Proposal Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });      
      dispatch({ type: DELETE_QUOTE_RESET });
      dispatch(clearErrors());
    }

    if (isDeleted) {
      // alert('Team Member deleted successfully');
      history.push('/quotes');
      dispatch({ type: DELETE_QUOTE_RESET });
      // dispatch(addNotification({ message: 'Proposal Deleted Successfully'}));
      dispatch(createNotification(combined.user._id, `Proposal Deleted Successfully`));
      
      setSnackbarMessage("Proposal Deleted Successfully");
      setSeverity('success');
      setSnackbarOpen(true);
    }

    dispatch(getQuote());

  }, [dispatch, error, alert, isDeleted, deleteError, history]);
  return (
<div>
<div>
      {/* Your Client component JSX */}
      <CustomizedSnackbars
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={severity}
      />
    </div>
      <MetaData title="Quote -- Test" />
      <div className="quote-dashboard-container">
        <div className="btn">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
        <Typography color="rgb(127, 86, 217)">Proposals</Typography>
      </Button>
      </Breadcrumbs>
          {/* <Link to="/new/quote" className="createbtn">Create</Link> */}
          {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT" ? (
          <Button 
            style={{backgroundColor:'rgb(127, 86, 217)', marginLeft: 'auto'}}
            onClick={handleOpen} 
            variant="contained"  
            type="submit"
          >
            Create Proposal
          </Button>
        ) : null}
        </div>

        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>
                Create New Proposal
              </Typography>
              <NewQuote handleClose={handleClose} />
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
                Update Proposal
              </Typography>
              <UpdateQuote handleUpdateClose={handleUpdateClose} selectedQuoteId={selectedQuoteId} />
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
              <Typography variant="h5" >Please Create A Proposal</Typography>
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
        const rowIndex = page * rowsPerPage + index; // Calculate the actual index
        return (
            <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex} style={{borderBottom:'1px solid black'}}>
                <TableCell style={{textAlign:'center'}}>{row.quoteId && row.quoteId}</TableCell>
                <TableCell style={{textAlign:'center'}}>{serviceNamesMap[row.serviceId]}</TableCell>
               */}
              
                {/* <TableCell style={{textAlign:'center'}}>
                {documentSrc[rowIndex] ? (
                        <a href={documentSrc[rowIndex]} target="_blank" rel="noopener noreferrer">{rowIndex}: {documentSrc[rowIndex]}</a>
                    ) : (
                        <p>Document not available</p>
                    )}
                </TableCell> */}

{/* 
                <TableCell style={{textAlign:'center'}}>
                    <Chip
                        label={row.selected}
                        variant="outlined"
                        size="medium"
                        color={
                            row.selected === 'Rejected' ? 'error' :
                            row.selected === 'Pending' ? 'warning' :
                            row.selected === 'Accepted' ? 'success' :
                            'default' 
                        }
                    />
                </TableCell>
                <TableCell style={{textAlign:'center'}}>
                    {new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                </TableCell>
                <TableCell style={{textAlign:'center'}}>{row.budget}</TableCell>
                <TableCell>
                    <Tooltip TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="top" 
                            title={'Proposal Information'}>
                        <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleInfoClick(row)}>
                            <InfoIcon />    
                        </IconButton>
                    </Tooltip>
                    
                    <Tooltip 
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      placement="top" 
                      title={documentSrc[rowIndex] ? 'Download Attachment' : 'Attachment not available'}
                    >
                      <span>
                        <IconButton 
                          style={{color:'rgb(127, 86, 217)'}} 
                          onClick={() => handleDownloadClick(rowIndex)}
                          disabled={!documentSrc[rowIndex]}
                        >
                          {documentSrc[rowIndex] ? <DownloadIcon /> : <FileDownloadOffIcon />}    
                        </IconButton>
                      </span>
                    </Tooltip>
                    {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" || combined.user.role === "CLIENT" ? (
                    <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="top" 
                        title={row.selected === 'Rejected' || row.selected === 'Accepted' ? Can't Edit as Proposal is ${row.selected} : ''}
                    >
                        <span>
                            <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleUpdateOpen(row._id) }
                                        disabled={row.selected === 'Rejected' || row.selected === 'Accepted' || loading}>
                                <EditIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    ) : null}

                  {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (

                    <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleDeleteConfirmation(row._id)}>
                        <DeleteIcon />
                    </IconButton>
                    ) : null}
                  
                </TableCell>
            </TableRow>
        );
    })
}
    
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
          Are you sure you want to delete this proposal?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteQuote}
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

export default Quotes;