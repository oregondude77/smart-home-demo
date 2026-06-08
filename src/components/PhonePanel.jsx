"use client";

import { useEffect, useRef, useState } from "react";

const OUTDOOR_NIGHT_VIDEO_SRC = "/outdoor-camera-night.mp4";
const THERMOSTAT_MIN_TEMP = 60;
const THERMOSTAT_MAX_TEMP = 82;
const SCENE_ACTION_STEP_MS = 1550;
const MANUAL_ACTION_STEP_MS = 1450;
const SCENE_STATUS_TYPE_MIN_MS = 18;
const SCENE_STATUS_TYPE_MAX_MS = 34;
const SCENE_ACTION_MIN_RUN_DELAY_MS = 520;
const SCENE_ACTION_COMPLETION_BUFFER_MS = 120;
const SCENE_ACTION_END_GUARD_MS = 220;
const SCENE_STATUS_COPY = {
  home: {
    title: "Home scene",
    actions: [
      "Disarming security system",
      "Unlocking front door",
      "Turning on porch light",
      "Turning on living room lights",
      "Setting thermostat to 68°",
    ],
  },
  away: {
    title: "Away scene",
    actions: [
      "Arming security system",
      "Locking front door",
      "Turning on porch, side, and garage lights",
      "Turning off interior lights",
      "Setting thermostat to 72°",
    ],
  },
  sleep: {
    title: "Sleep scene",
    actions: [
      "Arming security system",
      "Locking doors",
      "Turning off interior lights",
      "Turning on perimeter lights",
      "Lowering thermostat to 68°",
    ],
  },
  "wake-up": {
    title: "Wake Up scene",
    actions: [
      "Disarming security system",
      "Unlocking front door",
      "Turning on downstairs lights",
      "Setting thermostat to 70°",
    ],
  },
};

const formatSceneStartLabel = (sceneTitle) => (
  `Starting ${sceneTitle
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}`
);

const getSceneStatusTypeMs = (action, stepMs) => (
  Math.min(
    SCENE_STATUS_TYPE_MAX_MS,
    Math.max(
      SCENE_STATUS_TYPE_MIN_MS,
      Math.floor((stepMs * 0.58) / Math.max(action.length, 1))
    )
  )
);

const getSceneActionRunDelay = (action, stepMs) => (
  Math.min(
    stepMs - SCENE_ACTION_END_GUARD_MS,
    Math.max(
      SCENE_ACTION_MIN_RUN_DELAY_MS,
      (getSceneStatusTypeMs(action, stepMs) * action.length) + SCENE_ACTION_COMPLETION_BUFFER_MS
    )
  )
);

export default function PhonePanel({
  garageOpen,
  setGarageOpen,
  armed,
  setArmed,
  upstairsBedroomOn,
  setUpstairsBedroomOn,
  bedroomOn,
  setBedroomOn,
  livingRoomOn,
  setLivingRoomOn,
  diningRoomOn,
  setDiningRoomOn,
  garageLightsOn,
  setGarageLightsOn,
  floodlightOn,
  setFloodlightOn,
  exteriorSideLightOn,
  setExteriorSideLightOn,
  porchLightOn,
  setPorchLightOn,
  frontDoorUnlocked,
  setFrontDoorUnlocked,
  sideDoorUnlocked,
  setSideDoorUnlocked,
  thermostatTemp,
  thermostatRoomTemp = 72,
  setThermostatTemp,
  activeCamera,
  setActiveCamera,
  liveCamera,
  setLiveCamera,
  nightMode,
  setNightMode,
  feedEnabled,
  setFeedEnabled,
  setSceneStatus,
  setDoorAction,
  tourFocus,
}) {
  const [activeDoorSlide, setActiveDoorSlide] = useState(0);
  const [activeVideoSlide, setActiveVideoSlide] = useState(0);

  const phoneAppRef = useRef(null);
  const thermostatCardRef = useRef(null);
  const lightsCardRef = useRef(null);
  const doorCarouselRef = useRef(null);
  const videoCarouselRef = useRef(null);
  const desiredDoorSlideRef = useRef(0);
  const suppressDoorScrollSyncRef = useRef(false);
  const sceneActionTimeoutsRef = useRef([]);
  const feedKeyRef = useRef(0);
  const doorActionKeyRef = useRef(0);

  const clearSceneActionTimeouts = () => {
    sceneActionTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    sceneActionTimeoutsRef.current = [];
  };

  useEffect(() => (
    () => {
      clearSceneActionTimeouts();
    }
  ), []);

  useEffect(() => {
    if (!tourFocus?.section || !phoneAppRef.current) return;

    const targetRef = tourFocus.section === "lights" ? lightsCardRef : thermostatCardRef;
    const target = targetRef.current;

    if (!target) return;

    const phoneApp = phoneAppRef.current;
    const phoneRect = phoneApp.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = phoneApp.scrollTop + targetRect.top - phoneRect.top - 12;

    phoneApp.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth",
    });
  }, [tourFocus]);

  const getFeedKey = () => {
    feedKeyRef.current += 1;
    return `${Date.now()}-${feedKeyRef.current}`;
  };

  const pushActionFeed = (title, action, stepMs = MANUAL_ACTION_STEP_MS) => {
    clearSceneActionTimeouts();

    if (feedEnabled && setSceneStatus) {
      setSceneStatus({
        title,
        actions: Array.isArray(action) ? action : [action],
        stepMs,
        key: getFeedKey(),
      });
    }
  };

  const pushFeedToggleStatus = (enabled) => {
    clearSceneActionTimeouts();

    if (setSceneStatus) {
      setSceneStatus({
        title: "Action feed",
        actions: [enabled ? "Feed enabled" : "Feed disabled"],
        stepMs: MANUAL_ACTION_STEP_MS,
        key: getFeedKey(),
      });
    }
  };

  const cameraFeeds = [
    {
      id: "doorbell",
      label: "Video Doorbell",
      liveLabel: "Live Doorbell",
      src: "/doorbell-camera-scene.svg",
      videoSrc: nightMode
        ? "/video-doorbell-night.mp4"
        : "/video-doorbell-delivery2.mp4",
      alt: "Video doorbell camera view",
    },
    {
      id: "outdoor",
      label: "Outdoor Camera",
      liveLabel: "Outdoor Camera",
      src: "/outdoor-camera-scene.svg",
      videoSrc: nightMode
        ? OUTDOOR_NIGHT_VIDEO_SRC
        : "/outdoor-camera-day.mp4",
      alt: "Outdoor camera view",
    },
    {
      id: "floodlight",
      label: "Floodlight Camera",
      liveLabel: "Floodlight Camera",
      src: "/floodlight-camera-scene.svg",
      videoSrc: nightMode
        ? "/floodlight-camera-night.mp4"
        : "/floodlight-camera-day.mp4",
      alt: "Floodlight camera view",
    },
  ];

  const activeFeed = cameraFeeds.find((feed) => feed.id === activeCamera);

  const scrollDoorCarouselTo = (slideIndex, behavior = "smooth") => {
    if (!doorCarouselRef.current) return;

    doorCarouselRef.current.scrollTo({
      left: doorCarouselRef.current.offsetWidth * slideIndex,
      behavior,
    });
  };

  const restoreDoorSlide = (slideIndex) => {
    desiredDoorSlideRef.current = slideIndex;
    suppressDoorScrollSyncRef.current = true;
    setActiveDoorSlide(slideIndex);

    requestAnimationFrame(() => {
      scrollDoorCarouselTo(slideIndex, "auto");
      requestAnimationFrame(() => {
        suppressDoorScrollSyncRef.current = false;
      });
    });
  };

  const goToDoorSlide = (slideIndex) => {
    desiredDoorSlideRef.current = slideIndex;
    setActiveDoorSlide(slideIndex);
    scrollDoorCarouselTo(slideIndex);
  };

  useEffect(() => {
    restoreDoorSlide(desiredDoorSlideRef.current);
  }, [frontDoorUnlocked, sideDoorUnlocked]);

  const goToVideoSlide = (slideIndex) => {
    setActiveVideoSlide(slideIndex);

    if (videoCarouselRef.current) {
      videoCarouselRef.current.scrollTo({
        left: videoCarouselRef.current.offsetWidth * slideIndex,
        behavior: "smooth",
      });
    }
  };

  const handleExpandCamera = (cameraId) => {
    const feed = cameraFeeds.find((cameraFeed) => cameraFeed.id === cameraId);
    const feedName = feed?.label?.replace(/\s+Camera$/, "") ?? "camera";

    pushActionFeed("Video", `Viewing ${feedName} camera feed`);
    setActiveCamera(cameraId);

    if (typeof setLiveCamera === "function") {
      setLiveCamera(cameraId);
    }
  };

  const handleCloseCamera = () => {
    setActiveCamera(null);

    if (typeof setLiveCamera === "function") {
      setLiveCamera(null);
    }
  };

  const weatherDateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
  }).format(new Date()).replace(",", "");

  const adjustThermostat = (amount) => {
    const nextTemp = Math.min(
      THERMOSTAT_MAX_TEMP,
      Math.max(THERMOSTAT_MIN_TEMP, thermostatTemp + amount)
    );

    if (nextTemp !== thermostatTemp) {
      pushActionFeed("Thermostat", `Setting thermostat to ${nextTemp}°`);
      setThermostatTemp(nextTemp);
    }
  };

  const thermostatMode =
    thermostatTemp > thermostatRoomTemp
      ? "heating"
      : thermostatTemp < thermostatRoomTemp
        ? "cooling"
        : "idle";
  const thermostatAccent =
    thermostatMode === "heating"
      ? "#EC720B"
      : thermostatMode === "cooling"
        ? "#22A1C1"
        : "#767676";

  const setSceneDoorState = (door, unlocked) => {
    doorActionKeyRef.current += 1;

    if (door === "front") {
      setFrontDoorUnlocked(unlocked);
    } else {
      setSideDoorUnlocked(unlocked);
    }

    if (setDoorAction) {
      setDoorAction({
        door,
        unlocked,
        suppressStateFeedback: true,
        key: `scene-door-${Date.now()}-${doorActionKeyRef.current}`,
      });
    }
  };

  const handleScene = (sceneId) => {
    const sceneStatus = SCENE_STATUS_COPY[sceneId];
    const sceneStepsById = {
      home: [
        { label: "Disarming security system", run: () => setArmed(false) },
        { label: "Unlocking front door", run: () => setSceneDoorState("front", true) },
        { label: "Turning on porch light", run: () => setPorchLightOn(true) },
        { label: "Turning on living room lights", run: () => setLivingRoomOn(true) },
        { label: "Setting thermostat to 68°", run: () => setThermostatTemp(68) },
      ],
      away: [
        { label: "Arming security system", run: () => setArmed(true) },
        { label: "Locking front door", run: () => setSceneDoorState("front", false) },
        {
          label: "Turning on porch, side, and garage lights",
          run: () => {
            setPorchLightOn(true);
            setExteriorSideLightOn(true);
            setGarageLightsOn(true);
          },
        },
        {
          label: "Turning off interior lights",
          run: () => {
            setLivingRoomOn(false);
            setDiningRoomOn(false);
          },
        },
        { label: "Setting thermostat to 72°", run: () => setThermostatTemp(72) },
      ],
      sleep: [
        { label: "Arming security system", run: () => setArmed(true) },
        {
          label: "Locking doors",
          run: () => {
            setSceneDoorState("front", false);
            window.setTimeout(() => {
              setSceneDoorState("side", false);
            }, 450);
          },
        },
        {
          label: "Turning off interior lights",
          run: () => {
            setUpstairsBedroomOn(false);
            setBedroomOn(false);
            setLivingRoomOn(false);
            setDiningRoomOn(false);
          },
        },
        {
          label: "Turning on perimeter lights",
          run: () => {
            setPorchLightOn(true);
            setExteriorSideLightOn(true);
            setGarageLightsOn(true);
          },
        },
        { label: "Lowering thermostat to 68°", run: () => setThermostatTemp(68) },
      ],
      "wake-up": [
        { label: "Disarming security system", run: () => setArmed(false) },
        { label: "Unlocking front door", run: () => setSceneDoorState("front", true) },
        {
          label: "Turning on downstairs lights",
          run: () => {
            setLivingRoomOn(true);
            setDiningRoomOn(true);
          },
        },
        { label: "Setting thermostat to 70°", run: () => setThermostatTemp(70) },
      ],
    };
    const sceneSteps = sceneStepsById[sceneId];

    clearSceneActionTimeouts();

    if (!sceneStatus || !sceneSteps) {
      return;
    }

    const sceneStepMs = SCENE_ACTION_STEP_MS;
    const sceneFeedActions = [
      formatSceneStartLabel(sceneStatus.title),
      ...sceneSteps.map((step) => step.label),
    ];

    if (feedEnabled && setSceneStatus) {
      setSceneStatus({
        title: sceneStatus.title,
        actions: sceneFeedActions,
        stepMs: sceneStepMs,
        key: getFeedKey(),
      });
    }

    sceneActionTimeoutsRef.current = sceneSteps.map((step, index) =>
      setTimeout(
        step.run,
        ((feedEnabled ? index + 1 : index) * sceneStepMs)
          + (feedEnabled ? getSceneActionRunDelay(step.label, sceneStepMs) : 0)
      )
    );
  };

  const DoorLockCard = ({ label, unlocked, onToggle }) => (
    <button
      type="button"
      className="door-lock-card-button"
      onClick={onToggle}
      aria-label={`${unlocked ? "Lock" : "Unlock"} ${label}`}
    >
      <svg
        className="door-lock-card-svg"
        width="381"
        height="150"
        viewBox="0 0 381 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="1" width="377" height="146" rx="4" fill="white" />

        <text
          x="19"
          y="30"
          fill="#767676"
          fontSize="15"
          fontWeight="800"
          letterSpacing="0.08em"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
        >
          LOCKS
        </text>

        <text
          x="352"
          y="30"
          fill="#767676"
          fontSize="34"
          fontWeight="400"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
        >
          ›
        </text>

        <g transform="translate(82 44)">
          {unlocked ? (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M41 28V15C41 10.864 44.364 7.5 48.5 7.5C52.636 7.5 56 10.864 56 15V19H62V15C62 7.556 55.944 1.5 48.5 1.5C41.056 1.5 35 7.556 35 15V28H32C27.582 28 24 31.582 24 36V61C24 65.418 27.582 69 32 69H64C68.418 69 72 65.418 72 61V36C72 31.582 68.418 28 64 28H41Z"
              fill="#23AB3F"
            />
          ) : (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M41 15C41 10.864 44.364 7.5 48.5 7.5C52.636 7.5 56 10.864 56 15V28H41V15ZM64 28H62V15C62 7.556 55.944 1.5 48.5 1.5C41.056 1.5 35 7.556 35 15V28H32C27.582 28 24 31.582 24 36V60C24 64.418 27.582 68 32 68H64C68.418 68 72 64.418 72 60V36C72 31.582 68.418 28 64 28Z"
              fill="#D92C29"
            />
          )}

          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M64 66H32C27.582 66 24 61.918 24 57.5V60C24 64.418 27.582 68 32 68H64C68.418 68 72 64.418 72 60V57.5C72 61.918 68.418 66 64 66Z"
            fill="black"
            fillOpacity="0.13"
          />

          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M48 37C43.589 37 40 40.589 40 45C40 47.883 41.56 50.511 44 51.922V59V61H46H50H52V59V51.922C54.44 50.511 56 47.883 56 45C56 40.589 52.411 37 48 37ZM54 45C54 41.686 51.314 39 48 39C44.686 39 42 41.686 42 45C42 47.611 43.671 49.827 46 50.651V59H50V50.651C52.329 49.827 54 47.611 54 45Z"
            fill="black"
            fillOpacity="0.13"
          />

          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M54 45C54 41.686 51.314 39 48 39C44.686 39 42 41.686 42 45C42 47.611 43.671 49.827 46 50.651V59H50V50.651C52.329 49.827 54 47.611 54 45Z"
            fill="white"
          />
        </g>

        <text
          x="187"
          y="76"
          fill="#333333"
          fontSize="20"
          fontWeight="500"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
        >
          {label}
        </text>

        <text
          x="187"
          y="101"
          fill={unlocked ? "#23AB3F" : "#D92C29"}
          fontSize="15"
          fontWeight="900"
          letterSpacing="0.04em"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
        >
          {unlocked ? "UNLOCKED" : "LOCKED"}
        </text>
      </svg>
    </button>
  );

  const ScenesCard = () => {
    const sceneButtons = [
      { id: "home", label: "Home" },
      { id: "away", label: "Away" },
      { id: "sleep", label: "Sleep" },
      { id: "wake-up", label: "Wake Up" },
    ];

    return (
      <section className="phone-section phone-section--scenes-card" aria-label="Scenes">
        <div className="scenes-card-shell">
          <svg
            className="scenes-card-svg"
            width="381"
            height="164"
            viewBox="0 0 381 164"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="2" y="1" width="377" height="160" rx="4" fill="white" shapeRendering="crispEdges" />

            <text
              x="19"
              y="26"
              fill="#767676"
              fontSize="15"
              fontWeight="900"
              letterSpacing="0.18em"
              fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
            >
              SCENES
            </text>

            <path fillRule="evenodd" clipRule="evenodd" d="M354.414 29.9956L363.418 20.9916L354.423 11.9956L353.009 13.4096L360.59 20.9916L353 28.5816L354.414 29.9956Z" fill="#767676" />

            <rect x="20.5" y="49.5" width="63" height="63" rx="3.5" stroke="black" strokeOpacity="0.1" />
            <path fillRule="evenodd" clipRule="evenodd" d="M51.3223 70.6225L58.3423 63.6008L70.834 77.0108V95.9992H50.834V92.6658H59.1673V82.6658H64.1673V92.6658H67.5007V78.3225L58.2573 68.3992L53.679 72.9792L51.3223 70.6225ZM45.1507 76.69L47.5073 74.3333L55.834 82.66L47.4923 91L45.1357 88.6433L49.4457 84.3333H35.834V81H49.4607L45.1507 76.69Z" fill="#23AB3F" />
            <text x="52" y="135" fill="#333333" fontSize="13" fontWeight="500" textAnchor="middle" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif">Home</text>

            <rect x="112.5" y="49.5" width="63" height="63" rx="3.5" stroke="black" strokeOpacity="0.1" />
            <path fillRule="evenodd" clipRule="evenodd" d="M143.322 70.6221L150.342 63.6005L162.834 77.0105V96.0005H142.834V92.6671H151.167V82.6671H156.167V92.6671H159.501V78.3221L150.257 68.3988L145.679 72.9788L143.322 70.6221ZM146.167 81V84.3333H132.54L136.85 88.6433L134.493 91L126.167 82.6733L134.507 74.3333L136.863 76.69L132.555 81H146.167Z" fill="#D92C29" />
            <text x="144" y="135" fill="#333333" fontSize="13" fontWeight="500" textAnchor="middle" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif">Away</text>

            <rect x="206.5" y="49.5" width="63" height="63" rx="3.5" stroke="black" strokeOpacity="0.1" />
            <path fillRule="evenodd" clipRule="evenodd" d="M239.074 96.532C230.299 96.532 223.187 89.2403 223.187 80.2437C223.187 74.1887 226.414 68.9187 231.196 66.1137C231.874 65.717 232.637 66.4337 232.361 67.1687C231.677 68.982 231.301 70.952 231.301 73.0137C231.301 82.0087 238.414 89.302 247.187 89.302C248.419 89.302 249.614 89.152 250.764 88.877C251.522 88.6937 252.139 89.532 251.671 90.157C248.769 94.032 244.209 96.532 239.074 96.532Z" fill="#2071DD" />
            <text x="238" y="135" fill="#333333" fontSize="13" fontWeight="500" textAnchor="middle" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif">Sleep</text>

            <rect x="298.5" y="49.5" width="63" height="63" rx="3.5" stroke="black" strokeOpacity="0.1" />
            <path fillRule="evenodd" clipRule="evenodd" d="M317.655 66.9764L316.476 68.1547C315.175 69.4564 315.175 71.568 316.476 72.8697L322.368 66.9764C321.066 65.6747 318.956 65.6747 317.655 66.9764ZM320.5 81C320.5 86.5134 324.987 91 330.5 91C336.013 91 340.5 86.5134 340.5 81C340.5 75.4867 336.013 71 330.5 71C324.987 71 320.5 75.4867 320.5 81ZM317.167 81C317.167 73.6367 323.137 67.6667 330.5 67.6667C337.863 67.6667 343.833 73.6367 343.833 81C343.833 83.34 343.227 85.5384 342.167 87.45V94.3334H338.833V91.4C336.55 93.2317 333.655 94.3334 330.5 94.3334C327.345 94.3334 324.45 93.2317 322.167 91.4V94.3334H318.833V87.45C317.773 85.5384 317.167 83.34 317.167 81ZM325.5 82.6667H328.833V76H332.167V81V82.6667V86H325.5V82.6667ZM343.345 66.9765L344.524 68.1549C345.825 69.4565 345.825 71.5665 344.524 72.8682L338.63 66.9765C339.934 65.6749 342.044 65.6749 343.345 66.9765Z" fill="#FFCD00" />
            <text x="330" y="135" fill="#333333" fontSize="13" fontWeight="500" textAnchor="middle" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif">Wake Up</text>
          </svg>

          {sceneButtons.map((scene) => (
            <button
              key={scene.id}
              type="button"
              className={`scenes-card-hit scenes-card-hit--${scene.id}`}
              aria-label={`Run ${scene.label} scene`}
              onClick={() => handleScene(scene.id)}
            />
          ))}
        </div>
      </section>
    );
  };

  const WeatherCard = () => (
    <section className="phone-section phone-section--weather-card" aria-label="Weather">
      <div className="weather-card__header">
        <h3 className="phone-section__title">Weather</h3>
      </div>

      <div className="weather-card__body">
        <svg
          className="weather-card__icon"
          viewBox="0 0 92 92"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M35.65 6.32498C35.65 5.37229 36.4223 4.59998 37.375 4.59998C38.3277 4.59998 39.1 5.37228 39.1 6.32497V16.675C39.1 17.6277 38.3277 18.4 37.375 18.4C36.4223 18.4 35.65 17.6277 35.65 16.675V6.32498ZM58.1109 14.1995C58.7846 13.5258 59.8768 13.5258 60.5504 14.1995C61.2241 14.8731 61.2241 15.9654 60.5504 16.639L55.6714 21.518C54.9977 22.1917 53.9055 22.1917 53.2319 21.518C52.5582 20.8444 52.5582 19.7522 53.2319 19.0785L58.1109 14.1995ZM52.9 37.375C52.9 45.9492 45.9492 52.9 37.375 52.9C28.8008 52.9 21.85 45.9492 21.85 37.375C21.85 28.8008 28.8008 21.85 37.375 21.85C45.9492 21.85 52.9 28.8008 52.9 37.375ZM60.5504 60.5503C61.2241 59.8766 61.2241 58.7844 60.5504 58.1108L55.6714 53.2317C54.9977 52.5581 53.9055 52.5581 53.2319 53.2317C52.5582 53.9054 52.5582 54.9976 53.2319 55.6713L58.1109 60.5503C58.7846 61.224 59.8768 61.224 60.5504 60.5503ZM16.6391 60.5503C15.9654 61.224 14.8732 61.224 14.1996 60.5503C13.5259 59.8767 13.5259 58.7845 14.1996 58.1108L19.0786 53.2318C19.7523 52.5581 20.8445 52.5581 21.5181 53.2318C22.1918 53.9054 22.1918 54.9976 21.5181 55.6713L16.6391 60.5503ZM14.1996 14.1995C13.5259 14.8732 13.5259 15.9654 14.1996 16.639L19.0786 21.5181C19.7523 22.1917 20.8445 22.1917 21.5181 21.5181C22.1918 20.8444 22.1918 19.7522 21.5181 19.0785L16.6391 14.1995C15.9655 13.5259 14.8732 13.5259 14.1996 14.1995ZM70.15 37.375C70.15 36.4223 69.3777 35.65 68.425 35.65H58.075C57.1223 35.65 56.35 36.4223 56.35 37.375C56.35 38.3277 57.1223 39.1 58.075 39.1H68.425C69.3777 39.1 70.15 38.3277 70.15 37.375ZM39.1 68.425C39.1 69.3777 38.3277 70.15 37.375 70.15C36.4223 70.15 35.65 69.3777 35.65 68.425V58.075C35.65 57.1223 36.4223 56.35 37.375 56.35C38.3277 56.35 39.1 57.1223 39.1 58.075V68.425ZM4.60001 37.375C4.60001 38.3277 5.37232 39.1 6.32501 39.1H16.675C17.6277 39.1 18.4 38.3277 18.4 37.375C18.4 36.4223 17.6277 35.65 16.675 35.65H6.325C5.37231 35.65 4.60001 36.4223 4.60001 37.375Z"
            fill="#FFBB34"
          />
          <path
            className="weather-card__cloud"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.1879 51.596C16.3304 45.7841 21.4532 41.4 27.6 41.4C29.3576 41.4 31.0314 41.7584 32.5524 42.4061C35.8538 33.7494 44.2338 27.6 54.05 27.6C66.7526 27.6 77.05 37.8974 77.05 50.6C77.05 50.9691 77.0413 51.3362 77.0241 51.7011C83.1784 54.8026 87.4 61.1809 87.4 68.5482C87.4 78.9597 78.9666 87.4 68.5596 87.4H23.4404C13.0351 87.4 4.60001 78.962 4.60001 68.5482C4.60001 61.098 8.91826 54.6572 15.1879 51.596Z"
            fill="#E0E3E7"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.63448 67.3983C5.22832 77.2763 13.421 85.1 23.4404 85.1H68.5596C78.5806 85.1 86.7718 77.2742 87.3655 67.3982C87.3884 67.7786 87.4 68.1621 87.4 68.5483C87.4 78.9598 78.9666 87.4 68.5596 87.4H23.4404C13.0351 87.4 4.60001 78.9621 4.60001 68.5483C4.60001 68.1621 4.61161 67.7787 4.63448 67.3983V67.3983Z"
            fill="#C9CBCF"
          />
        </svg>

        <div className="weather-card__content">
          <div className="weather-card__date">{weatherDateLabel}</div>
          <div className="weather-card__temp">
            <span>85/64</span>
            <small>
              <span>°</span>
              <span>F</span>
            </small>
          </div>
          <div className="weather-card__summary">Mostly Sunny</div>
        </div>
      </div>
    </section>
  );

  const ThermostatCard = () => (
    <section ref={thermostatCardRef} className="phone-section phone-section--thermostat-card">
      <div className="thermostat-card-shell">
        <svg
          className="thermostat-card-svg"
          width="381"
          height="242"
          viewBox="0 0 381 242"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g filter="url(#thermostatCardShadow)">
            <rect x="2" y="1" width="377" height="238" rx="4" fill="white" shapeRendering="crispEdges" />

            <text
              x="19"
              y="26"
              fill="#767676"
              fontSize="15"
              fontWeight="900"
              letterSpacing="0.18em"
              fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
            >
              THERMOSTATS
            </text>

            <path fillRule="evenodd" clipRule="evenodd" d="M354.414 29.9956L363.418 20.9916L354.423 11.9956L353.009 13.4096L360.59 20.9916L353 28.5816L354.414 29.9956Z" fill="#767676" />

            <text
              x="19"
              y="77"
              fill="#333333"
              fontSize="17"
              fontWeight="500"
              fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
            >
              Thermostat
            </text>

            <text
              x="110"
              y="170"
              fill={thermostatAccent}
              fontSize="72"
              fontWeight="300"
              letterSpacing="0"
              fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Arial, sans-serif"
            >
              {thermostatTemp}
            </text>

            <text
              x="194"
              y="140"
              fill={thermostatAccent}
              fontSize="34"
              fontWeight="400"
              fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Arial, sans-serif"
            >
              °
            </text>

            <path fillRule="evenodd" clipRule="evenodd" d="M250 128.326L237.995 116.321L226 128.314L227.885 130.199L237.995 120.091L248.115 130.211L250 128.326Z" fill="#333333" />
            <path fillRule="evenodd" clipRule="evenodd" d="M225.994 160.314L237.999 172.32L249.994 160.326L248.109 158.441L237.999 168.549L227.879 158.429L225.994 160.314Z" fill="#333333" />

            {thermostatMode === "heating" ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M292.95 75.707L291.536 74.293C292.8 73.028 292.8 70.972 291.536 69.707C289.493 67.663 289.493 64.337 291.536 62.293L292.95 63.707C291.686 64.972 291.686 67.028 292.95 68.293C294.994 70.337 294.994 73.663 292.95 75.707ZM306 78V74H308V80H288V74H290V78H306ZM297.021 74.293L298.435 75.707C300.479 73.663 300.479 70.337 298.435 68.293C297.171 67.028 297.171 64.972 298.435 63.707L297.021 62.293C294.978 64.337 294.978 67.663 297.021 69.707C298.285 70.972 298.285 73.028 297.021 74.293ZM303.95 75.707L302.536 74.293C303.8 73.028 303.8 70.972 302.536 69.707C300.493 67.663 300.493 64.337 302.536 62.293L303.95 63.707C302.686 64.972 302.686 67.028 303.95 68.293C305.994 70.337 305.994 73.663 303.95 75.707Z" fill={thermostatAccent} />
            ) : (
              <path fillRule="evenodd" clipRule="evenodd" d="M307.816 68.8882L307.201 66.9852L303.814 68.0792L305.121 65.5252L303.341 64.6142L301.122 68.9482L299 69.6342V67.4342L302.471 63.9632L301.057 62.5492L299 64.6062V61.0002H297V64.5592L294.971 62.5302L293.557 63.9452L297 67.3882V69.6052L294.925 68.9152L292.727 64.5262L290.938 65.4222L292.241 68.0232L288.819 66.8852L288.188 68.7832L291.566 69.9062L289.001 71.1912L289.896 72.9792L294.25 70.7982L296.366 71.5022L295.064 73.2752L290.212 74.0182L290.514 75.9952L293.39 75.5552L291.255 78.4612L292.867 79.6452L294.974 76.7762L295.408 79.6122L297.385 79.3102L296.648 74.4962L297.968 72.6992L299.255 74.4832L298.471 79.3292L300.445 79.6482L300.91 76.7772L303.019 79.7022L304.641 78.5312L302.559 75.6452L305.392 76.1032L305.711 74.1292L300.904 73.3512L299.6 71.5422L301.693 70.8662L306.063 73.1022L306.974 71.3212L304.385 69.9962L307.816 68.8882Z" fill={thermostatAccent} />
            )}
            <path fillRule="evenodd" clipRule="evenodd" d="M328 63V61C333.514 61 338 65.486 338 71C338 76.514 333.514 81 328 81C322.486 81 318 76.514 318 71C318 68.816 318.709 66.728 320.004 65.004L318 63H323V68L321.438 66.438C320.509 67.77 320 69.35 320 71C320 75.411 323.589 79 328 79C332.411 79 336 75.411 336 71C336 66.589 332.411 63 328 63ZM329 71H328.995L325.278 74.717L323.864 73.302L327 70.167V64H329V70.988L329.003 70.992L329 70.995V71Z" fill="#767676" />

            <path d="M2 208H379V209H2V208Z" fill="black" fillOpacity="0.1" />
            <path fillRule="evenodd" clipRule="evenodd" d="M190.95 227.364L185.293 221.707L186.707 220.293L190.95 224.536L195.193 220.293L196.607 221.707L190.95 227.364Z" fill="#767676" />
          </g>

          <defs>
            <filter id="thermostatCardShadow" x="0" y="0" width="381" height="242" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
          </defs>
        </svg>

        <button
          type="button"
          className="thermostat-card-hit thermostat-card-hit--up"
          onClick={() => adjustThermostat(1)}
          aria-label="Increase thermostat temperature"
        />

        <button
          type="button"
          className="thermostat-card-hit thermostat-card-hit--down"
          onClick={() => adjustThermostat(-1)}
          aria-label="Decrease thermostat temperature"
        />
      </div>
    </section>
  );

  return (
    <div className={`phone-panel-wrap ${nightMode ? "is-night" : ""}`}>
      <div className="phone-panel">
        <div className="phone-shell">
          <div className="phone-shell__hardware">
            <div className="phone-shell__island" />
          </div>

          <div className="phone-shell__screen">
            <div ref={phoneAppRef} className="phone-app">
              <div className="phone-app__top-svg">
                <svg
                  width="393"
                  height="104"
                  viewBox="0 0 393 104"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="393" height="104" fill="#00964B" />

                  <text
                    x="50"
                    y="35"
                    fill="white"
                    fontSize="17"
                    fontWeight="800"
                    fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
                  >
                    6:26
                  </text>

                  <rect
                    x="134"
                    y="11"
                    width="125"
                    height="37"
                    rx="18.5"
                    fill="black"
                  />

                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M318.484 25.416C320.911 25.4161 323.245 26.3485 325.003 28.0205C325.136 28.1496 325.348 28.1479 325.478 28.0168L326.744 26.7392C326.81 26.6727 326.847 26.5827 326.846 26.4889C326.846 26.3952 326.808 26.3056 326.741 26.2399C322.125 21.8162 314.843 21.8162 310.227 26.2399C310.16 26.3055 310.122 26.3951 310.122 26.4889C310.121 26.5826 310.158 26.6727 310.224 26.7392L311.49 28.0168C311.62 28.1481 311.832 28.1498 311.965 28.0205C313.723 26.3484 316.058 25.416 318.484 25.416ZM318.484 29.5726C319.818 29.5725 321.103 30.0681 322.092 30.963C322.225 31.09 322.436 31.0872 322.566 30.9568L323.831 29.6792C323.897 29.6122 323.934 29.5213 323.933 29.4268C323.932 29.3323 323.893 29.2422 323.825 29.1765C320.816 26.3771 316.155 26.3771 313.146 29.1765C313.078 29.2422 313.039 29.3324 313.038 29.4269C313.037 29.5214 313.074 29.6123 313.141 29.6792L314.405 30.9568C314.535 31.0872 314.746 31.09 314.88 30.963C315.867 30.0687 317.152 29.5731 318.484 29.5726ZM321.017 32.3692C321.019 32.464 320.982 32.5553 320.914 32.6217L318.727 34.829C318.663 34.8939 318.576 34.9304 318.484 34.9304C318.393 34.9304 318.306 34.8939 318.242 34.829L316.054 32.6217C315.986 32.5553 315.949 32.4639 315.951 32.3692C315.953 32.2744 315.994 32.1847 316.065 32.1212C317.461 30.9397 319.507 30.9397 320.904 32.1212C320.974 32.1848 321.015 32.2745 321.017 32.3692Z"
                    fill="white"
                  />

                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M300.521 23.29H299.426C298.822 23.29 298.331 23.7803 298.331 24.3851V33.8759C298.331 34.4807 298.822 34.971 299.426 34.971H300.521C301.126 34.971 301.617 34.4807 301.617 33.8759V24.3851C301.617 23.7803 301.126 23.29 300.521 23.29ZM294.316 25.8452H295.411C296.016 25.8452 296.506 26.3355 296.506 26.9403V33.8759C296.506 34.4807 296.016 34.971 295.411 34.971H294.316C293.711 34.971 293.221 34.4807 293.221 33.8759V26.9403C293.221 26.3355 293.711 25.8452 294.316 25.8452ZM290.301 28.4005H289.206C288.601 28.4005 288.11 28.8907 288.11 29.4955V33.8759C288.11 34.4807 288.601 34.971 289.206 34.971H290.301C290.905 34.971 291.396 34.4807 291.396 33.8759V29.4955C291.396 28.8907 290.905 28.4005 290.301 28.4005ZM285.19 30.5906H284.095C283.49 30.5906 283 31.0809 283 31.6857V33.8759C283 34.4807 283.49 34.971 284.095 34.971H285.19C285.795 34.971 286.285 34.4807 286.285 33.8759V31.6857C286.285 31.0809 285.795 30.5906 285.19 30.5906Z"
                    fill="white"
                  />

                  <rect x="335" y="24" width="21" height="9" rx="2" fill="white" />
                  <rect x="333.5" y="22.5" width="24" height="12" rx="3.5" stroke="white" />
                  <path
                    d="M359 26C359.552 26 360 26.4477 360 27V30C360 30.5523 359.552 31 359 31V26Z"
                    fill="white"
                  />

                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M365 85.9922C362.795 85.9922 361.008 84.2052 361.008 82.0002C361.008 79.7952 362.795 78.0082 365 78.0082C367.205 78.0082 368.992 79.7952 368.992 82.0002C368.992 84.2052 367.205 85.9922 365 85.9922ZM372.946 80.5072L372.264 80.2642C371.379 79.9502 370.961 78.9392 371.364 78.0912L371.675 77.4372C372.315 76.0902 370.91 74.6852 369.563 75.3252L368.909 75.6362C368.061 76.0392 367.05 75.6212 366.736 74.7362L366.493 74.0542C365.993 72.6492 364.007 72.6492 363.507 74.0542L363.264 74.7362C362.95 75.6212 361.939 76.0392 361.091 75.6362L360.437 75.3252C359.09 74.6852 357.685 76.0902 358.325 77.4372L358.636 78.0912C359.039 78.9392 358.621 79.9502 357.736 80.2642L357.054 80.5072C355.649 81.0072 355.649 82.9932 357.054 83.4932L357.736 83.7362C358.621 84.0502 359.039 85.0612 358.636 85.9092L358.325 86.5632C357.685 87.9102 359.09 89.3152 360.437 88.6752L361.091 88.3642C361.939 87.9602 362.95 88.3792 363.264 89.2642L363.507 89.9462C364.007 91.3512 365.993 91.3512 366.493 89.9462L366.736 89.2642C367.05 88.3792 368.061 87.9602 368.909 88.3642L369.563 88.6752C370.91 89.3152 372.315 87.9102 371.675 86.5632L371.364 85.9092C370.961 85.0612 371.379 84.0502 372.264 83.7362L372.946 83.4932C374.351 82.9932 374.351 81.0072 372.946 80.5072Z"
                    fill="white"
                  />

                  <text
                    x="134"
                    y="87"
                    fill="white"
                    fontSize="24"
                    fontWeight="800"
                    letterSpacing="0.02em"
                    fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Arial, sans-serif"
                  >
                    ALERT 360
                  </text>
                </svg>
              </div>

              <div className="phone-app__sections">
                <ScenesCard />

                {/* SECURITY SYSTEM */}
                <section className="phone-section phone-section--security-system-card">
                  <button
                    type="button"
                    className="security-system-card-button"
                    onClick={() => {
                      const nextArmed = !armed;

                      pushActionFeed(
                        "Security system",
                        nextArmed ? "Arming security system" : "Disarming security system"
                      );
                      setArmed(nextArmed);
                    }}
                  >
                    <svg
                      className="security-system-full-svg"
                      width="381"
                      height="213"
                      viewBox="0 0 381 213"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="2" y="1" width="377" height="209" rx="4" fill="white" />

                      <text
                        x="19"
                        y="30"
                        fill="#767676"
                        fontSize="15"
                        fontWeight="800"
                        letterSpacing="0.08em"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
                      >
                        SECURITY SYSTEM
                      </text>

                      <text
                        x="352"
                        y="30"
                        fill="#767676"
                        fontSize="34"
                        fontWeight="400"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
                      >
                        ›
                      </text>

                      <g transform="translate(82 65)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M49 74.2734C49 74.2734 77 60.8304 77 37.8424V21.0064C77 19.8894 76.199 18.9314 75.077 18.6124C75.077 18.6124 62.555 15.3024 48.934 9.87537C35.313 15.3024 22.857 18.6124 22.857 18.6124C21.735 18.9314 21 19.8894 21 21.0064V37.8424C21 60.8304 49 74.2734 49 74.2734Z"
                          fill={armed ? "#D92C29" : "#23AB3F"}
                        />

                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M49 71.8109C49 71.8109 21 58.3679 21 35.3799V37.8439C21 60.8319 49 74.2749 49 74.2749C49 74.2749 77 60.8319 77 37.8439V35.3799C77 58.3679 49 71.8109 49 71.8109Z"
                          fill="black"
                          fillOpacity="0.13"
                        />

                        {armed ? (
                          <>
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M59.4749 28.6464L58.0609 30.0604L45.6069 42.5144L39.2429 36.1504L37.8289 34.7364L36.4139 36.1504L33.5859 38.9794L32.1719 40.3934L33.5859 41.8074L41.3639 49.5854L44.1929 52.4144L45.6069 53.8284L47.0209 52.4144L49.8489 49.5854L63.7179 35.7174L65.1319 34.3034L63.7179 32.8894L60.8889 30.0604L59.4749 28.6464Z"
                              fill="black"
                              fillOpacity="0.13"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M62.3032 34.3032L59.4752 31.4752L45.6062 45.3432L37.8282 37.5652L35.0002 40.3932L42.7782 48.1712L45.6062 51.0002L48.4352 48.1712L62.3032 34.3032Z"
                              fill="white"
                            />
                          </>
                        ) : (
                          <>
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M35.0161 45.125H63.0001V37.125H35.0161V45.125Z"
                              fill="black"
                              fillOpacity="0.13"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M37.0161 43.125H61.0001V39.125H37.0161V43.125Z"
                              fill="white"
                            />
                          </>
                        )}
                      </g>

                      <text
                        x="188"
                        y="101"
                        fill="#333333"
                        fontSize="20"
                        fontWeight="500"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
                      >
                        System
                      </text>

                      <text
                        x="188"
                        y="125"
                        fill={armed ? "#D92C29" : "#23AB3F"}
                        fontSize="15"
                        fontWeight="900"
                        letterSpacing="0.04em"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
                      >
                        {armed ? "ARMED AWAY" : "DISARMED"}
                      </text>

                      <rect x="2" y="178" width="377" height="1" fill="black" fillOpacity="0.1" />

                      <text
                        x="148"
                        y="199"
                        fill="#767676"
                        fontSize="13"
                        fontWeight="500"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
                      >
                        No Active Sensors
                      </text>
                    </svg>
                  </button>
                </section>

                {/* DOORS */}
                <section className="phone-section phone-section--door-locks-card">
                  <div
                    ref={doorCarouselRef}
                    className="door-locks-carousel"
                    onScroll={(event) => {
                      if (suppressDoorScrollSyncRef.current) return;

                      const slide = Math.round(
                        event.currentTarget.scrollLeft / event.currentTarget.offsetWidth
                      );

                      desiredDoorSlideRef.current = slide;
                      setActiveDoorSlide(slide);
                    }}
                  >
                    <DoorLockCard
                      label="Front Door"
                      unlocked={frontDoorUnlocked}
                      onToggle={() => {
                        restoreDoorSlide(0);
                        const nextUnlocked = !frontDoorUnlocked;

                        pushActionFeed(
                          "Door locks",
                          `${nextUnlocked ? "Unlocking" : "Locking"} front door`
                        );
                        setFrontDoorUnlocked(nextUnlocked);
                      }}
                    />

                    <DoorLockCard
                      label="Side Door"
                      unlocked={sideDoorUnlocked}
                      onToggle={() => {
                        restoreDoorSlide(1);
                        const nextUnlocked = !sideDoorUnlocked;

                        pushActionFeed(
                          "Door locks",
                          `${nextUnlocked ? "Unlocking" : "Locking"} side door`
                        );
                        setSideDoorUnlocked(nextUnlocked);
                      }}
                    />
                  </div>

                  <div
                    className="door-locks-nav-zone"
                    onClick={(event) => {
                      event.stopPropagation();
                      goToDoorSlide(activeDoorSlide === 0 ? 1 : 0);
                    }}
                  >
                    <div className="door-locks-bars">
                      <span
                        className={activeDoorSlide === 0 ? "is-active" : ""}
                        onClick={(event) => {
                          event.stopPropagation();
                          goToDoorSlide(0);
                        }}
                      />
                      <span
                        className={activeDoorSlide === 1 ? "is-active" : ""}
                        onClick={(event) => {
                          event.stopPropagation();
                          goToDoorSlide(1);
                        }}
                      />
                    </div>
                  </div>
                </section>

                {/* GARAGE */}
                <section className="phone-section phone-section--garage-card">
                  <button
                    type="button"
                    className="garage-card-button"
                    onClick={() => {
                      const nextOpen = !garageOpen;

                      pushActionFeed(
                        "Garage door",
                        `${nextOpen ? "Opening" : "Closing"} garage door`
                      );
                      setGarageOpen(nextOpen);
                    }}
                  >
                    <svg
                      className="garage-card-svg"
                      width="381"
                      height="140"
                      viewBox="0 0 381 140"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="2" y="1" width="377" height="136" rx="4" fill="white" />

                      <text
                        x="19"
                        y="30"
                        fill="#767676"
                        fontSize="15"
                        fontWeight="800"
                        letterSpacing="0.08em"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
                      >
                        GARAGE DOORS
                      </text>

                      <text
                        x="352"
                        y="30"
                        fill="#767676"
                        fontSize="34"
                        fontWeight="400"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
                      >
                        ›
                      </text>

                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M157.968 78.9999V107C157.968 109.209 156.177 111 153.968 111H105.968C103.759 111 102 109.209 102 107V78.9999H99.2281C97.3891 78.9999 96.5251 76.7269 97.9001 75.5049L128.639 46.9999C129.397 46.3259 130.539 46.3259 131.297 46.9999L162.036 75.5049C163.411 76.7269 162.547 78.9999 160.708 78.9999H157.968Z"
                        fill={garageOpen ? "#23AB3F" : "#D92C29"}
                      />

                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M153.968 111H105.968V83C105.968 80.791 107.759 79 109.968 79H149.968C152.177 79 153.968 80.791 153.968 83V111Z"
                        fill="black"
                        fillOpacity="0.13"
                      />

                      <path fillRule="evenodd" clipRule="evenodd" d="M111 97H148.968V93H111V97Z" fill="white" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M111 89H148.968V85H111V89Z" fill="white" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M111 105H148.968V101H111V105Z" fill="white" />

                      <text
                        x="187"
                        y="76"
                        fill="#333333"
                        fontSize="20"
                        fontWeight="500"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
                      >
                        Garage
                      </text>

                      <text
                        x="187"
                        y="101"
                        fill={garageOpen ? "#23AB3F" : "#D92C29"}
                        fontSize="15"
                        fontWeight="900"
                        letterSpacing="0.04em"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Arial, sans-serif"
                      >
                        {garageOpen ? "OPEN" : "CLOSED"}
                      </text>
                    </svg>
                  </button>
                </section>

                {/* VIDEO */}
                <section className="phone-section phone-section--video-card">
                  <div className="video-card-header">
                    <h3 className="phone-section__title">Video</h3>
                    <span className="video-card-arrow">›</span>
                  </div>

                  <div
                    ref={videoCarouselRef}
                    className="video-carousel"
                    onScroll={(event) => {
                      const slide = Math.round(
                        event.currentTarget.scrollLeft / event.currentTarget.offsetWidth
                      );
                      setActiveVideoSlide(slide);
                    }}
                  >
                    {cameraFeeds.map((feed) => (
                      <div
                        key={feed.id}
                        className={`video-slide video-slide--${feed.id}`}
                        onClick={() => handleExpandCamera(feed.id)}
                      >
                        <div
                          className="video-slide__nav-zone"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          <div className="video-slide__bars">
                            {cameraFeeds.map((bar, barIndex) => (
                              <span
                                key={bar.id}
                                className={activeVideoSlide === barIndex ? "is-active" : ""}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  goToVideoSlide(barIndex);
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {feed.videoSrc ? (
                          <video
                            key={`${feed.id}-${nightMode ? "night" : "day"}`}
                            className="video-slide__thumbnail"
                            src={feed.videoSrc}
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img src={feed.src} alt={feed.alt} />
                        )}

                        <button
                          type="button"
                          className="video-slide__play"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleExpandCamera(feed.id);
                          }}
                          aria-label={`Open ${feed.label}`}
                        >
                          ▶
                        </button>

                        <div className="video-slide__footer">
                          <span className="video-slide__label">{feed.label}</span>

                          <button
                            type="button"
                            className="video-slide__expand"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleExpandCamera(feed.id);
                            }}
                            aria-label={`Expand ${feed.label}`}
                          >
                            ⛶
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <ThermostatCard />

                <WeatherCard />

                {/* LIGHTS */}
                <section ref={lightsCardRef} className="phone-section phone-section--lights">
                  <h3 className="phone-section__title">Lights</h3>

                  <div className="light-list">
                    {[
                      ["Master Bedroom", upstairsBedroomOn, setUpstairsBedroomOn],
                      ["Bedroom", bedroomOn, setBedroomOn],
                      ["Living Room", livingRoomOn, setLivingRoomOn],
                      ["Dining Room", diningRoomOn, setDiningRoomOn],
                      ["Garage Lights", garageLightsOn, setGarageLightsOn],
                      ["Floodlight", floodlightOn, setFloodlightOn],
                      ["Side Light", exteriorSideLightOn, setExteriorSideLightOn],
                      ["Porch Light", porchLightOn, setPorchLightOn],
                    ].map(([label, isOn, setter]) => (
                      <button
                        key={label}
                        type="button"
                        className={`light-row ${isOn ? "is-on" : ""}`}
                        onClick={() => {
                          const nextOn = !isOn;

                          pushActionFeed(
                            "Lighting",
                            `${nextOn ? "Turning on" : "Turning off"} ${label.toLowerCase()}`
                          );
                          setter(nextOn);
                        }}
                      >
                        <span className="light-row__icon">💡</span>

                        <span className="light-row__copy">
                          <strong>{label}</strong>
                          <small>{isOn ? "On" : "Off"}</small>
                        </span>

                        <span className="light-row__switch">
                          <span />
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {activeFeed && (
              <div
                className={`doorbell-view doorbell-view--${activeFeed.id}`}
                onClick={handleCloseCamera}
              >
                {activeFeed.videoSrc ? (
                  <video
                    key={`${activeFeed.id}-${nightMode ? "night" : "day"}`}
                    className="doorbell-view__image"
                    src={activeFeed.videoSrc}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                  />
                ) : (
                  <img
                    src={activeFeed.src}
                    alt={activeFeed.alt}
                    className="doorbell-view__image"
                  />
                )}

                <div className="doorbell-view__header">
                  <span>{activeFeed.liveLabel}</span>
                  <strong>Now</strong>
                </div>

                <button
                  type="button"
                  className="doorbell-view__close"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCloseCamera();
                  }}
                  aria-label="Close camera view"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="phone-shell__side-button phone-shell__side-button--one" />
          <div className="phone-shell__side-button phone-shell__side-button--two" />
          <div className="phone-shell__power-button" />
        </div>
      </div>

      <button
        type="button"
        className={`feed-toggle ${feedEnabled ? "is-on" : ""}`}
        onClick={() => {
          const nextFeedEnabled = !feedEnabled;

          pushFeedToggleStatus(nextFeedEnabled);
          setFeedEnabled(nextFeedEnabled);
        }}
        aria-label={`${feedEnabled ? "Turn off" : "Turn on"} action feed`}
        aria-pressed={feedEnabled}
      >
        <span className="feed-toggle__icon" aria-hidden="true">
          <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.5 14.5L16 19L11.5 23.5"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 16H30"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M19 22H27"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.72"
            />
            <path
              d="M19 28H24"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.48"
            />
            {feedEnabled ? (
              <circle cx="32" cy="11" r="3.6" fill="currentColor" />
            ) : (
              <path
                d="M31 11L11 31"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </span>
        <span className="feed-toggle__label">Action Feed</span>
      </button>

      <button
        type="button"
        className={`mode-toggle ${nightMode ? "is-night" : ""}`}
        onClick={() => {
          const nextNightMode = !nightMode;

          pushActionFeed(
            "Display mode",
            nextNightMode ? "Switching to night mode" : "Switching to day mode"
          );
          setNightMode(nextNightMode);
        }}
      >
        <span className="mode-toggle__icon">{nightMode ? "☾" : "☀"}</span>
        <span className="mode-toggle__label">{nightMode ? "Night Mode" : "Day Mode"}</span>
      </button>
    </div>
  );
}
