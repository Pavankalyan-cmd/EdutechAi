import "./LandingPage.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="container-fluid">
      <div className="navbar">
        <h3>Edutech</h3>
        <div>
          <button className="btn btn-primary m-2">
            {" "}
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontWeight: "bold",
                margin: "30px",
              }}
              to="/Login"
            >
              LoginIn
            </Link>
          </button>
          <button className="btn btn-primary">
            {" "}
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontWeight: "bold",
                margin: "25px",
              }}
              to="/signup"
            >
              SignUp
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
