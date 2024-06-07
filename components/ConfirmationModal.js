import ModalWrapper from "./ModalWrapper";

const ConfirmDeleteModal = ({
  text,
  isOpen,
  onClose,
  confirmDelete,
  loading,
}) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} height="w-96 h-auto">
      <div className="flex flex-col my-10">
        <div className="flex justify-center mx-auto">
          <i className="my-auto text-6xl text-red-600 fas fa-trash-alt" />
        </div>
        <div className="py-4 mx-10">
          <h2 className="text-lg font-semibold text-center capitalize-first font-title">
            {text}
          </h2>
        </div>
        <div className="flex justify-center w-full space-x-4 text-xs font-medium">
          <button
            className="flex justify-center w-32 py-1 text-red-600 transition duration-150 ease-in-out bg-white border border-red-600 rounded-full hover:bg-red-100 "
            onClick={onClose}
          >
            Atrás
          </button>
          <button
            className="flex items-center justify-center w-32 py-1 text-white transition duration-150 ease-in-out bg-red-500 rounded-full hover:bg-red-600 hover:opacity-90"
            onClick={confirmDelete}
            disabled={loading}
          >
            {loading ? (
              <i className="fas fa-spinner-third animate-spin" />
            ) : (
              <p>Si, eliminar</p>
            )}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
export default ConfirmDeleteModal;
