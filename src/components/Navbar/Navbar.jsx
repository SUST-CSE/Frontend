import "./Navbar.css";

import { useRef } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

import logo from "/images/logo.png";
import UserMenu from "../UserMenu/UserMenu";

const Navbar = ({ darkText }) => {
  const navLinkRef = useRef();

  const showMenu = () => {
    if (navLinkRef.current) {
      navLinkRef.current.style.right = "0";
    }
  };

  const hideMenu = () => {
    if (navLinkRef.current) {
      navLinkRef.current.style.right = "-200px";
    }
  };

  return (
    <nav className={darkText ? "dark-text" : ""}>
      <Link to="/">
        <img src={logo} alt="" />
      </Link>

      <div className="nav-links" id="navLinks" ref={navLinkRef}>

        <FontAwesomeIcon icon={faTimes} className="fas" onClick={hideMenu} />

        <ul>
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/about">ABOUT</Link>
          </li>
          <li>
            <Link to="/course">COURSE</Link>
          </li>
          <li>
            <Link to="/faculty">FACULTY</Link>
          </li>
          <li>
            <Link to="/contact">CONTACT</Link>
          </li>
        </ul>
      </div>

      <UserMenu />

      <FontAwesomeIcon icon={faBars} className="fas" onClick={showMenu} />
    </nav>
  );
};

export default Navbar;
