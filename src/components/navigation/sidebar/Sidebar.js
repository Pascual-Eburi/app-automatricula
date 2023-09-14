
import React from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import SidebarFooter from "./SidebarFooter";
export default function Sidebar() {
  return (
    <>
      <div id="kt_app_sidebar" className="app-sidebar flex-column" 
      data-kt-drawer="true" data-kt-drawer-name="app-sidebar" 
      data-kt-drawer-activate="{default: true, lg: false}" 
      data-kt-drawer-overlay="true" data-kt-drawer-width="225px" 
      data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
        {/*begin::Logo*/}
          <Logo/>
        {/*end::Logo*/}

        {/*begin::sidebar menu*/}
        <Menu/>
        {/*end::sidebar menu*/} 

        {/*begin::Footer*/}
        <SidebarFooter/>
        {/*end::Footer*/}
      </div>
    </>
  );
}
