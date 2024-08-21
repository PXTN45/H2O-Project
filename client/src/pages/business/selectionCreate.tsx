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
    <div className="flex flex-col md:flex-row items-center justify-between h-full w-full overflow-hidden relative z-1">
      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <LeftSide />
      </div>
      <div className="w-full md:w-1/2 h-1/2 md:h-full">
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
