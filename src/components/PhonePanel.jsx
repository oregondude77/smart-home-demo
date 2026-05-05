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

                {/* LIGHTS (NEW CARD UI) */}
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

            {/* CAMERA VIEWS */}
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