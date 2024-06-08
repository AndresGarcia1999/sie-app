"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatDate } from "utils/dateFormat";

const Calculator = () => {
  const { user } = useSelector((state) => state.user);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [insidePrice, setInsidePrice] = useState(10000);
  const [outsidePrice, setOutsidePrice] = useState(15000);
  const [resume, setResume] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    if (!user?.id) {
      toast.info("Por favor, inicia sesión");
      return;
    }
    if (!startDate || !endDate || !insidePrice || !outsidePrice) {
      toast.info("Por favor, llena todos los campos");
      return;
    }
    if (startDate > endDate) {
      toast.info("La fecha de inicio no puede ser mayor a la fecha de fin");
      return;
    }
    setLoading(true);
    // fetch resume
    fetch(
      `api/classes/resume?tutor=${user.id}&start=${startDate}&end=${endDate}&inside_price=${insidePrice}&outside_price=${outsidePrice}`
    )
      .then((res) => res.json())
      .then((data) => {
        setResume(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateClassPrice = (day, classId, newPrice, newTransportationCost) => {
    if (newPrice < 0) newPrice = 0;
    if (newTransportationCost < 0) newTransportationCost = 0;
    setResume((prevResume) => {
      const updatedDays = { ...prevResume.days };
      const updatedClasses = updatedDays[day].classes.map((classData) => {
        if (classData.id === classId) {
          return {
            ...classData,
            price: newPrice,
            transportation_cost: newTransportationCost,
          };
        }
        return classData;
      });
      updatedDays[day].classes = updatedClasses;

      // Recalculate total price for the day
      updatedDays[day].totalPrice = updatedClasses.reduce(
        (total, classData) =>
          total + classData.price + classData.transportation_cost,
        0
      );

      // Recalculate overall totals
      const newTotals = calculateTotals(updatedDays);

      return {
        ...prevResume,
        days: updatedDays,
        totals: newTotals,
      };
    });
  };

  const calculateTotals = (days) => {
    let totalInside = 0;
    let totalOutside = 0;
    let totalTransportationCost = 0;

    Object.values(days).forEach((day) => {
      day.classes.forEach((classData) => {
        if (classData.is_outside) {
          totalOutside += classData.price;
        } else {
          totalInside += classData.price;
        }
        totalTransportationCost += classData.transportation_cost;
      });
    });

    return {
      totalInside,
      totalOutside,
      totalTransportationCost,
      total: totalInside + totalOutside + totalTransportationCost,
    };
  };

  return (
    <div className="w-full">
      <h1>Calcula el costo de tus clases:</h1>
      {/* Fechas */}
      <div className="flex flex-wrap items-end gap-4 pt-2">
        <div className="flex w-full gap-2 md:w-auto">
          <label className="w-1/2 md:w-52" htmlFor="start_date">
            Fecha de inicio:
            <input
              className="w-full border border-gray-400 rounded"
              type="date"
              id="start_date"
              name="start_date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="w-1/2 md:w-52" htmlFor="end_date">
            Fecha de fin:
            <input
              className="w-full border border-gray-400 rounded"
              type="date"
              id="end_date"
              name="end_date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        {/* precios */}
        <div className="flex w-full gap-2 md:w-auto">
          <label className="w-1/2 md:w-52" htmlFor="inside_price">
            Precio sede:
            <input
              className="w-full border border-gray-400 rounded"
              type="number"
              id="inside_price"
              name="inside_price"
              value={insidePrice}
              onChange={(e) => setInsidePrice(e.target.value)}
            />
          </label>
          <label className="w-1/2 md:w-52" htmlFor="outside_price">
            Precio a domicilio:
            <input
              className="w-full border border-gray-400 rounded"
              type="number"
              id="outside_price"
              name="outside_price"
              value={outsidePrice}
              onChange={(e) => setOutsidePrice(e.target.value)}
            />
          </label>
        </div>
        {/* Botón */}
        <button
          className="w-full px-4 py-2 text-white bg-blue-500 rounded md:w-32 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onClick={handleCalculate}
        >
          Calcular
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-32">
          <i className="text-4xl text-blue-500 fas fa-spinner fa-spin"></i>
        </div>
      ) : resume?.days && Object.keys(resume.days).length ? (
        <>
          <div className="pt-4 space-y-4">
            {Object.keys(resume.days).map((day) => (
              <DayCard
                key={day}
                day={day}
                resume={resume.days[day]}
                updateClassPrice={updateClassPrice}
              />
            ))}
          </div>
          <div className="flex justify-end w-full pt-4">
            <div className="w-full md:w-1/4">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">Total sede</h2>
                <p className="text-lg font-semibold">
                  ${resume.totals.totalInside}
                </p>
              </div>
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">Total a domicilio</h2>
                <p className="text-lg font-semibold">
                  ${resume.totals.totalOutside}
                </p>
              </div>
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">Total transporte</h2>
                <p className="text-lg font-semibold">
                  ${resume.totals.totalTransportationCost}
                </p>
              </div>
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">Total</h2>
                <p className="text-lg font-semibold">${resume.totals.total}</p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Calculator;

const DayCard = ({ day, resume, updateClassPrice }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="z-10 p-4 transition-all duration-500 bg-gray-200 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex justify-between w-full">
            <h2 className="text-lg font-semibold">{formatDate(day)}</h2>
            <span className="text-lg font-semibold">${resume.totalPrice}</span>
          </div>
          <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}></i>
        </div>
      </div>
      <div
        className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="p-4 bg-gray-100 rounded-xl">
          <div className="flex flex-wrap gap-3">
            {resume.classes.map((classData) => (
              <div
                key={classData.id}
                className="w-full p-2 bg-white rounded-lg shadow-lg sm:p-3 sm:w-56"
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-700">{classData.title}</p>
                  <div>
                    {classData.is_outside && (
                      <i
                        title="domicilio"
                        className="ml-2 text-orange-600 fas fa-home"
                      ></i>
                    )}
                    {classData.transportation_cost > 0 && (
                      <i
                        title="con transporte"
                        className="ml-2 text-blue-600 fas fa-car"
                      ></i>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  {classData.student_name}
                </p>
                <p className="text-sm text-gray-700">
                  {classData.duration}{" "}
                  {classData.duration > 1 ? " horas" : " hora"}
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <div className="flex items-center justify-center w-1/2 px-3 py-1 text-sm text-white bg-green-500 border-none rounded-full">
                    $
                    <input
                      className="w-full p-0 text-sm text-center bg-transparent border-none"
                      type="number"
                      value={classData.price}
                      onChange={(e) =>
                        updateClassPrice(
                          day,
                          classData.id,
                          Number(e.target.value),
                          classData.transportation_cost
                        )
                      }
                      step={1000}
                      min="0"
                    />
                  </div>
                  {classData.transportation_cost > 0 && (
                    <div className="flex items-center justify-center w-1/2 px-3 py-1 text-sm text-white bg-blue-500 border-none rounded-full">
                      $
                      <input
                        className="w-full p-0 text-sm text-center bg-transparent border-none"
                        type="number"
                        value={classData.transportation_cost}
                        onChange={(e) =>
                          updateClassPrice(
                            day,
                            classData.id,
                            classData.price,
                            Number(e.target.value)
                          )
                        }
                        step={1000}
                        min="0"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
