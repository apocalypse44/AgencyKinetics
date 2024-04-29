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

const Dashboard = () => {
  // Assuming you have a count of clients stored in a variable called "clientCount"
  // const clientCount = 15; // Replace 15 with the actual count of your clients
  const dispatch = useDispatch()
  const {combined: clients} = useSelector((state)=>state.clients);
  const { services } = useSelector((state) => state.services)
  const { orders } = useSelector((state) => state.orders);
  const {invoices} = useSelector((state)=>state.invoices)
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

  console.log("after login",error, loading, isAuthenticated, combined)
  console.log(clients.length, services.length, orders.length, invoices.length, tickets.length)
  

  const orderStatusCounts = {
    Ongoing: orders.filter(order => order.status === 'Ongoing').length,
    Review: orders.filter(order => order.status === 'Review').length,
    Cancelled: orders.filter(order => order.status === 'Cancelled').length,
    Completed: orders.filter(order => order.status === 'Completed').length
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
    const clientOrders = orders.filter(order => order.clientId === clientId);
    const clientInvoices = invoices.filter(invoice => invoice.client_name === clientId);
    const clientTickets = tickets.filter(ticket => ticket.client_name === clientId);
    return { clientOrders, clientInvoices, clientTickets };
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
      <Card style={{ borderRadius: '10px', height: '100%', backgroundColor: clickedGrid === 'Clients' ? 'rgb(127, 86, 217)' : '' }} onClick={() => handleGridClick('Clients')}>
        <CardHeader style={{ paddingTop: '6px', paddingLeft: '6px' }} title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SvgIcon style={{ color: clickedGrid === 'Clients' ? 'white' : 'inherit' }} width="1em" height="1em" viewBox="0 0 28 28">
              <path d="M15.114 25.719A7.48 7.48 0 0 1 13 20.5c0-1.688.558-3.247 1.5-4.5H5a3 3 0 0 0-3 3v.715C2 23.433 6.21 26 12 26a17 17 0 0 0 3.114-.281M18 8A6 6 0 1 0 6 8a6 6 0 0 0 12 0m2.5 19a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13m0-11a.5.5 0 0 1 .5.5V20h3.5a.5.5 0 0 1 0 1H21v3.5a.5.5 0 0 1-1 0V21h-3.5a.5.5 0 0 1 0-1H20v-3.5a.5.5 0 0 1 .5-.5"></path>
            </SvgIcon>
            <Typography variant="h6" component="h4" style={{ marginLeft: '10px', color: clickedGrid === 'Clients' ? 'white' : 'inherit' }}>Clients</Typography>
          </div>
        } />
        <CardContent style={{ display: 'flex', alignItems: 'center', paddingTop: '6px', paddingLeft: '6px' }}>
          <Typography variant="body1" component="p" style={{ marginLeft: '10px', color: clickedGrid === 'Clients' ? 'white' : 'inherit' }}>{clients.length}</Typography>
        </CardContent>
      </Card>
    </Grid>

          <Grid item xs={3} style={{ maxHeight: '100px' }}>
          {/* Grid 4 with Card component */}
          <Card style={{ borderRadius: '10px', height: '275%' }}>
            <CardHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <SvgIcon viewBox="0 0 20 20" width="20" height="20" >
          <path d="M12.5 4.5C12.5 5.16304 12.2366 5.79893 11.7678 6.26777C11.2989 6.73661 10.663 7 10 7C9.33696 7 8.70107 6.73661 8.23223 6.26777C7.76339 5.79893 7.5 5.16304 7.5 4.5C7.5 3.83696 7.76339 3.20107 8.23223 2.73223C8.70107 2.26339 9.33696 2 10 2C10.663 2 11.2989 2.26339 11.7678 2.73223C12.2366 3.20107 12.5 3.83696 12.5 4.5ZM17.5 5C17.5 5.53043 17.2893 6.03914 16.9142 6.41421C16.5391 6.78929 16.0304 7 15.5 7C14.9696 7 14.4609 6.78929 14.0858 6.41421C13.7107 6.03914 13.5 5.53043 13.5 5C13.5 4.46957 13.7107 3.96086 14.0858 3.58579C14.4609 3.21071 14.9696 3 15.5 3C16.0304 3 16.5391 3.21071 16.9142 3.58579C17.2893 3.96086 17.5 4.46957 17.5 5ZM4.5 7C5.03043 7 5.53914 6.78929 5.91421 6.41421C6.28929 6.03914 6.5 5.53043 6.5 5C6.5 4.46957 6.28929 3.96086 5.91421 3.58579C5.53914 3.21071 5.03043 3 4.5 3C3.96957 3 3.46086 3.21071 3.08579 3.58579C2.71071 3.96086 2.5 4.46957 2.5 5C2.5 5.53043 2.71071 6.03914 3.08579 6.41421C3.46086 6.78929 3.96957 7 4.5 7ZM6 9.25C6 8.56 6.56 8 7.25 8H12.75C13.44 8 14 8.56 14 9.25V14C14 15.0609 13.5786 16.0783 12.8284 16.8284C12.0783 17.5786 11.0609 18 10 18C8.93913 18 7.92172 17.5786 7.17157 16.8284C6.42143 16.0783 6 15.0609 6 14V9.25ZM5 9.25C5 8.787 5.14 8.358 5.379 8H3.25C2.56 8 2 8.56 2 9.25V13C1.99995 13.4281 2.09154 13.8513 2.2686 14.2411C2.44566 14.6309 2.7041 14.9782 3.02655 15.2599C3.34901 15.5415 3.728 15.7508 4.13807 15.8738C4.54813 15.9968 4.97978 16.0307 5.404 15.973C5.13691 15.3495 4.99945 14.6783 5 14V9.25ZM15 14C15 14.7 14.856 15.368 14.596 15.973C14.728 15.991 14.8627 16 15 16C15.7956 16 16.5587 15.6839 17.1213 15.1213C17.6839 14.5587 18 13.7956 18 13V9.25C18 8.56 17.44 8 16.75 8H14.621C14.861 8.358 15 8.787 15 9.25V14Z" />
        </SvgIcon>
                  <Typography variant="h6" component="h4" style={{ marginLeft: '10px' }}>Team Members</Typography>
                </div>
              }
            />
              <CardContent style={{ display: 'flex', flexDirection: 'column', maxHeight: '80%', overflowY: 'auto' }}>
                {/* Display team members */}
                {teams.filter(team => team.verified).slice(0, 3).map((team, index) => (
                  <div key={index} style={{ backgroundColor: 'lightgrey', borderRadius: '20px', marginBottom: '8px', padding: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" component="p" style={{ marginRight: '8px' }}>
                        {`${team.fname} ${team.lname}`}
                      </Typography>
                      
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'right', marginTop:'2px' }}>
                        {/* Chip outlined containing the role */}
                        <Chip label={formatRole(team.role)} variant="outlined" size="small" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>


          </Card>
        </Grid>


          {/* Second row */}
          {/* <Grid item xs={9}>
  <div style={{ height: '400px', backgroundColor: 'lightgrey', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
      <Typography>Invoices</Typography>
      <FormControl style={{ minWidth: '120px' , textAlign:'center'}}>
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
    </div>
    {chartType === 'invoiceId' ? (
      <LineChart
        xAxis={[{ data: labels}]}
        series={[
          {
            data: totalAmounts,
            color: 'rgb(127, 86, 217)'
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
            color: 'rgb(127, 86, 217)'
          },
        ]}
        height={300}
      />
    )}
  </div>
</Grid> */}


          <Grid item xs={9}>
          {clickedGrid === 'Orders' && (
            <Card style={{ height: '486px',  borderRadius: '10px', padding: '10px' }}>
              <CardHeader title="Orders"/>
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
                      // width={800}
                      height={300}
                    />
                  )}
              </CardContent>
            </Card> 
            )}

            {clickedGrid === 'Invoices' && (
              <Card style={{ height: '486px',  borderRadius: '10px', padding: '10px' }}>
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
                )}
              </CardContent>
            </Card>
            )}

          {clickedGrid === 'Clients' && (
            <Card style={{ height: '486px',  borderRadius: '10px', padding: '10px', overflowY:'auto' }}>

              <CardHeader title="Clients" />
              <CardContent>
              {clients.length === 0 ? (
                    <Container style={{ marginTop: '75px', textAlign: 'center' }}>
                    <img
                        src={empty}
                        alt="Empty Folder"
                        style={{ width: "150px", height: "150px", marginBottom: "10px" }}
                    />
                    <Typography variant="h5">No Clients</Typography>
                    </Container>
                ) : (
                clients.map(client => (
                  <Accordion key={client._id} expanded={expandedAccordion === client._id} onChange={handleAccordionChange(client._id)} style={{ marginBottom: '10px', backgroundColor:'rgb(127, 86, 217)', color:'#ffffff' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{color:'white'}}/>} aria-controls="panel1a-content" id="panel1a-header">
                      <Typography>{`${client.fname} ${client.lname}`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <div>
                      <Typography variant="subtitle1">Orders: {getClientData(client._id).clientOrders.length > 0 ? getClientData(client._id).clientOrders.map(order => order.orderId).join(', ') : 'None'}</Typography>
                      <Typography variant="subtitle1">Invoices: {getClientData(client._id).clientInvoices.length > 0 ? getClientData(client._id).clientInvoices.map(invoice => invoice.invoiceId).join(', ') : 'None'}</Typography>
                      <Typography variant="subtitle1">Tickets: {getClientData(client._id).clientTickets.length > 0 ? getClientData(client._id).clientTickets.map(ticket => ticket._id.slice(-4)).join(', ') : 'None'}</Typography>
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
              {/* <div style={{ marginLeft:'0px',width: '100%', maxWidth: '300px' }}> */}
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


                    {/* Third row
                    <Grid item xs={9}>
            <div style={{ height: '400px', backgroundColor: 'lightgrey', borderRadius: '10px', padding: '10px' }}>Full Width Grid
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
                // width={800}
                // height={300}
              />
            </div>
            
          </Grid>
           <Grid item xs={3}>
            <Card style={{ borderRadius: '10px', height: '74%' }}>
            <CardHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon>
                    <PersonIcon />
                  </Icon>
                  <Typography variant="h6" component="h4" style={{ marginLeft: '10px' }}>Invoices</Typography>
                </div>
              }
            />
              <CardContent style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{ marginLeft:'0px',width: '100%', maxWidth: '300px' }}>
                <BarChart
                  margin={{ bottom: 30, left: 30, right: 30, top: 30 }}
                  xAxis={[{ scaleType: 'band', data: invoiceData.map(item => item.status) }]}
                  series={[{ data: invoiceData.map(item => item.count)}]}
                  width={300}
                  height={200}
                />
              </div>
            </CardContent>


            </Card>
          </Grid>  */}

        </Grid>
      </Container>

    
    </div>
  );
};

export default Dashboard;
