import React from "react";
import Card from "./Card";

function ProjectCard({ title, link, description, status, children }) {
  return (
    <Card variant="project">
      <h2>{title}</h2>
      {status && (
        <div className="status-container">
          <span className={`status-badge status-${status.type}`}>
            <span className="status-icon">{status.icon}</span>
            <span className="status-text">{status.text}</span>
          </span>
        </div>
      )}
      {description && <p>{description}</p>}
      {children}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link-btn"
        >
          View Project
        </a>
      )}
    </Card>
  );
}

export default ProjectCard;
