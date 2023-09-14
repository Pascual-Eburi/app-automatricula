import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ShowInformation from "../../components/notifications/information";
import KTComponents, { KTAppSidebar } from "../../helpers/AppComponents";
import SetBodyStyle from "../../helpers/fixBodyStyle";
import Layout from "../../hocs/Layout";
import usePageTitle from "../../hooks/hooks";

function InstituteStaff() {
  const [isMounted, setIsMounted] = useState(false);

  usePageTitle("Personal Institutos");
  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMounted(true);
  }, []);



  useEffect(() => {
    if (isMounted) {
      KTComponents.init();
      KTAppSidebar.init();
    }

    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);

  return (
    <Layout>
      <ShowInformation
        information={{
          type: "info",
          message: "Esta vista no está implementada todavía",
        }}
      />
    </Layout>
  );
}

//staffs: state.InstituteStaff.institute_staffs,
const mapStateToProps = (state) => ({
  user: state.Auth.user,
  userRole: state.Auth.user.user_data.rol,
  isSuperUser: state.Auth.user.user_data.is_super_user,
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps, {

})(InstituteStaff);
