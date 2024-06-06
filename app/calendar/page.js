"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const pastelRainbowColors = [
  "bg-red-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-indigo-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-orange-200",
  "bg-teal-200",
  "bg-cyan-200",
  "bg-fuchsia-200",
  "bg-lime-200",
  "bg-amber-200",
  "bg-emerald-200",
  "bg-violet-200",
  "bg-rose-200",
];

const Calendar = () => {
  const { user } = useSelector((state) => state.user);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCalendar = async () => {
      try {
        const res = await fetch(`/api/tutors/${user.id}/calendar`);
        const data = await res.json();
        // Format events
        const formattedEvents = data.map((c) => {
          const color = pastelRainbowColors[c.student % 16];
          return {
            title: c.title,
            start: `${c.day}T${c.start_at}`,
            end: `${c.day}T${c.end_at}`,
            student: c.student_name,
            classNames: `rounded-lg shadow-md ${color}`,
          };
        });
        setEvents(formattedEvents);
      } catch (error) {
        console.error(error);
        setEvents([]);
      }
      setLoading(false);
    };
    getCalendar();
  }, []);
  return (
    <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center w-full h-32">
          <i className="text-4xl text-blue-400 fas fa-spinner fa-spin"></i>
        </div>
      ) : (
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin]}
          initialView="timeGridWeek"
          hiddenDays={[0]}
          locale={esLocale}
          allDaySlot={false}
          height={"calc(100vh - 80px)"}
          eventContent={renderEventContent}
          slotLabelFormat={{
            hour: "numeric",
            hour12: true,
            meridiem: "short",
          }}
          slotMinTime={"08:00:00"}
          slotMaxTime={"20:00:00"}
          views={{
            timeGrid3Days: {
              type: "timeGrid",
              duration: { days: 3 },
              buttonText: "3 días",
            },
          }}
          events={events}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGrid3Days,timeGridWeek,dayGridMonth",
          }}
        />
      )}
    </div>
  );
};

export default Calendar;

function renderEventContent(eventInfo) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 overflow-hidden text-xs text-gray-700 md:text-sm ">
      <p className="whitespace-nowrap">{eventInfo.event.title}</p>
      <p className="whitespace-nowrap">
        {eventInfo.event.extendedProps.student}
      </p>
    </div>
  );
}
