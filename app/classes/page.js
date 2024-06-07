"use client";

import ConfirmDeleteModal from "components/ConfirmationModal";
import ClassModal from "components/classes/DetailModal";
import ClassForm from "components/classes/Form";
import ClassesTable from "components/classes/Table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteClass, fetchClasses, resetStatus } from "store/classesSlice";
import { fetchStudents } from "store/studentsSlice";
import { fetchTutors } from "store/tutorsSlice";

const ClassesHome = () => {
  const dispatch = useDispatch();
  const { classes, status, error } = useSelector((state) => state.classes);
  const { tutors } = useSelector((state) => state.tutors);
  const { students } = useSelector((state) => state.students);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classToShow, setClassToShow] = useState(null);
  //Delete logic
  const [classToDelete, setClassToDelete] = useState(null);

  const handleAddClass = () => {
    setIsFormOpen(true);
    setSelectedClass(null);
  };

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchStudents());
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
      toast.success("clase agregada exitosamente");
      dispatch(resetStatus());
    }
    if (status.edit === "succeeded") {
      setIsFormOpen(false);
      toast.success("clase editada exitosamente");
      dispatch(resetStatus());
    }

    if (status.delete === "succeeded") {
      toast.success("clase eliminada exitosamente");
      dispatch(resetStatus());
    }
  }, [status]);

  return (
    <>
      <h1 className="w-full text-lg font-semibold text-center">Clases</h1>
      <ClassesTable
        classes={classes.map((classData) => ({
          ...classData,
          student: students.find((s) => s.id === classData.student),
          tutor: tutors.find((t) => t.id === classData.tutor),
        }))}
        loadingClasses={
          status.fetch === "loading" || status.delete === "loading"
        }
        onAdd={handleAddClass}
        onSelect={setClassToShow}
        onEdit={(classData) => {
          setSelectedClass(classData);
          setIsFormOpen(true);
        }}
        onDelete={(classDataId) => {
          setClassToDelete(classDataId);
        }}
      />
      <ClassForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        classData={selectedClass}
      />
      <ClassModal
        classData={classToShow || {}}
        isOpen={!!classToShow?.id} // Open modal if class ID is selected
        onClose={() => setClassToShow(null)}
      />
      <ConfirmDeleteModal
        text="¿Estás seguro de que deseas eliminar esta clase?"
        isOpen={!!classToDelete}
        onClose={() => setClassToDelete(null)}
        confirmDelete={() => {
          dispatch(deleteClass(classToDelete));
          setClassToDelete(null);
        }}
        loading={status.delete === "loading"}
      />
    </>
  );
};

export default ClassesHome;
