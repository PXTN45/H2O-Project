import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import PrivateRouterUser from "../PrivateRouter/PrivateRouterUser";
import PrivateRouterBusiness from "../PrivateRouter/PrivateRouterBusiness";
import PrivateRouterAdmin from "../PrivateRouter/PrivateRouterAdmin";
import PrivateVerifyEmail from "../PrivateRouter/PrivateVerifyEmail";
import Home from "../pages/home/homepage";
import VerifyEmailSuccess from "../pages/orther/emailIsVerify";
import ProfileUser from "../pages/user/profile";
import ProfileBusiness from "../pages/business/profile";
import SelectionCreate from "../pages/business/selectionCreate";
import Payment from "../pages/orther/MakePayment";
import DrawerDashBoard from "../layout/DrawerDashBoard";
import DrawerSearch from "../layout/DrawerSearch";
import TEST from "./test";
import TEST2 from "./test2";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/test",
        element: <TEST />,
      },
      {
        path: "/test2",
        element: <TEST2 />,
      },
      {
        path: "/Payment",
        element: <Payment />,
      },
      {
        path: "/search",
        element: (<DrawerSearch />),
        children:[
          {
            path: "/search/1",
            element: <ProfileUser />,
          },
        ],
      },
      {
        path: "/create-business",
        element: (
          <PrivateRouterBusiness>
            <SelectionCreate />
          </PrivateRouterBusiness>
        ),
      },
      {
        path: "/dashboard-user",
        element: (
          <PrivateRouterUser>
            <DrawerDashBoard />
          </PrivateRouterUser>
        ),
        children: [
          {
            path: "/dashboard-user/Profile-user",
            element: <ProfileUser />,
          },
        ],
      },
      {
        path: "/dashboard-business",
        element: (
          <PrivateRouterBusiness>
            <DrawerDashBoard />
          </PrivateRouterBusiness>
        ),
        children: [
          {
            path: "/dashboard-business/Profile-business",
            element: <ProfileBusiness />,
          },
        ],
      },
      {
        path: "/dashboard-admin",
        element: (
          <PrivateRouterAdmin>
            <DrawerDashBoard />
          </PrivateRouterAdmin>
        ),
        children: [
          {
            path: "/dashboard-admin/Profile-admin",
            element: <ProfileBusiness />,
          },
        ],
      },
    ],
  },
  {
    path: "/verifySuccess/:token",
    element: (
      <PrivateVerifyEmail>
        <VerifyEmailSuccess />
      </PrivateVerifyEmail>
    ),
  },
]);

export default router;
