import React from 'react'

export default function SpecificSubject(props) {
    const { index, subject } = props;
  return (
    <div className="col-md-6 col-sm-12 mb-5">
    <label htmlFor=""
      className="col-form-label fw-semibold fs-6"
    >
        Especifica { index }
    </label>
    <input
      type="text"
      readOnly
      className="form-control form-control-lg form-control-solid"
      placeholder={ subject.name }
      value={ subject.name }
    />
  </div>
  )
}
