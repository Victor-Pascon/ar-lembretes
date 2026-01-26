import { useState } from "react";
import { AvatarConfig } from "@/components/avatar/AvatarModel";
import ARStartScreen from "./ARStartScreen";
import ARCameraView from "./ARCameraView";

interface ReminderData {
  title: string;
  message: string;
  location?: string;
  creatorName?: string;
}

interface ARExperienceProps {
  reminder: ReminderData;
  avatarConfig: AvatarConfig;
  onClose: () => void;
}

type ARState = "start" | "camera";

const ARExperience = ({ reminder, avatarConfig, onClose }: ARExperienceProps) => {
  const [arState, setArState] = useState<ARState>("start");

  const handleStart = () => {
    setArState("camera");
  };

  return (
    <>
      {arState === "start" && (
        <ARStartScreen
          title={reminder.title}
          location={reminder.location}
          onStart={handleStart}
        />
      )}
      {arState === "camera" && (
        <ARCameraView
          message={reminder.message}
          avatarConfig={avatarConfig}
          title={reminder.title}
          location={reminder.location}
          creatorName={reminder.creatorName}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default ARExperience;
