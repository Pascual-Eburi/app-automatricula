import React from "react";

export default function Degree(props) {
    const { index, degree, modality } = props

    const colors = ['danger', 'warning', 'primary', 'success', 'info'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    const color = colors[randomIndex];

  return (
    <div className={`w-auto d-flex align-items-center bg-light-${color} rounded p-5 mb-7`}>
      <i className={`ki-duotone ki-abstract-26 text-${color} fs-1 me-5`}>
        <span className="path1"></span>
        <span className="path2"></span>
      </i>

      <div className="flex-grow-1 me-2">
        <a href="#" className="fw-bold text-gray-800 text-hover-primary fs-6">
          { degree.name }
        </a>

        <span className="text-muted fw-semibold d-block">{modality} </span>
      </div>
      <span className={`fw-bold text-${color} py-1`}>{index} </span>
    </div>
  );
}
