import React  from 'react';
import { Link, Outlet } from "react-router-dom";

export const App = () => {
  return (
    <div data-testid={"App-data-test-id"}>
      <h1>PAGE</h1>
      <Link to={"/about"}> about </Link>
      <br/>
      <Link to={"/shop"}> shop </Link>
      <Outlet />
    </div>
  );
};

export default App;