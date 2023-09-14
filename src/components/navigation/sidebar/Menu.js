import React, { Fragment, useEffect } from "react";
//import { check_authenticated, load_user, refresh } from "../redux/actions/auth";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

function Menu({ isAuthenticated, user, announcements, open_announcement }) {
  // const path = window.location.pathname;
  //if (!isAuthenticated){ return <Navigate to="/login" />}

  const is_admin = () => {
    return isAuthenticated && user && user.user_data.is_superuser;
  };
  const is_staff = () => {
    return isAuthenticated && user && user.user_data.is_staff;
  };

  return (
    <div className="app-sidebar-menu overflow-hidden flex-column-fluid">
      {isAuthenticated && (
        <div
          id="kt_app_sidebar_menu_wrapper"
          className="app-sidebar-wrapper hover-scroll-overlay-y my-5"
          data-kt-scroll="true"
          data-kt-scroll-activate="true"
          data-kt-scroll-height="auto"
          data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
          data-kt-scroll-wrappers="#kt_app_sidebar_menu"
          data-kt-scroll-offset="5px"
          data-kt-scroll-save-state="true"
        >
          <div
            className="menu menu-column menu-rounded menu-sub-indention px-3"
            id="#kt_app_sidebar_menu"
            data-kt-menu="true"
            data-kt-menu-expand="false"
          >
            <div className="menu-item">
              <NavLink className="menu-link" to="/panel">
                <span className="menu-icon">
                  <i className="ki-duotone ki-element-11 fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                  </i>
                </span>
                <span className="menu-title">Panel</span>
              </NavLink>
            </div>
            <div className="menu-item pt-5">
              <div className="menu-content">
                <span className="menu-heading fw-bold text-uppercase fs-7">
                  Area academica
                </span>
              </div>
            </div>

            {/* begin:Menu item */}
            <div
              data-kt-menu-trigger="click"
              className="menu-item here show menu-accordion"
            >
              <span className="menu-link">
                <span className="menu-icon">
                  <i className="ki-duotone ki-element-plus fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                  </i>
                </span>
                <span className="menu-title">Matriculas</span>
                <span className="menu-arrow"></span>
              </span>
              <div className="menu-sub menu-sub-accordion">
                <div className="menu-item" key={uuidv4()}>
                  <NavLink className="menu-link" to={`/matriculas/registrar`}>
                    <span className="menu-bullet">
                      <span className="bullet bullet-dot"></span>
                    </span>
                    <span className="menu-title">Registrar</span>
                  </NavLink>
                </div>
                <div className="menu-item" key={uuidv4()}>
                  <NavLink className="menu-link" to={`/matriculas/listado`}>
                    <span className="menu-bullet">
                      <span className="bullet bullet-dot"></span>
                    </span>
                    <span className="menu-title">Todas</span>
                  </NavLink>
                </div>
                {announcements &&
                  announcements.map((item) => {
                    return (
                      <div className="menu-item" key={uuidv4()}>
                        <NavLink
                          className="menu-link"
                          to={`/matriculas/convocatoria/${item.announcement_id}`}
                        >
                          <span className="menu-bullet">
                            <span className="bullet bullet-dot"></span>
                          </span>
                          <span className="menu-title">{item.name}</span>
                        </NavLink>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* begin:Menu item */}
            <div
              data-kt-menu-trigger="click"
              className="menu-item menu-accordion"
            >
              <span className="menu-link">
                <span className="menu-icon">
                  <i className="ki-duotone ki-color-swatch fs-2">
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
                    <span className="path11"></span>
                    <span className="path12"></span>
                    <span className="path13"></span>
                    <span className="path14"></span>
                    <span className="path15"></span>
                    <span className="path16"></span>
                    <span className="path17"></span>
                    <span className="path18"></span>
                    <span className="path19"></span>
                    <span className="path20"></span>
                    <span className="path21"></span>
                  </i>
                </span>
                <span className="menu-title">Examenes</span>
                <span className="menu-arrow"></span>
              </span>
              <div className="menu-sub menu-sub-accordion">
                <div className="menu-item" key={uuidv4()}>
                  <NavLink className="menu-link" to={`/examenes`}>
                    <span className="menu-bullet">
                      <span className="bullet bullet-dot"></span>
                    </span>
                    <span className="menu-title">Todos</span>
                  </NavLink>
                </div>
                {announcements &&
                  announcements.map((item) => {
                    return (
                      <div className="menu-item" key={uuidv4()}>
                        <NavLink
                          className="menu-link"
                          to={`/examenes/convocatoria/${item.announcement_id}`}
                        >
                          <span className="menu-bullet">
                            <span className="bullet bullet-dot"></span>
                          </span>
                          <span className="menu-title">{item.name}</span>
                        </NavLink>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* begin:Menu item */}
            <div
              data-kt-menu-trigger="click"
              className="menu-item menu-accordion"
            >
              <span className="menu-link">
                <span className="menu-icon">
                  <i className="ki-duotone ki-office-bag fs-2">
                    <i className="path1"></i>
                    <i className="path2"></i>
                    <i className="path3"></i>
                    <i className="path4"></i>
                  </i>
                </span>
                <span className="menu-title">Notas</span>
                <span className="menu-arrow"></span>
              </span>
              <div className="menu-sub menu-sub-accordion">
                {(is_admin() || is_staff() ) && (
                  <div className="menu-item" key={uuidv4()}>
                    <NavLink className="menu-link" to={`/notas/registrar`}>
                      <span className="menu-bullet">
                        <span className="bullet bullet-dot"></span>
                      </span>
                      <span className="menu-title">Registrar</span>
                    </NavLink>
                  </div>

                )}
                <div className="menu-item" key={uuidv4()}>
                  <NavLink className="menu-link" to={`/notas/`}>
                    <span className="menu-bullet">
                      <span className="bullet bullet-dot"></span>
                    </span>
                    <span className="menu-title">Todas</span>
                  </NavLink>
                </div>

                {announcements &&
                  announcements.map((item) => {
                    return (
                      <div className="menu-item" key={uuidv4()}>
                        <NavLink
                          className="menu-link"
                          to={`/notas/convocatoria/${item.announcement_id}`}
                        >
                          <span className="menu-bullet">
                            <span className="bullet bullet-dot"></span>
                          </span>
                          <span className="menu-title">{item.name}</span>
                        </NavLink>
                      </div>
                    );
                  })}
              </div>
            </div>
            {is_admin() && (
              <div className="menu-item pt-5">
                <div className="menu-content">
                  <span className="menu-heading fw-bold text-uppercase fs-7">
                    Usuarios
                  </span>
                </div>
              </div>
            )}
            {user && user.user_data.rol !== "student" && (
              <div
                data-kt-menu-trigger="click"
                className="menu-item menu-accordion"
              >
                <span className="menu-link">
                  <span className="menu-icon">
                    <i className="ki-duotone ki-profile-user  fs-2">
                      <i className="path1"></i>
                      <i className="path2"></i>
                      <i className="path3"></i>
                      <i className="path4"></i>
                    </i>
                  </span>
                  <span className="menu-title">Alumnos</span>
                  <span className="menu-arrow"></span>
                </span>
                <div className="menu-sub menu-sub-accordion">
                  <div className="menu-item">
                    <NavLink className="menu-link" to="/alumnos/registrar">
                      <span className="menu-bullet">
                        <span className="bullet bullet-dot"></span>
                      </span>
                      <span className="menu-title">Preincribir</span>
                    </NavLink>
                  </div>
                  <div className="menu-item">
                    <NavLink className="menu-link" to="/alumnos/listado">
                      <span className="menu-bullet">
                        <span className="bullet bullet-dot"></span>
                      </span>
                      <span className="menu-title">Lista</span>
                    </NavLink>
                  </div>
                </div>
              </div>
            )}

            {is_admin() && (
              <Fragment>
                <div
                  data-kt-menu-trigger="click"
                  className="menu-item menu-accordion"
                >
                  <span className="menu-link">
                    <span className="menu-icon">
                      <i className="ki-duotone ki-profile-user  fs-2">
                        <i className="path1"></i>
                        <i className="path2"></i>
                        <i className="path3"></i>
                        <i className="path4"></i>
                      </i>
                    </span>
                    <span className="menu-title">Personal Instituto</span>
                    <span className="menu-arrow"></span>
                  </span>
                  <div className="menu-sub menu-sub-accordion">
                    <div className="menu-item">
                      <NavLink className="menu-link" to="/personal-instituto/registrar">
                        <span className="menu-bullet">
                          <span className="bullet bullet-dot"></span>
                        </span>
                        <span className="menu-title">Registrar</span>
                      </NavLink>
                    </div>
                    <div className="menu-item">
                      <NavLink className="menu-link" to="/personal-instituto/listado">
                        <span className="menu-bullet">
                          <span className="bullet bullet-dot"></span>
                        </span>
                        <span className="menu-title">Lista</span>
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div
                  data-kt-menu-trigger="click"
                  className="menu-item menu-accordion"
                >
                  <span className="menu-link">
                    <span className="menu-icon">
                      <i className="ki-duotone ki-profile-user  fs-2">
                        <i className="path1"></i>
                        <i className="path2"></i>
                        <i className="path3"></i>
                        <i className="path4"></i>
                      </i>
                    </span>
                    <span className="menu-title">Personal</span>
                    <span className="menu-arrow"></span>
                  </span>
                  <div className="menu-sub menu-sub-accordion">
                    <div className="menu-item">
                      <NavLink className="menu-link" to="/personal/registrar">
                        <span className="menu-bullet">
                          <span className="bullet bullet-dot"></span>
                        </span>
                        <span className="menu-title">Registrar</span>
                      </NavLink>
                    </div>
                    <div className="menu-item">
                      <NavLink className="menu-link" to="/personal/listado">
                        <span className="menu-bullet">
                          <span className="bullet bullet-dot"></span>
                        </span>
                        <span className="menu-title">Lista</span>
                      </NavLink>
                    </div>
                  </div>
                </div>

              </Fragment>
            )}

            <div className="menu-item pt-5">
              <div className="menu-content">
                <span className="menu-heading fw-bold text-uppercase fs-7">
                  Tu información
                </span>
              </div>
            </div>
            <div className="menu-item">
              <NavLink className="menu-link" to="/cuenta?ficha">
                <span className="menu-icon">
                  <i className="ki-duotone ki-user fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </span>
                <span className="menu-title">Perfil</span>
              </NavLink>
            </div>
            <div className="menu-item">
              <NavLink className="menu-link" to="/cuenta">
                <span className="menu-icon">
                  <i className="ki-duotone ki-address-book fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>
                <span className="menu-title">Cuenta</span>
              </NavLink>
            </div>

            <div className="menu-item pt-5">
              <div className="menu-content">
                <span className="menu-heading fw-bold text-uppercase fs-7">
                  ayuda
                </span>
              </div>
            </div>

            {user && user.user_data.rol === "student" && (
              <Fragment>
                <div className="menu-item">
                  <a
                    className="menu-link"
                    href="pages/user-profile/overview.html"
                  >
                    <span className="menu-icon">
                      <i className="ki-duotone ki-call fs-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                        <span className="path4"></span>
                        <span className="path5"></span>
                        <span className="path6"></span>
                        <span className="path7"></span>
                        <span className="path8"></span>
                      </i>
                    </span>
                    <span className="menu-title">Modelos de examenes</span>
                  </a>
                </div>
                <div className="menu-item">
                  <a
                    className="menu-link"
                    href="pages/user-profile/overview.html"
                  >
                    <span className="menu-icon">
                      <i className="ki-duotone ki-faceid fs-2">
                        <i className="path1"></i>
                        <i className="path2"></i>
                        <i className="path3"></i>
                        <i className="path4"></i>
                        <i className="path5"></i>
                        <i className="path6"></i>
                      </i>
                    </span>
                    <span className="menu-title">Clases Particulares</span>
                  </a>
                </div>
              </Fragment>
            )}

            <div className="menu-item">
              <NavLink className="menu-link" to="/manual">
                <span className="menu-icon">
                  <i className="ki-duotone ki-code fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                  </i>
                </span>
                <span className="menu-title">Manual</span>
              </NavLink>
            </div>

            {/*           {isAuthenticated &&
                student_links.map((item) => {
                  return item.childs ? (
                    <AccordionMenuLink
                      title={item.name}
                      key={item.name}
                      icon={item.icon()}
                    />
                  ) : (
                    <SimpleMenuLink
                      title={item.name}
                      href={item.href}
                      key={item.name}
                      icon={item.icon()}
                    />
                  );
                })} */}
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
  announcements: state.Announcement.announcements,
  open_announcement: state.Announcement.open_announcement,
});

export default connect(mapStateToProps, {})(Menu);
