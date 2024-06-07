import ConfirmDeleteModal from "components/ConfirmationModal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTutor } from "store/tutorsSlice";

const TutorsTable = ({ tutors = [], loadingTutors, onAdd, onEdit }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.tutors);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const onDelete = (id) => {
    setSelectedTutor(id);
  };

  return loadingTutors ? (
    <div className="flex justify-center py-4">
      <i className="text-2xl text-gray-400 -z-10 fa-spin fas fa-spinner"></i>
    </div>
  ) : (
    <>
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
                    Correo
                  </th>
                  <th className="p-4 text-sm text-gray-600 uppercase rounded-tr-xl">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {tutors.map((tutor) => (
                  <tr
                    key={tutor.id}
                    className="bg-white border-b hover:bg-gray-100"
                  >
                    <td className="p-4">{tutor.name}</td>
                    <td className="p-4">{tutor.email}</td>
                    <td className="p-4 ">
                      <div className="flex justify-center space-x-2 text-sm">
                        <button
                          onClick={() => onEdit(tutor)}
                          className="px-5 py-0.5 border text-yellow-400 bg-white  border-yellow-400 rounded-full "
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(tutor.id)}
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
              {tutors.map((tutor) => (
                <div key={tutor.id} className="bg-white shadow-lg rounded-2xl">
                  <div className="px-2 pt-2 space-y-1">
                    <p className="font-semibold text-gray-800">{tutor.name}</p>
                    <p className="text-gray-600 ">{tutor.email}</p>
                  </div>
                  <div className="flex pt-3">
                    <button
                      onClick={() => onEdit(tutor)}
                      className="w-1/2 py-2 font-medium text-white bg-yellow-400 rounded-bl-2xl "
                    >
                      <i className="pr-1 fas fa-edit"></i>
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(tutor.id)}
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
      <ConfirmDeleteModal
        text="¿Estás seguro de que deseas eliminar este profe?"
        isOpen={!!selectedTutor}
        onClose={() => setSelectedTutor(null)}
        confirmDelete={() => {
          dispatch(deleteTutor(selectedTutor));
          setSelectedTutor(null);
        }}
        loading={status.delete === "loading"}
      />
    </>
  );
};

export default TutorsTable;
