const ModalWrapper = ({
  onClose,
  isOpen = false,
  width = "w-96",
  height = "h-96",
  children,
}) => {
  if (isOpen) {
    return (
      <>
        <div
          className={`fixed top-0 bottom-0 left-0 z-50 flex justify-center items-center
          w-screen pt-16 pb-20 bg-gray-600 outline-none md:py-6 2xl:py-20 bg-opacity-40 ml-0`}
          // onClick={onClose}
        >
          <div
            className={`show-modal relative z-50 bg-white shadow-xl ${width} ${height} rounded-xl `}
            onClick={(e) => e.stopPropagation()}
          >
            {onClose && (
              <button onClick={onClose} className="absolute z-40 top-2 right-2">
                <i className=" py-1  px-1.5  text-xs text-white bg-gray-300 rounded-full fas fa-times" />
              </button>
            )}
            <div className="flex flex-col items-center content-center object-center w-full h-full">
              {children}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default ModalWrapper;
