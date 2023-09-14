
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { UserAvatarUrl } from '../../helpers/Media';

function Header({ isAuthenticated, user }){
  
  const [avatar_url, setAvatarUrl] = useState('');
  useEffect(() => {
    const avatar = user ? RolesAvatar[user.user_data.rol] : '';
    setAvatarUrl(avatar)
  }, []);
  

  const RolesAvatar = {
    student: user && user.student_data && UserAvatarUrl(user.student_data.photo),
    institute_staff: user && user.staff_data && UserAvatarUrl(user.staff_data.photo ),
    admin_staff: user && UserAvatarUrl(user.user_data.photo),
    staff: user && UserAvatarUrl(user.user_data.photo)
  }
  


    // link al manual
    const LINK_MANAUL = {
      student: { title: 'Manual para estudiantes', link: '/manual'},
      institute_staff: { title: 'Manual para institutos', link: '/manual'},
      staff: { title: 'Manual para secretaria general', link: '/manual'},
      admin_staff: { title: 'Manual', link: '/manual'}

    }



    return (
          user && (

          <div id="kt_app_header" className="app-header">
            {/*begin::Header container*/}
            <div
              className="app-container container-fluid d-flex align-items-stretch justify-content-between"
              id="kt_app_header_container"
            >
              {/*begin::Sidebar mobile toggle*/}
              <div
                className="d-flex align-items-center d-lg-none ms-n3 me-1 me-md-2"
                title="Show sidebar menu"
              >
                <div
                  className="btn btn-icon btn-active-color-primary w-35px h-35px"
                  id="kt_app_sidebar_mobile_toggle"
                >
                  <i className="ki-duotone ki-abstract-14 fs-2 fs-md-1">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </div>
              </div>
              {/*end::Sidebar mobile toggle*/}

              {/*begin::Mobile logo*/}
              <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                <Link to="/panel" className="d-lg-none">
                  <img
                    alt="Logo"
                    src="../../assets/media/logos/default-small.svg"
                    className="h-30px"
                  />
                </Link>
              </div>
              {/*end::Mobile logo*/}

              {/*begin::Header wrapper*/}
              <div
                className="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
                id="kt_app_header_wrapper"
              >
                {/*begin::Menu wrapper*/}
                <div
                  className="app-header-menu app-header-mobile-drawer align-items-stretch"
                  data-kt-drawer="true"
                  data-kt-drawer-name="app-header-menu"
                  data-kt-drawer-activate="{default: true, lg: false}"
                  data-kt-drawer-overlay="true"
                  data-kt-drawer-width="250px"
                  data-kt-drawer-direction="end"
                  data-kt-drawer-toggle="#kt_app_header_menu_toggle"
                  data-kt-swapper="true"
                  data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                  data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
                >
                  {/*begin::Menu*/}
                  <div
                    className="menu menu-rounded menu-column menu-lg-row my-5 my-lg-0 align-items-stretch fw-semibold px-2 px-lg-0"
                    id="kt_app_header_menu"
                    data-kt-menu="true"
                  >
                    {/*begin:Menu item*/}
                    <div
                      data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                      data-kt-menu-placement="bottom-start"
                      className="menu-item here show menu-here-bg menu-lg-down-accordion me-0 me-lg-2"
                    >
                      {/*begin:Menu link*/}
                      <span className="menu-link">
                        <span className="menu-title">Inicio</span>
                        <span className="menu-arrow d-lg-none"></span>
                      </span>
                      {/*end:Menu link*/}

                    </div>
                    {/*end:Menu item*/}
 
                    <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion me-0 me-lg-2"
                    >
                      <span className="menu-link">
                        <span className="menu-title">Como funciona</span>
                        <span className="menu-arrow d-lg-none"></span>
                      </span>
                    </div>
 
                    <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion me-0 me-lg-2"
                    >
                      <span className="menu-link">
                        {
                          user && user.user_data.rol && (
                    
                            <span className="menu-title">{ LINK_MANAUL[user.user_data.rol].title || 'Desconocido'}</span>
                          )
                        }
                        
                        <span className="menu-arrow d-lg-none"></span>
                      </span>
                    </div>

                    {
                      user && user.user_data.rol === 'student' && (
                        <Fragment>

                            <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2"
                            >
                              <span className="menu-link">
                                <span className="menu-title">Modelos de examenes</span>
                                <span className="menu-arrow d-lg-none"></span>
                              </span>
        
                            </div>
                            <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion me-0 me-lg-2"
                            >
                              <span className="menu-link">
                                <span className="menu-title">Clases particulares</span>
                                <span className="menu-arrow d-lg-none"></span>
                              </span>
        
                            </div>
                            <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2"
                            >
                              <span className="menu-link">
                                <span className="menu-title">Apuntes</span>
                                <span className="menu-arrow d-lg-none"></span>
                              </span>
        
                            </div>
                        </Fragment>

                      )
                    }
                  </div>
                  {/*end::Menu*/}
                </div>
                {/*end::Menu wrapper*/}

                {/*begin::Navbar*/}
                <div className="app-navbar flex-shrink-0">


                  {/*begin::Chat*/}
                  <div className="app-navbar-item ms-1 ms-md-3">
                    {/*begin::Menu wrapper*/}
                    <div
                      className="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-30px h-30px w-md-40px h-md-40px position-relative"
                      id="kt_drawer_chat_toggle"
                    >
                      <i className="ki-duotone ki-message-text-2 fs-2 fs-lg-1">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                      <span className="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink"></span>
                    </div>
                    {/*end::Menu wrapper*/}
                  </div>
                  {/*end::Chat*/}


                  {/*begin::Theme mode*/}
                  <div className="app-navbar-item ms-1 ms-md-3">
                    {/*begin::Menu toggle*/}
                    <a
                      href="#"
                      className="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-30px h-30px w-md-40px h-md-40px"
                      data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                      data-kt-menu-attach="parent"
                      data-kt-menu-placement="bottom-end"
                    >
                      <i className="ki-duotone ki-night-day theme-light-show fs-2 fs-lg-1">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                        <span className="path4"></span>
                        <span className="path5"></span>
                        <span className="path6"></span>
                        <span className="path7"></span>
                        <span className="path8"></span>
                        <span className="path9"></span>
                        <span className="path10"></span>
                      </i>
                      <i className="ki-duotone ki-moon theme-dark-show fs-2 fs-lg-1">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </a>
                    {/*begin::Menu toggle*/}

                    {/*begin::Menu*/}
                    <div
                      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px"
                      data-kt-menu="true"
                      data-kt-element="theme-mode-menu"
                    >
                      {/*begin::Menu item*/}
                      <div className="menu-item px-3 my-0">
                        <a
                          href="#"
                          className="menu-link px-3 py-2"
                          data-kt-element="mode"
                          data-kt-value="light"
                        >
                          <span className="menu-icon" data-kt-element="icon">
                            <i className="ki-duotone ki-night-day fs-2">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                              <span className="path4"></span>
                              <span className="path5"></span>
                              <span className="path6"></span>
                              <span className="path7"></span>
                              <span className="path8"></span>
                              <span className="path9"></span>
                              <span className="path10"></span>
                            </i>
                          </span>
                          <span className="menu-title"> Claro </span>
                        </a>
                      </div>
                      {/*end::Menu item*/}

                      {/*begin::Menu item*/}
                      <div className="menu-item px-3 my-0">
                        <a
                          href="#"
                          className="menu-link px-3 py-2"
                          data-kt-element="mode"
                          data-kt-value="dark"
                        >
                          <span className="menu-icon" data-kt-element="icon">
                            <i className="ki-duotone ki-moon fs-2">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                          </span>
                          <span className="menu-title"> Oscuro </span>
                        </a>
                      </div>
                      {/*end::Menu item*/}

                      {/*begin::Menu item*/}
                      <div className="menu-item px-3 my-0">
                        <a
                          href="#"
                          className="menu-link px-3 py-2"
                          data-kt-element="mode"
                          data-kt-value="system"
                        >
                          <span className="menu-icon" data-kt-element="icon">
                            <i className="ki-duotone ki-screen fs-2">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                              <span className="path4"></span>
                            </i>
                          </span>
                          <span className="menu-title"> Sistema </span>
                        </a>
                      </div>
                      {/*end::Menu item*/}
                    </div>
                    {/*end::Menu*/}
                  </div>
                  {/*end::Theme mode*/}

                  {/*begin::User menu*/}
                  <div
                    className="app-navbar-item ms-1 ms-md-3"
                    id="kt_header_user_menu_toggle">
                    {/*begin::Menu wrapper*/}
                    <div
                      className="cursor-pointer symbol symbol-30px symbol-md-40px"
                      data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                      data-kt-menu-attach="parent"
                      data-kt-menu-placement="bottom-end"
                    >


                      <img src={avatar_url} alt="Avatar" />
                    </div>

                    {/*begin::User account menu*/}
                    <div
                      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px"
                      data-kt-menu="true"
                    >
                      {/*begin::Menu item*/}
                      <div className="menu-item px-3">
                        <div className="menu-content d-flex align-items-center px-3">
                          {/*begin::Avatar*/}
                          <div className="symbol symbol-50px me-5">
                            <img
                              alt="Avatar"
                              src={avatar_url}
                            />
                          </div>
                          {/*end::Avatar*/}

                          {/*begin::Username*/}
                          <div className="d-flex flex-column">
                            <div className="fw-bold d-flex align-items-center fs-5">
                              { user.user_data.name }
                              <span className="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">
                                { user.user_data.rol }
                              </span>
                            </div>

                            <a
                              href="#"
                              className="fw-semibold text-muted text-hover-primary fs-7"
                            >
                              { user.user_data.email }
                            </a>
                          </div>
                          {/*end::Username*/}
                        </div>
                      </div>
                      {/*end::Menu item*/}

                      {/*begin::Menu separator*/}
                      <div className="separator my-2"></div>
                      {/*end::Menu separator*/}

                      {/*begin::Menu item*/}
                      <div className="menu-item px-5">
                        <NavLink
                          to ="/perfil"
                          className="menu-link px-5"
                        >
                          Mi Perfil
                        </NavLink>
                      </div>
                      {/*end::Menu item*/}

                      {/*begin::Menu item*/}
                      <div className="menu-item px-5">
                        <NavLink
                          to="/notificaciones"
                          className="menu-link px-5"
                        >
                          <span className="menu-text">Notificaciones</span>
                          <span className="menu-badge">
                            <span className="badge badge-light badge-circle fw-bold fs-7">
                              0
                            </span>
                          </span>
                        </NavLink>
                      </div>
                      {/*end::Menu item*/}


                      {/*begin::Menu item*/}
                      <div className="menu-item px-5">
                        <NavLink
                          to="/cuenta"
                          className="menu-link px-5"
                        >
                          Mi cuenta
                        </NavLink>
                      </div>
                      {/*end::Menu item*/}

                      {/*begin::Menu separator*/}
                      <div className="separator my-2"></div>
                      {/*end::Menu separator*/}


                      {/*begin::Menu item*/}
                      <div className="menu-item px-5 my-1">
                        <NavLink
                          to="/cambiar-contraseña"
                          className="menu-link px-5"
                        >
                          Cambiar contraseña
                        </NavLink>
                      </div>
                      {/*end::Menu item*/}

                      {/*begin::Menu item*/}
                      {
                        isAuthenticated && (

                        <div className="menu-item px-5">
                          <Link
                            to="#"
                            className="menu-link px-5"
                          >
                            Cerrar Sesión
                          </Link>
                        </div>

                        )
                      }
                      {/*end::Menu item*/}
                    </div>
                    {/*end::User account menu*/}
                    {/*end::Menu wrapper*/}
                  </div>
                  {/*end::User menu*/}

                  {/*begin::Header menu toggle*/}
                  <div
                    className="app-navbar-item d-lg-none ms-2 me-n2"
                    title="Mostrar menú superior"
                  >
                    <div
                      className="btn btn-flex btn-icon btn-active-color-primary w-30px h-30px"
                      id="kt_app_header_menu_toggle"
                    >
                      <i className="ki-duotone ki-element-4 fs-1">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </div>
                  </div>
                  {/*end::Header menu toggle*/}
                </div>
                {/*end::Navbar*/}
              </div>
              {/*end::Header wrapper*/}
            </div>
            {/*end::Header container*/}
          </div>

          )

    );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps, {})(Header);