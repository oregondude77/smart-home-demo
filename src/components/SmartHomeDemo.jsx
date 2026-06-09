"use client";

import { useEffect, useRef, useState } from "react";
import HouseScene from "./HouseScene";
import PhonePanel from "./PhonePanel";

const THERMOSTAT_ROOM_TEMP = 72;
const A360_FEED_STEP_MS = 2200;
const A360_AUTO_STEP_MS = 5600;
const A360_STEP_PAUSE_MS = 900;
const A360_HOME_AUTOMATION_DURATION_MS = (A360_FEED_STEP_MS * 3) + 2200;
const A360_SECURITY_SCAN_STEP_MS = 3000;
const A360_AWAY_STEP_MS = 2600;
const A360_AWAY_AUTO_ADVANCE_BUFFER_MS = 450;
const A360_AWAY_FEED_ACTIONS = [
  "Running Away Scene",
  "Arming security system",
  "Locking doors",
  "Turning on porch light",
  "Turning on side light",
  "Turning on garage lights",
  "Turning off interior lighting",
  "Setting thermostat to 72°",
];
const A360_AWAY_DURATION_MS =
  ((A360_AWAY_FEED_ACTIONS.length - 1) * A360_AWAY_STEP_MS) +
  Math.round(A360_AWAY_STEP_MS * 0.62) +
  A360_AWAY_AUTO_ADVANCE_BUFFER_MS;

export default function SmartHomeDemo() {
  const [garageOpen, setGarageOpen] = useState(false);
  const [armed, setArmed] = useState(false);

  const [upstairsBedroomOn, setUpstairsBedroomOn] = useState(false);
  const [bedroomOn, setBedroomOn] = useState(false);
  const [livingRoomOn, setLivingRoomOn] = useState(false);
  const [diningRoomOn, setDiningRoomOn] = useState(false);

  const [garageLightsOn, setGarageLightsOn] = useState(false);
  const [floodlightOn, setFloodlightOn] = useState(false);
  const [exteriorSideLightOn, setExteriorSideLightOn] = useState(false);
  const [porchLightOn, setPorchLightOn] = useState(false);

  const [frontDoorUnlocked, setFrontDoorUnlocked] = useState(true);
  const [sideDoorUnlocked, setSideDoorUnlocked] = useState(true);
  const [thermostatTemp, setThermostatTemp] = useState(70);
  const [sceneStatus, setSceneStatus] = useState(null);
  const [doorAction, setDoorAction] = useState(null);
  const [systemAction, setSystemAction] = useState(null);
  const [feedEnabled, setFeedEnabled] = useState(true);
  const [a360Open, setA360Open] = useState(true);
  const [a360TourActive, setA360TourActive] = useState(false);
  const [a360StepIndex, setA360StepIndex] = useState(0);
  const [phoneTourFocus, setPhoneTourFocus] = useState(null);
  const [quietResetKey, setQuietResetKey] = useState(0);
  const a360FeedKeyRef = useRef(0);
  const doorActionKeyRef = useRef(0);
  const a360ActionTimeoutsRef = useRef([]);

  const [nightMode, setNightMode] = useState(false);

  /* FULL SCREEN PHONE CAMERA */
  const [activeCamera, setActiveCamera] = useState(null);

  /* HOUSE LIVE CAMERA MARKER */
  const [liveCamera, setLiveCamera] = useState(null);

  const clearA360ActionTimeouts = () => {
    a360ActionTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    a360ActionTimeoutsRef.current = [];
  };

  const pushA360Feed = (actions, stepMs = A360_FEED_STEP_MS) => {
    const feedActions = Array.isArray(actions) ? actions : [actions];

    if (!feedEnabled || !feedActions.length || !feedActions[0]) return;

    a360FeedKeyRef.current += 1;

    setSceneStatus({
      title: "Smart Home Security Tour",
      actions: feedActions,
      stepMs,
      persist: true,
      key: `a360-${Date.now()}-${a360FeedKeyRef.current}`,
    });
  };

  const scheduleA360Actions = (actions, stepMs, startIndex = 0) => {
    a360ActionTimeoutsRef.current = actions.map((action, index) =>
      window.setTimeout(action.run, ((index + startIndex) * stepMs) + Math.round(stepMs * 0.62))
    );
  };

  const resetDemoState = ({ quiet = false } = {}) => {
    if (quiet) {
      setQuietResetKey((key) => key + 1);
    }

    setGarageOpen(false);
    setArmed(false);
    setUpstairsBedroomOn(false);
    setBedroomOn(false);
    setLivingRoomOn(false);
    setDiningRoomOn(false);
    setGarageLightsOn(false);
    setFloodlightOn(false);
    setExteriorSideLightOn(false);
    setPorchLightOn(false);
    setFrontDoorUnlocked(true);
    setSideDoorUnlocked(true);
    setThermostatTemp(70);
    setActiveCamera(null);
    setLiveCamera(null);
    setPhoneTourFocus(null);
    setSceneStatus(null);
    setDoorAction(null);
    setSystemAction(null);
  };

  const setTourDoorState = (door, unlocked) => {
    doorActionKeyRef.current += 1;

    if (door === "both") {
      setFrontDoorUnlocked(unlocked);
      setSideDoorUnlocked(unlocked);
    } else if (door === "front") {
      setFrontDoorUnlocked(unlocked);
    } else {
      setSideDoorUnlocked(unlocked);
    }

    setDoorAction({
      door,
      unlocked,
      suppressStateFeedback: true,
      key: `tour-door-${Date.now()}-${doorActionKeyRef.current}`,
    });
  };

  const closeAndResetA360Tour = () => {
    clearA360ActionTimeouts();
    setA360Open(false);
    setA360TourActive(false);
    setA360StepIndex(0);
    resetDemoState({ quiet: true });
  };

  const a360TourSteps = [
    {
      message: "Your security status stays visible at a glance, so you always know whether the system is armed, disarmed, or ready for action.",
      feed: [
        "Checking security system status",
        "System disarmed",
      ],
      feedStepMs: A360_SECURITY_SCAN_STEP_MS,
      run: () => {
        setActiveCamera(null);
        setLiveCamera(null);
        a360ActionTimeoutsRef.current.push(
          window.setTimeout(() => {
            setArmed(false);
            setSystemAction({
              armed: false,
              key: Date.now(),
            });
          }, A360_SECURITY_SCAN_STEP_MS)
        );
      },
    },
    {
      message: "Smart locks give you direct control of each entry point, with clear status for the exact door you are managing.",
      feed: [
        "Reviewing front door lock",
        "Front door unlocked",
      ],
      run: () => {
        setFrontDoorUnlocked(true);
        setDoorAction({
          door: "front",
          unlocked: true,
          noAnimation: true,
          suppressStateFeedback: true,
          key: Date.now(),
        });
      },
    },
    {
      message: "Live video brings your cameras into the same app, so you can see what is happening before deciding what to do next.",
      feed: "Viewing doorbell camera feed",
      run: () => {
        setActiveCamera("doorbell");
        setLiveCamera("doorbell");
      },
    },
    {
      message: "Home automation can coordinate lighting and climate together, so the environment adjusts to the moment without managing each device one at a time.",
      feed: [
        "Running home automation sequence",
        "Setting thermostat to 68°",
        "Turning on living room light",
      ],
      durationMs: A360_HOME_AUTOMATION_DURATION_MS,
      run: () => {
        setActiveCamera(null);
        setLiveCamera(null);
        setPhoneTourFocus({ section: "automation", key: Date.now() });
        a360ActionTimeoutsRef.current.push(
          window.setTimeout(() => {
            setThermostatTemp(68);
          }, A360_FEED_STEP_MS),
          window.setTimeout(() => {
            setLivingRoomOn(true);
          }, A360_FEED_STEP_MS * 2)
        );
      },
    },
    {
      message: "Now I’ll run Away Scene, a one-tap routine that prepares the home by coordinating security, locks, lights, and temperature.",
      feed: A360_AWAY_FEED_ACTIONS,
      feedStepMs: A360_AWAY_STEP_MS,
      durationMs: A360_AWAY_DURATION_MS,
      run: () => {
        scheduleA360Actions([
          { run: () => setArmed(true) },
          { run: () => setTourDoorState("both", false) },
          { run: () => setPorchLightOn(true) },
          { run: () => setExteriorSideLightOn(true) },
          { run: () => setGarageLightsOn(true) },
          {
            run: () => {
              setUpstairsBedroomOn(false);
              setBedroomOn(false);
              setLivingRoomOn(false);
              setDiningRoomOn(false);
            },
          },
          { run: () => setThermostatTemp(72) },
        ], A360_AWAY_STEP_MS, 1);
      },
    },
    {
      message: "Tour complete. You can keep exploring the smart home at your own pace.",
      feed: "Guided tour complete",
      run: () => {},
    },
  ];

  const runA360Step = (stepIndex) => {
    const step = a360TourSteps[stepIndex];

    if (!step) return;

    clearA360ActionTimeouts();
    setA360StepIndex(stepIndex);
    step.run();
    pushA360Feed(step.feed, step.feedStepMs);
  };

  const startA360Tour = () => {
    setA360Open(true);
    setA360TourActive(true);
    runA360Step(0);
  };

  const finishA360Tour = () => {
    closeAndResetA360Tour();
  };

  const advanceA360Tour = () => {
    const nextStepIndex = a360StepIndex + 1;

    if (nextStepIndex >= a360TourSteps.length) {
      finishA360Tour();
      return;
    }

    runA360Step(nextStepIndex);
  };

  const closeA360Guide = () => {
    closeAndResetA360Tour();
  };

  useEffect(() => {
    if (!a360TourActive) return undefined;
    if (a360StepIndex >= a360TourSteps.length - 1) return undefined;

    const timeoutId = window.setTimeout(() => {
      const nextStepIndex = a360StepIndex + 1;

      if (nextStepIndex >= a360TourSteps.length) {
        finishA360Tour();
        return;
      }

      runA360Step(nextStepIndex);
    }, (currentA360Step?.durationMs ?? A360_AUTO_STEP_MS) + A360_STEP_PAUSE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [a360TourActive, a360StepIndex]);

  useEffect(() => () => clearA360ActionTimeouts(), []);

  const currentA360Step = a360TourSteps[a360StepIndex];
  const currentA360StepDuration =
    (currentA360Step?.durationMs ?? A360_AUTO_STEP_MS) + A360_STEP_PAUSE_MS;

  return (
  <div className={`demo ${nightMode ? "is-night" : ""}`}>
    <div className="demo-hero-copy">
  <img
    className="demo-hero-logo"
    src="/alert-360-logo.svg"
    alt="Alert 360"
  />

  <div className="demo-hero-pill">
    <span></span>
    Interactive Smart Home Demo
  </div>

  <h1>Smarter Security. Real-Time Control.</h1>

  <p>
    See how Alert 360 connects security, cameras, lights, locks, garage doors,
    and monitoring into one seamless smart home experience.
  </p>

  <div className="demo-hero-actions">
    <a href="https://www.alert360.com/home-security-package-specials">
      Explore Protection
    </a>
    <span>24/7 Monitoring • Smart Automation • Live Video</span>
  </div>
</div>
      <div className="demo-grid">
        <PhonePanel
          garageOpen={garageOpen}
          setGarageOpen={setGarageOpen}
          armed={armed}
          setArmed={setArmed}
          upstairsBedroomOn={upstairsBedroomOn}
          setUpstairsBedroomOn={setUpstairsBedroomOn}
          bedroomOn={bedroomOn}
          setBedroomOn={setBedroomOn}
          livingRoomOn={livingRoomOn}
          setLivingRoomOn={setLivingRoomOn}
          diningRoomOn={diningRoomOn}
          setDiningRoomOn={setDiningRoomOn}
          garageLightsOn={garageLightsOn}
          setGarageLightsOn={setGarageLightsOn}
          floodlightOn={floodlightOn}
          setFloodlightOn={setFloodlightOn}
          exteriorSideLightOn={exteriorSideLightOn}
          setExteriorSideLightOn={setExteriorSideLightOn}
          porchLightOn={porchLightOn}
          setPorchLightOn={setPorchLightOn}
          frontDoorUnlocked={frontDoorUnlocked}
          setFrontDoorUnlocked={setFrontDoorUnlocked}
          sideDoorUnlocked={sideDoorUnlocked}
          setSideDoorUnlocked={setSideDoorUnlocked}
          thermostatTemp={thermostatTemp}
          thermostatRoomTemp={THERMOSTAT_ROOM_TEMP}
          setThermostatTemp={setThermostatTemp}
          nightMode={nightMode}
          setNightMode={setNightMode}
          feedEnabled={feedEnabled}
          setFeedEnabled={setFeedEnabled}
          activeCamera={activeCamera}
          setActiveCamera={setActiveCamera}
          liveCamera={liveCamera}
          setLiveCamera={setLiveCamera}
          setSceneStatus={setSceneStatus}
          setDoorAction={setDoorAction}
          tourFocus={phoneTourFocus}
        />

        <HouseScene
          garageOpen={garageOpen}
          armed={armed}
          upstairsBedroomOn={upstairsBedroomOn}
          bedroomOn={bedroomOn}
          livingRoomOn={livingRoomOn}
          diningRoomOn={diningRoomOn}
          garageLightsOn={garageLightsOn}
          floodlightOn={floodlightOn}
          exteriorSideLightOn={exteriorSideLightOn}
          porchLightOn={porchLightOn}
          frontDoorUnlocked={frontDoorUnlocked}
          sideDoorUnlocked={sideDoorUnlocked}
          thermostatTemp={thermostatTemp}
          thermostatRoomTemp={THERMOSTAT_ROOM_TEMP}
          nightMode={nightMode}

          /* IMPORTANT */
          activeCamera={liveCamera}
          doorAction={doorAction}
          systemAction={systemAction}
          sceneStatus={sceneStatus}
          quietResetKey={quietResetKey}
        />
      </div>
      <div className={["a360-guide", a360Open ? "is-open" : "is-collapsed"].join(" ")}>
        {a360Open ? (
          <div className="a360-guide__panel" role="dialog" aria-label="A-360 guided tour">
            <div className="a360-guide__bubble">
              <button
                type="button"
                className="a360-guide__close"
                onClick={closeA360Guide}
                aria-label="Hide A-360 concierge"
              >
                x
              </button>
              <div className="a360-guide__content">
                <div className="a360-guide__eyebrow">A-360 Concierge</div>
                <p>
                  {a360TourActive
                    ? currentA360Step.message
                    : "Hi, I'm A-360, your smart home security virtual assistant. Want a quick tour?"}
                </p>
                {a360TourActive && (
                  <div
                    className="a360-guide__progress"
                    style={{ "--a360-step-duration": `${currentA360StepDuration}ms` }}
                  >
                    {a360TourSteps.map((step, index) => (
                      <button
                        type="button"
                        key={step.message}
                        onClick={() => runA360Step(index)}
                        aria-label={`Go to tour step ${index + 1}`}
                        className={[
                          index < a360StepIndex && "is-active",
                          index === a360StepIndex && "is-active is-current",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                    ))}
                  </div>
                )}
                <div className="a360-guide__actions">
                  {a360TourActive ? (
                    <>
                      <button type="button" className="a360-guide__button" onClick={advanceA360Tour}>
                        {a360StepIndex >= a360TourSteps.length - 1 ? "Done" : "Next"}
                      </button>
                      <button type="button" className="a360-guide__button a360-guide__button--ghost" onClick={closeA360Guide}>
                        Hide
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="a360-guide__button" onClick={startA360Tour}>
                        Start Tour
                      </button>
                      <button type="button" className="a360-guide__button a360-guide__button--ghost" onClick={closeA360Guide}>
                        Hide
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="a360-guide__avatar-wrap" aria-hidden="true">
              <img className="a360-guide__avatar" src="/a360-avatar.png" alt="" />
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="a360-guide__launcher"
            onClick={() => setA360Open(true)}
            aria-label="Open A-360 concierge"
          >
            <span className="a360-guide__launcher-orb" aria-hidden="true">
              <img src="/a360-avatar.png" alt="" />
            </span>
            <span>Start Tour</span>
          </button>
        )}
      </div>
    </div>
  );
}
