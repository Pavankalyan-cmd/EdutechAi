import { Routes, Route, Switch } from "react-router-dom";
import Header from "../components/button/Header";
import RoadMap from "../Pages/RoadMap";
import Resources from "../Pages/Resources";
export default function ApplicationLayout() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/road-map" element={<RoadMap />} />
        <Route path="/tutorial/:topicName" element={<Resources />} />
      </Routes>
    </>
  );
}
