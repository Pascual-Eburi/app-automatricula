import React from 'react'

export function LanguageInput({ data }) {
  return (
    <div className="col-12 mb-5">
    <label className="col-form-label fw-semibold fs-6">
      <span className="required">Asignatura obligatoria</span>

      <span
        className="ms-1"
        data-bs-toggle="tooltip"
        aria-label="Está asignatura es obligatoría"
        data-bs-original-title="Está asignatura es obligatoría"
      >
        <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
        </i>
      </span>
    </label>
    <input
      type="text"
      readOnly
      className="form-control form-control-lg form-control-solid"
      placeholder={data.name}
      value={data.name }
      
    />
  </div>
  )
}

export function HistoryInput({data}){
    return (
        <div className="col-md-6 mb-5">
        <label
          htmlFor=""
          className="col-form-label fw-semibold fs-6"
        >
          Historia
        </label>
        <input
          type="text"
          readOnly
          className="form-control form-control-lg form-control-solid"
          placeholder={ data.name }
          value={ data.name }
        />
      </div>
    )
}

export function IdiomInput({data}){
    return (
        <div className="col-md-6 mb-5">
        <label
          htmlFor=""
          className="col-form-label fw-semibold fs-6"
        >
            Idioma
        </label>
        <input
          type="text"
          readOnly
          className="form-control form-control-lg form-control-solid"
          placeholder={ data.name }
          value={ data.name }
        />
      </div>
    )
}


