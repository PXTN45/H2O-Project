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
import DrawerDashBoard from "../layout/DrawerDashBoard";
import DrawerSearch from "../layout/DrawerSearch";
import BookingDetail from "../pages/orther/bookingDetail";
import DetailPayment from "../pages/orther/detailPayment";
import SearchResult from "../pages/orther/searchResult";
import HomeStayDetail from "../pages/detail/homeStayDetail";
import PackageDetail from "../pages/detail/packageDetail";
import { PaymentProvider } from "../AuthContext/paymentContext";
import QR from "../testPromptPay";

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
        path: "/pay",
        element: <QR />,
      },
      {
        path: "/detailPayment",
        element: (
          <PaymentProvider>
            <DetailPayment />
          </PaymentProvider>
        ),
      },
      {
        path: "/homeStayDetail/:id",
        element: (
          <PrivateRouterUser>
            <PaymentProvider>
              <HomeStayDetail />
            </PaymentProvider>
          </PrivateRouterUser>
        ),
      },
      {
        path: "/bookingDetail",
        element: (
          <PaymentProvider>
            <BookingDetail />
          </PaymentProvider>
        ),
      },

      {
        path: "/packageDetail/:id",
        element: <PackageDetail />,
      },
      {
        path: "/search",
        element: <DrawerSearch />,
        children: [
          {
            path: "/search/search-result",
            element: <SearchResult />,
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
