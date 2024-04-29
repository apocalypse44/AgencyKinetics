import React, { useEffect, useState } from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Avatar,
  MenuItem,
  Menu,
  Typography,
  ListItemIcon,
  ListItemText, 
  MenuList
} from "@material-ui/core";
import { Notifications, AccountCircle, Close as CloseIcon } from "@material-ui/icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { logoutMember, setAuthentication, setSidebarVisibility } from '../../../actions/loginAction';
import { addNotification, deleteNotification, deleteNotificationForUser, removeNotification, resetNotifications } from '../../../actions/notificationAction'; // Import notification actions
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";

const useStyles = makeStyles({
  brandText: {},
  appBarItemsRight: {
    marginLeft: "auto",
    marginRight: 0,
    display: "flex",
    alignItems: "center"
  },
  appBarShift: {
    // width: `calc(100% - 200px)`,
    backgroundColor: 'rgb(255, 255, 255)',
    color:'rgb(0, 0, 0)'
  },
  avatar: {
    width: 30,
    height: 30,
    marginLeft: 10
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between', // Align items to the end
    alignItems: 'center',
    
  },
  closeIcon: {
    marginLeft: 'auto', // Push the close icon to the far right
    cursor: 'pointer', // Change cursor to pointer on hover
  },
  roundedPaper: {
    borderRadius: '15px',
    marginTop: '45px', 
    marginLeft: '-85px'
  },
  roundedPaperProfile: {
    borderRadius: '15px',
    marginTop: '45px', 
    marginLeft: 'auto'
  },
  
});

export default function AppHeader() {
  const workspace_name = useSelector((state) => state.logMember.workspace_name);
  const combined = useSelector((state) => state.logMember.combined);
  const [imageSrc, setImageSrc] = useState(null);
  
  const {notifications} = useSelector((state) => state.notifications); // Access notifications from Redux store
  const name = combined.user.fname + ' '+ combined.user.lname;
  
  console.log(combined.user._id, name)

  const [notificationData, setNotificationData] = useState([]);

  // async function fetchData() {
  //   try {
  //     const response = await axios.get(`/test/v1/notification/getByUserId/${combined.user._id}`);
  //     const data = response.data;
  //     console.log('notification data:', data);
  //     setNotificationData(data.notifications); // Store notification data in state
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  
  // useEffect(() => {
  //   fetchData();
  //   const intervalId = setInterval(fetchData, 60000); // Fetch data every 1 minute
  //   return () => clearInterval(intervalId); // Cleanup interval on unmount
  // }, []);



  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  console.log('-------------', notifications)
  const userNotifications = notifications.filter(notification => notification.userId === combined.user._id);
  console.log(userNotifications)
  
 
  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const openProfile = () => {
    history.push('/profile');
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    dispatch(setSidebarVisibility(false));
    dispatch(setAuthentication(false));
    dispatch(logoutMember({ isAuthenticated: false }));
    alert("Logout Successfully");
    history.push('/');
  };

  // const handleNotificationClick = () => {
  //   setNotificationOpen(true);
  //   // dispatch(resetNotifications()); // Reset notifications count when clicked
  // };

  const handleClearNotifications = () => {
    // dispatch(resetNotifications());
    dispatch(deleteNotificationForUser(combined.user._id))
    handleNotificationMenuClose();
  };

  const handleCloseNotification = (id, reversedIndex) => {
    const originalIndex = notifications.findIndex(notification => notification._id === id);
    console.log(originalIndex)
    if (originalIndex !== -1) {
      // Handle closing a specific notification
      dispatch(deleteNotification(id, originalIndex));
    }
  
    // Optionally, you can close the notification menu if there are no notifications left
    if (userNotifications.length === 1) {
      handleNotificationMenuClose();
    }
  };

  const loadImages = async () => {
    var updatedImageSrcs = null;
    // console.log(combined.profile_img.data.data.length)
    console.log(combined.user)
    
      if (combined.user.profile_img.data.data.length > 0) {
        try {
          console.log(combined.user.profile_img.data.data.length)

          const response = await fetch(`data:${combined.user.profile_img.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(combined.user.profile_img.data.data)))}`);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          updatedImageSrcs = url;
        } catch (error) {
          console.error('Error fetching image:', error);
          updatedImageSrcs = null;
        }
      } else {
        updatedImageSrcs = null;
      }
    setImageSrc(updatedImageSrcs);
    console.log(imageSrc)

  };

  useEffect(() => {
    loadImages();
  }, [dispatch, combined]);

  return (
    <AppBar position="fixed" className={classes.appBarShift}>
      <Toolbar>
        {/* Welcome text */}
        <Typography className={classes.brandText}style={{ marginLeft: '200px' }}>Welcome, {name}</Typography>

        {/* Notification Icon */}
        <Box className={classes.appBarItemsRight}>
          <IconButton color="inherit" aria-label="toggle dark mode" onClick={userNotifications.length > 0 ? handleNotificationMenuOpen : undefined}>
            <Badge badgeContent={userNotifications.length} max={50} color='primary' >
              <Notifications />
            </Badge>
          </IconButton>

          {/* Notification Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            keepMounted
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            style={{marginTop:'40px', marginLeft:'-80px'}}
            
          >
            <MenuList style={{
          maxHeight: "300px", // Adjust as needed
          overflowY: "auto",
        }}>
                 {userNotifications.length > 0 ? (
                [
                  <MenuItem key="clear" onClick={handleClearNotifications} className={classes.menuItem}>
                    Clear notifications
                  </MenuItem>,
                  ...userNotifications.slice(0).reverse().map((notification, index) => (
                    <MenuItem key={index} className={classes.menuItem}>
                      <ListItemText primary={notification.message} />
                      <CloseIcon fontSize="small" className={classes.closeIcon} onClick={() => handleCloseNotification(notification._id, index)} />
                    </MenuItem>
                  ))
                ]
              ) : null}

            </MenuList>
          </Menu>


          {/* User Profile Icon */}
          <Box display="flex" alignItems="center">
          {imageSrc ? (
              
            <IconButton color="inherit" aria-label="user profile" onClick={handleProfileMenuOpen}>
              <Avatar alt="User Avatar" src={imageSrc} className={classes.avatar} />
            </IconButton>
              ):(
                <IconButton color="inherit" aria-label="user profile" onClick={handleProfileMenuOpen}>
              <Avatar alt="User Avatar" src='' className={classes.avatar} />
            </IconButton>
              )}

          </Box>

          {/* User Profile Menu */}
          <Menu
            anchorEl={profileAnchorEl}
            keepMounted
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{ // Use PaperProps to apply custom styles to the Paper component
              className: classes.roundedPaperProfile, // Apply the custom style to the Paper component
            }}
          >
            <MenuItem onClick={openProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}