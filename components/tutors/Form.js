import ModalWrapper from "components/ModalWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTutor, editTutor } from "store/tutorsSlice";

const TutorForm = ({ isOpen, onClose, tutor }) => {
  const { user } = useSelector((state) => state.user);
  const { status } = useSelector((state) => state.tutors);
  const dispatch = useDispatch();
  const [name, setName] = useState(tutor ? tutor.name : "");
  const [email, setEmail] = useState(tutor ? tutor.email : "");
  const [password, setPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const loading = status.add === "loading" || status.edit === "loading";

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setEditMode(!!tutor);
    if (isOpen) {
      setName(tutor ? tutor.name : "");
      setEmail(tutor ? tutor.email : "");
      setPassword(tutor ? "*********" : "");
      setPasswordChanged(false);
      setNameError("");
      setEmailError("");
      setPasswordError("");
    }
  }, [isOpen, tutor]);

  const validateForm = () => {
    let isValid = true;

    if (!name) {
      setNameError("El nombre es requerido");
      isValid = false;
    } else {
      setNameError("");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("El correo es requerido");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("El correo no es válido");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!editMode && !password) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    } else if (editMode && passwordChanged && !password) {
      setPasswordError("La nueva contraseña es requerida");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (loading) return;
    if (validateForm()) {
      if (editMode) {
        const tutorData = { id: tutor.id, name };
        if (passwordChanged && user?.is_admin) {
          tutorData.password = password;
        }
        dispatch(editTutor(tutorData));
      } else {
        dispatch(addTutor({ name, email, password }));
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
          {editMode ? "Editar" : "Agregar"} Profesor
        </h1>
        <div>
          <input
            value={name}
            type="text"
            placeholder="Nombre"
            className={`w-full p-2 border ${
              nameError ? "border-red-500" : "border-gray-200"
            } rounded`}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          {nameError && <p className="text-sm text-red-500">{nameError}</p>}
        </div>
        <div>
          <input
            value={email}
            type="email"
            placeholder="Correo"
            className={`w-full p-2 border ${
              emailError ? "border-red-500" : "border-gray-200"
            } rounded`}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            disabled={editMode}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>
        <div>
          <input
            value={password}
            type="password"
            placeholder="Contraseña"
            className={`w-full p-2 border ${
              passwordError ? "border-red-500" : "border-gray-200"
            } rounded`}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordChanged(true);
            }}
            disabled={editMode && !user?.is_admin}
          />
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
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

export default TutorForm;
