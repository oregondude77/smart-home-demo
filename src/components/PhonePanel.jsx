"use client";

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
  nightMode,
  setNightMode,
}) {
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

                <section className="phone-section">
                  <h3 className="phone-section__title">Video</h3>
                  <div className="phone-section__controls">
                    <button
                      className={`phone-control ${
                        activeCamera === "doorbell" ? "is-active" : ""
                      }`}
                      onClick={() => setActiveCamera("doorbell")}
                    >
                      Video Doorbell
                    </button>

                    <button
                      className={`phone-control ${
                        activeCamera === "outdoor" ? "is-active" : ""
                      }`}
                      onClick={() => setActiveCamera("outdoor")}
                    >
                      Outdoor Camera
                    </button>

                    <button
                      className={`phone-control ${
                        activeCamera === "floodlight" ? "is-active" : ""
                      }`}
                      onClick={() => setActiveCamera("floodlight")}
                    >
                      Floodlight Camera
                    </button>
                  </div>
                </section>

                <section className="phone-section">
                  <h3 className="phone-section__title">Lights</h3>
                  <div className="phone-section__controls">
                    <button
                      className={`phone-control ${
                        upstairsBedroomOn ? "is-active" : ""
                      }`}
                      onClick={() => setUpstairsBedroomOn((prev) => !prev)}
                    >
                      {upstairsBedroomOn ? "Master Off" : "Master On"}
                    </button>

                    <button
                      className={`phone-control ${
                        bedroomOn ? "is-active" : ""
                      }`}
                      onClick={() => setBedroomOn((prev) => !prev)}
                    >
                      {bedroomOn ? "Bedroom Off" : "Bedroom On"}
                    </button>

                    <button
                      className={`phone-control ${
                        livingRoomOn ? "is-active" : ""
                      }`}
                      onClick={() => setLivingRoomOn((prev) => !prev)}
                    >
                      {livingRoomOn ? "Living Off" : "Living On"}
                    </button>

                    <button
                      className={`phone-control ${
                        diningRoomOn ? "is-active" : ""
                      }`}
                      onClick={() => setDiningRoomOn((prev) => !prev)}
                    >
                      {diningRoomOn ? "Dining Off" : "Dining On"}
                    </button>

                    <button
                      className={`phone-control ${
                        garageLightsOn ? "is-active" : ""
                      }`}
                      onClick={() => setGarageLightsOn((prev) => !prev)}
                    >
                      {garageLightsOn ? "Garage Lights Off" : "Garage Lights On"}
                    </button>

                    <button
                      className={`phone-control ${
                        exteriorSideLightOn ? "is-active" : ""
                      }`}
                      onClick={() => setExteriorSideLightOn((prev) => !prev)}
                    >
                      {exteriorSideLightOn ? "Side Light Off" : "Side Light On"}
                    </button>

                    <button
                      className={`phone-control ${
                        porchLightOn ? "is-active" : ""
                      }`}
                      onClick={() => setPorchLightOn((prev) => !prev)}
                    >
                      {porchLightOn ? "Porch Off" : "Porch On"}
                    </button>
                  </div>
                </section>

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

            {activeCamera === "doorbell" && (
              <div
                className="doorbell-view"
                onClick={() => setActiveCamera(null)}
              >
                <img
                  src="/doorbell-camera-scene.svg"
                  alt="Video doorbell camera view"
                  className="doorbell-view__image"
                />
                <div className="doorbell-view__header">
                  <span>Live Doorbell</span>
                  <strong>Now</strong>
                </div>
                <button
                  className="doorbell-view__close"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveCamera(null);
                  }}
                  aria-label="Close doorbell view"
                >
                  ×
                </button>
              </div>
            )}

            {activeCamera === "outdoor" && (
              <div
                className="doorbell-view"
                onClick={() => setActiveCamera(null)}
              >
                <img
                  src="/outdoor-camera-scene.svg"
                  alt="Outdoor camera view"
                  className="doorbell-view__image"
                />
                <div className="doorbell-view__header">
                  <span>Outdoor Camera</span>
                  <strong>Now</strong>
                </div>
                <button
                  className="doorbell-view__close"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveCamera(null);
                  }}
                  aria-label="Close outdoor camera view"
                >
                  ×
                </button>
              </div>
            )}

            {activeCamera === "floodlight" && (
              <div
                className="doorbell-view"
                onClick={() => setActiveCamera(null)}
              >
                <img
                  src="/floodlight-camera-scene.svg"
                  alt="Floodlight camera view"
                  className="doorbell-view__image"
                />
                <div className="doorbell-view__header">
                  <span>Floodlight Camera</span>
                  <strong>Now</strong>
                </div>
                <button
                  className="doorbell-view__close"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveCamera(null);
                  }}
                  aria-label="Close floodlight camera view"
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
        aria-label="Toggle day/night mode"
      >
        <span className="mode-toggle__icon">{nightMode ? "☾" : "☀"}</span>
        <span className="mode-toggle__label">
          {nightMode ? "Night Mode" : "Day Mode"}
        </span>
      </button>
    </div>
  );
}