import React, { useEffect } from 'react'
import { clearErrors, getUserDetails } from '../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from "../layout/MetaData.jsx";

const UserDetails = ({match}) => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const { user, error } = useSelector(state => state.userDetails);
console.log(user)

    useEffect(() => {
      if(error){
       alert.error(error)
       dispatch(clearErrors)
    }
    dispatch(getUserDetails(match.params.id));
  }, [dispatch, match.params.id, error , alert]);
  return (
    <div>
        <MetaData title ="OrderDetails  -- Test"/>
          <p>{user.user_email}</p>

    </div>
  )
}

export default UserDetails