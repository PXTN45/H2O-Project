import Drawer from "../components/Drawer-Search";
import { Outlet } from "react-router-dom";

const DashBoard = () => {
  return (
      <div className="flex">
        <Drawer />
        <div className="md:w-1.5/4 w-full mx-40">
          <Outlet />
        </div>
      </div>
  );
};

export default DashBoard;
