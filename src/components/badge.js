import React from 'react'

export default function Badge({ data }) {
  return (
    <div className={`badge badge-light-${data.color}`}>{data.text}</div>
  )
}

export function EnrollmentBadge ({ data }){
  const {status_code, type} = data;

  const statuses = {
    enrollment: {
      0: {text: 'No Formalizada', color: 'primary'},
      1: {text: 'Formalizada', color: 'info'},
      2: {text: 'Valida', color: 'success'},
      3: {text: 'Válida Parcialmente', color: 'warning'},

    },
    document: {
      0: {text: 'Sin validar', color: 'info'},
      1: {text: 'Valido', color: 'success'},
      2: {text: 'No válido', color: 'warning'},
    }

  }


  const default_status = {text: 'No aplica', color: 'danger'};
  const status = statuses[type][status_code] || default_status;
  const {text, color } = status;

  return (
    <span className={`badge badge-light-${color} fs-7 fw-bold`}>{text}</span>
  )
}