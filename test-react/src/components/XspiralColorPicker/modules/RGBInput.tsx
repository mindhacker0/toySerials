import { Divider, Input, InputNumber, Space } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { extractAlphaFromRGBA, extractRGBFromRGBA, formatInteger } from "../../../utils/api";

const RGBInput = (props: { setColor?: Function; color: string }) => {
  const [colorRgb, setColorRgb] = useState({ r: 0, g: 0, b: 0 });
  const [transparent, setTransparent] = useState(100);

  const onChangeTransparent = (e: ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(formatInteger(e.target.value));
    if (value > 100) {
      value = 100;
    } else if (value < 0) {
      value = 0;
    }
    setTransparent(value);
  };

  const onChangeRgb = (e: number | string, key: keyof typeof colorRgb) => {
    const color = { ...colorRgb };
    color[key] = typeof e === "number" ? e : parseInt(e, 10);
    setColorRgb(color);
  };
  const onBlur = () => {
    if (
      typeof colorRgb.r === "number" &&
      typeof colorRgb.g === "number" &&
      typeof colorRgb.b === "number" &&
      typeof transparent === "number"
    ) {
      if (props.setColor)
        props.setColor(`rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${transparent / 100})`);
    }
  };

  useEffect(() => {
    const rgbColor = extractRGBFromRGBA(props.color);
    if (rgbColor) {
      setColorRgb(rgbColor);
      setTransparent(parseInt(String(extractAlphaFromRGBA(props.color) * 100)));
    }
  }, [props.color]);

  return (
    <>
      <div className="picker-space">
        <Space.Compact>
          <InputNumber
            onBlur={onBlur}
            formatter={(value: string | undefined) => {
              if (value === undefined) {
                return "";
              }
              return formatInteger(value);
            }}
            value={String(colorRgb.r)}
            max={"255"}
            min={"0"}
            controls={false}
            onChange={(e) => {
              if (typeof e === "number") onChangeRgb(e, "r");
            }}
          />
          <Divider type="vertical" className="custom-divider" />
          <InputNumber
            onBlur={onBlur}
            formatter={(value: string | undefined) => {
              if (value === undefined) {
                return "";
              }
              return formatInteger(value);
            }}
            value={String(colorRgb.g)}
            max={"255"}
            min={"0"}
            controls={false}
            onChange={(e) => {
              if (typeof e === "number") onChangeRgb(e, "g");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
          <Divider type="vertical" className="custom-divider" />
          <InputNumber
            onBlur={onBlur}
            formatter={(value: string | undefined) => {
              if (value === undefined) {
                return "";
              }
              return formatInteger(value);
            }}
            value={String(colorRgb.b)}
            max={"255"}
            min={"0"}
            controls={false}
            onChange={(e) => {
              if (typeof e === "number") onChangeRgb(e, "b");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
        </Space.Compact>
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
export default RGBInput;
