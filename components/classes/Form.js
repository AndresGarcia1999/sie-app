import { useState, useEffect } from "react";
import ModalWrapper from "components/ModalWrapper";
import { useDispatch, useSelector } from "react-redux";
import { addClass, editClass } from "store/classesSlice";
import { toast } from "react-toastify";

const ClassForm = ({ isOpen, onClose, classData }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.classes);
  const tutorsState = useSelector((state) => state.tutors);
  const studentsState = useSelector((state) => state.students);
  const [title, setTitle] = useState(classData ? classData.title : "");
  const [description, setDescription] = useState(
    classData ? classData.description : ""
  );
  const [day, setDay] = useState(classData ? classData.day : "");
  const [startAt, setStartAt] = useState(classData ? classData.start_at : "");
  const [endAt, setEndAt] = useState(classData ? classData.end_at : "");
  const [isOutside, setIsOutside] = useState(
    classData ? classData.is_outside : false
  );
  const [transportationCost, setTransportationCost] = useState(
    classData ? classData.transportation_cost : 0
  );
  const [selectedStudent, setSelectedStudent] = useState(
    classData ? classData.student.id : ""
  );
  const [selectedTutor, setSelectedTutor] = useState(
    classData ? classData.tutor.id : ""
  );
  const [editMode, setEditMode] = useState(false);
  const loading = status.add === "loading" || status.edit === "loading";

  //Errors
  const [titleError, setTitleError] = useState("");
  const [tutorError, setTutorError] = useState("");
  const [studentError, setStudentError] = useState("");
  const [scheduleError, setScheduleError] = useState("");

  useEffect(() => {
    setEditMode(!!classData);
    if (isOpen) {
      setTitle(classData ? classData.title : "");
      setDescription(classData ? classData.description : "");
      setDay(classData ? classData.day : "");
      setStartAt(classData ? classData.start_at : "");
      setEndAt(classData ? classData.end_at : "");
      setIsOutside(classData ? classData.is_outside : false);
      setTransportationCost(classData ? classData.transportation_cost : 0);
      setSelectedStudent(classData ? classData.student.id : "");
      setSelectedTutor(classData ? classData.tutor.id : "");
      setTitleError("");
      setTutorError("");
      setStudentError("");
      setScheduleError("");
    }
  }, [isOpen, classData]);

  const validateForm = () => {
    let isValid = true;

    // Validate title
    if (!title.trim()) {
      setTitleError("el titulo es requerido");
      isValid = false;
    } else {
      setTitleError("");
    }

    // Validate tutor
    if (!selectedTutor) {
      setTutorError("el profe es requerido");
      isValid = false;
    } else {
      setTutorError("");
    }

    // Validate student
    if (!selectedStudent) {
      setStudentError("el estudiante es requeriodo");
      isValid = false;
    } else {
      setStudentError("");
    }

    // Validate schedule
    if (!day || !startAt || !endAt) {
      setScheduleError("el horario es requerido");
      isValid = false;
    } else {
      setScheduleError("");
    }
    // Validate end time is after start time
    if (day && startAt && endAt) {
      const start = new Date(`${day}T${startAt}`);
      const end = new Date(`${day}T${endAt}`);
      if (end <= start) {
        toast.error("La hora de fin debe ser después de la hora de inicio");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (loading) return;
    if (validateForm()) {
      const classFormData = {
        title,
        description,
        day,
        start_at: startAt,
        end_at: endAt,
        is_outside: isOutside,
        transportation_cost: transportationCost,
        student: selectedStudent,
        tutor: selectedTutor,
      };

      if (editMode) {
        classFormData.id = classData.id;
        dispatch(editClass(classFormData));
      } else {
        dispatch(addClass(classFormData));
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
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
        <h1 className="text-lg font-semibold">
          {editMode ? "Editar" : "Agregar"} Clase
        </h1>

        <div
          style={{
            scrollbarWidth: "thin",
            scrollMargin: "0.5rem",
            maxHeight: "calc(100vh - 300px)",
          }}
          className="px-1 py-2 overflow-y-auto"
        >
          {/* Class Details Section */}
          <div className="space-y-2">
            <label htmlFor="title" className="block">
              Título:
              <input
                id="title"
                value={title}
                type="text"
                className="w-full p-2 border border-gray-200 rounded"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {titleError && (
                <p className="text-sm text-red-500">{titleError}</p>
              )}
            </label>
            <label htmlFor="description" className="block">
              Descripción:
              <textarea
                id="description"
                value={description}
                className="w-full p-2 border border-gray-200 rounded"
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label
              htmlFor="isOutside"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                id="isOutside"
                type="checkbox"
                checked={isOutside}
                className="text-green-600 outline-none ring-0"
                onChange={(e) => setIsOutside(e.target.checked)}
              />
              <span>Domicilio</span>
            </label>
          </div>
          {/* Student and Tutor Selection */}
          <div className="space-y-2">
            <label htmlFor="selectedStudent" className="block">
              Estudiante:
              {studentsState.status === "loading" ? (
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <select
                  id="selectedStudent"
                  value={selectedStudent}
                  className="w-full p-2 border border-gray-200 rounded"
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <option value="">Seleccionar estudiante</option>
                  {studentsState.students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              )}
              {studentError && (
                <p className="text-sm text-red-500">{studentError}</p>
              )}
            </label>
            <label htmlFor="selectedTutor" className="block">
              Profe:
              {tutorsState.status === "loading" ? (
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <select
                  id="selectedTutor"
                  value={selectedTutor}
                  className="w-full p-2 border border-gray-200 rounded"
                  onChange={(e) => setSelectedTutor(e.target.value)}
                >
                  <option value="">Seleccionar profe</option>
                  {tutorsState.tutors.map((tutor) => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.name}
                    </option>
                  ))}
                </select>
              )}
              {tutorError && (
                <p className="text-sm text-red-500">{tutorError}</p>
              )}
            </label>
          </div>

          {/* Schedule Section */}
          <div className="pt-2 space-y-2">
            <h2 className="font-medium">Horario</h2>
            <label htmlFor="day" className="block">
              Fecha:
              <input
                id="day"
                type="date"
                value={day}
                className="w-full p-2 border border-gray-200 rounded"
                onChange={(e) => setDay(e.target.value)}
              />
            </label>
            <div className="flex space-x-2">
              <label htmlFor="startAt" className="block w-1/2">
                Hora de inicio:
                <input
                  id="startAt"
                  type="time"
                  value={startAt}
                  className="w-full p-2 border border-gray-200 rounded"
                  onChange={(e) => setStartAt(e.target.value)}
                />
              </label>
              <label htmlFor="endAt" className="block w-1/2">
                Hora de fin:
                <input
                  id="endAt"
                  type="time"
                  value={endAt}
                  className="w-full p-2 border border-gray-200 rounded"
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </label>
            </div>
          </div>
          {scheduleError && (
            <p className="text-sm text-red-500">{scheduleError}</p>
          )}

          {/* Transportation Cost (Optional) */}
          <div className="pt-2">
            <label htmlFor="transportationCost" className="block">
              Costo de transporte (opcional):
              <input
                id="transportationCost"
                value={transportationCost}
                type="number"
                step={1000}
                placeholder="Costo de transporte"
                className="w-full p-2 border border-gray-200 rounded"
                onChange={(e) => setTransportationCost(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
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

export default ClassForm;
