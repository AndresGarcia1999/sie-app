import { useSelector } from "react-redux";
import { formatDateInterval } from "utils/dateFormat";

const ClassesTable = ({
  classes = [],
  loadingClasses,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return loadingClasses ? (
    <div className="flex justify-center py-4">
      <i className="text-2xl text-gray-400 -z-10 fa-spin fas fa-spinner"></i>
    </div>
  ) : (
    <div className="flex flex-col py-4">
      {/* Table */}
      <ul className="space-y-2 list-none">
        {classes.map((classData) => (
          <ClassListItem
            key={classData.id}
            classData={classData}
            onOpenModal={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
      {/* Add button */}

      <div className="flex justify-center pt-4">
        <button
          onClick={onAdd}
          className="px-8 py-3 text-white bg-green-400 border rounded-full "
        >
          <i className="text-xl fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default ClassesTable;

const ClassListItem = ({ classData, onOpenModal, onEdit, onDelete }) => {
  return (
    <li
      onClick={() => onOpenModal(classData)}
      className="flex items-center justify-between px-4 py-2 border rounded cursor-pointer hover:bg-gray-100"
    >
      <div>
        <h3 className="text-lg font-semibold">
          {classData.title}{" "}
          <span className="block text-sm font-normal text-gray-500 sm:inline ">
            {formatDateInterval(
              classData.day,
              classData.start_at,
              classData.end_at
            )}
          </span>
        </h3>

        <div className="flex justify-between">
          <div className="flex flex-col gap-x-2 sm:flex-row">
            <p className="text-sm text-gray-500">
              Profe:{" "}
              <span className="font-semibold">{classData.tutor.name}</span>
            </p>
            <p className="text-sm text-gray-500">
              Estudiante:{" "}
              <span className="font-semibold">{classData.student.name}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 text-xl">
        <i
          onClick={(e) => {
            e.stopPropagation();
            onDelete(classData.id);
          }}
          className="text-red-500 fas fa-trash-alt"
        ></i>
        <i
          onClick={(e) => {
            e.stopPropagation();
            onEdit(classData);
          }}
          className="text-yellow-500 fas fa-edit"
        ></i>
      </div>
    </li>
  );
};
