import React, { Fragment, useEffect, useState } from "react";
import $ from "jquery";
import { toScheduleDate } from "../../helpers/DateFormater";
import { groupExamsByAnnouncementAndDate } from "../../helpers/General";
import { v4 as uuidv4 } from "uuid";
import ShowInformation from "../notifications/information";

export default function ExamSchedule(props) {
  const { announcements, exams } = props;
  const [events, setEvents] = useState([]);
  const [announcement, setAnnouncement] = useState(null);
  const [annoucementEvents, setAnnouncementEvents] = useState(null);

  useEffect(() => {
    if (announcements) {
      setAnnouncement(announcements[0].announcement_id);
    }
  }, [announcements]);

  useEffect(() => {
    async function groupExams(exams) {
      const grouped = await groupExamsByAnnouncementAndDate(exams);
      setEvents(grouped);
    }

    if (exams) {
      groupExams(exams);
    }
  }, [exams]);

  
  let select = document.querySelector("#exams");
  useEffect(() => {
    $(select).on("change", function(e) {
      e.stopPropagation();
      setAnnouncement(e.target.value);
    });
  }, [select]);

  useEffect(() => {
    console.log(announcement)
    if (announcement && events) {
      const list_events = events[announcement];
      setAnnouncementEvents(list_events);
    }
  }, [announcement]);

  const set_color = () => {
    const colors = ['danger', 'warning', 'primary', 'success', 'info'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  return (
    <div className="card card-flush mb-5 ">
      <div className="card-header mt-6">
        <div className="card-title flex-column">
          <h3 className="fw-bold mb-1">Exámenes</h3>
          <div className="fs-6 text-gray-400">
            Consulta el calendario de examenes
          </div>
        </div>

          <div className="card-toolbar">
            <select
              name="exams"
              id="exams"
              defaultValue={announcement}
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
        <Fragment>
          <ul className="nav nav-pills d-flex flex-nowrap hover-scroll-x py-2">
            {annoucementEvents &&
              Object.keys(annoucementEvents.exams).map((a, index) => {
                const dateFormated = toScheduleDate(a);
                return (
                  <li className="nav-item me-1" key={a}>
                    <a
                      className={`nav-link btn d-flex flex-column flex-center rounded-pill min-w-45px me-2 py-4 px-3 btn-active-primary ${
                        index === 0 ? "active" : ""
                      }`}
                      data-bs-toggle="tab"
                      href={`#schedule_${a}`}
                    >
                      <span className="opacity-50 fs-7 fw-semibold">
                        {dateFormated.weekDay}
                      </span>
                      <span className="fs-6 fw-bold">{dateFormated.date} </span>
                      <span className="opacity-50 fs-7 fw-semibold">
                        {dateFormated.month}
                      </span>
                    </a>
                  </li>
                );
              })}
          </ul>
          <div className="tab-content">
            {annoucementEvents &&
              Object.keys(annoucementEvents.exams).map((a, index) => {
                const exams = annoucementEvents.exams[a];

                return (
                  <div
                    id={`schedule_${a}`}
                    className={`tab-pane fade show ${
                      index === 0 ? "active" : ""
                    }`}
                    key={uuidv4()}
                  >
                    {exams &&
                      exams.map((e, index) => {
                        return (
                          <div
                            className="d-flex flex-stack position-relative mt-8"
                            key={uuidv4()}
                          >
                            <div className={`position-absolute h-100 w-4px bg-${set_color()} rounded top-0 start-0`}></div>
                            <div className="fw-semibold ms-5 text-gray-600">
                              <div className="fs-5">
                                {e.start}
                                <span className="fs-7 text-gray-400 text-uppercase">
                                  {parseInt(e.start.split(":")[0]) > 12
                                    ? " pm"
                                    : " am"}
                                </span>{" - "}

                                {e.end}
                                <span className="fs-7 text-gray-400 text-uppercase">
                                  {parseInt(e.end.split(":")[0]) > 12
                                    ? " pm"
                                    : " am"}
                                </span>
                              </div>
                              <a
                                href="#"
                                className="fs-5 fw-bold text-gray-800 text-hover-primary mb-2"
                              >
                                {e.exam}
                              </a>
                              <div className="text-gray-400">
                                Fase: <a href="#"> {e.phase} </a>
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
                          </div>
                        );
                      })}
                  </div>
                );
              })}
          </div>
        </Fragment>
      </div>
    </div>
  );
}
