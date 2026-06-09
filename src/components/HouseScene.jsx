"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GARAGE_MAX_FRAME = 14;
const GARAGE_FRAME_MS = 110;
const DEADBOLT_MAX_FRAME = 15;
const DEADBOLT_FRAME_MS = 55;
const DOOR_PULSE_MS = 700;
const DOOR_CALLOUT_MS = 3400;
const SYSTEM_MESSAGE_MS = 2000;
const SCENE_STATUS_STEP_MS = 1550;
const SCENE_STATUS_HOLD_MS = 2400;
const SCENE_STATUS_TYPE_MIN_MS = 18;
const SCENE_STATUS_TYPE_MAX_MS = 34;

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
      ].filter(Boolean).join(" ")}
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

function DoorLockSource({ door, unlocked, active }) {
  return (
    <div
      className={[
        "door-lock-source",
        `door-lock-source--${door}`,
        active ? "is-active" : "",
        unlocked ? "is-unlocked" : "is-locked",
      ].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}

function SmartLockCallout({ door, unlocked, active, actionKey, noAnimation = false, unlockedOverride = null }) {
  const calloutUnlocked = unlockedOverride ?? unlocked;
  const [boltFrame, setBoltFrame] = useState(calloutUnlocked ? 0 : DEADBOLT_MAX_FRAME);
  const renderedBoltFrame = DEADBOLT_MAX_FRAME - boltFrame;

  useEffect(() => {
    if (!active) return;

    if (noAnimation) {
      setBoltFrame(calloutUnlocked ? 0 : DEADBOLT_MAX_FRAME);
      return;
    }

    setBoltFrame(calloutUnlocked ? DEADBOLT_MAX_FRAME : 0);

    const timer = setInterval(() => {
      setBoltFrame((prev) => {
        const next = calloutUnlocked ? prev - 1 : prev + 1;
        const bounded = Math.max(0, Math.min(DEADBOLT_MAX_FRAME, next));

        if (bounded === prev) {
          clearInterval(timer);
        }

        return bounded;
      });
    }, DEADBOLT_FRAME_MS);

    return () => clearInterval(timer);
  }, [active, actionKey, calloutUnlocked, noAnimation]);

  return (
    <div
      className={[
        "scene-action-callout",
        `scene-action-callout--${door}`,
        active ? "is-active" : "",
        calloutUnlocked ? "is-unlocking" : "is-locking",
      ].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <div
        key={`${door}-${actionKey}-${calloutUnlocked ? "unlocking" : "locking"}-${noAnimation ? "static" : "animated"}`}
        className="scene-action-callout__inner"
      >
        <img
          src="/door-lock-no-deadbolt.svg"
          alt=""
          className="scene-action-callout__deadbolt-base"
        />
        <img
          src={`/door-lock-bolt-${renderedBoltFrame}.svg`}
          alt=""
          className="scene-action-callout__deadbolt-frame"
        />
      </div>
    </div>
  );
}

function ThermostatSceneDevice({
  roomTemperature,
  setTemperature,
}) {
  const mode =
    setTemperature === roomTemperature
      ? "idle"
      : setTemperature > roomTemperature
        ? "heating"
        : "cooling";
  const modeLabel = mode === "idle" ? "" : mode === "heating" ? "HEATING" : "COOLING";

  return (
    <div
      className={[
        "thermostat-scene-device",
        `is-${mode}`,
      ].filter(Boolean).join(" ")}
      data-mode={mode}
      aria-hidden="true"
    >
      <div className="thermostat-scene-device__shell">
        <img
          src="/smart-thermostate-base.svg"
          alt=""
          className="thermostat-scene-device__base"
        />
        <div className="thermostat-scene-device__controls">
          <div className="thermostat-scene-device__glyph thermostat-scene-device__glyph--menu">
            <span />
            <span />
            <span />
          </div>
          <div className="thermostat-scene-device__glyph thermostat-scene-device__glyph--next" />
          <div className="thermostat-scene-device__glyph thermostat-scene-device__glyph--up" />
          <div className="thermostat-scene-device__glyph thermostat-scene-device__glyph--down" />
        </div>
        <div className="thermostat-scene-device__readout">
          <div className="thermostat-scene-device__mode">
            {modeLabel}
          </div>
          <div className="thermostat-scene-device__room">{roomTemperature}</div>
          <div className="thermostat-scene-device__set">{setTemperature}</div>
        </div>
      </div>
    </div>
  );
}

function CameraLiveMarker({ type, label }) {
  return (
    <>
      <div className={`camera-live-marker camera-live-marker--${type}`} />
      <div className={`camera-live-label camera-live-label--${type}`}>
        {label}
      </div>
    </>
  );
}


export default function HouseScene({
  garageOpen = false,
  nightMode = false,
  armed = false,

  upstairsBedroomOn = false,
  bedroomOn = false,
  livingRoomOn = false,
  diningRoomOn = false,
  garageLightsOn = false,
  floodlightOn = false,
  exteriorSideLightOn = false,
  porchLightOn = false,

  frontDoorUnlocked = false,
  sideDoorUnlocked = false,
  thermostatTemp = 70,
  thermostatRoomTemp = 72,

  activeCamera = null,
  doorAction = null,
  systemAction = null,
  sceneStatus = null,
  quietResetKey = 0,
}) {
  const [garageFrame, setGarageFrame] = useState(0);
  const [frontPulse, setFrontPulse] = useState(false);
  const [sidePulse, setSidePulse] = useState(false);
  const [frontCallout, setFrontCallout] = useState({ active: false, key: 0 });
  const [sideCallout, setSideCallout] = useState({ active: false, key: 0 });
  const [systemMessage, setSystemMessage] = useState("");
  const [systemMessageKey, setSystemMessageKey] = useState(0);
  const [sceneStatusIndex, setSceneStatusIndex] = useState(0);
  const [sceneStatusTextLength, setSceneStatusTextLength] = useState(0);
  const [sceneStatusVisible, setSceneStatusVisible] = useState(false);

  const frontMounted = useRef(false);
  const sideMounted = useRef(false);
  const previousFrontDoorUnlockedRef = useRef(frontDoorUnlocked);
  const previousSideDoorUnlockedRef = useRef(sideDoorUnlocked);
  const systemMounted = useRef(false);
  const suppressSystemFeedbackRef = useRef(false);

  const frontTimeoutRef = useRef(null);
  const sideTimeoutRef = useRef(null);
  const frontCalloutTimeoutRef = useRef(null);
  const sideCalloutTimeoutRef = useRef(null);
  const frontCalloutRaf1Ref = useRef(null);
  const frontCalloutRaf2Ref = useRef(null);
  const sideCalloutRaf1Ref = useRef(null);
  const sideCalloutRaf2Ref = useRef(null);
  const systemTimeoutRef = useRef(null);
  const sceneStatusIntervalRef = useRef(null);
  const sceneStatusTimeoutRef = useRef(null);
  const sceneStatusTypingIntervalRef = useRef(null);

  const frontRaf1Ref = useRef(null);
  const frontRaf2Ref = useRef(null);
  const sideRaf1Ref = useRef(null);
  const sideRaf2Ref = useRef(null);

  useEffect(() => {
    if (!quietResetKey) return;

    [
      frontTimeoutRef,
      sideTimeoutRef,
      frontCalloutTimeoutRef,
      sideCalloutTimeoutRef,
      systemTimeoutRef,
      sceneStatusTimeoutRef,
    ].forEach((timeoutRef) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    });

    [
      frontCalloutRaf1Ref,
      frontCalloutRaf2Ref,
      sideCalloutRaf1Ref,
      sideCalloutRaf2Ref,
      frontRaf1Ref,
      frontRaf2Ref,
      sideRaf1Ref,
      sideRaf2Ref,
    ].forEach((rafRef) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    });

    if (sceneStatusIntervalRef.current) {
      clearInterval(sceneStatusIntervalRef.current);
      sceneStatusIntervalRef.current = null;
    }

    if (sceneStatusTypingIntervalRef.current) {
      clearInterval(sceneStatusTypingIntervalRef.current);
      sceneStatusTypingIntervalRef.current = null;
    }

    previousFrontDoorUnlockedRef.current = frontDoorUnlocked;
    previousSideDoorUnlockedRef.current = sideDoorUnlocked;
    suppressSystemFeedbackRef.current = true;
    setGarageFrame(0);
    setFrontPulse(false);
    setSidePulse(false);
    setFrontCallout({ active: false, key: 0 });
    setSideCallout({ active: false, key: 0 });
    setSystemMessage("");
    setSceneStatusVisible(false);
    setSceneStatusIndex(0);
    setSceneStatusTextLength(0);
  }, [quietResetKey, frontDoorUnlocked, sideDoorUnlocked]);

  useEffect(() => {
    const images = [
      "/house-base.svg",
      "/house-shadow.svg",
      "/light-bedroom-upstairs.svg",
      "/light-bedroom2-upstairs.svg",
      "/light-living-downstairs.svg",
      "/light-dining-downstairs.svg",
      "/garage-lights-outside.svg",
      "/light-floodlight.svg",
      "/side-light-outside.svg",
      "/porch-light-outside.svg",
      "/panel-base.svg",
      "/panel-armed.svg",
      "/panel-disarmed.svg",
      "/door-lock-no-deadbolt.svg",
    ];

    for (let i = 0; i <= DEADBOLT_MAX_FRAME; i += 1) {
      images.push(`/door-lock-bolt-${i}.svg`);
    }

    for (let i = 0; i <= GARAGE_MAX_FRAME; i += 1) {
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

  const showSystemFeedback = useCallback((isArmed) => {
    if (systemTimeoutRef.current) clearTimeout(systemTimeoutRef.current);

    setSystemMessageKey((k) => k + 1);
    setSystemMessage(isArmed ? "armed" : "disarmed");

    systemTimeoutRef.current = setTimeout(() => {
      setSystemMessage("");
    }, SYSTEM_MESSAGE_MS);
  }, []);

  useEffect(() => {
    if (!systemMounted.current) {
      systemMounted.current = true;
      return;
    }

    if (suppressSystemFeedbackRef.current) {
      suppressSystemFeedbackRef.current = false;
      setSystemMessage("");
      return;
    }

    showSystemFeedback(armed);

    return () => clearTimeout(systemTimeoutRef.current);
  }, [armed, showSystemFeedback]);

  useEffect(() => {
    if (!systemAction) return;

    showSystemFeedback(systemAction.armed);
  }, [systemAction, showSystemFeedback]);

  const triggerPulse = useCallback((setPulse, timeoutRef, raf1Ref, raf2Ref) => {
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
  }, []);

  const triggerCallout = useCallback((setCallout, timeoutRef, raf1Ref, raf2Ref, options = {}) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
    if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);

    setCallout((prev) => ({
      ...prev,
      active: false,
    }));

    raf1Ref.current = requestAnimationFrame(() => {
      raf2Ref.current = requestAnimationFrame(() => {
        setCallout((prev) => ({
          active: true,
          key: prev.key + 1,
          noAnimation: Boolean(options.noAnimation),
          unlockedOverride: options.unlockedOverride ?? null,
        }));

        timeoutRef.current = setTimeout(() => {
          setCallout((prev) => ({
            ...prev,
            active: false,
            noAnimation: false,
            unlockedOverride: null,
          }));
        }, DOOR_CALLOUT_MS);
      });
    });
  }, []);

  const triggerDoorFeedback = useCallback((door, options = {}) => {
    if (door === "both") {
      triggerDoorFeedback("front", options);
      triggerDoorFeedback("side", options);
      return;
    }

    if (door === "front") {
      triggerPulse(setFrontPulse, frontTimeoutRef, frontRaf1Ref, frontRaf2Ref);
      triggerCallout(
        setFrontCallout,
        frontCalloutTimeoutRef,
        frontCalloutRaf1Ref,
        frontCalloutRaf2Ref,
        options
      );
      return;
    }

    if (door === "side") {
      triggerPulse(setSidePulse, sideTimeoutRef, sideRaf1Ref, sideRaf2Ref);
      triggerCallout(
        setSideCallout,
        sideCalloutTimeoutRef,
        sideCalloutRaf1Ref,
        sideCalloutRaf2Ref,
        options
      );
    }
  }, [triggerCallout, triggerPulse]);

  useEffect(() => {
    if (!frontMounted.current) {
      frontMounted.current = true;
      previousFrontDoorUnlockedRef.current = frontDoorUnlocked;
      return;
    }

    if (previousFrontDoorUnlockedRef.current === frontDoorUnlocked) return;

    previousFrontDoorUnlockedRef.current = frontDoorUnlocked;

    if (
      (doorAction?.door === "front" || doorAction?.door === "both")
      && doorAction.suppressStateFeedback
      && doorAction.unlocked === frontDoorUnlocked
    ) {
      return;
    }

    triggerDoorFeedback("front");
  }, [frontDoorUnlocked, doorAction, triggerDoorFeedback]);

  useEffect(() => {
    if (!sideMounted.current) {
      sideMounted.current = true;
      previousSideDoorUnlockedRef.current = sideDoorUnlocked;
      return;
    }

    if (previousSideDoorUnlockedRef.current === sideDoorUnlocked) return;

    previousSideDoorUnlockedRef.current = sideDoorUnlocked;

    if (
      (doorAction?.door === "side" || doorAction?.door === "both")
      && doorAction.suppressStateFeedback
      && doorAction.unlocked === sideDoorUnlocked
    ) {
      return;
    }

    triggerDoorFeedback("side");
  }, [sideDoorUnlocked, doorAction, triggerDoorFeedback]);

  useEffect(() => {
    if (!doorAction) return;

    triggerDoorFeedback(doorAction.door, {
      noAnimation: doorAction.noAnimation,
      unlockedOverride: doorAction.unlocked,
    });
  }, [doorAction, triggerDoorFeedback]);

  useEffect(() => {
    if (!sceneStatus?.actions?.length) return;

    if (sceneStatusIntervalRef.current) {
      clearInterval(sceneStatusIntervalRef.current);
    }

    if (sceneStatusTimeoutRef.current) {
      clearTimeout(sceneStatusTimeoutRef.current);
    }

    let step = 0;
    const stepMs = sceneStatus.stepMs ?? SCENE_STATUS_STEP_MS;

    setSceneStatusIndex(0);
    setSceneStatusTextLength(0);
    setSceneStatusVisible(true);

    sceneStatusIntervalRef.current = setInterval(() => {
      step += 1;

      if (step < sceneStatus.actions.length) {
        setSceneStatusIndex(step);
        return;
      }

      clearInterval(sceneStatusIntervalRef.current);
      sceneStatusIntervalRef.current = null;

      if (sceneStatus.persist) return;

      sceneStatusTimeoutRef.current = setTimeout(() => {
        setSceneStatusVisible(false);
      }, SCENE_STATUS_HOLD_MS);
    }, stepMs);

    return () => {
      if (sceneStatusIntervalRef.current) {
        clearInterval(sceneStatusIntervalRef.current);
        sceneStatusIntervalRef.current = null;
      }

      if (sceneStatusTimeoutRef.current) {
        clearTimeout(sceneStatusTimeoutRef.current);
        sceneStatusTimeoutRef.current = null;
      }
    };
  }, [sceneStatus]);

  useEffect(() => {
    const action = sceneStatus?.actions?.[sceneStatusIndex];

    if (sceneStatusTypingIntervalRef.current) {
      clearInterval(sceneStatusTypingIntervalRef.current);
      sceneStatusTypingIntervalRef.current = null;
    }

    if (!action) {
      setSceneStatusTextLength(0);
      return undefined;
    }

    const stepMs = sceneStatus.stepMs ?? SCENE_STATUS_STEP_MS;
    const typeMs = Math.min(
      SCENE_STATUS_TYPE_MAX_MS,
      Math.max(
        SCENE_STATUS_TYPE_MIN_MS,
        Math.floor((stepMs * 0.58) / Math.max(action.length, 1))
      )
    );

    let characterCount = 0;
    setSceneStatusTextLength(0);

    sceneStatusTypingIntervalRef.current = setInterval(() => {
      characterCount += 1;
      setSceneStatusTextLength(characterCount);

      if (characterCount >= action.length) {
        clearInterval(sceneStatusTypingIntervalRef.current);
        sceneStatusTypingIntervalRef.current = null;
      }
    }, typeMs);

    return () => {
      if (sceneStatusTypingIntervalRef.current) {
        clearInterval(sceneStatusTypingIntervalRef.current);
        sceneStatusTypingIntervalRef.current = null;
      }
    };
  }, [sceneStatus, sceneStatusIndex]);

  useEffect(() => (
    () => {
      [
        frontTimeoutRef,
        sideTimeoutRef,
        frontCalloutTimeoutRef,
        sideCalloutTimeoutRef,
        systemTimeoutRef,
        sceneStatusTimeoutRef,
      ].forEach((timeoutRef) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      });

      if (sceneStatusIntervalRef.current) {
        clearInterval(sceneStatusIntervalRef.current);
      }

      if (sceneStatusTypingIntervalRef.current) {
        clearInterval(sceneStatusTypingIntervalRef.current);
      }

      [
        frontRaf1Ref,
        frontRaf2Ref,
        sideRaf1Ref,
        sideRaf2Ref,
        frontCalloutRaf1Ref,
        frontCalloutRaf2Ref,
        sideCalloutRaf1Ref,
        sideCalloutRaf2Ref,
      ].forEach((rafRef) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      });
    }
  ), []);

  return (
    <div
      className={[
        "house-scene",
        nightMode && "house-scene--night",
        armed ? "house-scene--armed" : "house-scene--disarmed",
      ].filter(Boolean).join(" ")}
    >
      <div className="house-scene__frame">
        <div className="house-container">
          {systemMessage && (
            <div
              key={systemMessageKey}
              className={[
                "system-status",
                armed ? "system-status--armed" : "system-status--disarmed",
              ].filter(Boolean).join(" ")}
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
              ].filter(Boolean).join(" ")}
            />

            <img
              src="/panel-disarmed.svg"
              alt=""
              className={[
                "security-panel-state",
                "security-panel-state--disarmed",
                !armed ? "is-visible" : "",
              ].filter(Boolean).join(" ")}
            />
          </div>

          {Array.from({ length: GARAGE_MAX_FRAME + 1 }, (_, i) => (
            <img
              key={i}
              src={`/garage-door-${i}.svg`}
              className={[
                "garage-door-frame-image",
                garageFrame === i ? "is-active" : "",
              ].filter(Boolean).join(" ")}
              alt=""
            />
          ))}

          {upstairsBedroomOn && (
            <img src="/light-bedroom-upstairs.svg" alt="" className="light-layer light-layer--master-bedroom" />
          )}

          {bedroomOn && (
            <img src="/light-bedroom2-upstairs.svg" alt="" className="light-layer light-layer--bedroom" />
          )}

          {livingRoomOn && (
            <img src="/light-living-downstairs.svg" alt="" className="light-layer light-layer--living-room" />
          )}

          {diningRoomOn && (
            <img src="/light-dining-downstairs.svg" alt="" className="light-layer light-layer--dining-room" />
          )}

          {garageLightsOn && (
            <img src="/garage-lights-outside.svg" alt="" className="light-layer light-layer--garage-lights" />
          )}

          {floodlightOn && (
            <img
              src="/light-floodlight.svg"
              alt=""
              className="light-layer light-layer--floodlight"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}

          {exteriorSideLightOn && (
            <img src="/side-light-outside.svg" alt="" className="light-layer light-layer--exterior-side-light" />
          )}

          {porchLightOn && (
            <img src="/porch-light-outside.svg" alt="" className="light-layer light-layer--porch-light" />
          )}

          {activeCamera === "doorbell" && (
            <CameraLiveMarker type="doorbell" label="Live Doorbell" />
          )}

          {activeCamera === "outdoor" && (
            <CameraLiveMarker type="outdoor" label="Outdoor Live" />
          )}

          {activeCamera === "floodlight" && (
            <CameraLiveMarker type="floodlight" label="Floodlight Live" />
          )}

          <DoorLockSource
            door="front"
            unlocked={frontDoorUnlocked}
            active={frontCallout.active}
          />

          <DoorLockSource
            door="side"
            unlocked={sideDoorUnlocked}
            active={sideCallout.active}
          />

          <DoorBadgeAnchor
            unlocked={frontDoorUnlocked}
            pulsing={frontPulse}
            className="door-front"
          />

          <DoorBadgeAnchor
            unlocked={sideDoorUnlocked}
            pulsing={sidePulse}
            className="door-side"
          />

          <SmartLockCallout
            door="front"
            unlocked={frontDoorUnlocked}
            active={frontCallout.active}
            actionKey={frontCallout.key}
            noAnimation={frontCallout.noAnimation}
            unlockedOverride={frontCallout.unlockedOverride}
          />

          <SmartLockCallout
            door="side"
            unlocked={sideDoorUnlocked}
            active={sideCallout.active}
            actionKey={sideCallout.key}
            noAnimation={sideCallout.noAnimation}
            unlockedOverride={sideCallout.unlockedOverride}
          />

          <ThermostatSceneDevice
            roomTemperature={thermostatRoomTemp}
            setTemperature={thermostatTemp}
          />

          {sceneStatus?.actions?.length > 0 && (
            <div
              key={sceneStatus.key}
              className={[
                "scene-status-hud",
                sceneStatusVisible ? "is-visible" : "",
              ].filter(Boolean).join(" ")}
              aria-live="polite"
            >
              <div className="scene-status-hud__title">{sceneStatus.title}</div>
              <div className="scene-status-hud__stack">
                {sceneStatus.actions
                  .slice(0, sceneStatusIndex + 1)
                  .reverse()
                  .map((action, displayIndex, visibleActions) => ({
                    action,
                    sourceIndex: visibleActions.length - 1 - displayIndex,
                    displayIndex,
                  }))
                  .map(({ action, sourceIndex, displayIndex }) => (
                    <div
                      key={`${sceneStatus.key}-${action}-${sourceIndex}`}
                      className={[
                        "scene-status-hud__line",
                        displayIndex === 0 ? "is-current" : "",
                      ].filter(Boolean).join(" ")}
                      style={{
                        "--scene-status-offset": `${displayIndex * 1.9}em`,
                        "--scene-status-z": sceneStatus.actions.length - displayIndex,
                      }}
                    >
                      <span className="scene-status-hud__prompt">&gt;</span>
                      <span className="scene-status-hud__text">
                        {displayIndex === 0
                          ? action.slice(0, Math.min(action.length, sceneStatusTextLength))
                          : action}
                      </span>
                      {displayIndex === 0 && <span className="scene-status-hud__cursor" />}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="house-overlay house-overlay--camera" />
        </div>
      </div>
    </div>
  );
}
