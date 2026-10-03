import React from "react";
import { TeamCard } from "./cards";
import "../styles/Team.css";
import Logo from "./Logo";

function Team() {
  const members = [
    {
      name: "plainskill",
      description:
        'The master of delegation who tells OpenCode to do things instead of doing it themselves. Has perfected the art of looking busy while simultaneously assigning tasks to others. Their favorite phrase is "Could you just..." followed by a complex coding request that they definitely could do themselves but won\'t.',
      tierBadge: "Top Contributor",
      funnyBadge: "Code Machine",
    },
    {
      name: "trafficcone",
      description:
        "Their desk setup is such a mess it's officially classified as a workplace hazard. OSHA had to send over actual traffic cones to mark the danger zone. Somehow finds everything in the chaos and claims it's an \"organized filing system\" that only they understand.",
      tierBadge: "Top Contributor",
      funnyBadge: "Steady Contributor",
    },
    {
      name: "fluffy-bunny-23",
      description:
        'Trusts his AI agents a little too much (we have the screenshots to prove it). His laptop has apparently never left the desk because it\'s made of fragile glass or something. The resident documentation enthusiast in a team that prefers to "ship first, document never."',
      tierBadge: "Top Contributor",
      funnyBadge: "Documentation Champion",
    },
    {
      name: "1nOnlyDude",
      description:
        "A Professional goof-off artist who spends work hours playing Roblox. Somehow still delivers projects on time, leading everyone to wonder if they've discovered time travel or just have a really good bot.",
      funnyBadge: "Speedrunner",
    },
    {
      name: "lazypanda5050",
      description:
        'So lazy it happens to be good sometimes. Their philosophy is "Why do it today when you can do it tomorrow... or never?" Has accidentally created some of our most efficient solutions (using his competitive coding genes) by trying to find the minimum effort required to solve a problem.',
      funnyBadge: "Thoroughly Lazy",
    },
  ];

  return (
    <>
      <header>
        <div className="logo-container">
          <Logo />
        </div>
        <div className="header-divider"></div>
        <h1>The Team</h1>
        <p>
          Meet the brilliant minds behind LibreLoom. We're a diverse group of
          developers, designers, and dreamers working together to create amazing
          open-source software.
        </p>
        <div className="header-divider"></div>
      </header>

      <section className="team-section">
        <div className="cards-container">
          {members.map((member) => (
            <TeamCard
              key={member.name}
              name={member.name}
              description={member.description}
              tierBadge={member.tierBadge}
              funnyBadge={member.funnyBadge}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Team;
