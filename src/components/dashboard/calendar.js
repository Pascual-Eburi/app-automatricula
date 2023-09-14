import React, { useEffect, useRef, useState } from "react";
/* import 'fullcalendar/dist/fullcalendar.css';
import 'fullcalendar/dist/daygrid/main.css';
import 'fullcalendar/dist/timegrid/main.css'; */

import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ExtractDateTime } from "../../helpers/DateFormater";

const CalendarComponent = (props) => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);

  const {announcements, enrollments } = props;
  const annoucement_titles = {
    list_submision_start: 'Preinscripciones',
    list_submision_end: 'Fin preinscripciones',
    enrollment_start: 'Inicio matriculación',
    enrollment_end: 'Fin matriculaciones',
    grades_publication: 'Publicación de notas'
  }


  useEffect(() => {
    const updatedEvents = []; // Nuevo array para los eventos actualizados
  
    if (announcements) {
      announcements.forEach((announcement) => {
        for (const key in announcement) {
          if (key !== 'announcement_id' && key !== 'name') {
            const dateTime = announcement[key];
            const { date, time } = ExtractDateTime(dateTime);
            const title = `${annoucement_titles[key]}, ${announcement.name}`;
            const event = { title: title, start: date };
            updatedEvents.push(event);
          }
        }
      });
    }
  
    setEvents(updatedEvents); // Actualizar el estado con los eventos actualizados
  
  }, [announcements]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin],
      locale: "es",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      initialView: "dayGridMonth",
      firstDay: 1,
      editable: true,
      events: events,/* [
        // Aquí puedes agregar tus eventos
        // Ejemplo: { title: 'Evento 1', start: '2023-06-01' }
      ], */
    });

    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, [events]);

  return (
    <div className="card">
      <div className="card-body">
        <div ref={calendarRef} />
      </div>
    </div>
  );
};

export default CalendarComponent;
