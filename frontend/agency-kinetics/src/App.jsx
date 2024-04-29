import Home from "./components/layout/Home";
import './App.css';
import { BrowserRouter as Router ,Route , Switch} from "react-router-dom"
import User from "./components/User/User";
import Service from "./components/Service/Service";
import ServiceDetails from "./components/Service/ServiceDetails";
import { positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import NewService from "./components/Service/NewService";
import UpdateService from "./components/Service/UpdateService";
import Invoices from "./components/Invoices/Invoices";
import Client from "./components/Clients/Client";
import Order from "./components/Orders/Order";
import Quotes from "./components/Quote/Quotes";
import QuoteDetails from "./components/Quote/QuoteDetails";
import InvoiceDetails from "./components/Invoices/InvoiceDetails";
import Ticket from "./components/Tickets/Ticket";
import TicketDetails from "./components/Tickets/TicketDetails";
import UserDetails from "./components/User/UserDetails";
import OrderDetails from "./components/Orders/OrderDetails";
import ClientDetails from "./components/Clients/ClientDetails";
import UpdateQuote from "./components/Quote/UpdateQuote";
import UpdateTicket from "./components/Tickets/UpdateTicket";
import UpdateOrder from "./components/Orders/UpdateOrder";
import UpdateInvoice from "./components/Invoices/UpdateInvoice";
import NewOrder from "./components/Orders/NewOrder";
import NewQuote from "./components/Quote/NewQuote.jsx";
import NewTicket from "./components/Tickets/NewTicket.jsx";
import NewUser from "./components/User/NewUser.jsx";
import Team from "./components/Teams/Team.jsx";
import TeamDetail from "./components/Teams/TeamDetail.jsx";
import UpdateTeam from "./components/Teams/UpdateTeam.jsx";
import NewTeam from "./components/Teams/NewTeam.jsx";
import NewClient from "./components/Clients/NewClient.jsx";
import TeamLogin from "./components/Teams/TeamLogin.jsx";
import ClientLogin from "./components/Clients/ClientLogin.jsx";
import ProtectedRoute from "../src/Login/ProtectedRoute.jsx"
import UpdateClient from "./components/Clients/UpdateClient.jsx";
import NewInvoice from "./components/Invoices/NewInvoice.jsx";
import LoginMembers from "./Login/LoginMembers.jsx";
import { useEffect, useState } from "react";
import UserProfile from "./components/User/UserProfile.jsx";
import { useDispatch, useSelector } from "react-redux";
import Logout from "./Login/Logout.jsx";
import 'semantic-ui-css/semantic.min.css'
import VerifyingPage from "./components/User/VerifyingPage.jsx";
import AppDrawer from "./components/layout/DrawerAppBar/Drawer.jsx";
import AppHeader from "./components/layout/DrawerAppBar/Appbar.jsx";
import {Box, Container, Divider, Grid, Paper, makeStyles} from '@material-ui/core';
import { styled } from '@mui/material/styles';
import login from './Images/login.png'
import Tasks from './components/Tasks/Tasks.jsx'
import Dashboard from "./DashBoard/dashboard.jsx";
import NewTask from "./components/Tasks/NewTask.jsx";
import UpdateTask from "./components/Tasks/UpdateTask.jsx";
import Teamcompletion from "./components/Teams/TeamCompletion.jsx";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import { logoutMember, setAuthentication, setSidebarVisibility } from "./actions/loginAction.jsx";
import axios from "axios";
import UpdatePassword from "./Password/UpdatePassword.jsx";
import ForgotPassword from "./Password/ForgotPassword.jsx";
import ResetPassword from "./Password/ResetPassword.jsx";
import VerifyingFP from "./Password/Verifing.jsx";
import { SET_SIDEBAR_VISIBILITY } from "./constants/loginConstants.jsx";
import ClientDashboard from "./DashBoard/ClientDashboard.jsx";
// import AppHeader from "./components/layout/DrawerAppBar/Appbar.jsx";
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
};


const useStyles = makeStyles((theme) => ({
  divider: {
      // Theme Color, or use css color in quote
      background: 'rgb(255, 255, 255)',
  }

}));


function App() {
  // const [isSidebarVisible, setSidebarVisibility] = useState(false);
  const showSidebar = useSelector((state) => state.logMember.showSidebar);
  const isAuthenticated = useSelector((state) => state.logMember.isAuthenticated);
  const userRole = useSelector((state) => state.logMember.userRole);
  const combined = useSelector((state) => state.logMember.combined);
  // const isAuthenticated = useSelector((state) => {
  //   console.log(state.logMember)
  //   return state.logMember.isAuthenticated});

  const classes = useStyles();
  
  console.log(showSidebar, isAuthenticated)

  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("/test/v1/checkSession");
        console.log(response.data, response);
        if (response.data.message === 'Session is inactive or expired. Please log in again.' || response.status === 401 ){
          dispatch(setSidebarVisibility(false));
          dispatch(setAuthentication(false));

          dispatch(logoutMember({ isAuthenticated: false }));
          alert("Logout Successfully");
          // history.push('/');
          window.location.href = '/'
        }
      } catch (error) {
        console.log(error)
        console.error("Session inactive. Logging out...");
        // Perform logout action here
        dispatch(setSidebarVisibility(false));
        dispatch(setAuthentication(false));

        dispatch(logoutMember({ isAuthenticated: false }));
        alert("Logout Successfully");
        // history.push('/');
        window.location.href = '/'

      }
    };

    const interval = setInterval(checkSession, 1200000); // Check session every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch, history]);

  const renderContent = () => {
    
    if(showSidebar === false || showSidebar === undefined ) {
      return (     
        <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/combined/login/:workspace_name?" component={LoginMembers} />
        <Route exact path = "/combined/newUser"  component={NewUser}/>
        <Route path="/verifyingPage" component={VerifyingPage} />
        <Route exact path="/combined/verifyTeam/:token?" component={Teamcompletion} />
        <Route exact path="/password/reset/:resetToken" component={ResetPassword} />

        <Route  path = "/password/forgot"  component={ForgotPassword}/>
        <Route path="/forgotMailSent" component={VerifyingFP} />
        <Route exact path = "/profile"  component={UserProfile}/>


      </Router>      
      )
    }


    else
    
    {
 
      // let SidebarComponent;
      // console.log(userRole)
      // switch (userRole) {
      //   case "SUPERADMIN":
      //     SidebarComponent = UserSideBar;
      //     break;
      //   case "ASSIGNEE":
      //     SidebarComponent = AssigneeSidebar;
      //     break;
      //   case "ADMIN":
      //     SidebarComponent = AdminSidebar;
      //     break;
      //   case "PROJECTMANAGER":
      //   SidebarComponent = ProjectManagerSidebar;
      //   break;
      //   case "CLIENT":
      //   SidebarComponent = ClientSidebar;
      //   break;
      //   default:
      //     SidebarComponent = UserSideBar;
      //     break;
      // }
    
      return (
        
        // <AlertProvider template={AlertTemplate} {...options}>
          <Router>
            {/* {showSidebar && <SidebarComponent />} */}
            
             {/* <SidebarComponent/> */}
             {showSidebar && <AppHeader />}
             {showSidebar && <AppDrawer />}
            <Container maxWidth={false}   style={{  display:"flex", flexDirection: "column", minHeight: "100vh", paddingTop:65,paddingLeft: 200,  paddingRight:0, backgroundColor: showSidebar ? 'rgb(233, 230, 251)' : 'white'}}>
            {/* <Box container > */}
              <Switch>
              <Route  path = "/password/update"  component={UpdatePassword}/>
              <Route exact path="/combined/login/:workspace_name?" component={LoginMembers} />
                

              <Route exact path="/combined/logout" component={Logout}/>
              {/* <Route exact path = "/dashboard"  component={Dashboard}/> */}
              <Route exact path="/dashboard">
                {combined.user.role === 'CLIENT' ? (
                  <ClientDashboard />
                ) : combined.user.role === 'SUPERADMIN' || combined.user.role === 'ADMIN' ? (
                  <Dashboard />
                ) : (
                  null
                )}
              </Route>
    
              <Route exact path = "/users"  component={User}/>
              <Route exact path = "/user/:id"  component={UserDetails}/>
              
              <Route exact path = "/invoices"  component={Invoices}/>
              <Route exact path = "/invoice/:id"  component={InvoiceDetails}/>
              <Route exact path = "/invoice/update/:id"  component={UpdateInvoice}/>
              <Route exact path = "/new/invoice"  component={NewInvoice}/>
    
              <Route exact path = "/clients"  component={Client}/>
              <Route exact path = "/client/:id"  component={ClientDetails}/>
              <Route exact path = "/combined/newClient"  component={NewClient}/>
              <Route exact path = "/login/client"  component={ClientLogin}/>
              <Route exact path = "/client/update/:id"  component={UpdateClient}/>
              <Route exact path = "/client/:id"  component={ClientDetails}/>
    
              <Route exact path = "/orders"  component={Order}/>
              <Route exact path = "/order/:id"  component={OrderDetails}/>
              <Route exact path = "/order/update/:id"  component={UpdateOrder}/>
              <Route exact path = "/new/order"  component={NewOrder}/>
    
              <Route exact path = "/task/order/:id"  component={Tasks}/>
              <Route exact path = "/task/new"  component={NewTask}/>
              <Route exact path = "/task/update/:id"  component={UpdateTask}/>

              

    
              <Route exact path = "/quotes"  component={Quotes}/>
              <Route exact path = "/quote/:id"  component={QuoteDetails}/>
              <Route exact path = "/quote/update/:id"  component={UpdateQuote}/>
              <Route exact path = "/new/quote"  component={NewQuote}/>
    
    
              <Route exact path = "/tickets"  component={Ticket}/>
              <Route exact path = "/ticket/:id"  component={TicketDetails}/>
              <Route exact path = "/ticket/update/:id"  component={UpdateTicket}/>
              <Route exact path = "/new/ticket"  component={NewTicket}/>
    
    
              <Route exact path = "/services"  component={Service}/>
              <Route exact path = "/service/:id"  component={ServiceDetails}/>
              <Route exact path = "/new/service"  component={NewService}/>
              <Route exact path = "/service/update/:id"  component={UpdateService}/>
    
    
              <Route exact path = "/teams"  component={Team}/>
              <Route exact path = "/team/:id"  component={TeamDetail}/>
              <Route exact path = "/combined/newTeam"  component={NewTeam}/>
              <Route exact path = "/login/team"  component={TeamLogin}/>
              <Route exact path = "/team/update/:id"  component={UpdateTeam}/>
    
              <Route exact path = "/profile"  component={UserProfile}/>
    
        </Switch>
        
    {/* </Box> */}
    </Container>
        </Router>
      // </AlertProvider>
    
      );
    }
  }

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Router>{renderContent()}</Router>
    </AlertProvider>
  )
  
}

export default App;
