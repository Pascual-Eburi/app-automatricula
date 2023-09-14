import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paginacion from "./pagination";

export default function Toolbar({ user }) {
  const [pageTitle, setPageTitle] = useState(null);
  useEffect(() => {
    setPageTitle(document.title)
  }, [document.title])

  const path = window.location.pathname;
  const pathElements = path.split("/").filter((element) => element !== "");
  //const pageTitle = pathElements[0];


  const { user_data, ...res } = user || {};
  const { rol, ...rest } = user_data || {};

  let institute = "";

  if (rol === "student") {
    institute = res.student_data.institute;
  } else if (rol === "institute_staff") {
    institute = res.staff_data.institute.name;
  } else {
    institute = rol;
  }

  return (
    <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
      {/*begin::Toolbar container*/}
      <div
        id="kt_app_toolbar_container"
        className="app-container container-fluid d-flex flex-stack"
      >
        {/*begin::Page title*/}
        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
          {/*begin::Title*/}
          <h1
            className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
            style={{ textTransform: "capitalize" }}
          >
            {pageTitle}
          </h1>
          {/*end::Title*/}

          {/*begin::Breadcrumb*/}
          <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
            {/*begin::Item*/}
            <li className="breadcrumb-item text-muted">
              <Link
                href="/panel"
                className="text-muted text-hover-primary"
                style={{ textTransform: "capitalize" }}
              >
                Inicio
              </Link>
            </li>
            {/*end::Item*/}
            {/*begin::Item*/}
            <li className="breadcrumb-item">
              <span className="bullet bg-gray-400 w-5px h-2px"></span>
            </li>
            {/*end::Item*/}

            {/*begin::Item*/}
            <li className="breadcrumb-item text-muted">
              {/*props.children*/}
              {pageTitle}
            </li>
            {/*end::Item*/}
          </ul>
          {/*end::Breadcrumb*/}
        </div>
        {/*end::Page title*/}
        {/*begin::Actions*/}
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <div className="btn btn-sm btn-light d-flex align-items-center px-4 shadow-sm">
            <div className="text-gray-600 fw-bold">{institute} </div>
              <i className="ki-duotone ki-safe-home fs-1 ms-2 me-0">
                <i className="path1"></i>
                <i className="path2"></i>
              </i>
          </div>
          <Paginacion />
        </div>
        {/*end::Actions*/}
      </div>
      {/*end::Toolbar container*/}
    </div>
  );
}
