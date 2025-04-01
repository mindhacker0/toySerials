import { PropSelect } from "../../PropSelect/PropSelect.tsx";
import { useState } from "react";
import { css } from "@emotion/react";
import HEXInput from "./HEXInput";
import RGBInput from "./RGBInput";
import CSSInput from "./CSSInput";
import { h24 } from "../../../common/globalStyle";

const Bottom = (props: { setColor?: Function; color: string }) => {
  const [setting] = useState([
    { value: "HEX", label: "HEX" },
    { value: "RGB", label: "RGB" },
    { value: "CSS", label: "CSS" },
  ]);
  const [selectValue, setSelectValue] = useState(setting[0].value);
  const [value, setValue] = useState("HEX");
  return (
    <div className="plane-control">
      <PropSelect
        options={setting}
        style={css`
          width: 64px;
          ${h24};
        `}
        setSelectValue={setSelectValue}
        selectValue={selectValue}
        onChange={(value: string) => {
          setValue(value);
        }}
        menuStyle={css`
          width: auto;
        `}
      />
      {value === "HEX" && <HEXInput {...props} />}
      {value === "RGB" && <RGBInput {...props} />}
      {value === "CSS" && <CSSInput {...props} />}
    </div>
  );
};

export default Bottom;
