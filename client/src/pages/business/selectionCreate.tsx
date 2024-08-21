import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

const LeftSide = () => {
  return (
    <div className="w-full h-full md:h-screen flex flex-col items-center justify-center relative">
      <a
        href="https://www.youtube.com/"
        className="relative group w-full text-center shadow-xl"
      >
        <div className="text-overlay text-[24px] md:text-[34px] xl:text-[100px] font-bold">
          Create Homestay
        </div>
        <div className="bg-custom-bg1 absolute inset-0"></div>
      </a>
      <a
        href="https://www.youtube.com/"
        className="relative group mt-[2rem] md:mt-[5rem] w-full text-center shadow-xl"
      >
        <div className="text-overlay text-[24px] md:text-[34px] xl:text-[100px] font-bold">
          Create Package
        </div>
        <div className="bg-custom-bg2 absolute inset-0"></div>
      </a>
    </div>
  );
};

const SelectionCreate = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between h-screen w-full overflow-hidden relative z-1">
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
        <Link 
          to="/" 
          className="absolute top-4 flex items-center space-x-2 bg-gradient-to-r from-primaryNoRole to-secondNoRole text-white py-2 px-4 rounded-r-lg shadow-lg hover:from-blue-600 hover:to-teal-500 z-10"
        >
          <FaHome className="w-5 h-5" />
          <span className="hidden md:inline">BACK TO HOME</span>
        </Link>
        <LeftSide />
      </div>
      <div className="w-full md:w-1/2 md:max-w-[50%] md:max-h-[70%] h-1/2 md:h-full">
        <img
          id="right-image"
          className="w-full h-full object-cover"
          src="https://wallpaperaccess.com/full/2100318.jpg"
          alt="User avatar"
        />
      </div>
    </div>
  );
};

export default SelectionCreate;
