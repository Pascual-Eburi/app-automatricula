import React, { useEffect } from "react";
import { check_authenticated, load_user, refresh } from "../redux/actions/auth";
import {
  get_annoucements,
  get_open_announcement,
} from "../redux/actions/announcement";

import { get_enrollments } from "../redux/actions/enrollment";

import { connect } from "react-redux";

import Footer from "../components/navigation/Footer";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/sidebar/Sidebar";
import Toolbar from "../components/navigation/Toolbar";
import SetBodyStyle from "../helpers/fixBodyStyle";
//import { LoadAppScripts } from '../assets/js/scripts.bundle';

function Layout(props) {
  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, [pathname]);

  useEffect(() => {

    async function fetchData() {
      await Promise.all([
        props.refresh(),
        props.check_authenticated(),
        props.load_user(),

      ]);

      props.get_annoucements();
      props.get_open_announcement();
      props.get_enrollments();
    }
  
    fetchData();

  }, []);

  //const {pageTitle, children} = props;
  return (
    <>
      {/* inicio::App*/}
      <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
        {/*begin::Page*/}
        <div
          className="app-page flex-column flex-column-fluid"
          id="kt_app_page"
        >
          {/*begin::Header*/}
          <Header />
          {/*end::Header*/}
          {/*begin::Wrapper*/}
          <div
            className="app-wrapper flex-column flex-row-fluid"
            id="kt_app_wrapper"
          >
            {/*begin::Sidebar*/}
            <Sidebar />
            {/*end::Sidebar*/}

            {/*begin::Main*/}
            <div
              className="app-main flex-column flex-row-fluid"
              id="kt_app_main"
            >
              {/*begin::Content wrapper*/}
              <div className="d-flex flex-column flex-column-fluid">
                {/*begin::Toolbar*/}
                <Toolbar user={props.user} />

                {/*end::Toolbar*/}

                {/*begin::Content*/}
                <div id="kt_app_content" className="app-content flex-column-fluid">
                  {/*begin::Content container
                    
                      <ToastContainer autoClose={5000} container-xxl container-fluid/>
                  */}
                  <div id="kt_app_content_container" className="app-container  app-container  container-fluid ">
                    {props.children}
                  </div>
                  {/*end::Content container*/}
                </div>
                {/*end::Content*/}
              </div>
              {/*end::Content wrapper*/}

              {/*begin::Footer*/}
              <Footer />
              {/*end::Footer*/}
            </div>
            {/*end:::Main*/}
          </div>
          {/*end::Wrapper*/}
        </div>
        {/*end::Page*/}
      </div>
      {/*end::App*/}
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.Auth.user,
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps, {
  check_authenticated,
  load_user,
  refresh,
  get_annoucements,
  get_open_announcement,
  get_enrollments
})(Layout);
