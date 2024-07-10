import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import { AuthContext } from "../AuthContext/auth.provider";
import Modal from "./Get-Stared";
import ModalSelectRoles from "./Modal-SelectRoles";
import { BsPersonWalking } from "react-icons/bs";

interface NavbarProps {
  image: string;
}

const Navbar: React.FC<NavbarProps> = ({image}) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { thisPage, userInfo, handleLogout } = authContext;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateAdmin = () => {
    (document.getElementById("Get-Started") as HTMLDialogElement)?.showModal();
  }

  return (
    <div>
      <nav
        className={
          thisPage === "/"
            ? "bg-white w-full relative"
            : userInfo && userInfo.role === "user"
            ? "bg-gradient-to-r from-primaryUser to-secondUser w-full relative"
            : userInfo && userInfo.role === "business"
            ? "bg-gradient-to-r from-primaryBusiness to-secondBusiness w-full relative"
            : userInfo && userInfo.role === "admin"
            ? "bg-gradient-to-r from-primaryAdmin to-secondAdmin w-full relative"
            : "bg-gradient-to-r from-dark to-smoke w-full relative"
        }
      >
        <div
          className={
            !userInfo || (userInfo && thisPage === "/")
              ? "relative p-8 h-[700px]"
              : "relative"
          }
          style={
            !userInfo || (userInfo && thisPage === "/")
              ? {
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                }
              : {}
          }
        >
          <div className="flex items-center justify-between">
            <Modal name="Get-Started" />
            <ModalSelectRoles name="Modal-SelectRoles" />
            <Link
              to="/"
              className="flex items-center space-x-3 rtl:space-x-reverse text-xl"
            >
              <BsPersonWalking className="h-8 w-10" />
              <span className="self-center font-bold whitespace-nowrap">
                H2O
              </span>
            </Link>

            <div className="hidden md:flex flex-grow items-center justify-center text-lg">
              <ul className="font-medium flex space-x-8 rtl:space-x-reverse">
                <li>
                  <Link to="/home" className="link-style ml-[50px]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="link-style ml-[50px]">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/service" className="link-style ml-[50px]">
                    Service
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="link-style ml-[50px]">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-600 text-lg font-bold py-2 px-4 rounded"
              onClick={
                !userInfo
                  ? () => {(document.getElementById("Get-Started") as HTMLDialogElement)?.showModal();}
                  : toggleDropdown
              }
            >
              {!userInfo ? (
                <>Get Started</>
              ) : (
                <>
                  <div className="relative">
                    <img
                      id="avatarButton"
                      data-dropdown-toggle="userDropdown"
                      data-dropdown-placement="bottom-start"
                      className="w-10 h-10 rounded-full cursor-pointer"
                      src={userInfo.image}
                      alt="User dropdown"
                    />
                    {isOpen && (
                      <div
                        id="userDropdown"
                        className="z-10 absolute right-7 divide  divide-y  rounded-[1.25rem] rounded-tr-[0rem] shadow w-44"
                      >
                        <div className="px-4 py-3 text-sm">
                          <div>
                            {userInfo.role === "user" || userInfo.role === "admin"
                              ? `${userInfo.name} ${userInfo.lastName}`
                              : userInfo.role === "business"
                              ? `${userInfo.businessName}`
                              :null
                            }
                          </div>
                          <div className="font-medium truncate">
                            {userInfo.email}
                          </div>
                        </div>
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="avatarButton"
                        >
                          <li>
                            <a
                              href={`/dashboard-${userInfo.role}`}
                              className="block px-4 py-2"
                            >
                              Dashboard
                            </a>
                          </li>
                          {userInfo && userInfo.role === "business" && (
                            <li>
                              <a href="/create-business" className="block px-4 py-2">
                                Create a sale 
                              </a>
                            </li>
                          )}
                          {userInfo && userInfo.role === "admin" && (
                            <li>
                              <a className="block px-4 py-2" onClick={handleCreateAdmin}>
                                Create a User
                              </a>
                            </li>
                          )}
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2"
                            >
                              Settings
                            </a>
                          </li>
                        </ul>
                        <div className="py-1">
                          <a
                            onClick={handleLogout}
                            className="block px-4 py-2 text-sm"
                          >
                            Sign out
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </button>
          </div>
          {!userInfo || (userInfo && thisPage === "/") ? (
            <div className="flex items-center mt-[100px]">
              <Search />
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
