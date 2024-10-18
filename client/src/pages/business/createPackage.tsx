import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { usePackageData } from "../../AuthContext/packageData";
import axiosPrivateBusiness from "../../hook/axiosPrivateBusiness";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthContext/auth.provider";

const CreatePackage = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  const {
    packageData: newPackageData,
    location,
    image,
    homestayID,
    bank,
    discount,
    price,
    statusAccept,
    currentStep,
    setCurrentStep,
  } = usePackageData();
  const navigate = useNavigate();

  // console.log(newPackageData);
  // console.log(location);
  // console.log(image);
  // console.log(homestayID);
  // console.log(bank);
  // console.log(discount);
  // console.log(price);

  // รายการของขั้นตอนและเส้นทางที่สอดคล้อง
  const steps = [
    { step: 1, path: "basic-information-package", label: "ข้อมูลพื้นฐาน" },
    { step: 2, path: "location", label: "สถานที่" },
    { step: 3, path: "images", label: "รูปภาพ" },
    { step: 4, path: "pricAndPayment", label: "ราคาและช่องทางการชำระเงิน" },
    { step: 5, path: "policies", label: "นโยบาย" },
  ];
  
  useEffect(() => {
    const storedStep = localStorage.getItem("currentStep");
    const initialStep = storedStep ? parseInt(storedStep) : 1;
    setCurrentStep(initialStep);
    
  }, [currentStep]);


  const clearLocalStorage = () => {
    localStorage.removeItem("selectedId");
    localStorage.removeItem("packageName");
    localStorage.removeItem("maxTourists");
    localStorage.removeItem("isChildren");
    localStorage.removeItem("isFood");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    localStorage.removeItem("description");
    localStorage.removeItem("activityPackages");
    localStorage.removeItem("newActivities");
    localStorage.removeItem("cancellationPolicy");
    localStorage.removeItem("image");
    localStorage.removeItem("selectedImages");
    localStorage.removeItem("Bank");
    localStorage.removeItem("homestay");
    localStorage.removeItem("indexHomesaty");
    localStorage.removeItem("checkStatus");
    localStorage.removeItem("locationPackage");
    localStorage.removeItem("discounts");
    localStorage.removeItem("packagePrice");
    localStorage.removeItem("openDiscount");
    localStorage.removeItem("images");
    localStorage.removeItem("currentStep");
    localStorage.removeItem("packageData");
    localStorage.removeItem("packageData");
  };

  const createPackage = async () => {
    try {
      const packageData = {
        ...newPackageData,
        location,
        image,
        homestay: homestayID,
        discount,
        price_package: price,
        review_rating_package: 0,
        business_user: userInfo?._id,
      };

      const updateData = {
        ...userInfo,
        ...bank,
      };

      const response = await axiosPrivateBusiness.post("/package", packageData);
      const responseUser = await axiosPrivateBusiness.put(
        `/user/updateUser/${userInfo?._id}`,
        updateData
      );

      if (response.status === 201 && responseUser.status === 200) {
        clearLocalStorage();
        navigate("/");
        Swal.fire({
          title: "สำเร็จ!",
          text: "สร้างแพคเกจสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
      }
    } catch (error) {
      console.error("Error creating package:", error);
      Swal.fire({
        title: "ผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการสร้างแพคเกจ",
        icon: "error",
        confirmButtonText: "ลองใหม่อีกครั้ง",
      });
    }
  };

  const prevStep = () => {
    navigate("/create-package/pricAndPayment");
    setCurrentStep(4);
    localStorage.setItem("currentStep", JSON.stringify(4));
  };

  return (
    <div className="h-screen overflow-auto">
      <div className="flex flex-wrap  xl:flex-nowrap w-full ">
        <div className="flex lg:justify-center w-full md:w-full lg:w-full xl:w-1/5 xl:h-[500px]">
          <div className="bg-white mx-6 flex rounded-md shadow-md p-4">
            <ul className="steps steps-horizontal md:steps-horizontal lg:steps-horizontal xl:steps-vertical">
              {steps.map((step) => (
                <li
                  key={step.step}
                  className={`step ${
                    currentStep >= step.step ? "step-primary" : ""
                  }`}
                >
                  {step.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full  md:w-full ">
          <div className="w-full flex flex-col justify-center items-center">
            <div className="w-4/5">
              <Outlet />
            </div>

            {/* ปุ่มไปกลับ */}
            {currentStep === 5 && (
              <div className=" w-4/5 flex items-center justify-center">
                <div className="w-full my-5">
                  <div className="flex justify-between">
                    <button
                      className="shadow-boxShadow px-3 py-2 rounded-lg hover:bg-secondBusiness
             bg-primaryBusiness text-white w-24 h-12"
                      onClick={prevStep}
                    >
                      ก่อนหน้า
                    </button>
                    <button
                      onClick={createPackage}
                      disabled={statusAccept === false}
                      className={` px-3 py-2 rounded-lg ${
                        statusAccept === false
                          ? "bg-whiteSmoke text-white"
                          : "bg-primaryBusiness hover:bg-secondBusiness text-white"
                      }`}
                    >
                      สร้างแพคเกจ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePackage;
