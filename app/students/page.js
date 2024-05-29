"use client";

import StudentForm from "components/students/Form";
import StudentsTable from "components/students/Table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchStudents, resetStatus } from "store/studentsSlice";

const StudentsHome = () => {
  const dispatch = useDispatch();
  const { students, status, error } = useSelector((state) => state.students);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleAddStudent = () => {
    setIsFormOpen(true);
    setSelectedStudent(null);
  };
  const handleEditStudent = (student) => {
    setIsFormOpen(true);
    setSelectedStudent(student);
  };

  useEffect(() => {
    dispatch(fetchStudents());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error("!Ups!, algo salió mal. Por favor, intenta de nuevo");
    }
  }, [error]);

  useEffect(() => {
    if (status.add === "succeeded") {
      setIsFormOpen(false);
      toast.success("Estudiante agregado exitosamente");
      dispatch(resetStatus());
    }
    if (status.edit === "succeeded") {
      setIsFormOpen(false);
      toast.success("Estudiante editado exitosamente");
      dispatch(resetStatus());
    }

    if (status.delete === "succeeded") {
      toast.success("Estudiante eliminado exitosamente");
      dispatch(resetStatus());
    }
  }, [status]);

  return (
    <>
      <h1 className="w-full text-lg font-semibold text-center">Estudiantes</h1>
      <StudentsTable
        students={students}
        loadingStudents={
          status.fetch === "loading" || status.delete === "loading"
        }
        onAdd={handleAddStudent}
        onEdit={handleEditStudent}
      />
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        student={selectedStudent}
      />
    </>
  );
};

export default StudentsHome;
