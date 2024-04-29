import React, { useEffect } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from "react-router-dom";
import { clearErrors, deleteUser } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstant';
const UserCard = ({user, history}) => {

const alert = useAlert();
const dispatch = useDispatch();


const {error} = useSelector(state=>state.users)
const {error : deleteError , isDeleted} = useSelector(state=>state.userDU)


const deleteUserHandler =(id)=>{
  dispatch(deleteUser(id));
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
  alert.success("User deleted Succeccfully")
 history.push("/users");
  dispatch({type:DELETE_USER_RESET}) 
}
  }, [dispatch, alert, error, isDeleted, history , deleteError])
  return (
    <div>
    <Link className='userCard' to ={`/user/${user._id}`}>
       <p>{user.role}</p></Link>
        <p>{user.user_email}</p>
            {/* <button onClick={()=>
            deleteUserHandler(user._id)}>
              Delete 
            </button> */}
  <hr/>
    
    </div>
  )
}

export default UserCard