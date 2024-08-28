import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface DateRange {
  startDate: string;      
  endDate: string;        
  startDate_Time: Date | null; 
  endDate_Time: Date | null;   
}

export interface DataNav {
  numPeople: number;
  numChildren: number;
  numRoom: number;
  dateRange: DateRange;
}
export interface Image_room {
  _id: string;
  image: string;
}
export interface Facilities_Room {
  facilitiesName: string;
}

export interface Offer {
  price_homeStay: number;
  max_people: {
    adult: number;
    child: number;
  };
  discount: number;
  facilitiesRoom: Facilities_Room[];
  roomCount: number;
  quantityRoom: number;
}
export interface RoomType {
  name_type_room: string;
  bathroom_homeStay: number;
  bedroom_homeStay: number;
  sizeBedroom_homeStay: string;
  offer: Offer[];
  image_room: Image_room[];
}

export interface Facility {
  _id: string;
  facilities_name: string;
}

interface User {
  _id?: string;
  name?: string;
  lastName?: string;
  businessName?: string;
  email: string;
  password: string;
  phone: string | undefined;
  image: string;
  address: string;
  birthday: Date;
  role: string;
}
interface PaymentData {
  homeStayId: string;
  homeStayName: string;
  totalPrice: number;
  roomType: RoomType;
  offer: Offer;
  bookingUser: User;
  rating: number;
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
}

export interface Image {
  _id: string;
  image: string;
}

export interface HomeStay {
  name_homeStay: string;
  room_type: RoomType[];
  max_people: number;
  detail_homeStay: string;
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
  location: Location[];
  image: Image[];
  business_user: string[]; // Assuming you use ObjectId as string
  review_rating_homeStay: number;
  facilities: Facility[];
  status_sell_homeStay: boolean;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentContextType {
  paymentData: PaymentData | null;
  setPaymentData: (data: PaymentData) => void;
  dataNav: DataNav | null;
  setDataNav: (data: DataNav) => void;
}

interface PaymentProviderProps {
  children: ReactNode;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<PaymentProviderProps> = ({
  children,
}) => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [dataNav, setDataNav] = useState<DataNav | null>(null);

  // โหลดข้อมูลจาก localStorage เมื่อคอมโพเนนต์ถูกสร้างใหม่
  useEffect(() => {
    const savedPaymentData = localStorage.getItem("paymentData");
    if (savedPaymentData) {
      setPaymentData(JSON.parse(savedPaymentData));
    }
    
    const savedDataNav = localStorage.getItem("dataNav");
    if (savedDataNav) {
      setDataNav(JSON.parse(savedDataNav));
    }
  }, []);

  // บันทึกข้อมูลลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (dataNav) {
      localStorage.setItem("dataNav", JSON.stringify(dataNav));
    }
  }, [dataNav]);

  return (
    <PaymentContext.Provider value={{ paymentData, setPaymentData, dataNav, setDataNav }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentContext must be used within a PaymentProvider");
  }
  return context;
};
