import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData.jsx";
import { getTeamDetails , clearErrors} from "../../actions/teamAction.jsx";

const TeamDetail = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { combined, error } = useSelector(state => state.teamDetails);
console.log(combined)
  useEffect(() => {
      if(error){
       alert.error(error)
       dispatch(clearErrors)
    }
    dispatch(getTeamDetails(match.params.id));
  }, [dispatch, match.params.id, error , alert]);
  return (
    <div>
        <MetaData title ="Team Details  -- Test"/>

          <p>{combined.email}</p>
          <p>{combined.fname}</p>
          <p>{combined.lname}</p>
          {/* <p>{combined.role}</p> */}

    </div>
  );
};
export default TeamDetail