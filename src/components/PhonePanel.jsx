"use client";

import { useState } from "react";

function LightControl({ label, isOn, onClick }) {
  return (
    <button
      type="button"
      className={`light-card ${isOn ? "is-on" : ""}`}
      onClick={onClick}
    >
      <span className="light-card__icon">●</span>
      <span className="light-card__content">
        <span className="light-card__label">{label}</span>
        <span className="light-card__status">{isOn ? "On" : "Off"}</span>
      </span>
      <span className="light-card__toggle">
        <span className="light-card__knob" />
      </span>
    </button>
  );
}

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
}) {
  const [doorbellOpen, setDoorbellOpen] = useState(false);
  const [outdoorCameraOpen, setOutdoorCameraOpen] = useState(false);
  const [floodlightCameraOpen, setFloodlightCameraOpen] = useState(false);

  return (
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
                    className={`phone-control ${doorbellOpen ? "is-active" : ""}`}
                    onClick={() => setDoorbellOpen(true)}
                  >
                    Video Doorbell
                  </button>

                  <button
                    className={`phone-control ${outdoorCameraOpen ? "is-active" : ""}`}
                    onClick={() => setOutdoorCameraOpen(true)}
                  >
                    Outdoor Camera
                  </button>

                  <button
                    className={`phone-control ${floodlightCameraOpen ? "is-active" : ""}`}
                    onClick={() => setFloodlightCameraOpen(true)}
                  >
                    Floodlight Camera
                  </button>
                </div>
              </section>

              <section className="phone-section phone-section--lights">
                <h3 className="phone-section__title">Lights</h3>

                <div className="light-card-list">
                  <LightControl
                    label="Master"
                    isOn={upstairsBedroomOn}
                    onClick={() => setUpstairsBedroomOn((prev) => !prev)}
                  />

                  <LightControl
                    label="Bedroom"
                    isOn={bedroomOn}
                    onClick={() => setBedroomOn((prev) => !prev)}
                  />

                  <LightControl
                    label="Living Room"
                    isOn={livingRoomOn}
                    onClick={() => setLivingRoomOn((prev) => !prev)}
                  />

                  <LightControl
                    label="Dining Room"
                    isOn={diningRoomOn}
                    onClick={() => setDiningRoomOn((prev) => !prev)}
                  />

                  <LightControl
                    label="Garage Lights"
                    isOn={garageLightsOn}
                    onClick={() => setGarageLightsOn((prev) => !prev)}
                  />

                  <LightControl
                    label="Side Light"
                    isOn={exteriorSideLightOn}
                    onClick={() => setExteriorSideLightOn((prev) => !prev)}
                  />

                  <LightControl
                    label="Porch Light"
                    isOn={porchLightOn}
                    onClick={() => setPorchLightOn((prev) => !prev)}
                  />
                </div>
              </section>

              <section className="phone-section">
                <h3 className="phone-section__title">Garage</h3>
                <div className="phone-section__controls">
                  <button
                    className={`phone-control ${garageOpen ? "is-active" : ""}`}
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

          {doorbellOpen && (
            <div className="doorbell-view">
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
                onClick={() => setDoorbellOpen(false)}
                aria-label="Close doorbell view"
              >
                ×
              </button>
            </div>
          )}

          {outdoorCameraOpen && (
            <div className="doorbell-view">
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
                onClick={() => setOutdoorCameraOpen(false)}
                aria-label="Close outdoor camera view"
              >
                ×
              </button>
            </div>
          )}

          {floodlightCameraOpen && (
            <div className="doorbell-view">
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
                onClick={() => setFloodlightCameraOpen(false)}
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
  );
}