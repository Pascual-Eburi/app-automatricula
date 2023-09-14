import React, { Fragment, useEffect, useRef, useState } from "react";
import $ from "jquery";

import "flatpickr/dist/l10n/es.js";
import { Link } from "react-router-dom";
//import { Select2 } from 'select2';
import { connect } from "react-redux";
import { generatePassword } from "../helpers/General";
import { add_institute_staff} from "../redux/actions/auth";

//import 'flatpickr/dist/flatpickr.min.css';

function AddStudentForm(props) {
  const {
    institutes,
    isAuthenticated,
    user,
    modalities,
    provinces,
    loading,
    add_institute_staff,
  } = props;
  const initialFormData = {
    photo: "",
    email: "",
    password: "",
    re_password: "",
    name: "",
    last_name: "",
    phone: "",
    rol: "institute_staff",
    doc_type: "",
    doc_number: "",
    institute: "",
    "job_title": ""

  };
  const initialStateAutoPassword = true;

  const [autoPassword, setAutoPassword] = useState(initialStateAutoPassword);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [thumbnail, setThumbnail] = useState(null);
  const [validating, setValidating] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleAuthoPassword = async () => {
    if (autoPassword){
      const password = await generatePassword(8);
      setGeneratedPassword(password);
      setRePassword(password);

      // establecer la contrseña autogenerada
      // Actualizar contraseña y contraseña repetida en formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        password: password,
        re_password: password,
      }));
    }else{
      setFormData((prevFormData) => ({
        ...prevFormData,
        password: '',
        re_password: '',
      }));

    }

  }

  useEffect(() => {
    handleAuthoPassword();
    
  }, [autoPassword]);

  // establecer el modo de generación de la contrseña de la cuenta
  const setPasswordMethod = (value) => {
    setAutoPassword(value);
  };

  let list_institutes = institutes;

 

  const {
    photo,
    email,
    password,
    re_password,
    name,
    last_name,
    phone,
    doc_type,
    doc_number,
    job_title,
    rol,
    institute

  } = formData;

  const fileSelectedHandler = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    setThumbnail(file);
    return file;
  };



  let selects = document.querySelectorAll('select[data-control="select2"]');

  useEffect(() => {
    selects.forEach(function(select) {
      $(select).on("change", function(e) {
        e.stopPropagation();
        const key = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [key]: value });
        const feedback = document.querySelector(
          `[data-validate="${e.target.name}"]`
        );
        e.target.classList.remove("is-invalid");
        if (feedback) {
          feedback.remove();
        }
      });
    });
  }, [selects]);

  // dropzone



  const onChange = (e) => {
    e.stopPropagation();
    //e.stopImmediatePropagation();
    const feedback = document.querySelector(
      `[data-validate="${e.target.name}"]`
    );
    e.target.classList.remove("is-invalid");
    if (feedback) {
      feedback.remove();
    }
    if (e.target.name === "photo") {
      const file = fileSelectedHandler(e);
      setFormData({ ...formData, [e.target.name]: file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const resetInvalidStates = () => {
    // elimiar mensajes anteriores
    const invalids = document.querySelectorAll(".is-invalid");
    invalids.forEach((input) => {
      const feedback_name = input.getAttribute("name");
      const feedback = document.querySelector(
        `[data-validate="${feedback_name}"]`
      );
      input.classList.remove("is-invalid");
      if (feedback) {
        feedback.remove();
      }
    });
  };

  const validateForm = async (formData) => {
    setValidating(true);
    resetInvalidStates();
    handleAuthoPassword();

    const inputs = Object.entries(formData);
    let errors = 0;
    inputs.forEach(([input, value]) => {
      const domInput = document.querySelector(`[name="${input}"]`);
      if (
        (domInput &&
          (value === "" ||
            !value ||
            value.length <= 0 ||
            value === undefined)) ||
        value === null
      ) {
        errors++;
        domInput.classList.add("is-invalid");
        const feedback = document.createElement("div");
        feedback.classList.add("d-block");
        feedback.classList.add("invalid-feedback");
        feedback.setAttribute("data-validate", input);

        feedback.innerHTML = "Este campo es invalido";
        let parentDiv;
        if (input !== "photo") {
          parentDiv = domInput.closest("div");
        } else {
          parentDiv =
            input === "photo"
              ? domInput.closest("div").nextElementSibling
              : domInput.parentElement;
        }

        parentDiv.insertAdjacentElement("beforeend", feedback);
        //console.log(domInput, value, input)
      }
    });

    setValidating(false);
    return errors === 0;
  };



  const onSubmit = async (e) => {
    e.preventDefault();

    // validaciones
    // validaciones finales en el servidor
    const form = e.target;
    // form.classList.add('was-validated');
    const valid = await validateForm(formData);

    //if (!valid){ return }
    if (valid) {
      console.log(formData);
      const added = await add_institute_staff(formData);
      if (added) {
        resetForm();
      }
    }
    //console.log(student_added);
    return;
  };

  // on cancel
  const resetForm = () => {
    setFormData(initialFormData);
    setAutoPassword(initialStateAutoPassword);
    resetInvalidStates();
    let selects = document.querySelectorAll('select[data-control="select2"]');
    const photo_reset_btn = document.querySelector(
      '[data-kt-image-input-action="cancel"]'
    );

    if (photo_reset_btn) {
      $(photo_reset_btn).click();
    }
  };

  return (
    <Fragment>
      {/* <!--begin::Form--> gap-14 gap-lg-14   flex-column flex-row-fluid flex-lg-row */}
      <form
        id="enrollStudentForm"
        className="form d-flex justify-content-between "
        onSubmit={(e) => onSubmit(e)}
      >
        {/* <!--begin::Aside column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10 -->*/}
        <div className="d-flex flex-column col-sm-12 col-md-3 gap-7 gap-lg-10  ">
          {/* <!--begin::Thumbnail settings-->*/}
          <div className="card card-flush py-4 me-lg-10">
            {/* <!--begin::Card header-->*/}
            <div className="card-header">
              {/* <!--begin::Card title-->*/}
              <div className="card-title">
                <h2>Foto</h2>
              </div>
              {/* <!--end::Card title-->*/}
            </div>
            {/* <!--end::Card header-->*/}

            {/* <!--begin::Card body-->*/}
            <div className="card-body text-center pt-0">
              {/* <!--begin::Image input-->*/}

              <div
                className="image-input image-input-empty image-input-outline image-input-placeholder mb-3"
                data-kt-image-input="true"
              >
                {/* <!--begin::Preview existing avatar-->*/}
                <div className="image-input-wrapper w-150px h-150px"></div>
                {/* <!--end::Preview existing avatar-->*/}

                {/* <!--begin::Label-->*/}
                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Foto "
                >
                  <i className="ki-duotone ki-pencil fs-7">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                  {/* <!--begin::Inputs-->*/}
                  <input
                    type="file"
                    name="photo"
                    id="photo"
                    accept=".png, .jpg, .jpeg"
                    onChange={(e) => onChange(e)}
                  />
                  <input type="hidden" name="avatar_remove" />
                  {/* <!--end::Inputs-->*/}
                </label>
                {/* <!--end::Label-->*/}

                {/* <!--begin::Cancel-->*/}
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                  data-bs-toggle="tooltip"
                  title="Cancelar foto"
                >
                  <i className="ki-duotone ki-cross fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </span>
                {/* <!--end::Cancel-->*/}

                {/* <!--begin::Remove-->*/}
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  title="Eliminar foto"
                >
                  <i className="ki-duotone ki-cross fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </span>
                {/* <!--end::Remove-->*/}
              </div>
              {/* <!--end::Image input-->*/}

              {/* <!--begin::Description-->*/}
              <div className="text-muted fs-7">
                Establezca la foto del usuario. Solo archivos con extension{" "}
                <code> *.png, *.jpg y *.jpeg </code> serán aceptados
              </div>
              {/* <!--end::Description-->*/}
            </div>

            {/* <!--end::Card body-->*/}
          </div>
          {/* <!--end::Thumbnail settings-->*/}

        </div>
        {/* <!--end::Aside column-->*/}

        {/* <!--begin::Main column flex-row-fluid gap-7 gap-lg-10-->*/}
        <div className="d-flex flex-column col-sm-12 col-md-6 gap-7 gap-lg-10">
          {/* <!--begin:::Tabs-->*/}
          <div className="d-flex flex-column gap-7 gap-lg-10 me-lg-10">
            {/* <!--begin::General options-->*/}
            <div className="card card-flush py-4">
              {/* <!--begin::Card header-->*/}
              <div className="card-header">
                <div className="card-title">
                  <h2>General</h2>
                </div>
              </div>
              {/* <!--end::Card header-->*/}

              {/* <!--begin::Card body-->*/}
              <div className="card-body pt-0">
                {/* <!--begin::Row-->*/}
                <div className="row">
                  {/* <!--begin::Input group-->*/}
                  <div className="col-md-6 col-sm-6 mb-10 fv-row">
                    {/* <!--begin::Label-->*/}
                    <label className="required form-label">Nombre</label>
                    {/* <!--end::Label-->*/}

                    {/* <!--begin::Input-->*/}
                    <input
                      type="text"
                      name="name"
                      className="form-control mb-2"
                      placeholder="Nombre...."
                      value={name}
                      onChange={(e) => onChange(e)}
                    />
                    {/* <!--end::Input-->*/}

                    {/* <!--begin::Description-->*/}
                    <div className="text-muted fs-7">
                      Tal y como aparece en su documento de identidad.
                    </div>
                    {/* <!--end::Description-->*/}
                  </div>
                  {/* <!--end::Input group-->*/}

                  {/* <!--begin::Input group-->*/}
                  <div className="col-md-6 col-sm-6 mb-10 fv-row">
                    {/* <!--begin::Label-->*/}
                    <label className="required form-label">Apellidos</label>
                    {/* <!--end::Label-->*/}

                    {/* <!--begin::Input-->*/}
                    <input
                      type="text"
                      name="last_name"
                      className="form-control mb-2"
                      placeholder="Apellidos...."
                      value={last_name}
                      onChange={(e) => onChange(e)}
                    />
                    {/* <!--end::Input-->*/}

                    {/* <!--begin::Description-->*/}
                    <div className="text-muted fs-7">
                      En el mismo orden que aparecen en su documento.
                    </div>
                    {/* <!--end::Description-->*/}
                  </div>
                  {/* <!--end::Input group-->*/}

                  {/* <!--begin::Input group-->*/}
                  <div className="col-md-3 col-sm-6 mb-10 fv-row">
                    {/* <!--begin::Label-->*/}
                    <label className="required form-label">
                      Tipo de documento
                    </label>
                    {/* <!--end::Label-->*/}
                    {/* <!--begin::Input-->*/}
                    <select
                      className="form-select mb-2"
                      data-control="select2"
                      data-hide-search="true"
                      name="doc_type"
                      data-placeholder="Selecciona una opción"
                      onChange={(e) => onChange(e)}
                      id="doc_type"
                      value={formData.doc_type}
                    >
                      <option></option>
                      <option value="dni">DNI</option>
                      <option value="pasaporte">Pasaporte</option>
                      <option value="otro">Otro</option>
                    </select>
                    {/* <!--end::Input-->*/}
                  </div>
                  {/* <!--end::Input group-->*/}

                  {/* <!--begin::Input group-->*/}
                  <div className="col-md-6 col-sm-6 mb-10 fv-row">
                    {/* <!--begin::Label-->*/}
                    <label className="required form-label">Documento:</label>
                    {/* <!--end::Label-->*/}
                    {/* <!--begin::Input-->*/}
                    <input
                      id="doc_number"
                      name="doc_number"
                      type="text"
                      disabled={ !doc_type ? true : false}
                      placeholder={
                        !doc_type ?
                        "Selecciona tipo de documento...":
                        doc_type.toUpperCase()
                      }
                      className="form-control mb-2"
                      value={doc_number}
                      onChange={(e) => onChange(e)}
                    />
                    {/* <!--end::Input-->*/}
                  </div>
                  {/* <!--end::Input group-->*/}

                  {/* <!--begin::Input group-->*/}
                  <div className="col-md-3 col-sm-6 mb-10 fv-row">
                    {/* <!--begin::Label-->*/}
                    <label className="required form-label">Cargo</label>
                    {/* <!--end::Label-->*/}

                    {/* <!--begin::Input-->*/}

                    <select
                      className="form-select mb-2"
                      data-control="select2"
                      data-hide-search="true"
                      name="job_title"
                      data-placeholder="Selecciona una opción"
                      id="job_title"
                      onChange={(e) => onChange(e)}
                      value={formData.job_title}
                    >
                      <option value=""></option>
                      <option value="Direccion">Director/a</option>
                      <option value="Secretaría">Secretario/a</option>
                      <option value="Jefatura Estudios">Jefe/a Estudios</option>
                    </select>
                    {/* <!--end::Input-->*/}
                  </div>
                  {/* <!--begin::Input group-->*/}
                  <div className="col-md-6 col-sm-6 mb-10 fv-row">
                    {/* <!--begin::Label-->*/}
                    <label className="required form-label">Telefono:</label>
                    {/* <!--end::Label-->*/}
                    {/* <!--begin::Input-->*/}
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="Telefono de contacto"
                      className="form-control mb-2"
                      value={phone}
                      onChange={(e) => onChange(e)}
                    />
                    {/* <!--end::Input-->*/}
                  </div>
                  {/* <!--end::Input group-->*/}
                  {/* <!--end::Input group-->*/}
                  <div className="col-md-6 col-sm-6">
                      {/* <!--begin::Input group-->*/}
                      <div className="mb-10 fv-row">
                        {/* <!--begin::Label-->*/}
                        <label className="required form-label">
                          Instituto
                        </label>
                        {/* <!--end::Label-->*/}
                        {/* <!--begin::Input-->*/}
                        <select
                          className="form-select mb-2"
                          data-control="select2"
                          data-hide-search={
                            user.user_data.rol === "institute_staff"
                              ? "true"
                              : "false"
                          }
                          name="institute"
                          onChange={(e) => onChange(e)}
                          data-placeholder="Selecciona una opción"
                          id="institute"
                          value={formData.institute}
                        >
                          <option></option>
                          {list_institutes &&
                            list_institutes.map((institute) => {
                              return (
                                <option
                                  value={institute.code}
                                  key={institute.name}
                                >
                                  {institute.name}{" "}
                                </option>
                              );
                            })}
                        </select>
                        {/* <!--end::Input-->*/}
                      </div>
                      {/* <!--end::Input group-->*/}
                    </div>

                  {/* <!--end::Input group-->*/}
                </div>
                {/* <!--end::Row-->*/}
              </div>
              {/* <!--end::Card header-->*/}
            </div>
            {/* <!--end::General options-->*/}
          </div>

          {/* <!--end:::Tabs-->*/}
          <div className="d-flex justify-content-end me-lg-10">
            {/* <!--begin::Button-->*/}
            <Link to="/personal-insituto/listado" id="cancel" className="btn btn-light me-5">
              Cancelar registro
            </Link>
            {/* <!--end::Button-->*/}

            {/* <!--begin::Button-->*/}
            <button
              type="reset"
              id="deregisterButton"
              className="btn btn-info me-5"
              onClick={resetForm}
            >
              <span className="indicator-label"> Reiniciar Formulario </span>
              <span className="indicator-progress">
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            </button>

            <button
              type="submit"
              id="submitEnrollmentForm"
              className="btn btn-primary"
            >
              {!loading && !validating && (
                <span className="indicator-label"> Registrar usuario  </span>
              )}
              {isLoading && (
                <span className="indicator-progress d-flex">
                  Registrando usuario...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}

              {validating && (
                <span className="indicator-progress d-flex">
                  Validando formulario...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
            {/* <!--end::Button-->*/}
          </div>
        </div>
        {/* <!--end::Main column-->*/}
        <div className="col-md-3">
            {/* <!--begin::Status-->*/}
            <div className="card card-flush py-4 ">
            {/* <!--begin::Card header-->*/}
            <div className="card-header">
              {/* <!--begin::Card title-->*/}
              <div className="card-title">
                <h2>Acceso</h2>
              </div>
              {/* <!--end::Card title-->*/}

              {/* <!--begin::Card toolbar-->*/}
              <div className="card-toolbar">
                <div
                  className="rounded-circle bg-success w-15px h-15px"
                  id="password_status"
                ></div>
              </div>
              {/* <!--begin::Card toolbar-->*/}
            </div>
            {/* <!--end::Card header-->*/}

            {/* <!--begin::Card body-->*/}
            <div className="card-body pt-0">
              {autoPassword && generatePassword && (
                <div className="alert alert-dismissible bg-light-info border border-info border-dashed d-flex flex-column flex-sm-row w-100 p-5 mb-10">
                  <div className="d-flex flex-column pe-0 pe-sm-10">
                    <h5 className="mb-1">Contraseña provisional</h5>
                    <span>
                      El  usuará esta constraseña para acceder a la
                      aplicacion por primera vez. La contraseña generada es{" "}
                      <code>{generatedPassword}</code>
                    </span>
                  </div>

                  <button
                    type="button"
                    className="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto"
                    data-bs-dismiss="alert"
                  >
                    <i className="ki-duotone ki-lock-2 fs-1 text-info">
                      <i className="path1"></i>
                      <i className="path2"></i>
                      <i className="path3"></i>
                      <i className="path4"></i>
                      <i className="path5"></i>
                    </i>{" "}
                  </button>
                </div>
              )}
              {/* <!--begin::Input group-->*/}
              <div className="mb-10 fv-row mt-10">
                {/* <!--begin::Label-->*/}
                <label className="required form-label">Email</label>
                {/* <!--end::Label-->*/}
                {/* <!--begin::Input-->*/}
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control mb-2"
                  placeholder="usuario@example.com"
                  value={email}
                  onChange={(e) => onChange(e)}
                />
                {/* <!--end::Input-->*/}
                {/* <!--begin::Description-->*/}
                <div className="text-muted fs-7">
                  El usuario podrá iniciar sesión con este email.
                </div>
                {/* <!--end::Description-->*/}
              </div>
              {/* <!--end::Input group-->*/}
              {/* <!--end::Input group-->*/}
              <div className="mb-5 fv-row mt-5 form-check form-switch form-check-custom form-check-success form-check-solid">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={autoPassword}
                  checked={autoPassword}
                  id="password_method"
                  onChange={(e) => setPasswordMethod(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="password_type">
                  Generar contraseña automáticamente
                </label>
              </div>
              {/* <!--end::Input group-->*/}
              {/* <!--begin::Input group-->*/}
              <div className="mb-5 fv-row mt-10">
                {/* <!--begin::Label-->*/}
                <label className="form-label">Contraseña</label>
                {/* <!--end::Label-->*/}
                {/* <!--begin::Input-->*/}
                {autoPassword ? (
                  <input
                    type="text"
                    readOnly
                    className="form-control mb-2"
                    placeholder="Una contraseña provisional..."
                    value={generatedPassword}
                  />
                ) : (
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control mb-2"
                    placeholder="Una contraseña provisional..."
                    value={password}
                    onChange={(e) => onChange(e)}
                  />
                )}
                {/* <!--end::Input-->*/}
                {/* <!--begin::Description-->*/}
                <div className="text-muted fs-7">
                  Mínimo 8 caracteres. Esta contraseña será provisional.
                </div>
                {/* <!--end::Description-->*/}
              </div>
              {/* <!--end::Input group-->*/}
              {!autoPassword && password && (
                <div className="mb-5 fv-row mt-10">
                  {/* <!--begin::Label-->*/}
                  <label className="form-label">Repetir Contraseña</label>
                  {/* <!--end::Label-->*/}
                  {/* <!--begin::Input-->*/}

                  <input
                    type="password"
                    id="re_password"
                    name="re_password"
                    className="form-control mb-2"
                    placeholder="Repita la contraseña anterior..."
                    value={re_password}
                    onChange={(e) => onChange(e)}
                  />

                  {/* <!--end::Input-->*/}
                  {/* <!--begin::Description-->*/}
                  <div className="text-muted fs-7">
                    Repetita la contraseña anterior aquí.
                  </div>
                  {/* <!--end::Description-->*/}
                </div>
              )}
            </div>
            {/* <!--end::Card body-->*/}
          </div>
          {/* <!--end::Status-->*/}
        </div>
      </form>
      {/* <!--end::Form-->*/}
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.Auth.loading,
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps, {
  add_institute_staff,
})(AddStudentForm);
