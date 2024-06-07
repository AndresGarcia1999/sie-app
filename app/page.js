"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatClassSchedule } from "utils/dateFormat";

export default function Home() {
  const { user } = useSelector((state) => state.user);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTodayClasses = async () => {
      const dateObj = new Date();
      const day = String(dateObj.getDate()).padStart(2, "0"); // day of the month
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // month (getMonth() returns 0-11 for Jan-Dec)
      const year = dateObj.getFullYear(); // year
      const today = `${day}/${month}/${year}`;
      try {
        const res = await fetch(`/api/tutors/${user.id}/classes?date=${today}`);
        const data = await res.json();
        setTodayClasses(data);
      } catch (error) {
        console.error(error);
        setTodayClasses([]);
      }
      setLoading(false);
    };
    getTodayClasses();
  }, []);

  return (
    <>
      <main className="w-full">
        <h2 className="text-lg font-medium md:text-2xl">
          Hola <span className="font-semibold">Profe {user?.name}</span>, estas
          son tus clases del dia:
        </h2>
        {loading ? (
          <div className="flex items-center justify-center w-full h-32">
            <i className="text-4xl text-blue-400 fas fa-spinner fa-spin"></i>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 px-4 py-2">
            {todayClasses.map((c) => (
              <ClassCard classData={c} key={c.id} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

const ClassCard = ({ classData }) => {
  const [showDescription, setShowDescription] = useState(false);
  return (
    <div className="w-full p-3 text-center bg-white rounded-lg shadow-md md:w-1/2 lg:w-1/3 xl:w-1/4">
      <h3 className="text-lg font-medium md:text-xl">
        {classData.title} - {classData.student_name}
      </h3>
      <p className="text-sm text-gray-800">
        {formatClassSchedule(classData.start_at, classData.end_at)}
      </p>
      <p className="text-sm font-light text-gray-500">
        {classData.student_phone} - {classData.student_address}
      </p>
      {classData.is_outside && (
        <p className="text-sm text-red-500">Clase a domicilio</p>
      )}
      {classData.description && (
        <p
          onClick={() => setShowDescription(!showDescription)}
          className="text-sm text-gray-600"
        >
          <i className="fas fa-eye"></i>{" "}
          {showDescription ? "Ocultar" : "Ver descripción"}
        </p>
      )}
      {showDescription && (
        <p className="text-sm text-gray-600">{classData.description}</p>
      )}
    </div>
  );
};
