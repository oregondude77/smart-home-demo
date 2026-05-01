"use client";

import { useEffect, useRef, useState } from "react";

const GARAGE_MAX_FRAME = 14;
const GARAGE_FRAME_MS = 110;
const DOOR_PULSE_MS = 700;
const SYSTEM_MESSAGE_MS = 2000;

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 10h-1V7a4 4 0 1 0-8 0v3H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-7-3a2 2 0 1 1 4 0v3h-4V7Zm2 10a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 12 17Z" />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 10h-6V7a2 2 0 1 1 4 0 1 1 0 1 0 2 0 4 4 0 1 0-8 0v3H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-5 7a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 12 17Z" />
    </svg>
  );
}

function DoorBadge({ unlocked, pulsing }) {
  return (
    <div
      className={[
        "ios-door-badge",
        unlocked ? "is-unlocked" : "is-locked",
        pulsing ? "is-pulsing" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="ios-door-badge__frame" />
      <div className="ios-door-badge__core" />
      <div className="ios-door-badge__gloss" />
      <div className="ios-door-badge__glare" />
      <div className="ios-door-badge__shimmer" />

      <div className="ios-door-badge__icon">
        {unlocked ? <UnlockIcon /> : <LockIcon />}
      </div>
    </div>
  );
}

function DoorBadgeAnchor({ unlocked, pulsing, style = {} }) {
  return (
    <div className="ios-door-badge-anchor" style={style}>
      <DoorBadge unlocked={unlocked} pulsing={pulsing} />
    </div>
  );
}

export default function HouseScene({
  garageOpen = false,
  cameraOn = false,
  armed = false,
  upstairsBedroomOn = false,
  livingRoomOn = false,
  frontDoorUnlocked = false,
  sideDoorUnlocked = false,
}) {
  const [garageFrame, setGarageFrame] = useState(0);
  const [frontPulse, setFrontPulse] = useState(false);
  const [sidePulse, setSidePulse] = useState(false);
  const [systemMessage, setSystemMessage] = useState("");
  const [systemMessageKey, setSystemMessageKey] = useState(0);

  const frontMounted = useRef(false);
  const sideMounted = useRef(false);
  const systemMounted = useRef(false);

  const frontTimeoutRef = useRef(null);
  const sideTimeoutRef = useRef(null);
  const systemTimeoutRef = useRef(null);

  const frontRaf1Ref = useRef(null);
  const frontRaf2Ref = useRef(null);
  const sideRaf1Ref = useRef(null);
  const sideRaf2Ref = useRef(null);

  /* =========================
     PRELOAD IMAGES
  ========================= */
  useEffect(() => {
    const images = [
      "/house-base.svg",
      "/house-shadow.svg",
      "/light-bedroom-upstairs.svg",
      "/light-living-downstairs.svg",
      "/alert-360-logo.svg",
    ];

    for (let i = 0; i <= GARAGE_MAX_FRAME; i++) {
      images.push(`/garage-door-${i}.svg`);
    }

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  /* =========================
     GARAGE ANIMATION
  ========================= */
  useEffect(() => {
    let timer;

    if (garageOpen) {
      timer = setInterval(() => {
        setGarageFrame((prev) =>
          prev >= GARAGE_MAX_FRAME ? prev : prev + 1
        );
      }, GARAGE_FRAME_MS);
    } else {
      timer = setInterval(() => {
        setGarageFrame((prev) =>
          prev <= 0 ? prev : prev - 1
        );
      }, GARAGE_FRAME_MS);
    }

    return () => clearInterval(timer);
  }, [garageOpen]);

  /* =========================
     SYSTEM MESSAGE
  ========================= */
  useEffect(() => {
    if (!systemMounted.current) {
      systemMounted.current = true;
      return;
    }

    if (systemTimeoutRef.current) {
      clearTimeout(systemTimeoutRef.current);
    }

    setSystemMessageKey((k) => k + 1);
    setSystemMessage(armed ? "System Armed" : "System Disarmed");

    systemTimeoutRef.current = setTimeout(() => {
      setSystemMessage("");
    }, SYSTEM_MESSAGE_MS);

    return () => clearTimeout(systemTimeoutRef.current);
  }, [armed]);

  /* =========================
     DOOR PULSE HANDLER
  ========================= */
  const triggerPulse = (setPulse, timeoutRef, raf1Ref, raf2Ref) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
    if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);

    setPulse(false);

    raf1Ref.current = requestAnimationFrame(() => {
      raf2Ref.current = requestAnimationFrame(() => {
        setPulse(true);

        timeoutRef.current = setTimeout(() => {
          setPulse(false);
        }, DOOR_PULSE_MS);
      });
    });
  };

  useEffect(() => {
    if (!frontMounted.current) {
      frontMounted.current = true;
      return;
    }
    triggerPulse(setFrontPulse, frontTimeoutRef, frontRaf1Ref, frontRaf2Ref);
  }, [frontDoorUnlocked]);

  useEffect(() => {
    if (!sideMounted.current) {
      sideMounted.current = true;
      return;
    }
    triggerPulse(setSidePulse, sideTimeoutRef, sideRaf1Ref, sideRaf2Ref);
  }, [sideDoorUnlocked]);

  /* =========================
     RENDER
  ========================= */
  return (
    <div
      className={[
        "house-scene",
        cameraOn && "house-scene--camera",
        armed ? "house-scene--armed" : "house-scene--disarmed",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="house-scene__frame">
        <div className="house-container">

          {/* ✅ ALERT 360 LOGO */}
          <img
            src="/alert-360-logo.svg"
            alt="Alert 360"
            className="house-logo"
          />

          {/* SYSTEM STATUS */}
          {systemMessage && (
            <div key={systemMessageKey} className="system-status">
              <span className="system-status__icon">
                {armed ? <LockIcon /> : <UnlockIcon />}
              </span>
              <span className="system-status__text">{systemMessage}</span>
            </div>
          )}

          {/* SHADOW */}
          <img
            src="/house-shadow.svg"
            alt=""
            className="house-shadow-layer"
          />

          {/* GLOW */}
          <div className="security-perimeter" />

          {/* HOUSE */}
          <img src="/house-base.svg" alt="House" className="house-base" />

          {/* GARAGE */}
          {Array.from({ length: GARAGE_MAX_FRAME + 1 }, (_, i) => (
            <img
              key={i}
              src={`/garage-door-${i}.svg`}
              className={`garage-door-frame-image ${
                garageFrame === i ? "is-active" : ""
              }`}
              alt=""
            />
          ))}

          {/* LIGHTS */}
          {upstairsBedroomOn && (
            <img
              src="/light-bedroom-upstairs.svg"
              className="light-layer"
              alt=""
            />
          )}

          {livingRoomOn && (
            <img
              src="/light-living-downstairs.svg"
              className="light-layer"
              alt=""
            />
          )}

          {/* DOORS */}
          <DoorBadgeAnchor
            unlocked={frontDoorUnlocked}
            pulsing={frontPulse}
            style={{
              top: "52.5%",
              left: "27.8%",
              transform: "translate(140px, -50%)",
            }}
          />

          <DoorBadgeAnchor
            unlocked={sideDoorUnlocked}
            pulsing={sidePulse}
            style={{
              top: "54%",
              left: "57.8%",
              transform: "translate(140px, -50%)",
            }}
          />

          {/* CAMERA */}
          <div className="house-overlay house-overlay--camera" />

        </div>
      </div>
    </div>
  );
}