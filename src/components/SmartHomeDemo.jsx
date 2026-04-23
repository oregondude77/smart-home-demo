"use client";

import { useState } from "react";
import HouseScene from "./HouseScene";
import PhonePanel from "./PhonePanel";

export default function SmartHomeDemo() {
  const [garageOpen, setGarageOpen] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [armed, setArmed] = useState(false);
  const [upstairsBedroomOn, setUpstairsBedroomOn] = useState(false);
  const [livingRoomOn, setLivingRoomOn] = useState(false);
  const [frontDoorUnlocked, setFrontDoorUnlocked] = useState(false);
  const [sideDoorUnlocked, setSideDoorUnlocked] = useState(false);

  return (
    <div className="demo">
      <div className="demo-grid">
        <PhonePanel
          garageOpen={garageOpen}
          setGarageOpen={setGarageOpen}
          cameraOn={cameraOn}
          setCameraOn={setCameraOn}
          armed={armed}
          setArmed={setArmed}
          upstairsBedroomOn={upstairsBedroomOn}
          setUpstairsBedroomOn={setUpstairsBedroomOn}
          livingRoomOn={livingRoomOn}
          setLivingRoomOn={setLivingRoomOn}
          frontDoorUnlocked={frontDoorUnlocked}
          setFrontDoorUnlocked={setFrontDoorUnlocked}
          sideDoorUnlocked={sideDoorUnlocked}
          setSideDoorUnlocked={setSideDoorUnlocked}
        />

        <HouseScene
          garageOpen={garageOpen}
          cameraOn={cameraOn}
          armed={armed}
          upstairsBedroomOn={upstairsBedroomOn}
          livingRoomOn={livingRoomOn}
          frontDoorUnlocked={frontDoorUnlocked}
          sideDoorUnlocked={sideDoorUnlocked}
        />
      </div>
    </div>
  );
}