"use client";

import TutorForm from "components/tutors/Form";
import TutorsTable from "components/tutors/Table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchTutors, resetStatus } from "store/tutorsSlice";

const TutorsHome = () => {
  const dispatch = useDispatch();
  const { tutors, status, error } = useSelector((state) => state.tutors);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const handleAddTutor = () => {
    setIsFormOpen(true);
    setSelectedTutor(null);
  };
  const handleEditTutor = (tutor) => {
    setIsFormOpen(true);
    setSelectedTutor(tutor);
  };

  useEffect(() => {
    dispatch(fetchTutors());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error("!Ups!, algo salió mal. Por favor, intenta de nuevo");
    }
  }, [error]);

  useEffect(() => {
    if (status.add === "succeeded") {
      setIsFormOpen(false);
      toast.success("Profesor agregado exitosamente");
      dispatch(resetStatus());
    }
    if (status.edit === "succeeded") {
      setIsFormOpen(false);
      toast.success("Profesor editado exitosamente");
      dispatch(resetStatus());
    }

    if (status.delete === "succeeded") {
      toast.success("Profesor eliminado exitosamente");
      dispatch(resetStatus());
    }
  }, [status]);

  return (
    <>
      <h1 className="w-full text-lg font-semibold text-center">Profes</h1>
      <TutorsTable
        tutors={tutors}
        loadingTutors={
          status.fetch === "loading" || status.delete === "loading"
        }
        onAdd={handleAddTutor}
        onEdit={handleEditTutor}
      />
      <TutorForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        tutor={selectedTutor}
      />
    </>
  );
};

export default TutorsHome;
