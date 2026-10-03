import React from "react";
import { MissionCard } from "./cards";
import "../styles/Home.css";
import Logo from "./Logo";

function Home() {
  return (
    <>
      <header>
        <div className="logo-container">
          <Logo />
        </div>
        <h1>This is LibreLoom.</h1>
        <p>
          Weaving free and open-source software for everyone. Our mission is to
          make the world a better place by displacing non-free software and putting free, open-source software in its place.
        </p>
      </header>

      <section className="mission-section">
        <MissionCard title="Our Mission">
          <p>
            At LibreLoom, we believe in the power of free and open source
            software to transform lives. We build tools that respect your
            freedom, protect your privacy, and put you in control. Every project
            we create is designed with transparency, accessibility, and
            community at its core. Join us in weaving a better digital future —
            one that belongs to everyone.
          </p>
        </MissionCard>
      </section>
    </>
  );
}

export default Home;
