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
  const [activeCamera, setActiveCamera] = useState(null);

  return (
    <div className="demo">
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
          activeCamera={activeCamera}
        />
      </div>
    </div>
  );
}
