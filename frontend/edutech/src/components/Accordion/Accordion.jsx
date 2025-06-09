import React, { useState } from "react";
import "./Accordion.css"; // You'll create this CSS file

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-container">
      <div className="accordion-header" onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span className={`accordion-icon ${isOpen ? "open" : ""}`}>
          &#9660;
        </span>{" "}
        {/* Down arrow */}
      </div>

      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default Accordion;
