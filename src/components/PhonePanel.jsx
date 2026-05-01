"use client";

import { useState } from "react";

export default function PhonePanel({
  garageOpen,
  setGarageOpen,
  cameraOn,
  setCameraOn,
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
                    className={`phone-control ${cameraOn ? "is-active" : ""}`}
                    onClick={() => setCameraOn((prev) => !prev)}
                  >
                    {cameraOn ? "Camera Off" : "Camera On"}
                  </button>
                </div>
              </section>

              <section className="phone-section">
                <h3 className="phone-section__title">Doorbell</h3>
                <div className="phone-section__controls">
                  <button
                    className={`phone-control ${
                      doorbellOpen ? "is-active" : ""
                    }`}
                    onClick={() => setDoorbellOpen(true)}
                  >
                    Video Doorbell
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
                    className={`phone-control ${bedroomOn ? "is-active" : ""}`}
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
        </div>

        <div className="phone-shell__side-button phone-shell__side-button--one" />
        <div className="phone-shell__side-button phone-shell__side-button--two" />
        <div className="phone-shell__power-button" />
      </div>
    </div>
  );
}