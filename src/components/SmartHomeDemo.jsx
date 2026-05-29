"use client";

import { useRef, useState } from "react";
import HouseScene from "./HouseScene";
import PhonePanel from "./PhonePanel";

const THERMOSTAT_ROOM_TEMP = 72;
const A360_FEED_STEP_MS = 1800;

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

  const [frontDoorUnlocked, setFrontDoorUnlocked] = useState(false);
  const [sideDoorUnlocked, setSideDoorUnlocked] = useState(false);
  const [thermostatTemp, setThermostatTemp] = useState(70);
  const [sceneStatus, setSceneStatus] = useState(null);
  const [feedEnabled, setFeedEnabled] = useState(true);
  const [a360Open, setA360Open] = useState(true);
  const [a360TourActive, setA360TourActive] = useState(false);
  const [a360StepIndex, setA360StepIndex] = useState(0);
  const a360FeedKeyRef = useRef(0);

  const [nightMode, setNightMode] = useState(false);

  /* FULL SCREEN PHONE CAMERA */
  const [activeCamera, setActiveCamera] = useState(null);

  /* HOUSE LIVE CAMERA MARKER */
  const [liveCamera, setLiveCamera] = useState(null);

  const pushA360Feed = (action) => {
    if (!feedEnabled || !action) return;

    a360FeedKeyRef.current += 1;

    setSceneStatus({
      title: "A-360",
      actions: [action],
      stepMs: A360_FEED_STEP_MS,
      key: `a360-${Date.now()}-${a360FeedKeyRef.current}`,
    });
  };

  const a360TourSteps = [
    {
      message: "Hi, I'm A-360. I can walk you through how the smart home responds in real time.",
      feed: "Starting guided tour",
      run: () => {
        setActiveCamera(null);
        setLiveCamera(null);
      },
    },
    {
      message: "First, the security panel updates immediately as the system arms or disarms.",
      feed: "Disarming security system",
      run: () => setArmed(false),
    },
    {
      message: "Door locks can be controlled from the phone while the house gives visual feedback.",
      feed: "Unlocking front door",
      run: () => setFrontDoorUnlocked(true),
    },
    {
      message: "Live cameras can open from the video card and mark the active view on the scene.",
      feed: "Viewing Doorbell camera feed",
      run: () => {
        setActiveCamera("doorbell");
        setLiveCamera("doorbell");
      },
    },
    {
      message: "Comfort controls can combine lights and climate into one smooth home state.",
      feed: "Setting comfort scene",
      run: () => {
        setLivingRoomOn(true);
        setPorchLightOn(true);
        setThermostatTemp(68);
      },
    },
    {
      message: "Scenes let the whole system shift together, like preparing the house for away mode.",
      feed: "Preparing away scene",
      run: () => {
        setArmed(true);
        setFrontDoorUnlocked(false);
        setPorchLightOn(true);
        setExteriorSideLightOn(true);
        setGarageLightsOn(true);
        setThermostatTemp(72);
      },
    },
    {
      message: "That's the core flow. You can keep exploring, or bring me back any time.",
      feed: "Guided tour complete",
      run: () => {},
    },
  ];

  const runA360Step = (stepIndex) => {
    const step = a360TourSteps[stepIndex];

    if (!step) return;

    setA360StepIndex(stepIndex);
    step.run();
    pushA360Feed(step.feed);
  };

  const startA360Tour = () => {
    setA360Open(true);
    setA360TourActive(true);
    runA360Step(0);
  };

  const advanceA360Tour = () => {
    const nextStepIndex = a360StepIndex + 1;

    if (nextStepIndex >= a360TourSteps.length) {
      setA360TourActive(false);
      setA360StepIndex(0);
      return;
    }

    runA360Step(nextStepIndex);
  };

  const closeA360Guide = () => {
    setA360Open(false);
    setA360TourActive(false);
    setA360StepIndex(0);
  };

  const currentA360Step = a360TourSteps[a360StepIndex];

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
    <button type="button">Explore Protection</button>
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
          sceneStatus={sceneStatus}
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
                <p>{a360TourActive ? currentA360Step.message : "Want a quick guided tour of the smart home system?"}</p>
                {a360TourActive && (
                  <div className="a360-guide__progress">
                    {a360TourSteps.map((step, index) => (
                      <span
                        key={step.message}
                        className={index <= a360StepIndex ? "is-active" : ""}
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
            <img src="/a360-avatar.png" alt="" />
            <span>A-360</span>
          </button>
        )}
      </div>
    </div>
  );
}
