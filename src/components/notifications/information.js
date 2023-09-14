import React, { Fragment } from "react";

export default function ShowInformation({information}) {
  const {type = 'info', message} = information;
  
  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-center" >
        <div className="row align-items-center justify-content-center">
        <div className={`col-sm-10 col-md-10 col-lg-10 d-flex align-items-center rounded py-5 px-5 bg-light-${type} shadow-sm`}>
          <i className={`ki-duotone ki-information-5 fs-3x text-${type} me-5`}>
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
          </i>{" "}
          <div className="text-gray-700 fw-bold fs-6">
            { message }
          </div>{" "}
        </div>

        </div>
      </div>
    </Fragment>
  );
}
