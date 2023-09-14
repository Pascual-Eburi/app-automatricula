
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { logout } from '../../../redux/actions/auth';


function SidebarFooter({logout}){

    const [redirect, setRedirect] = useState(false);
    const logoutHandler = () => {
        logout();
        setRedirect(true);
        
      }
    
      if (redirect){
        setTimeout(function(){
          window.location.reload(false)
          return <Navigate to='/login' replace={true} />;

        }, 3000)
      }

    return (
        <>
        {/*begin::Footer*/}
        <div className="app-sidebar-footer flex-column-auto pt-2 pb-6 px-6" id="kt_app_sidebar_footer">
            <button onClick={logoutHandler} className="btn btn-flex flex-center btn-custom btn-primary overflow-hidden text-nowrap px-0 h-40px w-100" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss-="click" title="Cierra sesión en tu cuenta">
                <span className="btn-label me-4"> Salir </span>
                <i className="ki-duotone ki-address-book">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </i>
            </button>
        </div>
        {/*end::Footer*/}
        </>
    );
}

export default connect(null, {logout})(SidebarFooter)