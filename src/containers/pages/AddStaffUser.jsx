import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import AddStaffForm from "../../components/addStaffForm";
import ShowInformation from "../../components/notifications/information";

import KTComponents, { KTAppSidebar } from "../../helpers/AppComponents";
import SetBodyStyle from "../../helpers/fixBodyStyle";
import Layout from "../../hocs/Layout";
import usePageTitle from "../../hooks/hooks";


function AddStaff({
  user,
  isAuthenticated
}) {
  usePageTitle("Registrar Personal Comisión Selectividad");
  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, []);

  const [isMounted, setIsMounted] = useState(false);

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
    {isAuthenticated && user && user.user_data.is_superuser  ? (
      <AddStaffForm
        user={user}
        isAuthenticated={isAuthenticated}
      />
    ) : (
      <ShowInformation
      information={{
        type: "primary",
        message: "No se ha encontrado la vista",
      }}
    />
    )}
  </Layout>
  );
}

const mapStateToProps = (state) => ({
  user: state.Auth.user,
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(AddStaff);
