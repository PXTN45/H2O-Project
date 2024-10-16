import { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { storage } from "../../../Firebase/firebase.config";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import Swal from "sweetalert2";
import { AuthContext } from "../../../AuthContext/auth.provider";
import { usePackageData } from "../../../AuthContext/packageData";
import { PackageImage } from "../../../type";

const AddImages: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { setImage } = usePackageData();

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  // localStorage.removeItem("selectedImages")

  const { userInfo } = authContext;
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const storedImage = localStorage.getItem("image");
    const storedSelectedImages = localStorage.getItem("selectedImages");

    if (storedImage) {
      setImages(JSON.parse(storedImage));
    }
    if (storedSelectedImages) {
      const parsedSelectedImages = JSON.parse(storedSelectedImages);
      setSelectedImages(parsedSelectedImages);
    }
  }, []);

  useEffect(() => {
    const packageImages: PackageImage[] = images.map((image) => ({
      image_upload: image,
    }));
    setImage(packageImages);
  }, [images]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
        const filesArray = Array.from(files);
        const updatedSelectedImages = [...selectedImages, ...filesArray];
        setSelectedImages(updatedSelectedImages);
        localStorage.setItem("selectedImages", JSON.stringify(updatedSelectedImages));

        const urls = await uploadImages(filesArray);
        setImages((prevImages) => [...prevImages, ...urls]); 
        localStorage.setItem("image", JSON.stringify([...images, ...urls])); 
    }
};

  const removeImage = (index: number) => {
    setSelectedImages((prevSelectedImages) => {
      const updatedSelectedImages = prevSelectedImages.filter((_, i) => i !== index);
      localStorage.setItem("selectedImages", JSON.stringify(updatedSelectedImages)); // Update localStorage
      return updatedSelectedImages;
    });
  
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index); // ลบจาก images
      localStorage.setItem("image", JSON.stringify(updatedImages)); // Update localStorage
      return updatedImages;
    });
  };

  const uploadImages = async (filesArray: File[]) => {
    const storageRef = ref(storage, "imagePackage/");
    const existingFiles = await listAll(storageRef);
    const existingNames = existingFiles.items.map((item) => item.name);
    let nextIndex = 1;

    while (existingNames.includes(`${userInfo?._id}[${nextIndex}]`)) {
      nextIndex++;
    }

    const uploadPromises = filesArray.map(async (file, index) => {
      const newFileName = `${userInfo?._id}[${nextIndex + index}]`;
      const fileRef = ref(storage, `imagePackage/${newFileName}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL; // ส่งกลับ URL
    });

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images: ", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ",
      });
      return [];
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full pt-10">
        <div className="flex flex-col">
          <span className="text-xl">อัปโหลดรูปภาพ</span>
          <span>
            รูปภาพมีความสำคัญต่อผู้ใช้
            อัปโหลดภาพคุณภาพสูงได้มากเท่าที่คุณมีสามารถเพิ่มมากขึ้นในภายหลัง
          </span>
        </div>
        <div className="my-10 border-2 border-dashed border-gray-500 rounded-lg h-full p-20 flex flex-col justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/h2o-project-ts.appspot.com/o/Icon%2Fphoto.png?alt=media&token=f50722f9-5f8c-4e64-aedb-5e815492679a"
              alt=""
              className="w-[80px]"
            />
            <div>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                className="shadow-boxShadow px-3 py-2 rounded-lg"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                เลือกรูปภาพ
              </button>
            </div>
          </div>
          <div className="mt-4 w-full p-5">
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 items-center justify-center">
                {images.map((file, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg hover:scale-105 flex flex-col p-2"
                  >
                    <img
                      src={file} // ใช้ createObjectURL
                      alt={`Selected ${index + 1}`}
                      style={{ maxWidth: "300px", height: "200px" }}
                      className="mx-2 rounded object-cover transition-transform duration-200"
                    />

                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 text-red-500 hover:underline"
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddImages;
