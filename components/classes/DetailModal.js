import ModalWrapper from "components/ModalWrapper";
import { formatDateInterval } from "utils/dateFormat";

const ClassModal = ({ isOpen, onClose, classData }) => {
  if (!isOpen) return null; // Only render if modal is open
  return (
    <ModalWrapper height="h-auto" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-full p-4">
        <p className="text-xl font-semibold">{classData.title}</p>
        <p>
          <b>Horario:</b>{" "}
          {formatDateInterval(
            classData.day,
            classData.start_at,
            classData.end_at
          )}
        </p>
        <p>
          <b>Descripción:</b> {classData.description}
        </p>

        <p>
          <b>Estudiante:</b> {classData.student.name}
        </p>
        <p>
          <b>Tutor:</b> {classData.tutor.name}
        </p>
        <p>
          <b>A domicilio:</b> {classData.is_outside ? "Sí" : "No"}
        </p>

        {classData.transportationCost && (
          <p>
            <b>Costo de transporte:</b> {classData.transportationCost}
          </p>
        )}
        <button
          className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-700"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </ModalWrapper>
  );
};

export default ClassModal;
