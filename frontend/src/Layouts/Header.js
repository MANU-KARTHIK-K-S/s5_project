import { NavLink } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import "../App.css";

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navigation" id="navbar">
        <div className="container">
          <NavLink className="navbar-brand" to="index.html">
            <img src={logo} alt="" className="img-sm" width={"40%"} />
          </NavLink>

          <button
            className="navbar-toggler collapsed"
            type="button"
            data-toggle="collapse"
            data-target="#navbarmain"
            aria-controls="navbarmain"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="icofont-navigation-menu"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarmain">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <NavLink
                  className="nav-NavLink"
                  to="index.html"
                  activeClassName="active"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-NavLink"
                  to="about.html"
                  activeClassName="active"
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-NavLink"
                  to="service.html"
                  activeClassName="active"
                >
                  Services
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <NavLink
                  className="nav-NavLink dropdown-toggle"
                  to="department.html"
                  id="dropdown02"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  activeClassName="active"
                >
                  Department <i className="icofont-thin-down"></i>
                </NavLink>
                <ul className="dropdown-menu" aria-labelledby="dropdown02">
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="department.html"
                      activeClassName="active"
                    >
                      Departments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="department-single.html"
                      activeClassName="active"
                    >
                      Department Single
                    </NavLink>
                  </li>

                  <li className="dropdown dropdown-submenu dropright">
                    <NavLink
                      className="dropdown-item dropdown-toggle"
                      to="#!"
                      id="dropdown0301"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      activeClassName="active"
                    >
                      Sub Menu
                    </NavLink>

                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdown0301"
                    >
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="index.html"
                          activeClassName="active"
                        >
                          Submenu 01
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="index.html"
                          activeClassName="active"
                        >
                          Submenu 02
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <NavLink
                  className="nav-NavLink dropdown-toggle"
                  to="doctor.html"
                  id="dropdown03"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  activeClassName="active"
                >
                  Doctors <i className="icofont-thin-down"></i>
                </NavLink>
                <ul className="dropdown-menu" aria-labelledby="dropdown03">
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="doctor.html"
                      activeClassName="active"
                    >
                      Doctors
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="doctor-single.html"
                      activeClassName="active"
                    >
                      Doctor Single
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="appoinment.html"
                      activeClassName="active"
                    >
                      Appoinment
                    </NavLink>
                  </li>

                  <li className="dropdown dropdown-submenu dropleft">
                    <NavLink
                      className="dropdown-item dropdown-toggle"
                      to="#!"
                      id="dropdown0501"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      activeClassName="active"
                    >
                      Sub Menu
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
