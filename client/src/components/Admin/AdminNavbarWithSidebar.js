import { useLocation } from "react-router-dom";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Icon from "@material-tailwind/react/Icon";
import H6 from "@material-tailwind/react/Heading6";

export default function AdminNavbarWithSidebar(props) {
  const location = useLocation().pathname;
  const [showSidebar, setShowSidebar] = useState("-left-64");
  const [logout, setLogout] = useState(false);

  return (
    <>
      <AdminNavbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div
        className={`h-screen fixed top-0 md:left-0 ${showSidebar} overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-64 z-10 py-4 px-6 transition-all duration-300`}
      >
        <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
          <a
            href="https://www.iitrpr.ac.in/"
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-center w-full inline-block"
          >
            <H6 color="gray">Admin Portal</H6>
          </a>
          <div className="flex flex-col">
            <hr className="my-4 min-w-full" />

            <ul className="flex-col min-w-full flex list-none">
              <li className="rounded-lg mb-2">
                <NavLink
                  to="/admin/dashboard"
                  exact
                  className={
                    location !== "/admin/dashboard"
                      ? "flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                      : "flex items-center gap-4 text-sm font-light px-4 py-3 rounded-lg bg-gradient-to-tr from-[#1E3A8A] to-light-blue-700 text-white shadow-md"
                  }
                >
                  <Icon name="dashboard" size="2xl" />
                  Dashboard
                </NavLink>
              </li>
              {/* <li className="rounded-lg mb-2">
                <NavLink
                  to="/settings"
                  className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                  activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                >
                  <Icon name="settings" size="2xl" />
                  Settings
                </NavLink>
              </li> */}
              {/* <li className="rounded-lg mb-2 ">
                <NavLink
                  to="/tables"
                  className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                  activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                >
                  <Icon name="toc" size="2xl" />
                  Tables
                </NavLink>
              </li> */}
              {/* <li className="rounded-lg mb-2 text-gray-700">
                <NavLink
                  to="/maps"
                  className="flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                  activeClassName="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md"
                >
                  <Icon name="map" size="2xl" />
                  Maps
                </NavLink>
              </li> */}
              <li className="rounded-lg mb-2 text-gray-700">
                <NavLink
                  to="/admin/admission-cycles"
                  exact
                  className={
                    location !== "/admin/admission-cycles"
                      ? "flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                      : "flex items-center gap-4 text-sm font-light px-4 py-3 rounded-lg bg-gradient-to-tr from-[#1E3A8A] to-light-blue-700 text-white shadow-md"
                  }
                >
                  <Icon name="web" size="2xl" />
                  Admissions
                </NavLink>
              </li>
              {/* <li className="px-4 rounded-lg mb-2 text-gray-700">
                <a
                  href="https://demos.creative-tim.com/material-tailwind-kit-react/#/profile"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 text-sm font-light py-3"
                >
                  <Icon name="account_circle" size="2xl" />
                  Profile Page
                </a>
              </li> */}
              <li className="rounded-lg mb-2 text-gray-700">
                <NavLink
                  to="/admin/manage-admins"
                  exact
                  className={
                    location !== "/admin/manage-admins"
                      ? "flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                      : "flex items-center gap-4 text-sm font-light px-4 py-3 rounded-lg bg-gradient-to-tr from-[#1E3A8A] to-light-blue-700 text-white shadow-md"
                  }
                >
                  <Icon name="web" size="2xl" />
                  Admins
                </NavLink>
              </li>

              <li className="rounded-lg mb-2 text-gray-700">
                <NavLink
                  to="/logout"
                  exact
                  onClick={() => setLogout(true)}
                  className={
                    !logout
                      ? "flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                      : "flex items-center gap-4 text-sm font-light px-4 py-3 rounded-lg bg-gradient-to-tr from-[#1E3A8A] to-light-blue-700 text-white shadow-md"
                  }
                >
                  <Icon name="web" size="2xl" />
                  Logout
                </NavLink>
              </li>
            </ul>

            {/* <ul className="flex-col min-w-full flex list-none absolute bottom-0">
              <li className="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 px-4 rounded-lg text-white mb-2">
                <a
                  href="https://material-tailwind.com/documentation/quick-start"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 text-sm font-light py-3"
                >
                  <Icon name="description" size="2xl" />
                  Documentation
                </a>
              </li>
              <li className="bg-gradient-to-tr from-purple-500 to-purple-700 px-4 rounded-lg text-white">
                <a
                  href="https://www.creative-tim.com/product/material-tailwind-dashboard-react"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-4 text-sm font-light py-3"
                >
                  Free Download
                </a>
              </li>
            </ul> */}
          </div>
        </div>
      </div>
    </>
  );
}
