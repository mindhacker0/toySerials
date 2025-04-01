/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { ChromePicker, AlphaPicker, HuePicker } from "react-color";
import "./styles.module.less";
import StrawIcon from "../../../assets/cursor/syringe.svg";
import { css } from "@emotion/react";
import { extractRGBFromRGBA } from "../../../utils/api";
import Bottom from "./Bottom.tsx";
import { useAppDispatch } from "../../../common/store/configureStore.tsx";
import { addRecentColor } from "../../../common/reducers/userConfig.tsx";
interface RGBAColorType {
  r: number | string;
  g: number | string;
  b: number | string;
  a?: number | string;
}

const PickerPlane = (props: { setColor?: Function; transparent?: number; color: string }) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState("");
  const handleChangeComplete = ({ rgb }: { rgb: RGBAColorType }) => {
    if (props.setColor) props.setColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
  };

  const handleChangeAlpha = ({ rgb }: { rgb: RGBAColorType }) => {
    if (props.setColor) props.setColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a ?? 1})`);
  };

  useEffect(() => {
    const rgb: RGBAColorType = extractRGBFromRGBA(state);
    const dot = document.querySelector(".hue-picker .hue-horizontal > div > div") as HTMLElement;
    const transparent = document.querySelector(
      ".custom-alpha > div > div:last-child > div > div",
    ) as HTMLElement;
    dot.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    transparent.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a ?? 1})`;
  }, [state]);

  useEffect(() => {
    setState(props.color);
  }, [props.color]);
  return (
    <>
      <ChromePicker
        color={state}
        onChange={handleChangeComplete}
        disableAlpha={false}
        css={css`
          width: 232px !important;
        `}
        onChangeComplete={({ rgb }: { rgb: RGBAColorType }) => {
          dispatch(addRecentColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a ?? 1})`));
        }}
      />
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 36px;
          margin-top: 12px;
          margin-bottom: 16px;
        `}
      >
        {/*<img src={StrawIcon} className="plane-straw" />*/}
        <div
          css={css`
            width: 232px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          `}
        >
          <HuePicker color={state} onChange={handleChangeComplete} width="232px" height="12px" />
          <AlphaPicker
            color={state}
            onChange={handleChangeAlpha}
            width="232px"
            className="custom-alpha"
          />
        </div>
      </div>
      <Bottom color={props.color} setColor={props.setColor} />
    </>
  );
};
export default PickerPlane;
