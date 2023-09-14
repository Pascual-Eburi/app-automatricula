import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { activate } from "../../redux/actions/auth";

import usePageTitle from "../../hooks/hooks";
import SetBodyStyle from "../../helpers/fixBodyStyle";

const Activate = ({ activate, loading }) => {
  usePageTitle("Activar Cuenta"); // title
  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, [pathname]);

  const params = useParams();
  const [activated, setActivated] = useState(false);

  const activate_account = async () => {
    const uid = params.uid;
    const token = params.token;
    const is_activated = await activate(uid, token);
    if (is_activated) {
      setTimeout(() => {
        setActivated(true);
      }, 10);
    }
  };

  //if (activated && !loading) return <Navigate to="/login" replace="true" />;

  return (
    <>
      <div className="d-flex flex-column flex-root h-100vh login-page">
        {!activated ? (
          <div className="d-flex flex-column flex-center flex-column-fluid">
            <div className="d-flex flex-column flex-center text-center p-10">
              <div className="card card-flush w-lg-650px py-5">
                <div className="card-body py-15 py-lg-20">
                  <div className="mb-14">
                    <a href="../../index.html" className="">
                      <img
                        alt="Logo"
                        src="../../assets/media/logos/custom-2.svg"
                        className="h-40px"
                      />
                    </a>
                  </div>

                  <h1 className="fw-bolder text-gray-900 mb-5">
                    Descubre Automatrícula"
                  </h1>

                  <div className="fw-semibold fs-6 text-gray-500 mb-8">
                    "¡Bienvenido/a a <b>AUTOMATRÍCULA</b> ! <br />
                    Activa tu cuenta para desbloquear todas las funcionalidades
                    y características que tenemos preparadas para ti. Completa
                    el proceso de activación haciendo click en el siguiente
                    botón y comienza a disfrutar de una experiencia única.
                  </div>

                  <div className="mb-11">
                    <button
                      onClick={activate_account}
                      disabled={loading}
                      className="btn btn-sm btn-primary"
                    >
                      {!loading ? "Activar cuenta" : "Activando tu cuenta..."}
                    </button>
                  </div>

                  <div className="mb-0">
                    <img
                      src="../../assets/media/auth/membership.png"
                      className="mw-100 mh-300px theme-light-show"
                      alt=""
                    />
                    <img
                      src="../../assets/media/auth/membership-dark.png"
                      className="mw-100 mh-300px theme-dark-show"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex flex-column flex-center flex-column-fluid">
            <div style={{backgroundColor:"#ffffff", padding: "45px 0 34px 0", borderRadius: "24px", margin:"0 auto", maxWidth: "600px"}} >
              <table
                style={{borderCollapse:"collapse"}} width="100%" height="auto" cellSpacing="0" cellPadding="0" border="0" align="center" >
                <tbody>
                  <tr>
                    <td
                      style={{textAlign:"center", paddingBottom: "10px",}} valign="center"
                align="center"
                    >
                      <div style={{textAlign:"center", margin:"0 15px 34px 15px"}}>
                        <div style={{marginBottom: "10px"}}>
                        </div>

                        <div style={{marginBottom: "15px"}}>
                          <img
                            alt="Logo"
                            src="../../assets/media/email/icon-positive-vote-1.svg"
                          />
                        </div>

                        <div style={{fontSize: " 14px", fontWeight: " 500", marginBottom: " 27px", fontFamily: "Arial,Helvetica,sans-serif",}}>
                          <p style={{marginBottom: "9px", color:"#181C32", fontSize: "22px", fontWeight:"700"}}>
                            ¡ Gracias por activar tu cuenta!
                          </p>
                          <p style={{marginBottom:"2px", color:"#7E8299"}}>
                          ¡Prepárate para una experiencia única! 
                          </p>
                          <p style={{marginBottom:"2px", color:"#7E8299"}}>
                          Explora, descubre y saca el máximo provecho de
                          </p>
                          <p style={{marginBottom:"2px", color:"#7E8299"}}>
                            Automatrícula. Tu siguiente paso es iniciar sesion.
                          </p>
                        </div>

                        <Link
                          to="/login"
                          style={{backgroundColor:"#50cd89", borderRadius:"6px",display:"inline-block", padding:"11px 19px", color:" #FFFFFF", fontSize:" 14px", fontWeight:"500",}}
                        >
                          Iniciar Sesion
                        </Link>
                      </div>
                    </td>
                  </tr>


                </tbody>
              </table>
            </div>

            </div>
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  loading: state.Auth.loading,
});

export default connect(mapStateToProps, {
  activate,
})(Activate);
