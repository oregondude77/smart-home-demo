"use client";

import { useState } from "react";
import HouseScene from "./HouseScene";
import PhonePanel from "./PhonePanel";

export default function SmartHomeDemo() {
  const [garageOpen, setGarageOpen] = useState(false);
  const [armed, setArmed] = useState(false);

  const [upstairsBedroomOn, setUpstairsBedroomOn] = useState(false);
  const [bedroomOn, setBedroomOn] = useState(false);
  const [livingRoomOn, setLivingRoomOn] = useState(false);
  const [diningRoomOn, setDiningRoomOn] = useState(false);

  const [garageLightsOn, setGarageLightsOn] = useState(false);
  const [exteriorSideLightOn, setExteriorSideLightOn] = useState(false);
  const [porchLightOn, setPorchLightOn] = useState(false);

  const [frontDoorUnlocked, setFrontDoorUnlocked] = useState(false);
  const [sideDoorUnlocked, setSideDoorUnlocked] = useState(false);

  const [nightMode, setNightMode] = useState(false);

  /* FULL SCREEN PHONE CAMERA */
  const [activeCamera, setActiveCamera] = useState(null);

  /* HOUSE LIVE CAMERA MARKER */
  const [liveCamera, setLiveCamera] = useState(null);

  return (
    <div className="demo">
    <div className="demo-hero-copy">
  <div className="demo-hero-pill">
    <span></span>
    Interactive Smart Home Demo
  </div>

  <h1>Smarter Security. Real-Time Control.</h1>

  <p>
    See how Alert 360 connects security, cameras, lights, locks, garage doors,
    and monitoring into one seamless smart home experience.
  </p>

  <div className="demo-hero-actions">
    <button type="button">Explore Protection</button>
    <span>24/7 Monitoring • Smart Automation • Live Video</span>
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
          exteriorSideLightOn={exteriorSideLightOn}
          setExteriorSideLightOn={setExteriorSideLightOn}
          porchLightOn={porchLightOn}
          setPorchLightOn={setPorchLightOn}
          frontDoorUnlocked={frontDoorUnlocked}
          setFrontDoorUnlocked={setFrontDoorUnlocked}
          sideDoorUnlocked={sideDoorUnlocked}
          setSideDoorUnlocked={setSideDoorUnlocked}
          nightMode={nightMode}
          setNightMode={setNightMode}
          activeCamera={activeCamera}
          setActiveCamera={setActiveCamera}
          liveCamera={liveCamera}
          setLiveCamera={setLiveCamera}
        />

        <HouseScene
          garageOpen={garageOpen}
          armed={armed}
          upstairsBedroomOn={upstairsBedroomOn}
          bedroomOn={bedroomOn}
          livingRoomOn={livingRoomOn}
          diningRoomOn={diningRoomOn}
          garageLightsOn={garageLightsOn}
          exteriorSideLightOn={exteriorSideLightOn}
          porchLightOn={porchLightOn}
          frontDoorUnlocked={frontDoorUnlocked}
          sideDoorUnlocked={sideDoorUnlocked}
          nightMode={nightMode}

          /* IMPORTANT */
          activeCamera={liveCamera}
        />
      </div>
    </div>
  );
}