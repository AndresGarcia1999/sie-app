import { deleteStudent } from "store/studentsSlice";

const { useDispatch } = require("react-redux");

const StudentsTable = ({ students = [], loadingStudents, onAdd, onEdit }) => {
  const dispatch = useDispatch();
  const onDelete = (id) => {
    dispatch(deleteStudent(id));
  };

  return loadingStudents ? (
    <div className="flex justify-center py-4">
      <i className="text-2xl text-gray-400 fas -z-10 fa-spinner fa-spin"></i>
    </div>
  ) : (
    <div className="flex flex-col py-4">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <table className="hidden min-w-full md:table">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 text-sm text-left text-gray-600 uppercase rounded-tl-xl">
                  Nombre
                </th>
                <th className="p-4 text-sm text-left text-gray-600 uppercase">
                  Edad
                </th>
                <th className="p-4 text-sm text-left text-gray-600 uppercase">
                  Grado
                </th>
                <th className="p-4 text-sm text-left text-gray-600 uppercase">
                  Telefono
                </th>
                <th className="p-4 text-sm text-left text-gray-600 uppercase">
                  Direccion
                </th>
                <th className="p-4 text-sm text-left text-gray-600 uppercase">
                  Acudiente
                </th>
                <th className="p-4 text-sm text-gray-600 uppercase rounded-tr-xl">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="align-middle bg-white border-b hover:bg-gray-100"
                >
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">{student.age}</td>
                  <td className="p-4">{student.grade}</td>
                  <td className="p-4">{student.phone}</td>
                  <td className="p-4">{student.address}</td>
                  <td className="p-4">{student.responsible}</td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2 text-sm">
                      <button
                        onClick={() => onEdit(student)}
                        className="px-5 py-0.5 border text-yellow-400 bg-white  border-yellow-400 rounded-full "
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(student.id)}
                        className="px-5 py-0.5 border  text-red-400 bg-white border-red-400 rounded-full "
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Add button */}
            </tbody>
          </table>

          {/* Responsive Cards for Mobile View */}
          <div className="flex flex-col px-2 py-2 space-y-4 md:hidden">
            {students.map((student) => (
              <div key={student.id} className="bg-white shadow-lg rounded-2xl">
                <div className="flex flex-wrap px-2 pt-2 space-y-1 text-sm">
                  <p className="w-full text-base font-semibold text-gray-800">
                    {student.name}
                    {", "}
                    <span className="font-normal">{student.age} años</span>
                  </p>

                  <p className="w-1/2 text-gray-600">
                    <span className="font-semibold">Grado:</span>{" "}
                    {student.grade}
                  </p>
                  <p className="w-1/2 text-gray-600">
                    <span className="font-semibold">Telefono:</span>{" "}
                    {student.phone}
                  </p>
                  <p className="w-1/2 text-gray-600">
                    <span className="font-semibold">Direccion:</span>{" "}
                    {student.address}
                  </p>
                  <p className="w-1/2 text-gray-600">
                    <span className="font-semibold">Acudiente:</span>{" "}
                    {student.responsible}
                  </p>
                </div>
                <div className="flex pt-3">
                  <button
                    onClick={() => onEdit(student)}
                    className="w-1/2 py-2 font-medium text-white bg-yellow-400 rounded-bl-2xl "
                  >
                    <i className="pr-1 fas fa-edit"></i>
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(student.id)}
                    className="w-1/2 font-medium text-white bg-red-400 rounded-br-2xl"
                  >
                    <i className="pr-1 fas fa-trash"></i>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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

export default StudentsTable;
