import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import AddStudentForm from "../../components/addStudentForm";
import ShowInformation from "../../components/notifications/information";
import KTComponents, { KTAppSidebar } from "../../helpers/AppComponents";
import SetBodyStyle from "../../helpers/fixBodyStyle";
import Layout from "../../hocs/Layout";
import usePageTitle from "../../hooks/hooks";
import { get_institutes } from "../../redux/actions/institutes";
import { get_modalities } from "../../redux/actions/modality";
import { get_provinces } from "../../redux/actions/provinces";

function AddStudent({
  get_institutes,
  get_modalities,
  get_provinces,
  institutes,
  provinces,
  modalities,
  open_announcement,
  user,
  isAuthenticated
}) {
  usePageTitle("Registrar Alumno");
  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, [pathname]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    
        get_institutes();
        get_modalities();
        get_provinces();
    

    window.scrollTo(0, 0);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (institutes) {
      KTComponents.init();
    }
  }, [institutes, modalities, provinces]);

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
    {!open_announcement ? (
      <ShowInformation information={ {type: 'info', message: 'No puedes inscribir nuevos alumnos porque no hay ninguna convocatoria abierta'} }/>
    ) : isAuthenticated && institutes && user && modalities && provinces ? (
      <AddStudentForm
        institutes={institutes}
        user={user}
        modalities={modalities}
        provinces={provinces}
        isAuthenticated={isAuthenticated}
      />
    ) : null}
  </Layout>
  );
}

const mapStateToProps = (state) => ({
  institutes: state.Institute.institutes,
  open_announcement: state.Announcement.open_announcement,
  modalities: state.Modality.modalities,
  provinces: state.Province.provinces,
  user: state.Auth.user,
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  get_institutes,
  get_modalities,
  get_provinces,
})(AddStudent);
