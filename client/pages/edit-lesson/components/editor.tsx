import { ControlledEditor } from "@monaco-editor/react";
import React from "react";

const Editor: React.FC<Props> = ({ setCode }) => {
  return (
    <iframe
      src="https://codesandbox.io/embed/parcel-template-ctq8k?fontsize=14&hidenavigation=1&theme=dark"
      className="w-full h-72"
      title="parcel template"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
  );
};

type Props = {
  setCode: (value: string) => void;
};

export default Editor;
