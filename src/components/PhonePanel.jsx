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

  return (
    <div className={`phone-panel-wrap ${nightMode ? "is-night" : ""}`}>
      <div className="phone-panel">
        <div className="phone-shell">
          <div className="phone-shell__hardware">
            <div className="phone-shell__island" />
          </div>

          <div className="phone-shell__screen">
            <div className="phone-app">
              <div className="phone-app__header">
                <div className="phone-app__eyebrow">Alert 360</div>
                <div className="phone-app__title">Home Control</div>
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

                      <circle cx="182.5" cy="168" r="4" fill="#333333" />
                      <circle cx="198.5" cy="168" r="4" fill="#767676" />

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
                        <div
                          key={feed.id}
                          className={`video-slide ${isInlineActive ? "is-playing" : ""}`}
                        >
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
                                <span
                                  key={bar.id}
                                  className={bar.id === feed.id ? "is-active" : ""}
                                />
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

                {/* GARAGE */}
                <section className="phone-section phone-section--garage-card">
                  <button
                    type="button"
                    className="garage-card-button"
                    onClick={() => setGarageOpen((prev) => !prev)}
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

                {/* DOORS */}
                <section className="phone-section">
                  <h3 className="phone-section__title">Doors</h3>

                  <div className="phone-section__controls">
                    <button
                      className={`phone-control ${frontDoorUnlocked ? "is-active" : ""}`}
                      onClick={() => setFrontDoorUnlocked((prev) => !prev)}
                    >
                      {frontDoorUnlocked ? "Lock Front" : "Unlock Front"}
                    </button>

                    <button
                      className={`phone-control ${sideDoorUnlocked ? "is-active" : ""}`}
                      onClick={() => setSideDoorUnlocked((prev) => !prev)}
                    >
                      {sideDoorUnlocked ? "Lock Side" : "Unlock Side"}
                    </button>
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