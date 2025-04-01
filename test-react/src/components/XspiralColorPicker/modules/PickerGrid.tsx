/** @jsxImportSource @emotion/react */
import Bottom from "./Bottom";
import { useEffect, useState } from "react";
import { AlphaPicker } from "react-color";
import { extractAlphaFromRGBA, extractRGBFromRGBA, hexToRgb, rgbToHex } from "../../../utils/api";
import { css } from "@emotion/react";
import StrawIcon from "../../../assets/cursor/syringe.svg";
import { useAppDispatch } from "../../../common/store/configureStore.tsx";
import { RgbaString, addRecentColor } from "../../../common/reducers/userConfig.tsx";

interface RGBAColorType {
  r: number | string;
  g: number | string;
  b: number | string;
  a?: number | string;
}

const PickerGrid = (props: { setColor?: Function; transparent?: number; color: string }) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState("");
  const colorsArray = [
    "#000000",
    "#333333",
    "#4F4F4F",
    "#6C6C6C",
    "#9A9A9A",
    "#BEBEBE",
    "#CECECE",
    "#EFEFEF",
    "#ffffff",
    "#C00000",
    "#FF0000",
    "#FFA800",
    "#FFFF00",
    "#00B050",
    "#3AF5FF",
    "#089BFF",
    "#0C13FF",
    "#A71BFF",
    "#FF7676",
    "#FFB7B7",
    "#FFDA92",
    "#FFFC9D",
    "#D5F691",
    "#C4FBFE",
    "#CCEAFF",
    "#A5A8FF",
    "#CDAEFF",
    "#58110E",
    "#9E1E1A",
    "#B86014",
    "#93780F",
    "#277C4F",
    "#1274A5",
    "#1450B8",
    "#060958",
    "#351173",
  ];
  const onChangeColor = (color: string) => {
    const rgb = hexToRgb(color);
    const alpha = extractAlphaFromRGBA(state);
    const rgbStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
    setState(rgbStr);
    if (props.setColor) props.setColor(rgbStr);
    dispatch(addRecentColor(rgbStr as RgbaString));
  };

  const handleChangeComplete = ({ rgb }: { rgb: RGBAColorType }) => {
    if (props.setColor) props.setColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a ?? 1})`);
  };

  const changeDotStyle = () => {
    const rgb: RGBAColorType = extractRGBFromRGBA(state);
    const dot = document.querySelector(
      ".custom-alpha > div > div:last-child > div > div",
    ) as HTMLElement;
    dot.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  };
  const [active, setActive] = useState(-1);
  useEffect(() => {
    if (props.color != state) {
      let hex = rgbToHex(extractRGBFromRGBA(props.color));
      let index = colorsArray.findIndex((item) => item.toLowerCase() === `#${hex.toLowerCase()}`);
      setActive(index);
      setState(props.color);
    }
  }, [props.color]);

  useEffect(() => {
    changeDotStyle();
  }, [state]);

  return (
    <>
      <div
        css={css`
          margin-top: 14px;
        `}
      >
        <div className="color-collect">
          {colorsArray.map((value, index) => {
            return (
              <div
                onClick={() => {
                  onChangeColor(value);
                  setActive(index);
                }}
                key={value + Math.random()}
                style={{
                  cursor: "pointer",
                  boxSizing: "border-box",
                  width: "18px",
                  height: "18px",
                  background: `${value}`,
                  borderRadius: "2px",
                  border: "1px rgba(102, 102, 102, 0.10) solid",
                  borderColor: `${
                    active === index ? "rgba(151, 55, 255, 1)" : "rgba(102, 102, 102, 0.10)"
                  }`,
                }}
                css={css`
                  &:hover {
                    border-color: rgba(151, 55, 255, 1) !important;
                  }
                `}
              ></div>
            );
          })}
        </div>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 12px 0;
          `}
        >
          {/*<img*/}
          {/*  src={StrawIcon}*/}
          {/*  className="plane-straw"*/}
          {/*  css={css`*/}
          {/*    margin: 12px 0;*/}
          {/*  `}*/}
          {/*/>*/}
          <AlphaPicker color={state} onChange={handleChangeComplete} className="custom-alpha" />
        </div>
        <Bottom color={props.color} setColor={props.setColor} />
      </div>
    </>
  );
};
export default PickerGrid;
