import React  from 'react';
import { Link, Outlet } from "react-router-dom";
import { adminRoutes } from "@packages/shared/src/routes/admin"
import { shopRoutes } from "@packages/shared/src/routes/shop"

export const App = () => {
  return (
    <div data-testid={"App-data-test-id"}>
      <h1>PAGE</h1>
      <Link to={adminRoutes.about}> about </Link>
      <br/>
      <Link to={shopRoutes.main}> shop </Link>
      <Outlet />
    </div>
  );
};