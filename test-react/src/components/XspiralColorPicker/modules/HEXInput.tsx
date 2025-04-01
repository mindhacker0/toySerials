import { Input } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import {
  extractAlphaFromRGBA,
  extractRGBFromRGBA,
  formatInteger,
  hexToRgb,
  rgbToHex,
} from "../../../utils/api";
const HEXInput = (props: { setColor?: Function; color: string }) => {
  const [printHex, setPrintHex] = useState("ffffff");
  const [transparent, setTransparent] = useState("100");
  const onChangeHex = (e: ChangeEvent<HTMLInputElement>) => {
    setPrintHex(e.target.value);
  };

  const onChangeTransparent = (e: ChangeEvent<HTMLInputElement>) => {
    let value = formatInteger(e.target.value);
    if (parseInt(value) > 100) {
      value = "100";
    } else if (parseInt(value) < 0) {
      value = "0";
    }
    setTransparent(value);
  };

  const onBlur = () => {
    const rgb = hexToRgb(printHex);
    if (typeof rgb.r === "number" && typeof rgb.g === "number" && typeof rgb.b === "number") {
      if (props.setColor) {
        props.setColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${parseInt(transparent) / 100})`);
      }
    }
  };

  useEffect(() => {
    const rgbColor = extractRGBFromRGBA(props.color);
    if (rgbColor) {
      const hexColor = rgbToHex({ ...rgbColor });
      setPrintHex(hexColor);
      setTransparent(String(parseInt(String(extractAlphaFromRGBA(props.color) * 100))));
    }
  }, [props.color]);

  return (
    <>
      <div>
        <Input
          style={{ width: "100px" }}
          onBlur={onBlur}
          prefix="#"
          className="plane-input"
          value={printHex}
          onChange={(e) => {
            onChangeHex(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>
      <div>
        <Input
          style={{ width: "52px" }}
          suffix="%"
          onBlur={onBlur}
          className="plane-input"
          value={transparent}
          onChange={(e) => {
            onChangeTransparent(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>
    </>
  );
};
export default HEXInput;
