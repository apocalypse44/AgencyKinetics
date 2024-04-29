import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Link} from "react-router-dom";
import { useAlert } from 'react-alert';
import { clearErrors, deleteTeam } from '../../actions/teamAction';
import { DELETE_TEAM_RESET } from '../../constants/teamConstants';


const TeamCard = ({team,  history}) => {
const alert = useAlert();
const dispatch = useDispatch();

const {error} = useSelector(state=>state.teams)
const {error : deleteError , isDeleted} = useSelector(state=>state.serviceDU)

const deleteServiceHandler= (id)=>{
dispatch(deleteTeam(id));
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
  alert.success("Team deleted Succeccfully")
 history.push("/teams");
  dispatch({type:DELETE_TEAM_RESET})
}
  }, [dispatch, alert, error, isDeleted, history , deleteError])
  
  return (
    <div >
    <Link className='userCard' to ={`/team/${team._id}`}>
       <p>{team.team_email}</p></Link>
        <p>{team.role} </p>
          <p>{team.team_fname}</p>

          <button>
 <Link to={`/team/update/${team._id}`}>
          Update
            </Link>
          </button>

            <button
              onClick={() =>
                   deleteServiceHandler(team._id)
              }
            >
              Delete 
            </button>
<hr></hr>

    </div>
  )
}


export default TeamCard