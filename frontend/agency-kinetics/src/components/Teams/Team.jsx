import{useSelector, useDispatch} from "react-redux";
import React, { useEffect, useState } from 'react'
import MetaData from "../layout/MetaData";
import { useHistory } from 'react-router-dom';
import { clearErrors, deleteTeam, getTeams } from "../../actions/teamAction.jsx";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min.js";
import { DELETE_TEAM_RESET } from "../../constants/teamConstants.jsx";
import "./Team.css"
import NewTeam from "./NewTeam.jsx";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Container, Breadcrumbs } from '@mui/material';
import UpdateTeam from "./UpdateTeam.jsx";
import { resetState } from "../../reducers/teamReducer.jsx";
import { addNotification, createNotification } from "../../actions/notificationAction.jsx";
import InfoIcon from '@mui/icons-material/Info';
import { Fade, IconButton, TableFooter, TablePagination, Tooltip } from "@material-ui/core";
import PendingActionsSharpIcon from '@mui/icons-material/PendingActionsSharp';
import CustomizedSnackbars from "../../snackbarToast.jsx";
import empty from '../../Images/empty-folder.png'
import { DataGrid, GridToolbar,GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 500,
  bgcolor: 'rgb(245,245,245)',
  border: '2px solid rgb(127, 86, 217)',
  boxShadow: '5px 5px 5px 5px rgba(255, 177, 0, 0.9)',
  borderRadius: 5, // Set border radius to 0 for rectangular border
  boxShadow: 24,
  overflow:'auto',
  p: 4,
};

const Team = () => {
  const history = useHistory();
const dispatch = useDispatch()
const {error, loading, combined:teams} = useSelector((state)=>state.teams)
  const { error: deleteError, isDeleted } = useSelector((state) => state.teamDU);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

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


  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleUpdateOpen = (teamId) => {
    setSelectedTeamId(teamId);
    setOpenUpdateModal(true);
  };

  const handleUpdateClose = () => {
    setSelectedTeamId(null);
    setOpenUpdateModal(false);
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [teamIdToDelete, setTeamIdToDelete] = useState(null);

  const [selectedTeamName, setselectedTeamName] = useState('')
  const getName = async (teamId) => {
    try {
      const response = await fetch(`/test/v1/get/team/${teamId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch team: ${response.status}`);
      }
      const data = await response.json();
      console.log('Team data:', data);
      setselectedTeamName(data.combined.email)
      console.log(selectedTeamName)
    } catch (error) {
      console.error('Error fetching team:', error.message);
    }
  };

  const handleDeleteConfirmation = (teamId) => {
    setTeamIdToDelete(teamId);
    setOpenConfirmDialog(true);
    getName(teamId)

  };

  // const handleDeleteConfirmation = (teamId) => {
  //   console.log(teamId)
  //   setTeamIdToDelete(teamId);
  //   setOpenConfirmDialog(true);
  // };

  const handleDeleteMember = () => {
    // console.log(teamIdToDelete)
    dispatch(deleteTeam(teamIdToDelete));
    setTeamIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setTeamIdToDelete(null);
    setOpenConfirmDialog(false);
  };

  // const deleteTeamHandler = (id) => {
  //   dispatch(deleteTeam(id));
  // };

  const handleBreadcrumbClick = () => {
    history.push('/teams');
  };

  const [breadcrumbs, setBreadcrumbs] = React.useState([
    <Button color="inherit" href="/teams" onClick={() => history.push('/teams')}>
      Teams
    </Button>
  ]);

  const originalRows = teams
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
    { field: 'teamId', headerName: 'Team ID', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'clientEmail', headerName: 'Client Email', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'clientName', headerName: 'Client Name', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'role', headerName: 'Role', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
    { field: 'createdOn', headerName: 'Created On', width: 200, align: 'center', fontWeight: 'bold', headerAlign:'center' },
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
        
        return canEdit ? (
              <IconButton
                style={{ color: 'rgb(127, 86, 217)' }}
                onClick={() => handleUpdateOpen(row.id)}
              >
                <EditIcon />
              </IconButton>
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
      {
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        field: 'pendingButton',
        headerAlign: 'center',
        headerName: '',
        width: 10,
        align: 'center',
        renderCell: (params) => {
          const { row } = params;
          console.log(row)
          return (
            <>
              {row && row.verified === false && (
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="top"
                  title={'Pending To Join'}
                >
                  <span>
                    <IconButton disabled style={{ color: 'rgb(127, 86, 217)' }}>
                      <PendingActionsSharpIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </>
          );
        },
      },


      
];

const rows = originalRows.map((row, index) => ({
  id: row._id,
  verified: row.verified,
  teamId: `#${row._id.slice(-4)}`,
  clientEmail: row.email || '', // Map order ID to its corresponding name
  clientName: `${row.fname || ''} ${row.lname || ''}`,
  role: row.role || '', 
  createdOn: new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
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
        pathname: "/teams",
        state: {
          snackbar: {
            message: `Member Deletion Failed as: ${deleteError}`,
            severity: "error"
          }
        }
      });      
      dispatch({ type: DELETE_TEAM_RESET });
      // dispatch(addNotification({ message: 'Member Deletion Failed'}));
      dispatch(clearErrors());
    }
    if (isDeleted) {
      // alert('Team Member deleted successfully');
      history.push('/teams');
      dispatch({ type: DELETE_TEAM_RESET });
      // dispatch(addNotification({ message: `Member ${selectedTeamName} Deleted Successfully`}));
      dispatch(createNotification(combined.user._id, `Member ${selectedTeamName} Deleted Successfully`));
      
      setSnackbarMessage("Member Deleted Successfully");
      setSeverity('success');
      setSnackbarOpen(true);
    }

    dispatch(getTeams());
    dispatch(resetState());
  }, [dispatch, error, alert, isDeleted, deleteError, history]);
  return (
    <div>
    <CustomizedSnackbars
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={severity}
      />
      <MetaData title="Team -- Test" />
      <div className="teams-dashboard-container">
        <div className="btn">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
    <Button onClick={handleBreadcrumbClick} style={{ background: 'none', boxShadow: 'none', textTransform: 'none' }}>
      <Typography color="rgb(127, 86, 217)">Teams</Typography>
    </Button>
  </Breadcrumbs>
          {/* <Link to="/combined/newTeam" className="createbtn">Create</Link> */}
        
        {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (  
          <Button style={{backgroundColor:'rgb(127, 86, 217)',marginLeft: 'auto',}}onClick={handleOpen} variant="contained"  type="submit" >
            Create Team Member
          </Button>
        ) : null}
        
        </div>

        {/* <Modal open={openUpdateModal} onClose={handleCloseUpdateModal}>
          <UpdateTeam selectedId={selectedTeamId} />
        </Modal> */}

        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" style={{ color: 'rgb(127, 86, 217)', textAlign: 'center'  }}>
                Create New Team
              </Typography>
              <NewTeam handleClose={handleClose} />
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
                Update Team Member
              </Typography>
              <UpdateTeam handleUpdateClose={handleUpdateClose} selectedTeamId={selectedTeamId} />
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
              <Typography variant="h5" >Please Add A Member</Typography>
            </Container>
            ) : (
              <>
              <div style={{ height: 577, width: '100%' }}>
                <DataGrid
                slots={{ toolbar:  CustomToolbar }}
                rows={rows}
                columns={columns}
                pageSize={rowsPerPage}
                pagination
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
        {rows
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={index} style={{borderBottom:'1px solid black'}}>
                <TableCell style={{ textAlign: 'center' }}>#{row._id && row._id.slice(19, 23)}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{row.email}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{row.fname} {row.lname}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{row.role}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                {new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</TableCell>
                  
                <TableCell> */}
                  {/* <Tooltip TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            placement="top" 
                            title={'Member Information'}>
                            <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleInfoClick(row)}>
                              <InfoIcon />    
                            </IconButton>
                  </Tooltip> */}
{/*             
              {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
                <IconButton style={{color:'rgb(127, 86, 217)'}} onClick={() => handleUpdateOpen(row._id) }>
                    <EditIcon />
                  </IconButton>
                ) : null}
              
                {combined.user.role === "SUPERADMIN" || combined.user.role === "ADMIN" || combined.user.role === "PROJECTMANAGER" ? (
                  <IconButton style={{ color: 'rgb(127, 86, 217)' }} onClick={() => handleDeleteConfirmation(row._id)}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}

                  {row && row.verified === false && (

                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        placement="top"
                        title={'Pending To Join'}
                      >
                      <span>
                          <IconButton disabled style={{ color: 'rgb(127, 86, 217)' }}>
                            <PendingActionsSharpIcon />
                          </IconButton>
                      </span>

                      </Tooltip>
                  )}

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
          Are you sure you want to delete this member?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteMember}
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

export default Team;

