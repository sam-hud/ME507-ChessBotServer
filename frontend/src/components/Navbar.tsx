import React from "react";
import { Link } from "react-router-dom";

//Navbar that is rendered on each page. Uses react router links.
export default function Navigation() {
  return (
    <header className="header">
      <h1>
        <Link to="/">Chessbot</Link>
      </h1>
      <a href="https://github.com/Dyruiz131/me507_Term_Project">GitHub Repo</a>
    </header>
  );
}
