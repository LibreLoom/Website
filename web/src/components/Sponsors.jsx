import { useEffect, useRef, useState } from "react";
import { SponsorCard } from "./cards";
import "../styles/Team.css";
import "../styles/Sponsors.css";
import Logo from "./Logo";

const CANVAS_WIDTH = 420;
const CANVAS_HEIGHT = 260;
const SUPPORTERS = [
  {
    name: "Eddie & Ali",
    amount: "$50",
    badge: "Founding thread",
    note: "First supporters of LibreLoom. Thank you for backing the mission.",
  },
  {
    name: "Дегтярева Наталья Игоревна & Ремигайло Павел Александрович",
    amount: "$180",
    badge: "Weaving patron",
    note: "Thank you for your support!",
  },
];

const getSupporterMark = (name) => {
  if (name.includes("&")) {
    const parts = name
      .split("&")
      .map((part) => part.trim())
      .filter(Boolean);
    return parts
      .map((part) => part[0])
      .join("&")
      .toUpperCase();
  }
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
};

const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const getDifficultyProfile = (elapsedMs) => {
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const level = Math.floor(elapsedSeconds / 10) + 1;
  const spawnInterval = Math.max(520, 1200 - (level - 1) * 70);
  const speedMultiplier = 1 + (level - 1) * 0.06;
  const shuttleWidth = Math.max(52, 72 - (level - 1) * 2);
  const minHorizontalSpacing = Math.max(0, Math.min(60, (level - 1) * 15));
  const maxHorizontalSpacing = Math.max(120, 160 - (level - 1) * 10);
  return {
    elapsedSeconds,
    level,
    spawnInterval,
    speedMultiplier,
    shuttleWidth,
    minHorizontalSpacing,
    maxHorizontalSpacing,
  };
};

function Sponsors() {
  const [isLoomOpen, setIsLoomOpen] = useState(false);
  const [runState, setRunState] = useState("idle");
  const [stitches, setStitches] = useState(0);
  const [slips, setSlips] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastWoven, setLastWoven] = useState("");
  const [wovenCounts, setWovenCounts] = useState({});
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const loomCloseRef = useRef(null);
  const animationRef = useRef(null);
  const gameRef = useRef(null);
  const runStateRef = useRef(runState);
  const stitchesRef = useRef(0);
  const slipsRef = useRef(0);
  const elapsedSecondsRef = useRef(0);
  const levelRef = useRef(1);
  const streakRef = useRef(0);
  const bestStreakRef = useRef(0);

  useEffect(() => {
    runStateRef.current = runState;
  }, [runState]);

  useEffect(() => {
    if (!isLoomOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      if (loomCloseRef.current) {
        loomCloseRef.current.focus();
      }
    });
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLoomOpen]);

  useEffect(() => {
    if (!isLoomOpen) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue("--primary").trim() || "#ffffff";
    const secondary =
      styles.getPropertyValue("--secondary").trim() || "#000000";
    const accent = styles.getPropertyValue("--accent").trim() || "#767676";

    const supporterNames = SUPPORTERS.length
      ? SUPPORTERS.map((supporter) => supporter.name)
      : ["LibreLoom"];
    const supporterMarks = SUPPORTERS.length
      ? SUPPORTERS.map((supporter) => getSupporterMark(supporter.name))
      : ["LL"];

    const game = {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      shuttle: {
        x: CANVAS_WIDTH / 2,
        width: 72,
        height: 12,
        y: CANVAS_HEIGHT - 26,
      },
      threads: [],
      lastSpawn: 0,
      lastSpawnX: null,
      lastTime: 0,
      elapsed: 0,
      countdownTime: 2000,
      input: {
        left: false,
        right: false,
      },
      slipsAllowed: 3,
      supporterNames,
      supporterMarks,
      supporterCursor: 0,
    };

    gameRef.current = game;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const updateCanvasSize = () => {
      const wrap = canvasWrapRef.current;
      const current = gameRef.current;
      if (!wrap || !current) {
        return;
      }
      const rect = wrap.getBoundingClientRect();
      const width = Math.max(280, Math.floor(rect.width));
      const height = Math.max(200, Math.floor(rect.height));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      current.width = width;
      current.height = height;
      current.shuttle.y = height - 26;
      current.shuttle.x = clamp(
        current.shuttle.x,
        16 + current.shuttle.width / 2,
        width - 16 - current.shuttle.width / 2,
      );
    };

    updateCanvasSize();
    requestAnimationFrame(updateCanvasSize);

    const resetWeave = () => {
      const current = gameRef.current;
      if (!current) {
        return;
      }
      current.threads = [];
      current.lastSpawn = 0;
      current.lastSpawnX = null;
      current.lastTime = 0;
      current.elapsed = 0;
      current.countdownTime = 2000;
      current.supporterCursor = 0;
      current.shuttle.x = current.width / 2;
      current.shuttle.width = 72;
      current.shuttle.y = current.height - 26;
      stitchesRef.current = 0;
      slipsRef.current = 0;
      elapsedSecondsRef.current = 0;
      levelRef.current = 1;
      streakRef.current = 0;
      bestStreakRef.current = 0;
      setStitches(0);
      setSlips(0);
      setElapsedSeconds(0);
      setLevel(1);
      setStreak(0);
      setBestStreak(0);
      setLastWoven("");
      setWovenCounts({});
    };

    resetWeave();
    setRunState("idle");

    const spawnThread = (time, speedMultiplier, minSpacing, maxSpacing) => {
      const current = gameRef.current;
      if (!current) {
        return;
      }
      const index = current.supporterCursor % current.supporterNames.length;
      const supporterName = current.supporterNames[index];
      const supporterMark = current.supporterMarks[index];
      current.supporterCursor += 1;

      const padding = 24;
      const availableWidth = current.width - padding * 2;

      let x;
      let attempts = 0;
      const maxAttempts = 15;

      do {
        x = padding + Math.random() * availableWidth;
        attempts++;

        if (current.lastSpawnX !== null) {
          const distance = Math.abs(x - current.lastSpawnX);
          const inRange = distance >= minSpacing && distance <= maxSpacing;
          if (inRange) {
            break;
          }
        } else {
          break;
        }
      } while (attempts < maxAttempts);

      current.lastSpawnX = x;

      current.threads.push({
        x,
        y: -10,
        radius: 6,
        speed: (0.12 + Math.random() * 0.05) * speedMultiplier,
        supporterName,
        label: supporterMark,
      });
      current.lastSpawn = time;
    };

    const update = (delta) => {
      const current = gameRef.current;
      if (!current) {
        return;
      }

      if (runStateRef.current === "counting") {
        current.countdownTime -= delta;
        if (current.countdownTime <= 0) {
          current.countdownTime = 0;
          setRunState("running");
        }
        return;
      }

      if (runStateRef.current !== "running") {
        return;
      }

      current.elapsed += delta;
      const difficulty = getDifficultyProfile(current.elapsed);
      if (difficulty.elapsedSeconds !== elapsedSecondsRef.current) {
        elapsedSecondsRef.current = difficulty.elapsedSeconds;
        setElapsedSeconds(difficulty.elapsedSeconds);
      }
      if (difficulty.level !== levelRef.current) {
        levelRef.current = difficulty.level;
        setLevel(difficulty.level);
      }
      current.shuttle.width = difficulty.shuttleWidth;

      const moveSpeed = 1.0 * delta;
      if (current.input.left) {
        current.shuttle.x -= moveSpeed;
      }
      if (current.input.right) {
        current.shuttle.x += moveSpeed;
      }

      const minX = 16 + current.shuttle.width / 2;
      const maxX = current.width - 16 - current.shuttle.width / 2;
      current.shuttle.x = clamp(current.shuttle.x, minX, maxX);

      if (
        !current.lastSpawn ||
        current.lastTime - current.lastSpawn > difficulty.spawnInterval
      ) {
        spawnThread(
          current.lastTime,
          difficulty.speedMultiplier,
          difficulty.minHorizontalSpacing,
          difficulty.maxHorizontalSpacing
        );
      }

      current.threads = current.threads.filter((thread) => {
        thread.y += thread.speed * delta * 3;
        const hitY = thread.y + thread.radius >= current.shuttle.y;
        const hitX =
          Math.abs(thread.x - current.shuttle.x) <= current.shuttle.width / 2;

        if (hitY && hitX) {
          stitchesRef.current += 1;
          setStitches(stitchesRef.current);
          streakRef.current += 1;
          setStreak(streakRef.current);
          if (streakRef.current > bestStreakRef.current) {
            bestStreakRef.current = streakRef.current;
            setBestStreak(bestStreakRef.current);
          }
          if (thread.supporterName) {
            const supporterName = thread.supporterName;
            setLastWoven(supporterName);
            setWovenCounts((prev) => ({
              ...prev,
              [supporterName]: (prev[supporterName] || 0) + 1,
            }));
          }
          return false;
        }

        if (thread.y - thread.radius > current.height + 10) {
          slipsRef.current += 1;
          setSlips(slipsRef.current);
          streakRef.current = 0;
          setStreak(0);
          if (slipsRef.current >= current.slipsAllowed) {
            setRunState("over");
          }
          return false;
        }

        return true;
      });
    };

    const draw = () => {
      const current = gameRef.current;
      if (!current) {
        return;
      }

      ctx.clearRect(0, 0, current.width, current.height);
      ctx.fillStyle = primary;
      ctx.fillRect(0, 0, current.width, current.height);

      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      for (let i = 1; i <= 8; i += 1) {
        const x = (current.width / 9) * i;
        ctx.beginPath();
        ctx.moveTo(x, 18);
        ctx.lineTo(x, current.height - 40);
        ctx.stroke();
      }
      ctx.restore();

      ctx.strokeStyle = secondary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(
          current.shuttle.x - current.shuttle.width / 2,
          current.shuttle.y,
          current.shuttle.width,
          current.shuttle.height,
          8,
        );
      } else {
        ctx.rect(
          current.shuttle.x - current.shuttle.width / 2,
          current.shuttle.y,
          current.shuttle.width,
          current.shuttle.height,
        );
      }
      ctx.stroke();

      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = accent;
      ctx.fillRect(
        current.shuttle.x - current.shuttle.width / 2 + 8,
        current.shuttle.y + 3,
        current.shuttle.width - 16,
        3,
      );
      ctx.restore();

      current.threads.forEach((thread) => {
        ctx.strokeStyle = secondary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(thread.x, thread.y - 8);
        ctx.lineTo(thread.x, thread.y + 8);
        ctx.stroke();

        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.arc(thread.x, thread.y, thread.radius, 0, Math.PI * 2);
        ctx.fill();

        if (thread.label) {
          ctx.fillStyle = secondary;
          ctx.font = "10px FreeMono, monospace";
          ctx.textAlign = "center";
          ctx.fillText(thread.label, thread.x, thread.y - 12);
        }
      });

      if (runStateRef.current === "idle") {
        ctx.fillStyle = secondary;
        ctx.font = "14px FreeMono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(
          "Move shuttle, catch threads.",
          current.width / 2,
          current.height / 2 - 6,
        );
        ctx.fillText(
          "Begin a weave when you are ready.",
          current.width / 2,
          current.height / 2 + 16,
        );
        ctx.fillText(
          "The tempo rises as time passes.",
          current.width / 2,
          current.height / 2 + 38,
        );
      }

      if (runStateRef.current === "counting") {
        ctx.fillStyle = secondary;
        ctx.font = "24px FreeMono, monospace";
        ctx.textAlign = "center";
        const countdownSeconds = Math.ceil(current.countdownTime / 1000);
        if (countdownSeconds >= 2) {
          ctx.fillText(
            "Ready?",
            current.width / 2,
            current.height / 2,
          );
        } else if (countdownSeconds >= 1) {
          ctx.fillText(
            "Weave.",
            current.width / 2,
            current.height / 2,
          );
        }
      }

      if (runStateRef.current === "over") {
        ctx.fillStyle = secondary;
        ctx.font = "16px FreeMono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(
          "Weave slipped.",
          current.width / 2,
          current.height / 2 - 6,
        );
        ctx.font = "12px FreeMono, monospace";
        ctx.fillText(
          "Reset and try again.",
          current.width / 2,
          current.height / 2 + 16,
        );
      }
    };

    const loop = (time) => {
      const current = gameRef.current;
      if (!current) {
        return;
      }
      if (!current.lastTime) {
        current.lastTime = time;
      }
      const delta = time - current.lastTime;
      current.lastTime = time;
      update(delta);
      draw();
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    const handleKeyDown = (event) => {
      const current = gameRef.current;
      if (!current) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        current.input.left = true;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        current.input.right = true;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setIsLoomOpen(false);
        setRunState("idle");
      }
    };

    const handleKeyUp = (event) => {
      const current = gameRef.current;
      if (!current) {
        return;
      }
      if (event.key === "ArrowLeft") {
        current.input.left = false;
      }
      if (event.key === "ArrowRight") {
        current.input.right = false;
      }
    };

    const handlePointer = (event) => {
      const current = gameRef.current;
      if (!current) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const ratio = current.width / rect.width;
      const x = (clientX - rect.left) * ratio;
      const minX = 16 + current.shuttle.width / 2;
      const maxX = current.width - 16 - current.shuttle.width / 2;
      current.shuttle.x = clamp(x, minX, maxX);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", updateCanvasSize);
    canvas.addEventListener("mousemove", handlePointer);
    canvas.addEventListener("touchmove", handlePointer, { passive: true });
    canvas.addEventListener("touchstart", handlePointer, { passive: true });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", updateCanvasSize);
      canvas.removeEventListener("mousemove", handlePointer);
      canvas.removeEventListener("touchmove", handlePointer);
      canvas.removeEventListener("touchstart", handlePointer);
    };
  }, [isLoomOpen]);

  const handleOpenLoom = () => {
    setIsLoomOpen(true);
  };

  const handleCloseLoom = () => {
    setIsLoomOpen(false);
    setRunState("idle");
  };

  const handleStartWeave = () => {
    const current = gameRef.current;
    if (current) {
      current.threads = [];
      current.lastSpawn = 0;
      current.lastSpawnX = null;
      current.lastTime = 0;
      current.elapsed = 0;
      current.countdownTime = 2000;
      current.supporterCursor = 0;
      current.shuttle.x = current.width / 2;
      current.shuttle.width = 72;
      current.shuttle.y = current.height - 26;
    }
    stitchesRef.current = 0;
    slipsRef.current = 0;
    elapsedSecondsRef.current = 0;
    levelRef.current = 1;
    streakRef.current = 0;
    bestStreakRef.current = 0;
    setStitches(0);
    setSlips(0);
    setElapsedSeconds(0);
    setLevel(1);
    setStreak(0);
    setBestStreak(0);
    setLastWoven("");
    setWovenCounts({});
    if (runState === "running" || runState === "counting") {
      setRunState("idle");
    } else {
      setRunState("counting");
    }
  };

  const loomActionLabel =
    runState === "running" || runState === "counting"
      ? "Stop weave"
      : runState === "over"
        ? "Weave again"
        : "Begin weave";
  const rosterLimit = 6;
  const rosterEntries = SUPPORTERS.map((supporter) => ({
    name: supporter.name,
    count: wovenCounts[supporter.name] || 0,
  }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, rosterLimit);
  const remainingSupporters = Math.max(
    0,
    SUPPORTERS.length - rosterEntries.length,
  );
  const loomStatus =
    runState === "over"
      ? "The loom slipped loose. Reset and try again."
      : runState === "running"
        ? "Tempo rises over time. Stay steady as the weave tightens."
        : "A quiet loom waits for the first thread.";

  return (
    <>
      <header>
        <div className="logo-container">
          <Logo />
        </div>
        <div className="header-divider"></div>
        <h1>Sponsors</h1>
        <p>
          Thanks to the people who keep LibreLoom going. Every thread
          strengthens the fabric we build together.
        </p>
        <div className="header-divider"></div>
      </header>

      <section className="sponsor-hero">
        <div className="sponsor-story">
          <h2>Support the weave</h2>
          <p>
            Each sponsor helps the loom move faster: better tools, clearer docs,
            and more time spent building open-source for everyone.
          </p>
          <p className="sponsor-emphasis">
            Your support is a quiet, steady force behind every release.
          </p>
          <div className="loom-cta-row">
            <button
              className="loom-cta"
              type="button"
              onClick={handleOpenLoom}
              aria-haspopup="dialog"
            >
              Weave a few threads
            </button>
            <span className="loom-hint">A quiet loom waits nearby.</span>
          </div>
        </div>
      </section>

      <section className="sponsor-line">
        <span className="sponsor-line-rule"></span>
        <span className="sponsor-line-label">Supporters</span>
        <span className="sponsor-line-rule"></span>
      </section>

      <section className="team-section sponsor-lineup">
        <div className="cards-container">
          {SUPPORTERS.map((supporter) => (
            <SponsorCard
              key={supporter.name}
              name={supporter.name}
              amount={supporter.amount}
              badge={supporter.badge}
              note={supporter.note}
            />
          ))}
        </div>
      </section>

      {isLoomOpen && (
        <div
          className="modal-overlay modal-overlay--full is-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="loom-title"
          aria-describedby="loom-subtitle"
        >
          <div
            className="card card--modal card--modal--fullscreen loom-modal-card"
            role="document"
            aria-describedby="loom-subtitle"
          >
            <div className="loom-modal-header">
              <h2 id="loom-title">Loom Mini</h2>
              <button
                className="loom-ghost"
                type="button"
                onClick={handleCloseLoom}
                aria-label="Close loom"
                ref={loomCloseRef}
              >
                Close
              </button>
            </div>
            <div className="loom-layout">
              <div className="loom-playfield">
                <div className="loom-canvas-wrap" ref={canvasWrapRef}>
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    role="img"
                    aria-label="Loom Mini playfield. Catch falling threads with the shuttle."
                  >
                    Loom Mini playfield. Use arrow keys or drag to move the
                    shuttle.
                  </canvas>
                </div>
                <p className="loom-controls">
                  Arrows or a gentle drag move the shuttle.
                </p>
              </div>
              <div className="loom-panel">
                <div className="loom-stats">
                  <span className="loom-stat">Tempo: {level}</span>
                  <span className="loom-stat">
                    Time: {formatDuration(elapsedSeconds)}
                  </span>
                  <span className="loom-stat loom-stat-highlight">Stitches: {stitches}</span>
                  <span className="loom-stat">Slips: {slips}/3</span>
                  <span className="loom-stat">Streak: {streak}</span>
                  <span className="loom-stat">Best: {bestStreak}</span>
                  <span className="loom-stat">Woven: {lastWoven || "—"}</span>
                  <span className="loom-stat">
                    Supporters: {SUPPORTERS.length}
                  </span>
                </div>
                <div className="loom-roster">
                  <div className="loom-roster-header">
                    <span>Supporters woven</span>
                    <span>{SUPPORTERS.length} total</span>
                  </div>
                  <div className="loom-roster-list">
                    {rosterEntries.map((supporter) => (
                      <span key={supporter.name}>
                        {supporter.name}: {supporter.count}
                      </span>
                    ))}
                  </div>
                  {remainingSupporters > 0 && (
                    <div className="loom-roster-more">
                      + {remainingSupporters} more
                    </div>
                  )}
                </div>
                <p className="loom-status" role="status">
                  {loomStatus}
                </p>
                <div className="loom-actions">
                  <button
                    className="loom-cta"
                    type="button"
                    onClick={handleStartWeave}
                  >
                    {loomActionLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sponsors;
