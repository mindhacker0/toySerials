/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Color } from "antd/es/color-picker";
import { ColorFactory } from "antd/es/color-picker/color";
import { cloneDeep } from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { searchInsert } from "../../../utils/toolkit";

interface CoordinatePos {
  x: number;
  y: number;
}
export interface ColorStop {
  offset: number; //number between 0-1
  color: Color;
  [key: string]: any;
}
interface MutiPickerThumbProps {
  colorLen: number;
  active: boolean;
  index: number;
  offset: number;
  color: Color;
  trackWidth: number;
  setOffset: (offset: number) => void;
  handleRemove?: (index: number) => void;
  onThumbClick?: (index: number, color: Color) => void;
  onDragStart?: (index: number, color: Color) => void;
  onDragEnd?: (index: number, color: Color) => void;
}

const MutiPickerThumb: React.FC<MutiPickerThumbProps> = ({
  colorLen,
  active,
  index,
  color,
  offset,
  trackWidth,
  setOffset,
  handleRemove,
  onThumbClick,
  onDragStart,
  onDragEnd,
}) => {
  const initialPos = useRef<CoordinatePos>({ x: 0, y: 0 }); //start pos.
  const offsetPos = useRef<CoordinatePos>({ x: 0, y: 0 }); //pos of mouse.
  const currentOffset = useRef<number>(offset);
  const [isDel, setIsDel] = useState<boolean>(false);
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    currentOffset.current = offset;
    if (e.target instanceof HTMLDivElement) {
      offsetPos.current = { x: 0, y: 0 }; // init
      initialPos.current.x = e.nativeEvent.clientX - e.target.offsetLeft;
      initialPos.current.y = e.nativeEvent.clientY - e.target.offsetTop;
      document.addEventListener("mousemove", handleMouseDownMove);
      document.addEventListener("mouseup", handleMouseUp);
      onDragStart && onDragStart(index, color);
    }
    e.stopPropagation();
    e.preventDefault();
  };
  const handleMouseDownMove = function (e: MouseEvent) {
    offsetPos.current.x = e.clientX - initialPos.current.x;
    offsetPos.current.y = e.clientY - initialPos.current.y;
    setIsDel(Math.abs(offsetPos.current.y) > 20 && colorLen > 2);
    const nextOffset =
      (offsetPos.current.x < 0
        ? 0
        : offsetPos.current.x > trackWidth
        ? trackWidth
        : offsetPos.current.x) / trackWidth;
    setOffset(nextOffset);
  };
  const handleMouseUp = (e: MouseEvent) => {
    const moveY = Math.abs(offsetPos.current.y);
    if (moveY > 20 && colorLen > 2) {
      //todo:distance mouse move vertical,attemp to remove thumb.
      if (handleRemove) handleRemove(index);
      setIsDel(false);
    } else {
      if (onDragEnd) onDragEnd(index, color);
    }
    document.removeEventListener("mousemove", handleMouseDownMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onThumbClick) onThumbClick(index, color);
  };
  return (
    <div
      css={css`
        width: 12px;
        height: 100%;
        border: 2px solid ${isDel ? "#DF433A" : "#fff"};
        border-radius: 8px;
        position: absolute;
        top: 0px;
        left: ${offset * 100}%;
        ${active ? "" : "box-shadow:0 0 2px #0006,inset 0 0 2px #0006;"}
        cursor:ew-resize;
        ${active
          ? css`
              ::after {
                content: "";
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border-radius: 10px;
                box-shadow: 0 0 2px #0006;
                border: 2px solid white;
                pointer-events: none;
              }
            `
          : ""}
      `}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div
        css={css`
          background: ${color.toRgbString()};
        `}
      ></div>
    </div>
  );
};

export interface MutiColorPickerProps {
  colorActive: number;
  colorList: ColorStop[]; //length of color stop no less than 2.
  gradientIndex: number;
  gradientActive: boolean;
  setColor: Dispatch<SetStateAction<string>>;
  setColorList: Dispatch<SetStateAction<ColorStop[]>>;
  setColorActive: Dispatch<SetStateAction<number>>;
  setGradientIndex: Dispatch<SetStateAction<number>>;
  onColorListChange?: (colors: ColorStop[]) => void;
}
const MutiColorPicker: React.FC<MutiColorPickerProps> = ({
  colorList,
  colorActive,
  gradientActive,
  gradientIndex,
  setColor,
  setColorList,
  setColorActive,
  setGradientIndex,
  onColorListChange,
}) => {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [trackWith, setTrackWith] = useState<number>(0);
  const [bgStr, setBgStr] = useState<string>();
  useEffect(() => {
    colorList.sort((a, b) => a.offset - b.offset);
    setBgStr(
      `linear-gradient(to right, ${colorList
        .map((v) => `${v.color.toRgbString()} ${v.offset * 100}%`)
        .join(",")})`,
    );
  }, [colorList]);
  useEffect(() => {
    if (barRef.current) {
      setTrackWith(barRef.current.offsetWidth);
    }
  }, [barRef]);
  const setOffset = (index: number, offset: number) => {
    //offset change
    const curColor = colorList[index];
    curColor.offset = offset;
    const muteColorList = cloneDeep(colorList);
    setColorList(muteColorList);
    onColorListChange && onColorListChange(muteColorList);
  };
  const removeThumb = (index: number) => {
    //del thumb
    colorList.splice(index, 1);
    const muteColorList = cloneDeep(colorList);
    setColorList(muteColorList);
    setColorActive(index > 0 ? index - 1 : index + 1); //active nearlest color.
    onColorListChange && onColorListChange(muteColorList);
  };
  const interPolateColor = (start: ColorStop, end: ColorStop, offset: number) => {
    //color interpolate
    const total = end.offset - start.offset;
    const alpha = (offset - start.offset) / total;
    const beta = (end.offset - offset) / total;
    const startColor = start.color.toRgb();
    const endColor = end.color.toRgb();
    return new ColorFactory({
      r: startColor.r * alpha + endColor.r * beta,
      g: startColor.g * alpha + endColor.g * beta,
      b: startColor.b * alpha + endColor.b * beta,
      a: startColor.a * alpha + endColor.a * beta,
    });
  };
  const handleTrackMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    //click track to add thumb.
    if (e.target instanceof HTMLDivElement) {
      const offsetAdd = e.nativeEvent.offsetX / trackWith;
      const len = colorList.length;
      let insert = searchInsert(colorList, "offset", offsetAdd);
      // add thumb to index
      const interpolatedColor =
        insert === 0
          ? colorList[insert].color
          : insert === len
          ? colorList[len - 1].color
          : interPolateColor(colorList[insert - 1], colorList[insert], offsetAdd);
      colorList.splice(insert, 0, { color: interpolatedColor, offset: offsetAdd });
      setColor(interpolatedColor.toRgbString());
      const muteColorList = cloneDeep(colorList);
      setColorList(muteColorList);
      onColorListChange && onColorListChange(muteColorList);
    }
  };
  const handleThumbClick: (index: number, color: Color) => void = (index, color) => {};
  const handleDragStart = (index: number, color: Color) => {
    setColorActive(index);
    setColor(color.toRgbString());
    setGradientIndex(gradientIndex);
  };
  const handleDragEnd = (index: number) => {
    colorList.sort((a, b) => a.offset - b.offset);
    const muteColorList = cloneDeep(colorList);
    setColorList(muteColorList);
    onColorListChange && onColorListChange(muteColorList);
  };
  return (
    <div
      css={css`
        width: 100%;
        height: 20px;
        border-radius: 8px;
        background: ${bgStr};
        padding-right: 12px;
      `}
    >
      <div
        ref={barRef}
        css={css`
          height: 100%;
          position: relative;
        `}
        onMouseDown={handleTrackMouseDown}
      >
        {colorList.map((c, index) => (
          <MutiPickerThumb
            active={gradientActive && index === colorActive}
            index={index}
            offset={c.offset}
            color={c.color}
            trackWidth={trackWith}
            colorLen={colorList.length}
            key={index}
            setOffset={(offset: number) => setOffset(index, offset)}
            handleRemove={() => removeThumb(index)}
            onThumbClick={handleThumbClick}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default MutiColorPicker;
