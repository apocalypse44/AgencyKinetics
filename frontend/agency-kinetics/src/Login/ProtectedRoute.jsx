import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
  const { loading, isAuthenticated, combined } = useSelector((state) => state.member);
  const showSidebar = useSelector((state) => state.logMember.showSidebar);
  return (
    <Fragment>
      {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            showSidebar ? (
              <Component {...props} />
            ) : (
              <Redirect to="/combined/login" />
            )
            
            if (isAuthenticated === false) {
              return <Redirect to="/combined/login" />;
            }

            if (isAdmin === true && combined.role !== "SUPERADMIN") {
              return <Redirect to="/combined/login" />;
            }

            return           <Fragment>
            <Component {...props} />
          </Fragment>
          }}
        />
      )}
    </Fragment>
  );
};

export default ProtectedRoute;