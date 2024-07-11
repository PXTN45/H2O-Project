import React, { useContext } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";
import { BsCamera } from "react-icons/bs";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthContext/auth.provider";
import { storage } from "../Firebase/firebase.config";
import axiosPrivateUser from "../hook/axiosPrivateUser";
import axiosPrivateBusiness from "../hook/axiosPrivateBusiness";
import axiosPrivateAdmin from "../hook/axiosPrivateAdmin";

const Drawer: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo, handleLogout, setUserInfo, setLoadPage } = authContext;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const resizedFile = await resizeImage(selectedFile, 500, 500);
      const pathImage = `imagesAvatar/${userInfo?._id}`;

      Swal.fire({
        title: "Are you sure you want to change the image?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLoadPage(false);
            await handleUpload(resizedFile, pathImage);
            const storageRef = ref(storage, pathImage);
            const imageURL = await getDownloadURL(storageRef);
            await apiUpdateImage(imageURL);
            setLoadPage(true);
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "There was an error updating.",
              text: `${error}`,
            });
          }
        } else if (result.isDismissed) {
          console.log("User canceled the image change");
        }
      });
    }
  };

  const resizeImage = (
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        Math.min(maxWidth / img.width, maxHeight / img.height);

        canvas.width = maxWidth;
        canvas.height = maxHeight;
        ctx?.drawImage(img, 0, 0, maxWidth, maxHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
            });
            resolve(resizedFile);
          } else {
            reject(new Error("Canvas is empty"));
          }
        }, file.type);
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handleUpload = async (file: File, pathImage: string) => {
    const storageRef = ref(storage, pathImage);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<void>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });
  };

  const apiUpdateImage = async (imageURL: string) => {
    if (userInfo) {
      const updateImage = {
        image: imageURL,
        role: userInfo.role,
      };

      const whatAxios = (() => {
        switch (userInfo.role) {
          case "user":
            return axiosPrivateUser;
          case "business":
            return axiosPrivateBusiness;
          case "admin":
            return axiosPrivateAdmin;
          default:
            throw new Error("Invalid user role");
        }
      })();

      const response = await whatAxios.put(
        `/user/updateUser/${userInfo._id}`,
        updateImage
      );

      if (!response) {
        throw new Error(`Error: ${response}`);
      } else {
        setUserInfo(response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Avatar image change successful!",
        });
      }
    }
  };

  return (
    <div>
      <div className="md:w-1/4">
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col items-center justify-center">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-2"
              className={
                userInfo?.role === "user"
                  ? "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-primaryUser to-secondUser"
                  : userInfo?.role === "business"
                  ? "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-primaryBusiness to-secondBusiness"
                  : userInfo?.role === "admin"
                  ? "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-primaryAdmin to-secondAdmin"
                  : "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-dark to-smoke"
              }
            >
              <RxHamburgerMenu />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            />
            <ul
              className={
                userInfo?.role === "user"
                  ? "menu p-4 w-80 min-h-full bg-gradient-to-b from-primaryUser to-secondUser text-dark text-xl"
                  : userInfo?.role === "business"
                  ? "menu p-4 w-80 min-h-full bg-gradient-to-b from-primaryBusiness to-secondBusiness text-dark text-xl"
                  : userInfo?.role === "admin"
                  ? "menu p-4 w-80 min-h-full bg-gradient-to-b from-primaryAdmin to-secondAdmin text-dark text-xl"
                  : "menu p-4 w-80 min-h-full bg-gradient-to-b from-dark to-smoke text-white text-xl"
              }
            >
              <div className="flex items-center justify-center mt-5">
                <div className="relative group">
                  <div className="rounded-full h-28 w-28 object-cover bg-dark">
                    <img
                      src={userInfo?.image}
                      alt="Profile"
                      className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-30 rounded-full"
                    />
                  </div>
                  <label
                    className="absolute inset-0 bg-gray-700 bg-opacity-50 text-white text-lg cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ textAlign: "center" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center">
                        <p>
                          <BsCamera />
                        </p>
                        <p>เปลี่ยนรูป</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center my-5">
                <button
                  className={
                    userInfo?.role === "user"
                      ? "btn btn-sm rounded-full btn-text hover:bg-gradient-to-r from-primaryUser to-secondUser hover:text-white"
                      : userInfo?.role === "business"
                      ? "btn btn-sm rounded-full btn-text hover:bg-gradient-to-r from-primaryBusiness to-secondBusiness hover:text-white"
                      : userInfo?.role === "admin"
                      ? "btn btn-sm rounded-full btn-text hover:bg-gradient-to-r from-primaryAdmin to-secondAdmin hover:text-white"
                      : "btn btn-sm rounded-full btn-text hover:bg-gradient-to-r from-dark to-smoke hover:text-white"
                  }
                >
                  {userInfo?.role === "user" || userInfo?.role === "admin"
                    ? `${userInfo?.name} ${userInfo?.lastName}`
                    : userInfo?.role === "business"
                    ? `${userInfo?.businessName}`
                    : null}
                </button>
              </div>
              {/* Sidebar content here */}
              <div className="text-darkmode">
                {userInfo?.role === "user" ? (
                  <div>
                    <Link to={"/dashboard-user/ProfileUser"}>
                      <li>
                        <a>Profile</a>
                      </li>
                    </Link>
                    <Link to={"#"}>
                      <li>
                        <a>My Bookings</a>
                      </li>
                    </Link>
                    <Link to={"#"}>
                      <li>
                        <a>My review</a>
                      </li>
                    </Link>
                    <Link to={"#"}>
                      <li>
                        <a>Property messages</a>
                      </li>
                    </Link>
                  </div>
                ) : userInfo?.role === "business" ? (
                  <div>
                    <Link to={"/dashboard-business/ProfileBusiness"}>
                      <li>
                        <a>Profile</a>
                      </li>
                    </Link>
                    <Link to={"#"}>
                      <li>
                        <a>My Business</a>
                      </li>
                    </Link>
                    <Link to={"#"}>
                      <li>
                        <a>Review</a>
                      </li>
                    </Link>
                    <Link to={"#"}>
                      <li>
                        <a>Property messages</a>
                      </li>
                    </Link>
                  </div>
                ) : userInfo?.role === "admin" ? (
                  <div>
                    <Link to={"/dashboard-business/ProfileAdmin"}>
                      <li>
                        <a>Profile</a>
                      </li>
                    </Link>
                  </div>
                ) : null}
                <hr className="h-px my-4 line-darkmode border-0"></hr>
                {userInfo?.role === "user" ? (
                  <div>
                    <Link to={"#"}>
                      <li>
                        <a>History Booking</a>
                      </li>
                    </Link>
                  </div>
                ) : userInfo?.role === "business" ? (
                  <div>
                    <Link to={"#"}>
                      <li>
                        <a>How to get money</a>
                      </li>
                    </Link>
                  </div>
                ) : null}
                <li onClick={handleLogout}>
                  <a>Log out</a>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
