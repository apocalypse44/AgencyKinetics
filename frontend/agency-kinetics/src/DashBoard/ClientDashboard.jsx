import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Grid, Container, Card, CardContent, Typography, Icon, FormControl, InputLabel, Select, MenuItem, ButtonBase, ListItem, ListItemText, List, Accordion, AccordionSummary, AccordionDetails, SvgIcon } from '@material-ui/core';
import PersonIcon from '@mui/icons-material/Person';
import { PieChart, BarChart, LineChart } from '@mui/x-charts';
import { CardHeader, Chip } from '@mui/material';
import MetaData from '../components/layout/MetaData';
import {
  ExpandMore as ExpandMoreIcon,
  Inbox as InboxIcon
  
} from "@material-ui/icons";
import empty from '../Images/empty-folder.png'

const ClientDashboard = () => {

  const dispatch = useDispatch()
  const {combined: clients} = useSelector((state)=>state.clients);
  const { tasks} = useSelector((state)=>state.tasks)
    console.log("task from CD", tasks)
  const { services } = useSelector((state) => state.services)
  const { orders } = useSelector((state) => state.orders);
  const {invoices} = useSelector((state)=>state.invoices)
  const {quotes} = useSelector((state)=>state.quotes)

  const {tickets} = useSelector((state)=>state.tickets)

  const { combined:teams} = useSelector((state)=>state.teams)
  const { error, loading, isAuthenticated, combined } = useSelector(
    (state) => state.logMember
  );

  const [chartType, setChartType] = useState('invoiceId');

  const handleChange = (event) => {
    setChartType(event.target.value);
  };

  const [clickedGrid, setClickedGrid] = useState('Orders');
  const handleGridClick = (gridName) => {
    setClickedGrid(gridName);
    console.log(`${gridName} clicked`);
  };

  const [clickedGridTask, setClickedGridTask] = useState('Tasks');
  const handleGridClickTask = (gridNameTask) => {
    setClickedGridTask(gridNameTask);
    console.log(`${gridNameTask} clicked1`);
  };

  console.log("after login",error, loading, isAuthenticated, combined)
  console.log(tasks.length, services.length, orders.length, invoices.length, tickets.length)
  

  const orderStatusCounts = {
    Ongoing: orders.filter(order => order.status === 'Ongoing').length,
    Review: orders.filter(order => order.status === 'Review').length,
    Cancelled: orders.filter(order => order.status === 'Cancelled').length,
    Completed: orders.filter(order => order.status === 'Completed').length
  };

  const taskStatusCounts = {
    Completed: orders.filter(order => order.status === 'Done').length,
    Review: orders.filter(order => order.status === 'Review').length,
    Ongoing: orders.filter(order => order.status === 'Progress').length
  };

  const formatRole = (role) => {
    switch (role) {
      case 'ASSIGNEE':
        return 'Assignee';
      case 'PROJECTMANAGER':
        return 'Project Manager';
      case 'ADMIN':
        return 'Admin';
      default:
        return role;
    }
  };
  //---------------------------------Invoices Bar Chart----------------------------
  const invoiceStatusCounts = invoices.reduce((acc, invoice) => {
    acc[invoice.status] = (acc[invoice.status] || 0) + 1;
    return acc;
  }, {});
  const invoiceData = Object.entries(invoiceStatusCounts).map(([status, count]) => ({ status, count }));

  const monthlyOrders = orders.reduce((acc, order) => {
    const month = new Date(order.kick_off_date).toLocaleString('default', { month: 'short' }); // Get short month name (e.g., Jan, Feb)
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(1); // Assuming you want to count the number of orders per month
    return acc;
  }, {});

  //---------------------------------Order Line Chart----------------------------

  const months = Object.keys(monthlyOrders);
  const orderCounts = Object.values(monthlyOrders).map((orders) => orders.length);

  const chartData = months.map((month, index) => {
    let totalValue = 0;
  
    orders.forEach(order => {
      const orderMonth = new Date(order.kick_off_date).toLocaleString('default', { month: 'short' });
      if (orderMonth === month) {
        const quantity = order.quantity || 0;
        const budget = order.budget || 0;
        totalValue += quantity * budget;
      }
    });
  
    return {
      x: month,
      y: totalValue,
    };
  });



  // -----------------------------------totalAmount x invoice ID line chart----------------------
  const totalAmounts = invoices.map(invoice => invoice.total_amount);
  const labels = invoices.map(invoice => invoice.invoiceId);
  // console.log(totalAmounts, labels)

  //-------------------------------------totalAmount x Month line chart--------------------------
  const dataByMonth = invoices.reduce((acc, invoice) => {
    const monthName = new Date(invoice.createdAt).toLocaleString('default', { month: 'long' }); // Get month name
  const totalAmount = invoice.total_amount;

  if (!acc[monthName]) {
    acc[monthName] = totalAmount;
  } else {
    acc[monthName] += totalAmount;
  }

    return acc;
  }, {});

  const xAxisData = Object.keys(dataByMonth);
  const seriesData = Object.values(dataByMonth);
  console.log(xAxisData, seriesData)


  //-----------------------------Client UI-----------------------
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null);
  };
  const getClientData = (clientId) => {
    const TaskName = orders.filter(order => order.clientId === clientId);
    const clientInvoices = invoices.filter(invoice => invoice.client_name === clientId);
    const clientTickets = tickets.filter(ticket => ticket.client_name === clientId);
    return { TaskName, clientInvoices, clientTickets };
  };

  //------------------------Proposal Pie------------------
  const quoteStatusCounts = {
    Pending: quotes.filter(quote => quote.selected === 'Pending').length,
    Accepted: quotes.filter(quote => quote.selected === 'Accepted').length,
    Rejected: quotes.filter(quote => quote.selected === 'Rejected').length,
  };

  
  
  return (
    <div>
      <MetaData title="Dashboard" />

      <Container style={{ marginTop: '20px', marginLeft:'10px'  }}>
        <Grid container spacing={2}>
          {/* First row */}
          <Grid item xs={3} style={{ maxHeight: '100px' }}>
      <Card style={{ borderRadius: '10px', height: '100%', backgroundColor: clickedGrid === 'Orders' ? 'rgb(127, 86, 217)' : '' }} onClick={() => handleGridClick('Orders')}>
        <CardHeader style={{ paddingTop: '6px', paddingLeft: '6px' }} title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon style={{ color: clickedGrid === 'Orders' ? 'white' : 'inherit' }}>
              <InboxIcon />
            </Icon>
            <Typography variant="h6" component="h4" style={{ marginLeft: '10px', color: clickedGrid === 'Orders' ? 'white' : 'inherit' }}>Orders</Typography>
          </div>
        } />
        <CardContent style={{ display: 'flex', alignItems: 'center', paddingTop: '6px', paddingLeft: '6px' }}>
          <Typography variant="body1" component="p" style={{ marginLeft: '10px', color: clickedGrid === 'Orders' ? 'white' : 'inherit' }}>{orders.length}</Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={3} style={{ maxHeight: '100px' }}>
      <Card style={{ borderRadius: '10px', height: '100%', backgroundColor: clickedGrid === 'Invoices' ? 'rgb(127, 86, 217)' : '' }} onClick={() => handleGridClick('Invoices')}>
        <CardHeader style={{ paddingTop: '6px', paddingLeft: '6px' }} title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SvgIcon style={{ color: clickedGrid === 'Invoices' ? 'white' : 'inherit' }} width="384" height="512" viewBox="0 0 384 512">
              <g clip-path="url(#clip0_699_6)">
                <path d="M377 105L279.1 7C274.6 2.5 268.5 0 262.1 0H256V128H384V121.9C384 115.6 381.5 109.5 377 105ZM224 136V0H24C10.7 0 0 10.7 0 24V488C0 501.3 10.7 512 24 512H360C373.3 512 384 501.3 384 488V160H248C234.8 160 224 149.2 224 136ZM64 72C64 67.58 67.58 64 72 64H152C156.42 64 160 67.58 160 72V88C160 92.42 156.42 96 152 96H72C67.58 96 64 92.42 64 88V72ZM64 152V136C64 131.58 67.58 128 72 128H152C156.42 128 160 131.58 160 136V152C160 156.42 156.42 160 152 160H72C67.58 160 64 156.42 64 152ZM208 415.88V440C208 444.42 204.42 448 200 448H184C179.58 448 176 444.42 176 440V415.71C164.71 415.13 153.73 411.19 144.63 404.36C140.73 401.43 140.53 395.59 144.06 392.22L155.81 381.01C158.58 378.37 162.7 378.25 165.94 380.28C169.81 382.7 174.2 384 178.76 384H206.87C213.37 384 218.67 378.08 218.67 370.81C218.67 364.86 215.06 359.62 209.9 358.08L164.9 344.58C146.31 339 133.32 321.16 133.32 301.19C133.32 276.67 152.37 256.75 175.99 256.12V232C175.99 227.58 179.57 224 183.99 224H199.99C204.41 224 207.99 227.58 207.99 232V256.29C219.28 256.87 230.26 260.8 239.36 267.64C243.26 270.57 243.46 276.41 239.93 279.78L228.18 290.99C225.41 293.63 221.29 293.75 218.05 291.72C214.18 289.29 209.79 288 205.23 288H177.12C170.62 288 165.32 293.92 165.32 301.19C165.32 307.14 168.93 312.38 174.09 313.92L219.09 327.42C237.68 333 250.67 350.84 250.67 370.81C250.67 395.34 231.62 415.25 208 415.88Z"/>
              </g>
              <defs>
                <clipPath id="clip0_699_6">
                  <rect width="384" height="512" fill="white"/>
                </clipPath>
              </defs>
            </SvgIcon>
            <Typography variant="h6" component="h4" style={{ marginLeft: '10px', color: clickedGrid === 'Invoices' ? 'white' : 'inherit' }}>Invoices</Typography>
          </div>
        } />
        <CardContent style={{ display: 'flex', alignItems: 'center', paddingTop: '6px', paddingLeft: '6px' }}>
          <Typography variant="body1" component="p" style={{ marginLeft: '10px', color: clickedGrid === 'Invoices' ? 'white' : 'inherit' }}>{invoices.length}</Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={3} style={{ maxHeight: '100px' }}>
      <Card style={{ borderRadius: '10px', height: '100%', backgroundColor: clickedGrid === 'Tasks' ? 'rgb(127, 86, 217)' : '' }} onClick={() => handleGridClick('Tasks')}>
        <CardHeader style={{ paddingTop: '6px', paddingLeft: '6px' }} title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SvgIcon style={{ color: clickedGrid === 'Tasks' ? 'white' : 'inherit' }} width="1em" height="1em" viewBox="0 0 28 28">
              <path d="M15.114 25.719A7.48 7.48 0 0 1 13 20.5c0-1.688.558-3.247 1.5-4.5H5a3 3 0 0 0-3 3v.715C2 23.433 6.21 26 12 26a17 17 0 0 0 3.114-.281M18 8A6 6 0 1 0 6 8a6 6 0 0 0 12 0m2.5 19a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13m0-11a.5.5 0 0 1 .5.5V20h3.5a.5.5 0 0 1 0 1H21v3.5a.5.5 0 0 1-1 0V21h-3.5a.5.5 0 0 1 0-1H20v-3.5a.5.5 0 0 1 .5-.5"></path>
            </SvgIcon>
            <Typography variant="h6" component="h4" style={{ marginLeft: '10px', color: clickedGrid === 'tasks' ? 'white' : 'inherit' }}>Task</Typography>
          </div>
        } />
        <CardContent style={{ display: 'flex', alignItems: 'center', paddingTop: '6px', paddingLeft: '6px' }}>
          <Typography variant="body1" component="p" style={{ marginLeft: '10px', color: clickedGrid === 'tasks' ? 'white' : 'inherit' }}>{tasks.length}</Typography>
        </CardContent>
      </Card>
    </Grid>

        <Grid item xs={3} style={{ maxHeight: '100px' }}>
          {/* Grid 4 with Card component */}
          <Card style={{ borderRadius: '10px', height: '275%' }}>
            <CardHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <SvgIcon width="1em" height="1em" viewBox="0 0 24 24">
                    <g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M17 3a3 3 0 0 1 2.995 2.824L20 6v4.35l.594-.264c.614-.273 1.322.15 1.4.798L22 11v8a2 2 0 0 1-1.85 1.995L20 21H4a2 2 0 0 1-1.995-1.85L2 19v-8c0-.672.675-1.147 1.297-.955l.11.041l.593.264V6a3 3 0 0 1 2.824-2.995L7 3zm0 2H7a1 1 0 0 0-1 1v5.239l6 2.667l6-2.667V6a1 1 0 0 0-1-1m-5 3a1 1 0 0 1 .117 1.993L12 10h-2a1 1 0 0 1-.117-1.993L10 8z"></path></g>
                </SvgIcon>
                  <Typography variant="h6" component="h4" style={{ marginLeft: '10px' }}>Proposals</Typography>
                </div>
              }
            />
              <CardContent style={{ display: 'flex', flexDirection: 'column', maxHeight: '80%', overflowY: 'auto' }}>
                <PieChart
                series={[{ data: Object.entries(quoteStatusCounts).map(([status, count]) => ({ label: status, value: count })) }]}
                width={250}
                height={100}
              />
              </CardContent>


          </Card>
        </Grid>




          <Grid item xs={9}>
          {clickedGrid === 'Orders' && (
            <Card style={{ height: '486px', borderRadius: '10px', padding: '10px' }}>
                <CardHeader title="Orders" />
                <CardContent>
                {orders.length === 0 ? (
                    <Container style={{ marginTop: '75px', textAlign: 'center' }}>
                    <img
                        src={empty}
                        alt="Empty Folder"
                        style={{ width: "150px", height: "150px", marginBottom: "10px" }}
                    />
                    <Typography variant="h5">No Orders</Typography>
                    </Container>
                ) : (
                    <LineChart
                    xAxis={[{ scaleType: 'band', data: months }]}
                    series={[
                        {
                        data: chartData.map((data) => data.y),
                        area: true,
                        fill: 'rgb(127, 86, 217)',
                        connectNulls: true,
                        baseValue: 0,
                        color: 'rgb(127, 86, 217)'
                        },
                    ]}
                    height={300}
                    />
                )}
                </CardContent>
            </Card>
            )}

            {clickedGrid === 'Invoices' && (
            <Card style={{ height: '486px', borderRadius: '10px', padding: '10px' }}>
                <CardHeader
                title="Invoices"
                action={
                    <FormControl style={{ minWidth: '120px', textAlign:'center' }}>
                    <Select
                        labelId="chart-type-label"
                        id="chart-type"
                        value={chartType}
                        onChange={handleChange}
                    >
                        <MenuItem value="invoiceId">Invoice ID</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                    </FormControl>
                }
                />
                <CardContent>
                {invoices.length === 0 ? (
                    <Container style={{ marginTop: '75px', textAlign: 'center' }}>
                    <img
                        src={empty}
                        alt="Empty Folder"
                        style={{ width: "150px", height: "150px", marginBottom: "10px" }}
                    />
                    <Typography variant="h5">No Invoices</Typography>
                    </Container>
                ) : 
                chartType === 'invoiceId' ? (
                    <LineChart
                    xAxis={[{ data: labels}]}
                    series={[
                        {
                        data: totalAmounts,
                        color: 'rgb(127, 86, 217)',
                        area:true
                        },
                    ]}
                    height={300}
                    grid={{ vertical: true, horizontal: true }}
                    />
                ) : (
                    <LineChart
                    xAxis={[{ data: xAxisData, scaleType: 'band'}]}
                    series={[
                        {
                        data: seriesData,
                        color: 'rgb(127, 86, 217)',
                        area:true
                        },
                    ]}
                    height={300}
                    />
                )
                }
                </CardContent>
            </Card>
            )}


          {clickedGrid === 'Tasks' && (
            <Card style={{ height: '486px',  borderRadius: '10px', padding: '10px', overflowY:'auto' }}>

                <CardHeader title="Tasks" />
                <CardContent>
                {tasks.length === 0 ? (
                    <Container style={{ marginTop: '75px', textAlign: 'center' }}>
                    <img
                        src={empty}
                        alt="Empty Folder"
                        style={{ width: "150px", height: "150px", marginBottom: "10px" }}
                    />
                    <Typography variant="h5">No Tasks</Typography>
                    </Container>
                ) : (
                    tasks.map(task => (
                    <Accordion key={task._id} expanded={expandedAccordion === task._id} onChange={handleAccordionChange(task._id)} style={{ marginBottom: '10px', backgroundColor:'rgb(127, 86, 217)', color:'#ffffff' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon style={{color:'white'}}/>} aria-controls="panel1a-content" id="panel1a-header">
                        <Typography>{`${task.task_name}`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <div>
                            <Typography variant="subtitle1">Name: {task.task_name}</Typography>
                            <Typography variant="subtitle1">Status: {task.status}</Typography>
                            <Typography variant="subtitle1">Assignee: {task.assignee}</Typography>
                        </div>   
                        </AccordionDetails>
                    </Accordion>
                    ))
                )}
                </CardContent>

            </Card>
              
            )}
  
          </Grid>
          


          <Grid item xs={3}>
            <Card style={{ borderRadius: '10px', height: '70%', marginTop:'145px' }}>
            <CardHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon>
                  <InboxIcon />
                  </Icon>
                  <Typography variant="h6" component="h4" style={{ marginLeft: '10px' }}>Orders</Typography>
                </div>
              }
            />
              <CardContent style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                {orders.length === 0 ? (
                    <Container style={{ marginTop: '150px', textAlign: 'center' }}>
                    <img
                        src={empty}
                        alt="Empty Folder"
                        style={{ width: "150px", height: "150px", marginBottom: "10px" }}
                    />
                    <Typography variant="h5">No Orders</Typography>
                    </Container>
                ) : (
                    <PieChart
                    series={[{ data: Object.entries(orderStatusCounts).map(([status, count]) => ({ label: status, value: count })) }]}
                    width={400}
                    height={200}
                    />
                )}
                </CardContent>

            </Card>
          </Grid>
        </Grid>
      </Container>

    
    </div>
  );
};

export default ClientDashboard