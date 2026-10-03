import React from "react";
import { ProjectCard } from "./cards";
import "../styles/Projects.css";
import Logo from "./Logo";

function Projects() {
  const projects = [
    {
      title: "LibreServ",
      link: "https://serv.libreloom.org",
      status: { type: "concept", icon: "🚧", text: "In development..." },
      description:
        "An operating system designed to simplify self-hosting to a level where anyone will be able to understand it. Hardware with LibreServ pre-installed will be available!",
    },
    {
      title: "PolyLibre",
      link: "https://gt.plainskill.net/LibreLoom/PolyLibre",
      status: { type: "active", icon: "⏸️", text: "Development Paused" },
      description:
        "A free, open-source 3D modeling tool designed as an alternative to TinkerCAD. Features 16 primitive shapes, model import/export, autosave, and full theme customization.",
    },
  ];

  return (
    <>
      <header>
        <div className="logo-container">
          <Logo />
        </div>
        <div className="header-divider"></div>
        <h1>Projects</h1>
        <p>Explore our current and upcoming projects!</p>
        <div className="header-divider"></div>
      </header>

      <section className="team-section">
        <div className="cards-container">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              link={project.link}
              status={project.status}
              description={project.description}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Projects;
