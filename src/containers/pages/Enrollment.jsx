//import $ from 'jquery';
import 'datatables.net-dt';
import 'datatables.net-bs5/js/dataTables.bootstrap5.min.js';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import KTComponents, { KTAppSidebar } from '../../helpers/AppComponents';
import SetBodyStyle from "../../helpers/fixBodyStyle";
import { v4 as uuidv4 } from "uuid";

import Layout from "../../hocs/Layout";
import usePageTitle from "../../hooks/hooks";
import { get_enrollments } from "../../redux/actions/enrollment";
import EnrollmentRow from '../../components/enrollment';
import GenerateDataTable from '../../helpers/tables';



//import "../../assets/plugins/custom/datatables/datatables.bundle.css" is_staff, is_student, is_admin, is_institute_staff


function Enrollment(
  { get_enrollments, enrollments, isAuthenticated, isSuperUser, userRole, isStaff}) {

  usePageTitle("Matriculas")
  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, []);


  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    get_enrollments();
    window.scrollTo(0, 0);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (enrollments){ 
      KTComponents.init();
      GenerateDataTable.init({
        table_id: 'enrollments_table',
        per_page: 20,
        no_orderable:[ 0, 8 ]
      });
 
    }

  }, [enrollments])

  useEffect(() => {
    if (isMounted) { 
      //KTComponents.init();
      KTAppSidebar.init();
    }

    return () => { setIsMounted(false); };
  }, [isMounted]);


  const is_student = () => userRole === 'student' && isAuthenticated
  const is_institute_staff = () => userRole === 'institute_staff' && isAuthenticated
  const is_admin = () => userRole === 'admin_staff' && isAuthenticated &&  isSuperUser
  const is_staff = () => userRole === 'staff' && isAuthenticated && isStaff; 
  console.log(is_admin())
  return (
    <Layout>
      {/*begin::Card*/}
      
      <div className="card">
        {/*begin::Card header*/}
        <div className="card-header border-0 pt-6">
          {/*begin::Card title*/}
          <div className="card-title">
            {/*begin::Search*/}
            <div className="d-flex align-items-center position-relative my-1">
              <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              <input
                type="text"
                data-table-filter="search"
                className="form-control form-control-solid w-250px ps-12"
                placeholder={`Buscando matricula...`}
              />
            </div>
            {/*end::Search*/}
          </div>
          {/*begin::Card title*/}

          {/*begin::Card toolbar*/}
          <div className="card-toolbar">
            {/*begin::Toolbar*/}
            <div
              className="d-flex justify-content-end"
              data-table-toolbar="base"
            >
              {/*begin::Filter*/}
              <button
                type="button"
                className="btn btn-light-primary me-3"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                
              >
                <i className="ki-duotone ki-filter fs-2">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
                Filter
              </button>
              {/*begin::Menu 1*/}
              <div
                className="menu menu-sub menu-sub-dropdown w-300px w-md-325px"
                data-kt-menu="true"
              >
                {/*begin::Header*/}
                <div className="px-7 py-5">
                  <div className="fs-5 text-dark fw-bold">Filtros disponibles</div>
                </div>
                {/*end::Header*/}

                {/*begin::Separator*/}
                <div className="separator border-gray-200"></div>
                {/*end::Separator*/}

                {/*begin::Content*/}
                <div
                  className="px-7 py-5"
                  data-table-filter="form"
                >
                  {/*begin::Input group*/}
                  <div className="mb-10">
                    <label className="form-label fs-6 fw-semibold">
                      Month:
                    </label>
                    <select
                      className="form-select form-select-solid fw-bold"
                      data-kt-select2="true"
                      data-placeholder="Select option"
                      data-allow-clear="true"
                      data-table-filter="month"
                      data-hide-search="true"
                    >
                      <option></option>
                      <option value="jan">January</option>
                      <option value="feb">February</option>
                      <option value="mar">March</option>
                      <option value="apr">April</option>
                      <option value="may">May</option>
                      <option value="jun">June</option>
                      <option value="jul">July</option>
                      <option value="aug">August</option>
                      <option value="sep">September</option>
                      <option value="oct">October</option>
                      <option value="nov">November</option>
                      <option value="dec">December</option>
                    </select>
                  </div>
                  {/*end::Input group*/}

                  {/*begin::Input group*/}
                  <div className="mb-10">
                    <label className="form-label fs-6 fw-semibold">
                      Status:
                    </label>
                    <select
                      className="form-select form-select-solid fw-bold"
                      data-kt-select2="true"
                      data-placeholder="Select option"
                      data-allow-clear="true"
                      data-table-filter="status"
                      data-hide-search="true"
                    >
                      <option></option>
                      <option value="Active">Active</option>
                      <option value="Expiring">Expiring</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  {/*end::Input group*/}

                  {/*begin::Input group*/}
                  <div className="mb-10">
                    <label className="form-label fs-6 fw-semibold">
                      Billing Method:
                    </label>
                    <select
                      className="form-select form-select-solid fw-bold"
                      data-kt-select2="true"
                      data-placeholder="Select option"
                      data-allow-clear="true"
                      data-table-filter="billing"
                      data-hide-search="true"
                    >
                      <option></option>
                      <option value="Auto-debit">Auto-debit</option>
                      <option value="Manual - Credit Card">
                        Manual - Credit Card
                      </option>
                      <option value="Manual - Cash">Manual - Cash</option>
                      <option value="Manual - Paypal">Manual - Paypal</option>
                    </select>
                  </div>
                  {/*end::Input group*/}

                  {/*begin::Input group
                  
                  d-sm-none
              d-sm-none
              d-sm-none
              d-sm-none
              d-sm-none
                  
                  */}
                  <div className="mb-10">
                    <label className="form-label fs-6 fw-semibold">
                      Product:
                    </label>
                    <select
                      className="form-select form-select-solid fw-bold"
                      data-kt-select2="true"
                      data-placeholder="Select option"
                      data-allow-clear="true"
                      data-table-filter="product"
                      data-hide-search="true"
                    >
                      <option></option>
                      <option value="Basic">Basic</option>
                      <option value="Basic Bundle">Basic Bundle</option>
                      <option value="Teams">Teams</option>
                      <option value="Teams Bundle">Teams Bundle</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="	Enterprise Bundle">
                        Enterprise Bundle
                      </option>
                    </select>
                  </div>
                  {/*end::Input group*/}

                  {/*begin::Actions*/}
                  <div className="d-flex justify-content-end">
                    <button
                      type="reset"
                      className="btn btn-light btn-active-light-primary fw-semibold me-2 px-6"
                      data-kt-menu-dismiss="true"
                      data-table-filter="reset"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary fw-semibold px-6"
                      data-kt-menu-dismiss="true"
                      data-table-filter="filter"
                    >
                      Apply
                    </button>
                  </div>
                  {/*end::Actions*/}
                </div>
                {/*end::Content*/}
              </div>
              {/*end::Menu 1*/}
              {/*end::Filter*/}

              {/*begin::Export*/}
              <button
                type="button"
                className="btn btn-light-primary me-3"
                data-bs-toggle="modal"
                data-bs-target="#kt_subscriptions_export_modal"
              >
                <i className="ki-duotone ki-exit-up fs-2">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
                Export
              </button>
              {/*end::Export*/}


            </div>
            {/*end::Toolbar*/}

            {/*begin::Group actions*/}
            {
              is_admin() && (
                <div
                  className="d-flex justify-content-end align-items-center d-none"
                  data-kt-subscription-table-toolbar="selected"
                >
                  <div className="fw-bold me-5">
                    <span
                      className="me-2"
                      data-kt-subscription-table-select="selected_count"
                    ></span>
                    Selected
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger"
                    data-kt-subscription-table-select="delete_selected"
                  >
                    Delete Selected
                  </button>
                </div>
              )
            }
            {/*end::Group actions*/}
          </div>
          {/*end::Card toolbar*/}
        </div>
        {/*end::Card header*/}

        {/*begin::Card body*/}
        <div className="card-body pt-0">
          {/*begin::Table*/}
          <table
            className="table align-middle table-row-dashed fs-6 gy-5"
            id="enrollments_table"
          >
            <thead>
              <tr className="fw-bold fs-7 text-uppercase text-muted bg-light">
{/*                 {
                  is_admin() && (
                    <th className="w-10px pe-2 ">
                      <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          data-kt-check="true"
                          data-kt-check-target="#kt_subscriptions_table .form-check-input"
                          value="1"
                        />
                      </div>
                    </th>
                  )
                } */}
                <th className="rounded-start">#</th>
                <th className="">Codigo</th>
                {
                  is_student() && (
                    <th className="min-w-125px" >Convocatoria</th>
                  )
                }
                {
                  (is_institute_staff() || is_staff() || is_admin()) && (
                    <th className="min-w-125px">Alumno</th>
                  )
                }
                <th className="min-w-125px">Estado</th>
                <th className="min-w-125px ">Precio</th>
                <th className="min-w-125px ">
                { is_student() ? "Asignaturas" : "Convocatoria" }
                </th>
                <th className="min-w-125px ">Documentos</th>
                <th className="min-w-125px ">Fecha</th>
                <th className="text-end min-w-70px rounded-end">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 fw-semibold">
               {enrollments && enrollments.map( (enrollment, index) =>{
                return ( <EnrollmentRow 
                  enrollment={enrollment} 
                  key={uuidv4()} 
                  is_staff={is_staff} 
                  is_student={is_student} 
                  is_admin={is_admin} 
                  is_institute_staff={is_institute_staff}
                  isAuthenticated={isAuthenticated}
                  index={index}
                  
                  />)
              })} 

             
            </tbody>
          </table>
          {/*end::Table*/}
        </div>
        {/*end::Card body*/}
      </div>
      {/*end::Card*/}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  enrollments: state.Enrollment.enrollments,
  userRole: state.Auth.user.user_data.rol,
  isSuperUser: state.Auth.user.user_data.is_superuser,
  isAuthenticated: state.Auth.isAuthenticated,
  isStaff: state.Auth.user.user_data.is_staff
});

export default connect(mapStateToProps, {
  get_enrollments,
})(Enrollment);
