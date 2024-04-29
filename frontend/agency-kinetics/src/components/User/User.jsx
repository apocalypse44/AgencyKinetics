import{useSelector, useDispatch} from "react-redux";
import React, { useEffect } from 'react'
import { getUser } from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import UserCard from "./UserCard";
import { useHistory } from "react-router-dom";

const User = () => {
  const history = useHistory();

const dispatch = useDispatch()
const {error, loading, users} = useSelector((state)=>state.users)
useEffect(() => {
    if(error){
        return alert.error(error);
    }
dispatch(getUser())
}, [dispatch, error])


  return (
    <div>
        <MetaData title ="User  -- Test"/>

      {users&&users.map((user)=>(
      <UserCard key = {user._id} user ={user} history={history}/>))}
    </div>
  )
}

export default User;