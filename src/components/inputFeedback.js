import React from 'react'

export default function InputFeedback({type, message}) {
    const default_class = 'invalid-feedback';
    const types = {success: 'valid-feedback', error: 'invalid-feedback'};
    const class_name = types[type] || default_class;

  return (
    <div className={`d-block ${class_name}`}>{ message }</div>
  )
}
