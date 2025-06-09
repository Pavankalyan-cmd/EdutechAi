import { Link } from "react-router-dom";
import "../button/header.css";
export default function Header() {
  return (
    <>
      <div className="header-layout  container-fluid">
        <h4>EdutechAi</h4>
        <div className="btns">
          <Link to="/road-map">
            {" "}
            <span className="roadmap-btn btn"> RoadMap</span>
          </Link>
          <Link to="/resources">
            <span className="tutorial-btn btn">Tutorial's</span>
          </Link>
          <Link to="/assesment">
            <span className="tutorial-btn btn">Assesment</span>
          </Link>
        </div>
      </div>
    </>
  );
}
