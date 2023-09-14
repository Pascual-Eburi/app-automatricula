import React from 'react';

export default function Footer() {
  return (
    <>
      <div id="kt_app_footer" className="app-footer">
        {/*begin::Footer container*/}
        <div className="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
          {/*begin::Copyright*/}
          <div className="text-dark order-2 order-md-1">
            <span className="text-muted fw-semibold me-1">2023&copy;</span>
            <a
              href="https://keenthemes.com/"
              target="_blank" rel="noopener noreferrer"
              className="text-gray-800 text-hover-primary"
            >
              Pascual Eburi Biloko
            </a>
          </div>
          {/*end::Copyright*/}

          {/*begin::Menu*/}
          <ul className="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
            <li className="menu-item">
              <a
                href="https://keenthemes.com/"
                target="_blank" rel="noopener noreferrer"
                className="menu-link px-2"
              >
                About
              </a>
            </li>

            <li className="menu-item">
              <a
                href="https://devs.keenthemes.com/"
                target="_blank" rel="noopener noreferrer"
                className="menu-link px-2"
              >
                Support
              </a>
            </li>

            <li className="menu-item">
              <a
                href="https://1.envato.market/EA4JP"
                target="_blank" rel="noopener noreferrer"
                className="menu-link px-2"
              >
                Purchase
              </a>
            </li>
          </ul>
          {/*end::Menu*/}
        </div>
        {/*end::Footer container*/}
      </div>
    </>
  );
}
