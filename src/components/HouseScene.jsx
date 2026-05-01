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

function DoorBadgeAnchor({ unlocked, pulsing, className = "" }) {
  return (
    <div className={["ios-door-badge-anchor", className].filter(Boolean).join(" ")}>
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

  useEffect(() => {
    const images = [
      "/house-base.svg",
      "/house-shadow.svg",
      "/light-bedroom-upstairs.svg",
      "/light-living-downstairs.svg",
      "/alert-360-logo.svg",
      "/panel-base.svg",
      "/panel-armed.svg",
      "/panel-disarmed.svg",
    ];

    for (let i = 0; i <= GARAGE_MAX_FRAME; i++) {
      images.push(`/garage-door-${i}.svg`);
    }

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGarageFrame((prev) =>
        garageOpen
          ? Math.min(prev + 1, GARAGE_MAX_FRAME)
          : Math.max(prev - 1, 0)
      );
    }, GARAGE_FRAME_MS);

    return () => clearInterval(timer);
  }, [garageOpen]);

  useEffect(() => {
    if (!systemMounted.current) {
      systemMounted.current = true;
      return;
    }

    if (systemTimeoutRef.current) {
      clearTimeout(systemTimeoutRef.current);
    }

    setSystemMessageKey((k) => k + 1);
    setSystemMessage(armed ? "armed" : "disarmed");

    systemTimeoutRef.current = setTimeout(() => {
      setSystemMessage("");
    }, SYSTEM_MESSAGE_MS);

    return () => clearTimeout(systemTimeoutRef.current);
  }, [armed]);

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
          <img
            src="/alert-360-logo.svg"
            alt="Alert 360"
            className="house-logo"
          />

          {systemMessage && (
            <div
              key={systemMessageKey}
              className={[
                "system-status",
                armed ? "system-status--armed" : "system-status--disarmed",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={armed ? "System Armed" : "System Disarmed"}
            >
              <span className="system-status__lock">
                {armed ? <LockIcon /> : <UnlockIcon />}
              </span>
            </div>
          )}

          <img src="/house-shadow.svg" alt="" className="house-shadow-layer" />

          <div className="security-perimeter" />

          <img src="/house-base.svg" alt="House" className="house-base" />

          <div className="security-panel-group">
            <img src="/panel-base.svg" alt="" className="security-panel-base" />

            <img
              src="/panel-armed.svg"
              alt=""
              className={[
                "security-panel-state",
                "security-panel-state--armed",
                armed ? "is-visible" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />

            <img
              src="/panel-disarmed.svg"
              alt=""
              className={[
                "security-panel-state",
                "security-panel-state--disarmed",
                !armed ? "is-visible" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </div>

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

          {upstairsBedroomOn && (
            <img
              src="/light-bedroom-upstairs.svg"
              alt=""
              className="light-layer"
            />
          )}

          {livingRoomOn && (
            <img
              src="/light-living-downstairs.svg"
              alt=""
              className="light-layer"
            />
          )}

          {/* Door behavior flipped so the name/state travels with the correct phone label */}
          <DoorBadgeAnchor
            unlocked={sideDoorUnlocked}
            pulsing={sidePulse}
            className="door-front"
          />

          <DoorBadgeAnchor
            unlocked={frontDoorUnlocked}
            pulsing={frontPulse}
            className="door-side"
          />

          <div className="house-overlay house-overlay--camera" />
        </div>
      </div>
    </div>
  );
}