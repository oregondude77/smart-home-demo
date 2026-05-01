"use client";

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
  frontDoorUnlocked,
  setFrontDoorUnlocked,
  sideDoorUnlocked,
  setSideDoorUnlocked,
}) {
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

            <div className="phone-app__status">
              <div className="phone-app__status-row">
                <span>Garage</span>
                <strong>{garageOpen ? "Open" : "Closed"}</strong>
              </div>

              <div className="phone-app__status-row">
                <span>Master Bedroom</span>
                <strong>{upstairsBedroomOn ? "On" : "Off"}</strong>
              </div>

              <div className="phone-app__status-row">
                <span>Bedroom</span>
                <strong>{bedroomOn ? "On" : "Off"}</strong>
              </div>

              <div className="phone-app__status-row">
                <span>Living Room</span>
                <strong>{livingRoomOn ? "On" : "Off"}</strong>
              </div>

              <div className="phone-app__status-row">
                <span>Dining Room</span>
                <strong>{diningRoomOn ? "On" : "Off"}</strong>
              </div>

              <div className="phone-app__status-row">
                <span>Garage Lights</span>
                <strong>{garageLightsOn ? "On" : "Off"}</strong>
              </div>

              <div className="phone-app__status-row">
                <span>Front Door</span>
                <strong>{frontDoorUnlocked ? "Unlocked" : "Locked"}</strong>
              </div>

              <div className="phone-app__status-row">
                <span>Side Door</span>
                <strong>{sideDoorUnlocked ? "Unlocked" : "Locked"}</strong>
              </div>

              <div className="phone-app__status-row">
                <span>Camera</span>
                <strong>{cameraOn ? "On" : "Off"}</strong>
              </div>

              <div className="phone-app__status-row">
                <span>System</span>
                <strong>{armed ? "Armed" : "Disarmed"}</strong>
              </div>
            </div>

            <div className="phone-app__controls">
              <button
                className={`phone-control ${garageOpen ? "is-active" : ""}`}
                onClick={() => setGarageOpen((prev) => !prev)}
              >
                {garageOpen ? "Close Garage" : "Open Garage"}
              </button>

              <button
                className={`phone-control ${
                  upstairsBedroomOn ? "is-active" : ""
                }`}
                onClick={() => setUpstairsBedroomOn((prev) => !prev)}
              >
                {upstairsBedroomOn
                  ? "Turn Master Bedroom Off"
                  : "Turn Master Bedroom On"}
              </button>

              <button
                className={`phone-control ${bedroomOn ? "is-active" : ""}`}
                onClick={() => setBedroomOn((prev) => !prev)}
              >
                {bedroomOn ? "Turn Bedroom Off" : "Turn Bedroom On"}
              </button>

              <button
                className={`phone-control ${livingRoomOn ? "is-active" : ""}`}
                onClick={() => setLivingRoomOn((prev) => !prev)}
              >
                {livingRoomOn
                  ? "Turn Living Room Off"
                  : "Turn Living Room On"}
              </button>

              <button
                className={`phone-control ${diningRoomOn ? "is-active" : ""}`}
                onClick={() => setDiningRoomOn((prev) => !prev)}
              >
                {diningRoomOn
                  ? "Turn Dining Room Off"
                  : "Turn Dining Room On"}
              </button>

              <button
                className={`phone-control ${garageLightsOn ? "is-active" : ""}`}
                onClick={() => setGarageLightsOn((prev) => !prev)}
              >
                {garageLightsOn
                  ? "Turn Garage Lights Off"
                  : "Turn Garage Lights On"}
              </button>

              <button
                className={`phone-control ${
                  frontDoorUnlocked ? "is-active" : ""
                }`}
                onClick={() => setFrontDoorUnlocked((prev) => !prev)}
              >
                {frontDoorUnlocked ? "Lock Front Door" : "Unlock Front Door"}
              </button>

              <button
                className={`phone-control ${
                  sideDoorUnlocked ? "is-active" : ""
                }`}
                onClick={() => setSideDoorUnlocked((prev) => !prev)}
              >
                {sideDoorUnlocked ? "Lock Side Door" : "Unlock Side Door"}
              </button>

              <button
                className={`phone-control ${cameraOn ? "is-active" : ""}`}
                onClick={() => setCameraOn((prev) => !prev)}
              >
                {cameraOn ? "Turn Camera Off" : "Turn Camera On"}
              </button>

              <button
                className={`phone-control ${armed ? "is-active" : ""}`}
                onClick={() => setArmed((prev) => !prev)}
              >
                {armed ? "Disarm System" : "Arm System"}
              </button>
            </div>
          </div>
        </div>

        <div className="phone-shell__side-button phone-shell__side-button--one" />
        <div className="phone-shell__side-button phone-shell__side-button--two" />
        <div className="phone-shell__power-button" />
      </div>
    </div>
  );
}