/** @jsxImportSource @emotion/react */
import styles from "./styles.module.less";
import { useState, useMemo, useEffect, Dispatch, SetStateAction } from "react";
import { Picker } from "./modules/Picker";
import { Popover, Input } from "antd";
import { css, SerializedStyles } from "@emotion/react";
import { w24, h24, midAlign } from "../../common/globalStyle";
import { extractAlphaFromRGBA, extractRGBFromRGBA, rgbToHex } from "../../utils/api";
import mosaic from "../../assets/mosaic.svg";
import { useTranslation } from "react-i18next";
import { ColorType, GradientTable } from "./modules/Gradient";
import { MixedGradientIcon } from "../Icons/Icons";

enum Tab {
  color = 1,
  img = 2,
  normal = 3,
}

const bgImg = css`
  background-image: url(${mosaic});
  background-size: 12px 12px;
  background-position: 5px;
`;
interface ColorContentRenderProps {
  rect?: React.ReactElement | React.ReactElement[] | null;
  rectStyle?: SerializedStyles;
  inputStyle?: SerializedStyles;
  handleClick?: () => void;
  inputText: string;
}
export const ColorContentRender: React.FC<ColorContentRenderProps> = ({
  rect,
  rectStyle,
  inputStyle,
  inputText,
  handleClick,
}) => {
  return (
    <div
      css={css`
        ${midAlign};
        width: 166px;
      `}
    >
      <div
        css={css`
          ${w24};
          ${h24};
          flex-shrink: 0;
          ${rectStyle}
        `}
        className={styles["active-color"]}
        onClick={handleClick}
      >
        {rect}
      </div>
      <div
        css={css`
          margin-left: 8px;
        `}
      >
        <Input
          css={css`
            ${inputStyle}
          `}
          className="custom-input"
          readOnly
          value={inputText}
        />
      </div>
    </div>
  );
};

const XspiralColorPicker: React.FC<{
  unlit?: boolean;
  setDefault?: Function;
  disabledColor?: boolean;
  disabled?: boolean;
  normalCover?: string;
  cover?: string;
  setColor: Function;
  transparent: number;
  color: string;
  isImage?: boolean;
  isColor?: boolean;
  isNormal?: boolean;
  colorTemplate?: Function;
  gradients?: GradientTable[];
}> = ({
  unlit,
  disabledColor,
  disabled,
  setColor,
  transparent,
  color,
  isImage = false,
  cover,
  isColor = true,
  isNormal = false,
  normalCover,
  colorTemplate,
  setDefault,
  gradients,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState(Tab.color);
  const [transparency, setTransparency] = useState(1);
  const colorHex = useMemo(() => {
    const rgbColor = extractRGBFromRGBA(color) || "rgba(0,0,0,1)";
    if (color) {
      setTransparency(extractAlphaFromRGBA(color));
    }
    return rgbToHex({ ...rgbColor });
  }, [color]);
  const gradienType = useMemo(() => {
    if (gradients) {
      let typeid;
      for (let i = 0; i < gradients?.length; ++i) {
        if (i === 0) typeid = gradients[i].gradient_type;
        else if (typeid !== gradients[i].gradient_type) typeid = "mixed";
      }
      return typeid;
    }
    console.log(gradients);
  }, [gradients]);
  return (
    <>
      <Popover
        open={disabled || disabledColor ? false : isOpen}
        onOpenChange={(flag) => {
          setIsOpen(flag);
        }}
        content={
          <Picker
            unlit={unlit}
            setDefault={setDefault}
            tab={tab}
            normalCover={normalCover}
            isColor={isColor}
            cover={cover}
            setIsOpen={setIsOpen}
            setColor={setColor}
            transparent={transparent}
            isImage={isImage}
            isNormal={isNormal}
            color={color}
            gradients={gradients}
          />
        }
        placement="left"
        trigger="click"
        arrow={false}
        overlayInnerStyle={{
          marginBottom: "8px",
          padding: 0,
          backgroundColor: "transparent",
          boxShadow: "none",
          marginRight: "90px",
        }}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 12px;
          `}
        >
          <ColorContentRender
            rectStyle={css`
              background-color: ${disabled || disabledColor
                ? "#999999"
                : color
                ? color
                : "#B7E9FF"};
              ${transparency === 0 ? bgImg : ""};
              opacity: ${transparency === 0 && disabled ? 0.6 : 1};
            `}
            inputStyle={css`
              color: ${disabled || disabledColor ? "#999999" : ""};
            `}
            inputText={
              colorTemplate ? colorTemplate(colorHex.toUpperCase()) : colorHex.toUpperCase()
            }
            handleClick={() => {
              if (!isOpen) {
                setTab(Tab.color);
              }
              setIsOpen(!isOpen);
            }}
          />
          {isImage && cover !== mosaic && (
            <div
              css={css`
                ${midAlign};
                width: 166px;
              `}
            >
              <div
                css={css`
                  ${w24};
                  ${h24};
                  flex-shrink: 0;
                  overflow: hidden;
                `}
                className={styles["active-color"]}
                onClick={() => {
                  if (!isOpen) {
                    setTab(Tab.img);
                  }
                  setIsOpen(!isOpen);
                }}
              >
                <img src={cover} width={24} height={24} />
              </div>
              <div
                css={css`
                  margin-left: 8px;
                `}
              >
                <Input className="custom-input" readOnly value={t("attrSetting.image")} />
              </div>
            </div>
          )}
          {isNormal && normalCover !== mosaic && (
            <div
              css={css`
                ${midAlign};
                width: 166px;
              `}
            >
              <div
                css={css`
                  ${w24};
                  ${h24};
                  flex-shrink: 0;
                  overflow: hidden;
                `}
                className={styles["active-color"]}
                onClick={() => {
                  if (!isOpen) {
                    setTab(Tab.normal);
                  }
                  setIsOpen(!isOpen);
                }}
              >
                <img src={normalCover} width={24} height={24} />
              </div>
              <div
                css={css`
                  margin-left: 8px;
                `}
              >
                <Input className="custom-input" readOnly value={t("attrSetting.normalMap")} />
              </div>
            </div>
          )}
          {gradients && gradients.length ? (
            <>
              <ColorContentRender
                rectStyle={css`
                  border-radius: 4px;
                  border: 1px solid rgba(102, 102, 102, 0.2);
                  background: ${gradienType === ColorType.Linear
                    ? "linear-gradient(180deg, #FFF 0%, #999 100%)"
                    : gradienType === ColorType.Polar
                    ? "radial-gradient(50% 50% at 50% 50%, #FFF 0%, #999 100%)"
                    : gradienType === ColorType.Radial
                    ? "conic-gradient(from 180deg at 50% 50%, #FFF 0deg, #999 360deg)"
                    : "#fff"};
                `}
                rect={gradienType === "mixed" ? <MixedGradientIcon /> : null}
                inputText={"渐变色"}
                handleClick={() => {
                  if (!isOpen) {
                    setTab(Tab.color);
                  }
                  setIsOpen(!isOpen);
                }}
              />
            </>
          ) : null}
        </div>
      </Popover>
    </>
  );
};
export default XspiralColorPicker;
