import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import AddInstituteStaffForm from "../../components/addInstituteStaffForm";

import KTComponents, { KTAppSidebar } from "../../helpers/AppComponents";
import SetBodyStyle from "../../helpers/fixBodyStyle";
import Layout from "../../hocs/Layout";
import usePageTitle from "../../hooks/hooks";
import { get_institutes } from "../../redux/actions/institutes";



function AddInstituteStaff({
  get_institutes,
  institutes,
  user,
  isAuthenticated
}) {
  usePageTitle("Registrar Personal Instituto");
  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, []);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    
    get_institutes();
    window.scrollTo(0, 0);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (institutes) {
      KTComponents.init();
    }
  }, [institutes]);

  useEffect(() => {
    if (isMounted) {
      KTAppSidebar.init();
    }

    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);

  return (

    <Layout>
    {isAuthenticated && institutes && user  ? (
      <AddInstituteStaffForm
        institutes={institutes}
        user={user}
        isAuthenticated={isAuthenticated}
      />
    ) : null}
  </Layout>
  );
}

const mapStateToProps = (state) => ({
  institutes: state.Institute.institutes,
  user: state.Auth.user,
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  get_institutes,
})(AddInstituteStaff);
