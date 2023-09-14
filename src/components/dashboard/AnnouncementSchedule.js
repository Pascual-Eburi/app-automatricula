import React, { useEffect, useState } from "react";
import $ from "jquery";
import { ExtractDateTime, toScheduleDate } from "../../helpers/DateFormater";

export default function AnnouncementSchedule(props) {
  const { announcements } = props;
  const [events, setEvents] = useState([]);
  const [announcement, setAnnouncement] = useState(null);
  const [annoucementEvents, setAnnouncementEvents] = useState(null);

  const annoucement_titles = {
    list_submision_start: "Preinscripciones",
    list_submision_end: "Fin preinscripciones",
    enrollment_start: "Inicio matriculación",
    enrollment_end: "Fin matriculaciones",
    grades_publication: "Publicación de notas",
  };

  useEffect(() => {
    const updatedEvents = {}; // Nuevo array para los eventos actualizados

    if (announcements) {
      setAnnouncement(announcements[0].announcement_id);
      if (announcements) {
        announcements.forEach((announcement) => {
          const eventsForAnnouncement = [];

          for (const key in announcement) {
            if (key !== "announcement_id" && key !== "name") {
              const dateTime = announcement[key];
              const { date, time } = ExtractDateTime(dateTime);
              const dateFormated = toScheduleDate(date);
              const title = `${annoucement_titles[key]}`;
              const event = {
                title: title,
                subtitle:  announcement.name,
                key: date,
                date: dateFormated,
                time: time,
              };
              eventsForAnnouncement.push(event);
            }
          }

          updatedEvents[announcement.announcement_id] = eventsForAnnouncement;
        });
      }
    }

    setEvents(updatedEvents);
  }, [announcements]);

  let select = document.querySelector('#announcements');

  useEffect(() => {
    $(select).on("change", function(e) {
      e.stopPropagation();
      setAnnouncement(e.target.value);
    });
  }, [select]);

  useEffect(() => {
    if (announcement && events) {
      const list_events = events[announcement];
      setAnnouncementEvents(list_events);
    }
  }, [announcement]);


  return (
    <div className="card card-flush mb-5 ">
      <div className="card-header mt-6">
        <div className="card-title flex-column">
          <h3 className="fw-bold mb-1">Selectividad</h3>
          <div className="fs-6 text-gray-400">Consulta el calendario</div>
        </div>
        <div className="card-toolbar">
          <select
            name="annoucements"
            id="announcements"
            defaultValue={announcement && announcement.announcement_id}
            data-control="select2"
            data-hide-search="false"
            className="form-select form-select-solid form-select-sm fw-bold w-100px"
          >
            {announcements &&
              announcements.map((announcement) => {
                return (
                  <option
                    value={announcement.announcement_id}
                    key={announcement.announcement_id}
                  >
                    {announcement.name}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
      <div className="card-body p-9 pt-4">
        <ul className="nav nav-pills d-flex flex-nowrap hover-scroll-x py-2">
          {annoucementEvents &&
            annoucementEvents.map((a, index) => {
              return (
                <li className="nav-item me-1" key={a.key}>
                  <a
                    className={`nav-link btn d-flex flex-column flex-center rounded-pill min-w-45px me-2 py-4 px-3 btn-active-primary ${
                      index === 0 ? "active" : ""
                    }`}
                    data-bs-toggle="tab"
                    href={`#schedule_${a.key}`}
                  >
                    <span className="opacity-50 fs-7 fw-semibold">
                      {a.date.weekDay}
                    </span>
                    <span className="fs-6 fw-bold">{a.date.date} </span>
                    <span className="opacity-50 fs-7 fw-semibold">
                      {a.date.month}
                    </span>
                  </a>
                </li>
              );
            })}
        </ul>
        <div className="tab-content">
          {annoucementEvents &&
            annoucementEvents.map((a, index) => {
              return (
                <div
                  id={`schedule_${a.key}`}
                  className={`tab-pane fade show ${
                    index === 0 ? "active" : ""
                  }`}
                  key={a.title}
                >
                  <div className="d-flex flex-stack position-relative mt-8">
                    <div className="position-absolute h-100 w-4px bg-info rounded top-0 start-0"></div>
                    <div className="fw-semibold ms-5 text-gray-600">
                      <div className="fs-5">
                        {a.time}
                        <span className="fs-7 text-gray-400 text-uppercase">
                          {parseInt(a.time.split(":")[0]) > 12 ? " pm" : " am"}
                        </span>
                      </div>
                      <a
                        href="#"
                        className="fs-5 fw-bold text-gray-800 text-hover-primary mb-2"
                      >
                        {a.title}
                      </a>
                      <div className="text-gray-400">
                        Convocatoria <a href="#"> {a.subtitle} </a>
                      </div>{" "}
                    </div>
                    <a
                      href="#"
                      className="btn btn-bg-white btn-color-danger "
                    >
                      <i className="ki-duotone ki-call fs-1">
                        <i className="path1"></i>
                        <i className="path2"></i>
                        <i className="path3"></i>
                        <i className="path4"></i>
                        <i className="path5"></i>
                        <i className="path6"></i>
                        <i className="path7"></i>
                        <i className="path8"></i>
                      </i>
                    </a>{" "}
                  </div>{" "}
                </div>
              );
            })}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
