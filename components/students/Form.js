import ModalWrapper from "components/ModalWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, editStudent } from "store/studentsSlice";

const gradeOptions = [
  "Preescolar",
  "Primero",
  "Segundo",
  "Tercero",
  "Cuarto",
  "Quinto",
  "Sexto",
];

const StudentForm = ({ isOpen, onClose, student }) => {
  const { status } = useSelector((state) => state.students);
  const dispatch = useDispatch();
  const [name, setName] = useState(student ? student.name : "");
  const [age, setAge] = useState(student ? student.age : "");
  const [grade, setGrade] = useState(student ? student.grade : "");
  const [phone, setPhone] = useState(student ? student.phone : "");
  const [address, setAddress] = useState(student ? student.address : "");
  const [responsible, setResponsible] = useState(
    student ? student.responsible : ""
  );
  const [editMode, setEditMode] = useState(false);
  const loading = status.add === "loading" || status.edit === "loading";

  const [nameError, setNameError] = useState("");

  useEffect(() => {
    setEditMode(!!student);
    if (isOpen) {
      setName(student ? student.name : "");
      setAge(student ? student.age : "");
      setGrade(student ? student.grade : "");
      setPhone(student ? student.phone : "");
      setAddress(student ? student.address : "");
      setResponsible(student ? student.responsible : "");
      setNameError("");
    }
  }, [isOpen, student]);

  const validateForm = () => {
    let isValid = true;

    if (!name) {
      setNameError("El nombre es requerido");
      isValid = false;
    } else {
      setNameError("");
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (loading) return;
    if (validateForm()) {
      const studentData = {
        name,
        age,
        grade,
        phone,
        address,
        responsible,
      };

      if (editMode) {
        studentData.id = student.id;
        dispatch(editStudent(studentData));
      } else {
        dispatch(addStudent(studentData));
      }
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      width="w-96"
      height="h-auto"
    >
      <div className="flex flex-col items-center justify-center p-4 space-y-4">
        <h1 className="text-lg font-semibold">
          {editMode ? "Editar" : "Agregar"} Estudiante
        </h1>
        <div>
          <input
            value={name}
            type="text"
            placeholder="Nombre"
            className={`w-full p-2 border ${
              nameError ? "border-red-500" : "border-gray-200"
            } rounded`}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && <p className="text-sm text-red-500">{nameError}</p>}
        </div>
        <div>
          <input
            value={age}
            type="number"
            placeholder="Edad"
            className="w-full p-2 border border-gray-200 rounded"
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="flex items-center w-full pl-2 space-x-4">
          <label>Grado</label>
          <select
            value={grade}
            className="w-full p-2 border border-gray-200 rounded"
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="">-</option>
            {gradeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            value={phone}
            type="text"
            placeholder="Teléfono"
            className="w-full p-2 border border-gray-200 rounded"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <input
            value={address}
            type="text"
            placeholder="Dirección"
            className="w-full p-2 border border-gray-200 rounded"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <input
            value={responsible}
            type="text"
            placeholder="Responsable"
            className="w-full p-2 border border-gray-200 rounded"
            onChange={(e) => setResponsible(e.target.value)}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full p-2 text-white bg-green-400 rounded"
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin" />
          ) : editMode ? (
            "Editar"
          ) : (
            "Agregar"
          )}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default StudentForm;
