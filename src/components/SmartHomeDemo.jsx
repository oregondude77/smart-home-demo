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
const GARAGE_SCENARIO_DOOR_OPEN_MS = 1500;
const GARAGE_SCENARIO_FEED_STEP_MS = 1900;
const GARAGE_SCENARIO_CAR_START_MS = 4800;
const GARAGE_SCENARIO_LEFT_OPEN_MS = 9400;
const GARAGE_SCENARIO_NOTIFICATION_MS = 11800;
const KIDS_SCENARIO_FEED_STEP_MS = 1900;
const KIDS_SCENARIO_NOTIFICATION_MS = 3600;
const KIDS_SCENARIO_UNLOCK_DELAY_MS = 7600;
const KIDS_SCENARIO_COMPLETE_DELAY_MS = 11200;
const KIDS_SCENARIO_CLEANUP_DELAY_MS = 13000;
const PACKAGE_SCENARIO_FEED_STEP_MS = 1900;
const PACKAGE_SCENARIO_NOTIFICATION_MS = 3600;
const PACKAGE_SCENARIO_APPROACH_ANIMATION_MS = 5900;
const PACKAGE_SCENARIO_DROPOFF_ANIMATION_MS = 1450;
const PACKAGE_SCENARIO_LEAVE_ANIMATION_MS = 3350;
const PACKAGE_SCENARIO_POST_DROPOFF_BUFFER_MS = 120;
const PACKAGE_SCENARIO_COMPLETE_BUFFER_MS = 260;

const DEMO_EXPERIENCES = {
  home: {
    pill: "Interactive Smart Home Demo",
    title: "Smarter Security. Real-Time Control.",
    description:
      "See how Alert 360 connects security, cameras, lights, locks, garage doors, and monitoring into one seamless smart home experience.",
    meta: "24/7 Monitoring • Smart Automation • Live Video",
  },
  business: {
    pill: "Interactive Smart Business Demo",
    title: "Smarter Business. Real-Time Control.",
    description:
      "See how Alert 360 connects intrusion, video, access, automation, and monitoring into one streamlined small business security experience.",
    meta: "Business Security • Video Verification • Access Control",
  },
};

export default function SmartHomeDemo() {
  const [demoExperience, setDemoExperience] = useState("home");
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
  const [storefrontLightsOn, setStorefrontLightsOn] = useState(false);
  const [cafeLightsOn, setCafeLightsOn] = useState(false);
  const [shopLightsOn, setShopLightsOn] = useState(false);
  const [entranceLightsOn, setEntranceLightsOn] = useState(false);

  const [frontDoorUnlocked, setFrontDoorUnlocked] = useState(true);
  const [sideDoorUnlocked, setSideDoorUnlocked] = useState(true);
  const [thermostatTemp, setThermostatTemp] = useState(70);
  const [sceneStatus, setSceneStatus] = useState(null);
  const [doorAction, setDoorAction] = useState(null);
  const [accessControlAction, setAccessControlAction] = useState(null);
  const [systemAction, setSystemAction] = useState(null);
  const [scenarioAction, setScenarioAction] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);
  const [scenarioPhoneMode, setScenarioPhoneMode] = useState(false);
  const [phoneNotification, setPhoneNotification] = useState(null);
  const [feedEnabled, setFeedEnabled] = useState(true);
  const [a360Open, setA360Open] = useState(true);
  const [a360TourActive, setA360TourActive] = useState(false);
  const [a360StepIndex, setA360StepIndex] = useState(0);
  const [phoneTourFocus, setPhoneTourFocus] = useState(null);
  const [quietResetKey, setQuietResetKey] = useState(0);
  const a360FeedKeyRef = useRef(0);
  const doorActionKeyRef = useRef(0);
  const a360ActionTimeoutsRef = useRef([]);
  const scenarioTimeoutsRef = useRef([]);

  const [nightMode, setNightMode] = useState(false);

  /* FULL SCREEN PHONE CAMERA */
  const [activeCamera, setActiveCamera] = useState(null);

  /* HOUSE LIVE CAMERA MARKER */
  const [liveCamera, setLiveCamera] = useState(null);

  const clearA360ActionTimeouts = () => {
    a360ActionTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    a360ActionTimeoutsRef.current = [];
  };

  const clearScenarioTimeouts = () => {
    scenarioTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    scenarioTimeoutsRef.current = [];
  };

  const getNotificationTime = () =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
      .format(new Date())
      .replace(/\s?(AM|PM)$/i, (period) => ` ${period.trim().toLowerCase()}`);

  const pushA360Feed = (
    actions,
    stepMs = A360_FEED_STEP_MS,
    title = "Smart Home Security Tour"
  ) => {
    const feedActions = Array.isArray(actions) ? actions : [actions];

    if (!feedEnabled || !feedActions.length || !feedActions[0]) return;

    a360FeedKeyRef.current += 1;

    setSceneStatus({
      title,
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
    setStorefrontLightsOn(false);
    setCafeLightsOn(false);
    setShopLightsOn(false);
    setEntranceLightsOn(false);
    setFrontDoorUnlocked(true);
    setSideDoorUnlocked(true);
    setThermostatTemp(70);
    setActiveCamera(null);
    setLiveCamera(null);
    setPhoneTourFocus(null);
    setSceneStatus(null);
    setDoorAction(null);
    setAccessControlAction(null);
    setSystemAction(null);
    setScenarioAction(null);
    setActiveScenario(null);
    setScenarioPhoneMode(false);
    setPhoneNotification(null);
    clearScenarioTimeouts();
  };

  const runScenario = (scenarioId) => {
    clearScenarioTimeouts();
    setActiveScenario(null);
    setScenarioAction(null);
    setScenarioPhoneMode(false);
    setPhoneNotification(null);

    if (scenarioId === "garage-left-open") {
      setActiveCamera(null);
      setLiveCamera(null);
      setGarageOpen(false);
      setScenarioPhoneMode(true);
      setA360Open(false);

      if (feedEnabled) {
        setSceneStatus({
          title: "Garage Door Alert",
          actions: [
            "Running scenario: Garage Left Open",
            "Opening garage door",
            "Vehicle leaving driveway",
          ],
          stepMs: GARAGE_SCENARIO_FEED_STEP_MS,
          persist: false,
          key: `scenario-garage-${Date.now()}`,
        });
      }

      scenarioTimeoutsRef.current.push(
        window.setTimeout(() => {
          setGarageOpen(true);
        }, GARAGE_SCENARIO_DOOR_OPEN_MS),
        window.setTimeout(() => {
          setActiveScenario("garage-left-open");
          setScenarioAction({
            type: "garage-left-open",
            key: `garage-left-open-${Date.now()}`,
          });
        }, GARAGE_SCENARIO_CAR_START_MS),
        window.setTimeout(() => {
          pushA360Feed(
            ["Garage door left open", "Sending Alert 360 notification"],
            GARAGE_SCENARIO_FEED_STEP_MS,
            "Garage Door Alert"
          );
        }, GARAGE_SCENARIO_LEFT_OPEN_MS),
        window.setTimeout(() => {
          setPhoneNotification({
            key: `garage-alert-${Date.now()}`,
            app: "ALERT 360",
            message: `Home: The Garage Door was left open at ${getNotificationTime()}.`,
            type: "garage-left-open",
          });
          pushA360Feed(
            "Tap the notification to open the app",
            A360_FEED_STEP_MS,
            "Garage Door Alert"
          );
        }, GARAGE_SCENARIO_NOTIFICATION_MS)
      );

      return;
    }

    if (scenarioId === "kids-arrived-home") {
      setActiveCamera(null);
      setLiveCamera(null);
      setScenarioPhoneMode(true);
      setA360Open(false);

      if (feedEnabled) {
        setSceneStatus({
          title: "Kids Arriving Home",
          actions: [
            "Running scenario: Kids Arriving Home",
            "Doorbell camera detected a person",
            "Sending Alert 360 notification",
          ],
          stepMs: KIDS_SCENARIO_FEED_STEP_MS,
          persist: false,
          key: `scenario-kids-${Date.now()}`,
        });
      }

      scenarioTimeoutsRef.current.push(
        window.setTimeout(() => {
          setActiveScenario("kids-arrived-home");
          setScenarioAction({
            type: "kids-arrived-home",
            phase: "approach",
            key: `kids-arrived-home-${Date.now()}`,
          });
        }, KIDS_SCENARIO_FEED_STEP_MS),
        window.setTimeout(() => {
          setPhoneNotification({
            key: `kids-alert-${Date.now()}`,
            app: "ALERT 360",
            message: `Home: Doorbell Camera detected a person at ${getNotificationTime()}.`,
            actionLabel: "Tap to View Doorbell",
            type: "kids-arrived-home",
          });
          pushA360Feed(
            "Tap the notification to view the doorbell camera",
            A360_FEED_STEP_MS,
            "Kids Arriving Home"
          );
        }, KIDS_SCENARIO_NOTIFICATION_MS)
      );

      return;
    }

    if (scenarioId === "package-delivered") {
      setActiveCamera(null);
      setLiveCamera(null);
      setScenarioPhoneMode(true);
      setA360Open(false);

      const approachDelayMs = PACKAGE_SCENARIO_FEED_STEP_MS;
      const dropoffDelayMs =
        approachDelayMs + PACKAGE_SCENARIO_APPROACH_ANIMATION_MS;
      const boxDelayMs = dropoffDelayMs + PACKAGE_SCENARIO_DROPOFF_ANIMATION_MS;
      const leaveDelayMs = boxDelayMs + PACKAGE_SCENARIO_POST_DROPOFF_BUFFER_MS;
      const completeDelayMs =
        leaveDelayMs +
        PACKAGE_SCENARIO_LEAVE_ANIMATION_MS +
        PACKAGE_SCENARIO_COMPLETE_BUFFER_MS;

      if (feedEnabled) {
        setSceneStatus({
          title: "Package Delivered",
          actions: [
            "Running scenario: Package Delivered",
            "Doorbell camera detected a delivery",
            "Sending Alert 360 notification",
          ],
          stepMs: PACKAGE_SCENARIO_FEED_STEP_MS,
          persist: false,
          key: `scenario-package-${Date.now()}`,
        });
      }

      scenarioTimeoutsRef.current.push(
        window.setTimeout(() => {
          setActiveScenario("package-delivered");
          setScenarioAction({
            type: "package-delivered",
            phase: "approach",
            key: `package-delivered-${Date.now()}`,
          });
        }, approachDelayMs),
        window.setTimeout(() => {
          setPhoneNotification({
            key: `package-alert-${Date.now()}`,
            app: "ALERT 360",
            message: `Home: Doorbell Camera detected a package delivery at ${getNotificationTime()}.`,
            actionLabel: "Tap to View Doorbell",
            type: "package-delivered",
          });
          pushA360Feed(
            "Tap the notification to view the delivery",
            A360_FEED_STEP_MS,
            "Package Delivered"
          );
        }, PACKAGE_SCENARIO_NOTIFICATION_MS),
        window.setTimeout(() => {
          setScenarioAction({
            type: "package-delivered",
            phase: "dropoff",
            key: `package-delivered-dropoff-${Date.now()}`,
          });
          pushA360Feed(
            "Package delivered at the front door",
            A360_FEED_STEP_MS,
            "Package Delivered"
          );
        }, dropoffDelayMs),
        window.setTimeout(() => {
          setScenarioAction({
            type: "package-delivered",
            phase: "box",
            key: `package-delivered-box-${Date.now()}`,
          });
        }, boxDelayMs),
        window.setTimeout(() => {
          setScenarioAction({
            type: "package-delivered",
            phase: "leaving",
            key: `package-delivered-leaving-${Date.now()}`,
          });
          pushA360Feed("Delivery clip saved", A360_FEED_STEP_MS, "Package Delivered");
        }, leaveDelayMs),
        window.setTimeout(() => {
          setScenarioAction({
            type: "package-delivered",
            phase: "complete",
            key: `package-delivered-complete-${Date.now()}`,
          });
          pushA360Feed("Scenario complete", A360_FEED_STEP_MS, "Package Delivered");
        }, completeDelayMs),
        window.setTimeout(() => {
          setActiveScenario(null);
          setScenarioAction(null);
        }, completeDelayMs + A360_FEED_STEP_MS)
      );
    }
  };

  const handlePhoneNotificationAction = () => {
    if (phoneNotification?.type === "garage-left-open") {
      setPhoneNotification(null);
      setScenarioPhoneMode(false);
      setPhoneTourFocus({ section: "garage", key: Date.now() });
      pushA360Feed("Close the garage door", A360_FEED_STEP_MS, "Garage Door Alert");
      return;
    }

    if (phoneNotification?.type === "kids-arrived-home") {
      setPhoneNotification(null);
      setScenarioPhoneMode(false);
      setActiveCamera("doorbell-kids-arrival");
      setLiveCamera("doorbell");
      pushA360Feed(
        [
          "Opening doorbell camera feed",
          "Kids approaching front door",
        ],
        A360_FEED_STEP_MS,
        "Kids Arriving Home"
      );
      scenarioTimeoutsRef.current.push(
        window.setTimeout(() => {
          setScenarioAction({
            type: "kids-arrived-home",
            phase: "entering",
            key: `kids-entering-${Date.now()}`,
          });
          pushA360Feed(
            [
              "Unlocking front door by user code",
              "Kids arriving home",
            ],
            A360_FEED_STEP_MS,
            "Kids Arriving Home"
          );
          doorActionKeyRef.current += 1;
          setFrontDoorUnlocked(true);
          setDoorAction({
            door: "front",
            unlocked: true,
            suppressStateFeedback: true,
            key: `kids-door-${Date.now()}-${doorActionKeyRef.current}`,
          });
        }, KIDS_SCENARIO_UNLOCK_DELAY_MS),
        window.setTimeout(() => {
          pushA360Feed("Scenario complete", A360_FEED_STEP_MS, "Kids Arriving Home");
        }, KIDS_SCENARIO_COMPLETE_DELAY_MS),
        window.setTimeout(() => {
          setActiveScenario(null);
          setScenarioAction(null);
        }, KIDS_SCENARIO_CLEANUP_DELAY_MS)
      );

      return;
    }

    if (phoneNotification?.type === "package-delivered") {
      setPhoneNotification(null);
      setScenarioPhoneMode(false);
      setActiveCamera("doorbell-package-delivery");
      setLiveCamera("doorbell");
      pushA360Feed(
        [
          "Opening doorbell camera feed",
          "Viewing package delivery clip",
        ],
        A360_FEED_STEP_MS,
        "Package Delivered"
      );
    }
  };

  const handleGarageScenarioResolved = () => {
    if (activeScenario !== "garage-left-open") return;

    clearScenarioTimeouts();
    setScenarioAction(null);
    setScenarioPhoneMode(false);
    setPhoneNotification(null);
    scenarioTimeoutsRef.current.push(
      window.setTimeout(() => {
        pushA360Feed("Scenario complete", A360_FEED_STEP_MS, "Garage Door Alert");
      }, 1200)
    );
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

  useEffect(() => () => {
    clearA360ActionTimeouts();
    clearScenarioTimeouts();
  }, []);

  const currentA360Step = a360TourSteps[a360StepIndex];
  const currentA360StepDuration =
    (currentA360Step?.durationMs ?? A360_AUTO_STEP_MS) + A360_STEP_PAUSE_MS;
  const activeExperience = DEMO_EXPERIENCES[demoExperience];

  return (
  <div className={`demo demo--${demoExperience} ${nightMode ? "is-night" : ""}`}>
    <div className="demo-hero-copy">
      <img
        className="demo-hero-logo"
        src="/alert-360-logo.svg"
        alt="Alert 360"
      />

      <div className="demo-hero-kicker">
        <div className="demo-hero-pill">
          <span></span>
          {activeExperience.pill}
        </div>
      </div>

      <h1>{activeExperience.title}</h1>

      <p>{activeExperience.description}</p>

      <div className="demo-hero-actions">
        <a href="https://www.alert360.com/home-security-package-specials">
          Explore Protection
        </a>
        <span>{activeExperience.meta}</span>
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
          storefrontLightsOn={storefrontLightsOn}
          setStorefrontLightsOn={setStorefrontLightsOn}
          cafeLightsOn={cafeLightsOn}
          setCafeLightsOn={setCafeLightsOn}
          shopLightsOn={shopLightsOn}
          setShopLightsOn={setShopLightsOn}
          entranceLightsOn={entranceLightsOn}
          setEntranceLightsOn={setEntranceLightsOn}
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
          setAccessControlAction={setAccessControlAction}
          tourFocus={phoneTourFocus}
          onRunScenario={runScenario}
          phoneNotification={phoneNotification}
          scenarioPhoneMode={scenarioPhoneMode}
          onPhoneNotificationAction={handlePhoneNotificationAction}
          onGarageScenarioResolved={handleGarageScenarioResolved}
          demoExperience={demoExperience}
          onDemoExperienceToggle={() => {
            setDemoExperience((current) => current === "home" ? "business" : "home");
          }}
        />

        <HouseScene
          demoExperience={demoExperience}
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
          storefrontLightsOn={storefrontLightsOn}
          cafeLightsOn={cafeLightsOn}
          shopLightsOn={shopLightsOn}
          entranceLightsOn={entranceLightsOn}
          frontDoorUnlocked={frontDoorUnlocked}
          sideDoorUnlocked={sideDoorUnlocked}
          thermostatTemp={thermostatTemp}
          thermostatRoomTemp={THERMOSTAT_ROOM_TEMP}
          nightMode={nightMode}

          /* IMPORTANT */
          activeCamera={liveCamera}
          doorAction={doorAction}
          accessControlAction={accessControlAction}
          systemAction={systemAction}
          scenarioAction={scenarioAction}
          activeScenario={activeScenario}
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
                    : `Hi, I'm A-360, your smart ${demoExperience === "business" ? "business" : "home"} security virtual assistant. Want a quick tour?`}
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
