import React, { createContext, useContext, useState } from "react";
import { Bank, Location, PackageImage } from "../type";

// สร้าง interface สำหรับข้อมูลแพ็คเกจ
interface Activity {
  activity_days: {
    activity_name: string;
  }[];
}

interface PackageData {
  name_package: string;
  type_package: string;
  max_people: number;
  detail_package: string;
  activity_package: Activity[];
  time_start_package: Date;
  time_end_package: Date;
  policy_cancel_package: string;
  isChildren: boolean;
  isFood: boolean;
}



interface PackageDataContextType {
  packageData: PackageData | undefined;
  setPackageData: React.Dispatch<React.SetStateAction<PackageData | undefined>>;
  location: Location[] | undefined;
  setLocation: React.Dispatch<React.SetStateAction<Location[] | undefined>>;
  image: PackageImage[] | undefined;
  setImage: React.Dispatch<React.SetStateAction<PackageImage[] | undefined>>;
  homestayID: string | undefined;
  setHomestayID: React.Dispatch<React.SetStateAction<string | undefined>>;
  price: number | undefined;
  setPrice: React.Dispatch<React.SetStateAction<number | undefined>>;
  discount: number | undefined;
  setDiscount: React.Dispatch<React.SetStateAction<number | undefined>>;
  bank: Bank | undefined;
  setBank: React.Dispatch<React.SetStateAction<Bank | undefined>>;
  statusAccept: boolean;
  setStatusAccept: React.Dispatch<React.SetStateAction<boolean>>;
}

const PackageDataContext = createContext<PackageDataContextType | undefined>(
  undefined
);

export const PackageDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [packageData, setPackageData] = useState<PackageData | undefined>(
    undefined
  );
  const [location, setLocation] = useState<Location[] | undefined>([]);
  const [image, setImage] = useState<PackageImage[] | undefined>();
  const [homestayID, setHomestayID] = useState<string | undefined>();
  const [price, setPrice] = useState<number | undefined>();
  const [discount, setDiscount] = useState<number | undefined>();
  const [bank, setBank] = useState<Bank | undefined>();
  const [statusAccept, setStatusAccept] = useState<boolean>(false);

  return (
    <PackageDataContext.Provider
      value={{
        packageData,
        setPackageData,
        location,
        setLocation,
        image,
        setImage,
        homestayID,
        setHomestayID,
        price,
        setPrice,
        discount,
        setDiscount,
        bank,
        setBank,
        statusAccept,
        setStatusAccept
      }}
    >
      {children}
    </PackageDataContext.Provider>
  );
};

// สร้าง hook เพื่อใช้งาน Context
export const usePackageData = () => {
  const context = useContext(PackageDataContext);
  if (!context) {
    throw new Error("usePackageData must be used within a PackageDataProvider");
  }
  return context;
};
