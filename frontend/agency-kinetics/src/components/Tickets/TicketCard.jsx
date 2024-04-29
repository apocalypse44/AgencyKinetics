import React, { useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { clearErrors, deleteTicket } from '../../actions/ticketAction';
import { DELETE_TICKET_RESET } from '../../constants/ticketConstants';

const TicketCard = ({ticket, history}) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const {error}= useSelector(state=>state.tickets)
  const {error: deleteError, isDeleted}= useSelector(state=>state.ticketDU)

  const deleteTicketHandler= (id)=>{
dispatch(deleteTicket(id));
  }

  
  useEffect(() => {
if(error){
  alert.error(error);
  dispatch(clearErrors())
}
if (deleteError){
  alert.error(deleteError);
  dispatch(clearErrors());
}
if(isDeleted){
  alert.success("Ticket deleted Succeccfully")
 history.push("/tickets");
  dispatch({type:DELETE_TICKET_RESET})
}
  }, [dispatch, alert, error, isDeleted, history , deleteError])
  return (

    <div>
    <Link className='ticketCard' to ={`/ticket/${ticket._id}`}>
       <p>{ticket.subject}</p></Link>
        <p>{ticket.orderId}</p>
                  <button>
 <Link to={`/ticket/update/${ticket._id}`}>
          Update
            </Link>
          </button>
            <button 
            onClick={()=>
            deleteTicketHandler(ticket._id)}>
              Delete 
            </button>
  <hr/>
    
    </div>
  )
}



export default TicketCard