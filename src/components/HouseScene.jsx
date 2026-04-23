"use client";

import { useEffect, useRef, useState } from "react";

const GARAGE_MAX_FRAME = 14;
const GARAGE_FRAME_MS = 55;
const DOOR_PULSE_MS = 700;

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
      aria-hidden="true"
    >
      <div className="ios-door-badge__frame" />
      <div className="ios-door-badge__core" />
      <div className="ios-door-badge__gloss" />
      <div className="ios-door-badge__glare" />
      <div className="ios-door-badge__shimmer" />

      <div className="ios-door-badge__icon">
        {unlocked ? (
          <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
            <path d="M17 10h-6V7a2 2 0 1 1 4 0 1 1 0 1 0 2 0 4 4 0 1 0-8 0v3H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-5 7a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 12 17Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
            <path d="M17 10h-1V7a4 4 0 1 0-8 0v3H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-7-3a2 2 0 1 1 4 0v3h-4V7Zm2 10a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 12 17Z" />
          </svg>
        )}
      </div>
    </div>
  );
}

function DoorBadgeAnchor({ unlocked, pulsing, style = {} }) {
  return (
    <div className="ios-door-badge-anchor" style={style} aria-hidden="true">
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

  const frontMounted = useRef(false);
  const sideMounted = useRef(false);
  const frontTimeoutRef = useRef(null);
  const sideTimeoutRef = useRef(null);
  const frontRaf1Ref = useRef(null);
  const frontRaf2Ref = useRef(null);
  const sideRaf1Ref = useRef(null);
  const sideRaf2Ref = useRef(null);

  useEffect(() => {
    let timer;

    if (garageOpen) {
      timer = setInterval(() => {
        setGarageFrame((prev) => {
          if (prev >= GARAGE_MAX_FRAME) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, GARAGE_FRAME_MS);
    } else {
      timer = setInterval(() => {
        setGarageFrame((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            return prev;
          }
          return prev - 1;
        });
      }, GARAGE_FRAME_MS);
    }

    return () => clearInterval(timer);
  }, [garageOpen]);

  const triggerPulse = (setPulse, timeoutRef, raf1Ref, raf2Ref) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
    if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);

    timeoutRef.current = null;
    raf1Ref.current = null;
    raf2Ref.current = null;

    setPulse(false);

    raf1Ref.current = requestAnimationFrame(() => {
      raf2Ref.current = requestAnimationFrame(() => {
        setPulse(true);

        timeoutRef.current = setTimeout(() => {
          setPulse(false);
          timeoutRef.current = null;
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

    return () => {
      if (frontTimeoutRef.current) clearTimeout(frontTimeoutRef.current);
      if (frontRaf1Ref.current) cancelAnimationFrame(frontRaf1Ref.current);
      if (frontRaf2Ref.current) cancelAnimationFrame(frontRaf2Ref.current);
    };
  }, [frontDoorUnlocked]);

  useEffect(() => {
    if (!sideMounted.current) {
      sideMounted.current = true;
      return;
    }

    triggerPulse(setSidePulse, sideTimeoutRef, sideRaf1Ref, sideRaf2Ref);

    return () => {
      if (sideTimeoutRef.current) clearTimeout(sideTimeoutRef.current);
      if (sideRaf1Ref.current) cancelAnimationFrame(sideRaf1Ref.current);
      if (sideRaf2Ref.current) cancelAnimationFrame(sideRaf2Ref.current);
    };
  }, [sideDoorUnlocked]);

  return (
    <div
      className={[
        "house-scene",
        cameraOn ? "house-scene--camera" : "",
        armed ? "house-scene--armed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="house-scene__frame">
        <div className="house-container">
          <img src="/house-base.svg" alt="House base" className="house-base" />

          <img
            src={`/garage-door-${garageFrame}.svg`}
            alt=""
            className="garage-door-frame-image"
          />

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

          <DoorBadgeAnchor
            key={`front-${frontDoorUnlocked}-${frontPulse ? "pulse" : "idle"}`}
            unlocked={frontDoorUnlocked}
            pulsing={frontPulse}
            style={{
              top: "52.5%",
              left: "27.8%",
              transform: "translate(140px, -50%)",
            }}
          />

          <DoorBadgeAnchor
            key={`side-${sideDoorUnlocked}-${sidePulse ? "pulse" : "idle"}`}
            unlocked={sideDoorUnlocked}
            pulsing={sidePulse}
            style={{
              top: "54%",
              left: "57.8%",
              transform: "translate(140px, -50%)",
            }}
          />

          <div className="house-overlay house-overlay--camera" />
        </div>
      </div>
    </div>
  );
}