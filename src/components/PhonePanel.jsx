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

      if (typeof setLiveCamera === "function") {
        setLiveCamera(null);
      }

      return;
    }

    setInlineCamera(cameraId);

    if (typeof setLiveCamera === "function") {
      setLiveCamera(cameraId);
    }
  };

  const handleExpandCamera = (cameraId) => {
    setActiveCamera(cameraId);

    if (typeof setLiveCamera === "function") {
      setLiveCamera(cameraId);
    }
  };

  const handleCloseCamera = () => {
    setActiveCamera(null);
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
                {/* SECURITY */}
                <section className="phone-section">
                  <h3 className="phone-section__title">Security</h3>
                  <div className="phone-section__controls">
                    <button
                      className={`phone-control ${armed ? "is-active" : ""}`}
                      onClick={() => setArmed((prev) => !prev)}
                    >
                      {armed ? "Disarm System" : "Arm System"}
                    </button>
                  </div>
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
                          className={`video-slide ${
                            isInlineActive ? "is-playing" : ""
                          }`}
                        >
                          {isInlineActive && (
                            <div className="video-slide__live-header">
                              <div className="video-slide__live-pill">
                                {feed.liveLabel}
                              </div>
                              <div className="video-slide__live-now">Now</div>
                            </div>
                          )}

                          <img
                            src={feed.src}
                            alt={feed.alt}
                            className={isInlineActive ? "is-live" : ""}
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
                                  className={
                                    bar.id === feed.id ? "is-active" : ""
                                  }
                                />
                              ))}
                            </div>
                          )}

                          <div className="video-slide__footer">
                            <span className="video-slide__label">
                              {feed.label}
                            </span>

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
                <section className="phone-section">
                  <h3 className="phone-section__title">Garage</h3>
                  <div className="phone-section__controls">
                    <button
                      className={`phone-control ${
                        garageOpen ? "is-active" : ""
                      }`}
                      onClick={() => setGarageOpen((prev) => !prev)}
                    >
                      {garageOpen ? "Close Garage" : "Open Garage"}
                    </button>
                  </div>
                </section>

                {/* DOORS */}
                <section className="phone-section">
                  <h3 className="phone-section__title">Doors</h3>
                  <div className="phone-section__controls">
                    <button
                      className={`phone-control ${
                        frontDoorUnlocked ? "is-active" : ""
                      }`}
                      onClick={() => setFrontDoorUnlocked((prev) => !prev)}
                    >
                      {frontDoorUnlocked ? "Lock Front" : "Unlock Front"}
                    </button>

                    <button
                      className={`phone-control ${
                        sideDoorUnlocked ? "is-active" : ""
                      }`}
                      onClick={() => setSideDoorUnlocked((prev) => !prev)}
                    >
                      {sideDoorUnlocked ? "Lock Side" : "Unlock Side"}
                    </button>
                  </div>
                </section>
              </div>
            </div>

            {/* FULL SCREEN CAMERA VIEW INSIDE PHONE */}
            {activeFeed && (
              <div className="doorbell-view" onClick={handleCloseCamera}>
                <img
                  src={activeFeed.src}
                  alt={activeFeed.alt}
                  className="doorbell-view__image"
                />

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

      {/* NIGHT MODE */}
      <button
        type="button"
        className={`mode-toggle ${nightMode ? "is-night" : ""}`}
        onClick={() => setNightMode((prev) => !prev)}
      >
        <span className="mode-toggle__icon">{nightMode ? "☾" : "☀"}</span>
        <span className="mode-toggle__label">
          {nightMode ? "Night Mode" : "Day Mode"}
        </span>
      </button>
    </div>
  );
}