"use client";

import { useState } from "react";

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
  exteriorSideLightOn,
  setExteriorSideLightOn,
  porchLightOn,
  setPorchLightOn,
  frontDoorUnlocked,
  setFrontDoorUnlocked,
  sideDoorUnlocked,
  setSideDoorUnlocked,
  activeCamera,
  setActiveCamera,
  liveCamera,
  setLiveCamera,
  nightMode,
  setNightMode,
}) {
  const [inlineCamera, setInlineCamera] = useState(null);
  const [activeDoorSlide, setActiveDoorSlide] = useState(0);

  const cameraFeeds = [
    {
      id: "doorbell",
      label: "Video Doorbell",
      liveLabel: "Live Doorbell",
      src: "/doorbell-camera-scene.svg",
      alt: "Video doorbell camera view",
    },
    {
      id: "outdoor",
      label: "Outdoor Camera",
      liveLabel: "Outdoor Camera",
      src: "/outdoor-camera-scene.svg",
      alt: "Outdoor camera view",
    },
    {
      id: "floodlight",
      label: "Floodlight Camera",
      liveLabel: "Floodlight Camera",
      src: "/floodlight-camera-scene.svg",
      alt: "Floodlight camera view",
    },
  ];

  const activeFeed = cameraFeeds.find((feed) => feed.id === activeCamera);

  const handleInlinePlay = (cameraId) => {
    const isAlreadyPlaying = inlineCamera === cameraId;

    if (isAlreadyPlaying) {
      setInlineCamera(null);
      if (typeof setLiveCamera === "function") setLiveCamera(null);
      return;
    }

    setInlineCamera(cameraId);
    if (typeof setLiveCamera === "function") setLiveCamera(cameraId);
  };

  const handleExpandCamera = (cameraId) => {
    setActiveCamera(cameraId);
    if (typeof setLiveCamera === "function") setLiveCamera(cameraId);
  };

  const handleCloseCamera = () => {
    setActiveCamera(null);
  };

  const handleCloseInlineCamera = () => {
    setInlineCamera(null);
    if (typeof setLiveCamera === "function") setLiveCamera(null);
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

  return (
    <div className={`phone-panel-wrap ${nightMode ? "is-night" : ""}`}>
      <div className="phone-panel">
        <div className="phone-shell">
          <div className="phone-shell__hardware">
            <div className="phone-shell__island" />
          </div>

          <div className="phone-shell__screen">
            <div className="phone-app">
             <div className="phone-app__top-svg">
  <svg
    width="393"
    height="104"
    viewBox="0 0 393 104"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="393" height="104" fill="#00964B" />

    <text x="50" y="35" fill="white" fontSize="17" fontWeight="800">
      6:26
    </text>

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
    <path d="M359 26C359.552 26 360 26.4477 360 27V30C360 30.5523 359.552 31 359 31V26Z" fill="white" />

    <rect x="134" y="11" width="125" height="37" rx="18.5" fill="black" />

    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M365 85.9922C362.795 85.9922 361.008 84.2052 361.008 82.0002C361.008 79.7952 362.795 78.0082 365 78.0082C367.205 78.0082 368.992 79.7952 368.992 82.0002C368.992 84.2052 367.205 85.9922 365 85.9922ZM372.946 80.5072L372.264 80.2642C371.379 79.9502 370.961 78.9392 371.364 78.0912L371.675 77.4372C372.315 76.0902 370.91 74.6852 369.563 75.3252L368.909 75.6362C368.061 76.0392 367.05 75.6212 366.736 74.7362L366.493 74.0542C365.993 72.6492 364.007 72.6492 363.507 74.0542L363.264 74.7362C362.95 75.6212 361.939 76.0392 361.091 75.6362L360.437 75.3252C359.09 74.6852 357.685 76.0902 358.325 77.4372L358.636 78.0912C359.039 78.9392 358.621 79.9502 357.736 80.2642L357.054 80.5072C355.649 81.0072 355.649 82.9932 357.054 83.4932L357.736 83.7362C358.621 84.0502 359.039 85.0612 358.636 85.9092L358.325 86.5632C357.685 87.9102 359.09 89.3152 360.437 88.6752L361.091 88.3642C361.939 87.9602 362.95 88.3792 363.264 89.2642L363.507 89.9462C364.007 91.3512 365.993 91.3512 366.493 89.9462L366.736 89.2642C367.05 88.3792 368.061 87.9602 368.909 88.3642L369.563 88.6752C370.91 89.3152 372.315 87.9102 371.675 86.5632L371.364 85.9092C370.961 85.0612 371.379 84.0502 372.264 83.7362L372.946 83.4932C374.351 82.9932 374.351 81.0072 372.946 80.5072Z"
      fill="white"
    />

    <text x="134" y="87" fill="white" fontSize="24" fontWeight="800">
      ALERT 360
    </text>
  </svg>
</div>

              <div className="phone-app__sections">
                {/* SECURITY SYSTEM */}
                <section className="phone-section phone-section--security-system-card">
                  <button
                    type="button"
                    className="security-system-card-button"
                    onClick={() => setArmed((prev) => !prev)}
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
                      <text x="19" y="30" fill="#767676" fontSize="15" fontWeight="800">
                        SECURITY SYSTEM
                      </text>
                      <text x="352" y="30" fill="#767676" fontSize="34">
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

                      <text x="188" y="101" fill="#333333" fontSize="20" fontWeight="500">
                        System
                      </text>

                      <text
                        x="188"
                        y="125"
                        fill={armed ? "#D92C29" : "#23AB3F"}
                        fontSize="15"
                        fontWeight="900"
                      >
                        {armed ? "ARMED AWAY" : "DISARMED"}
                      </text>

                      <circle cx="182.5" cy="168" r="4" fill="#333333" />
                      <circle cx="198.5" cy="168" r="4" fill="#767676" />
                      <rect x="2" y="178" width="377" height="1" fill="black" fillOpacity="0.1" />

                      <text x="148" y="199" fill="#767676" fontSize="13">
                        No Active Sensors
                      </text>
                    </svg>
                  </button>
                </section>

                {/* DOORS */}
                <section className="phone-section phone-section--door-locks-card">
                  <div
                    className="door-locks-carousel"
                    onScroll={(event) => {
                      const slide = Math.round(
                        event.currentTarget.scrollLeft / event.currentTarget.offsetWidth
                      );

                      setActiveDoorSlide(slide);
                    }}
                  >
                    <DoorLockCard
                      label="Front Door"
                      unlocked={frontDoorUnlocked}
                      onToggle={() => setFrontDoorUnlocked((prev) => !prev)}
                    />

                    <DoorLockCard
                      label="Side Door"
                      unlocked={sideDoorUnlocked}
                      onToggle={() => setSideDoorUnlocked((prev) => !prev)}
                    />
                  </div>

                  <div className="door-locks-bars">
                    <span className={activeDoorSlide === 0 ? "is-active" : ""} />
                    <span className={activeDoorSlide === 1 ? "is-active" : ""} />
                  </div>
                </section>

                {/* GARAGE */}
                <section className="phone-section phone-section--garage-card">
                  <button
                    type="button"
                    className="garage-card-button"
                    onClick={() => setGarageOpen((prev) => !prev)}
                  >
                    <svg className="garage-card-svg" width="381" height="140" viewBox="0 0 381 140" fill="none">
                      <rect x="2" y="1" width="377" height="136" rx="4" fill="white" />
                      <text x="19" y="30" fill="#767676" fontSize="15" fontWeight="800">
                        GARAGE DOORS
                      </text>
                      <text x="352" y="30" fill="#767676" fontSize="34">
                        ›
                      </text>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M157.968 78.9999V107C157.968 109.209 156.177 111 153.968 111H105.968C103.759 111 102 109.209 102 107V78.9999H99.2281C97.3891 78.9999 96.5251 76.7269 97.9001 75.5049L128.639 46.9999C129.397 46.3259 130.539 46.3259 131.297 46.9999L162.036 75.5049C163.411 76.7269 162.547 78.9999 160.708 78.9999H157.968Z"
                        fill={garageOpen ? "#23AB3F" : "#D92C29"}
                      />
                      <path fillRule="evenodd" clipRule="evenodd" d="M111 97H148.968V93H111V97Z" fill="white" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M111 89H148.968V85H111V89Z" fill="white" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M111 105H148.968V101H111V105Z" fill="white" />
                      <text x="187" y="76" fill="#333333" fontSize="20" fontWeight="500">
                        Garage
                      </text>
                      <text
                        x="187"
                        y="101"
                        fill={garageOpen ? "#23AB3F" : "#D92C29"}
                        fontSize="15"
                        fontWeight="900"
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

                  <div className="video-carousel">
                    {cameraFeeds.map((feed) => {
                      const isInlineActive = inlineCamera === feed.id;

                      return (
                        <div key={feed.id} className={`video-slide ${isInlineActive ? "is-playing" : ""}`}>
                          {isInlineActive && (
                            <div className="video-slide__live-header">
                              <div className="video-slide__live-pill">{feed.liveLabel}</div>
                              <div className="video-slide__live-now">Now</div>
                            </div>
                          )}

                          <img
                            src={feed.src}
                            alt={feed.alt}
                            className={isInlineActive ? "is-live" : ""}
                            onClick={() => {
                              if (isInlineActive) handleCloseInlineCamera();
                            }}
                          />

                          {!isInlineActive && (
                            <button
                              type="button"
                              className="video-slide__play"
                              onClick={() => handleInlinePlay(feed.id)}
                              aria-label={`Play ${feed.label}`}
                            >
                              ▶
                            </button>
                          )}

                          {!isInlineActive && (
                            <div className="video-slide__bars">
                              {cameraFeeds.map((bar) => (
                                <span key={bar.id} className={bar.id === feed.id ? "is-active" : ""} />
                              ))}
                            </div>
                          )}

                          <div className="video-slide__footer">
                            <span className="video-slide__label">{feed.label}</span>

                            <button
                              type="button"
                              className="video-slide__expand"
                              onClick={() => handleExpandCamera(feed.id)}
                              aria-label={`Expand ${feed.label}`}
                            >
                              ⛶
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* LIGHTS */}
                <section className="phone-section phone-section--lights">
                  <h3 className="phone-section__title">Lights</h3>

                  <div className="light-list">
                    {[
                      ["Master Bedroom", upstairsBedroomOn, setUpstairsBedroomOn],
                      ["Bedroom", bedroomOn, setBedroomOn],
                      ["Living Room", livingRoomOn, setLivingRoomOn],
                      ["Dining Room", diningRoomOn, setDiningRoomOn],
                      ["Garage Lights", garageLightsOn, setGarageLightsOn],
                      ["Side Light", exteriorSideLightOn, setExteriorSideLightOn],
                      ["Porch Light", porchLightOn, setPorchLightOn],
                    ].map(([label, isOn, setter]) => (
                      <button
                        key={label}
                        type="button"
                        className={`light-row ${isOn ? "is-on" : ""}`}
                        onClick={() => setter((prev) => !prev)}
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
              <div className="doorbell-view" onClick={handleCloseCamera}>
                <img src={activeFeed.src} alt={activeFeed.alt} className="doorbell-view__image" />

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
        className={`mode-toggle ${nightMode ? "is-night" : ""}`}
        onClick={() => setNightMode((prev) => !prev)}
      >
        <span className="mode-toggle__icon">{nightMode ? "☾" : "☀"}</span>
        <span className="mode-toggle__label">{nightMode ? "Night Mode" : "Day Mode"}</span>
      </button>
    </div>
  );
}