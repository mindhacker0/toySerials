/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ColorFactory } from "antd/es/color-picker/color";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import PickerPlane from "./PickerPlane";
import PropInput from "../../PropInput/PropInput";
import { midAlign } from "../../../common/globalStyle";
import { Radio, RadioChangeEvent } from "antd";
import MutiColorPicker, { ColorStop } from "./MutiColorPicker";
import { DeleteIcon } from "../../Icons/Icons";

export const COLOR_DELTA = 255;
export enum BlendType {
  Normal = "Normal",
  Multiply = "Multiply",
  Screen = "Screen",
  Overlay = "Overlay",
}
export enum ColorType {
  Color = "Color",
  Linear = "Linear",
  Radial = "Radial",
  Polar = "Polar",
}
export type FormateColorStop = [
  { Srgba: { red: number; green: number; blue: number; alpha: number } },
  number,
];
export interface GradientTable {
  gradient_type: Omit<ColorType, "Color">;
  smoothed: boolean;
  colors: FormateColorStop[];
  offset: [x: number, y: number];
  morph: [x: number, y: number];
  angle: number;
  is_mask: boolean;
  mask: number;
  alpha: number;
  blend_type: BlendType;
}
interface GradientOffset {
  x: number;
  y: number;
}
const formatToStop = (color: FormateColorStop): ColorStop => {
  const { red, green, blue, alpha } = color[0].Srgba;
  return {
    offset: color[1],
    color: new ColorFactory(
      `rgba(${red * COLOR_DELTA},${green * COLOR_DELTA},${blue * COLOR_DELTA},${alpha || 1})`,
    ),
  };
};
const stopToFormat = (color: ColorStop): FormateColorStop => {
  const rgb = color.color.toRgb();
  return [
    {
      Srgba: {
        red: rgb.r / COLOR_DELTA,
        green: rgb.g / COLOR_DELTA,
        blue: rgb.b / COLOR_DELTA,
        alpha: rgb.a || 1,
      },
    },
    color.offset,
  ];
};
const InputMemoFactory = (attrs: Parameters<typeof PropInput>[0], dep: unknown[]) => {
  return useMemo(() => {
    return (
      <PropInput
        base={1}
        isMove={true}
        style={css`
          width: 79px;
          padding-left: 20px;
        `}
        {...attrs}
      ></PropInput>
    );
  }, [dep]);
};
interface MutiColorPickerWithRadioProps {
  index: number;
  colorIndex: number;
  setColor: Dispatch<SetStateAction<string>>;
  setColorIndex: Dispatch<SetStateAction<number>>;
  setGradientIndex: Dispatch<SetStateAction<number>>;
  active: boolean;
  colors: FormateColorStop[];
  handleRemove?: () => void;
  onColorStopChange?: (colors: FormateColorStop[]) => void;
}
const MutiColorPickerWithRadio: React.FC<MutiColorPickerWithRadioProps> = ({
  index,
  active,
  colorIndex,
  setColorIndex,
  colors,
  setColor,
  handleRemove,
  setGradientIndex,
  onColorStopChange,
}) => {
  const [colorStopList, setColorStopList] = useState<ColorStop[]>([]);
  useEffect(() => {
    setColorStopList(colors.map(formatToStop));
  }, [colors]);
  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    handleRemove && handleRemove();
  };
  const handleColorListChange = (colors: ColorStop[]) => {
    if (onColorStopChange && active) onColorStopChange(colors.map(stopToFormat));
  };
  return (
    <Radio value={index}>
      <div
        css={css`
          width: 212px;
          ${midAlign};
          justify-content: space-between;
        `}
      >
        <MutiColorPicker
          gradientActive={active}
          gradientIndex={index}
          colorList={colorStopList}
          colorActive={colorIndex}
          setColor={setColor}
          setColorList={setColorStopList}
          setColorActive={setColorIndex}
          setGradientIndex={setGradientIndex}
          onColorListChange={handleColorListChange}
        />
        <DeleteIcon
          css={css`
            opacity: 0.2;
          `}
          onClick={handleDelete}
        />
      </div>
    </Radio>
  );
};
interface GradientProps {
  setColorType: Dispatch<SetStateAction<ColorType>>;
  gradientList: GradientTable[];
  onGradientChange: (list: GradientTable[], async?: false) => void;
  gradientListRemove?: (index: number) => void;
}
const Gradient: React.FC<GradientProps> = ({
  onGradientChange,
  gradientListRemove,
  gradientList,
  setColorType,
}) => {
  const [color, setColor] = useState<string>("");
  const [angle, setAngle] = useState<number>(0);
  const [graOffset, setGraOffset] = useState<GradientOffset>({ x: 0, y: 0 });
  const [morph, setMorph] = useState<GradientOffset>({ x: 0, y: 0 });
  const [colorIndex, setColorIndex] = useState<number>(0);
  const [gradientIndex, setGradientIndex] = useState<number>(0);
  const memoizedAngle = useMemo(() => {
    return (
      <PropInput
        base={1}
        isMove={true}
        text={"A"}
        style={css`
          width: 166px;
          padding-left: 20px;
        `}
        value={angle}
        change={(value: number) => {
          let v = value;
          setAngle(v);
          const curGradient = gradientList[gradientIndex];
          curGradient.angle = angle;
          onGradientChange(gradientList);
        }}
      ></PropInput>
    );
  }, [angle]);
  const memoizedOffsetX = InputMemoFactory(
    {
      text: "X",
      value: graOffset.x,
      change: (v: number) => {
        setGraOffset((k) => ({ x: v, y: k.y }));
        const curGradient = gradientList[gradientIndex];
        curGradient.offset = [v, graOffset.y];
        onGradientChange(gradientList);
      },
    },
    [graOffset.x],
  );
  const memoizedOffsetY = InputMemoFactory(
    {
      text: "Y",
      value: graOffset.y,
      change: (v: number) => {
        setGraOffset((k) => ({ x: k.x, y: v }));
        const curGradient = gradientList[gradientIndex];
        curGradient.offset = [graOffset.x, v];
        onGradientChange(gradientList);
      },
    },
    [graOffset.y],
  );
  const memoizedMorphX = InputMemoFactory(
    {
      text: "X",
      value: morph.x,
      change: (v: number) => {
        setMorph((k) => ({ x: v, y: k.y }));
        const curGradient = gradientList[gradientIndex];
        curGradient.morph = [v, morph.y];
        onGradientChange(gradientList);
      },
    },
    [morph.x],
  );
  const memoizedMorphY = InputMemoFactory(
    {
      text: "Y",
      value: morph.y,
      change: (v: number) => {
        setMorph((k) => ({ x: k.x, y: v }));
        const curGradient = gradientList[gradientIndex];
        curGradient.morph = [morph.x, v];
        onGradientChange(gradientList);
      },
    },
    [morph.y],
  );
  const curColorChange = (color: string) => {
    //change cur stop color.
    setColor(color);
    const rgb = new ColorFactory(color).toRgb();
    const curGradient = gradientList[gradientIndex];
    curGradient.colors[colorIndex][0] = {
      Srgba: {
        red: rgb.r / COLOR_DELTA,
        green: rgb.g / COLOR_DELTA,
        blue: rgb.b / COLOR_DELTA,
        alpha: rgb.a || 1,
      },
    };
    console.log("color change", gradientIndex, colorIndex);
    onGradientChange(gradientList);
  };
  const handleColorStopChange = (colors: FormateColorStop[]) => {
    const curGradient = gradientList[gradientIndex];
    curGradient.colors = colors;
    onGradientChange(gradientList);
  };
  useEffect(() => {
    const gradient = gradientList[gradientIndex];
    if (gradient) {
      setAngle(gradient.angle);
      setMorph({ x: gradient.morph[0], y: gradient.morph[1] });
      setGraOffset({ x: gradient.offset[0], y: gradient.offset[1] });
    }
  }, [gradientIndex, gradientList]);
  return (
    <div>
      <div
        css={css`
          margin-top: 12px;
        `}
      >
        <Radio.Group
          onChange={(e: RadioChangeEvent) => {
            const value: number = e.target.value;
            setGradientIndex(value);
            setColorIndex(0);
            const activeColor = formatToStop(gradientList[value].colors[0]);
            if (activeColor) setColor(activeColor.color.toRgbString());
            setColorType(gradientList[value].gradient_type as ColorType);
          }}
          value={gradientIndex}
          className="spiral-radio-group"
        >
          {gradientList.map((v, index) => (
            <MutiColorPickerWithRadio
              active={index === gradientIndex}
              key={index}
              index={index}
              colors={v.colors}
              handleRemove={() => {
                gradientListRemove && gradientListRemove(index);
              }}
              onColorStopChange={handleColorStopChange}
              colorIndex={colorIndex}
              setColorIndex={setColorIndex}
              setGradientIndex={setGradientIndex}
              setColor={setColor}
            />
          ))}
        </Radio.Group>
      </div>
      <div>
        <PickerPlane setColor={curColorChange} color={color} />
      </div>
      <div
        css={css`
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        `}
      >
        <div
          css={css`
            width: 100%;
            ${midAlign};
            color: #333;
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              width: auto;
            `}
          >
            <span>{"Angle"}</span>
          </div>
          <div
            css={css`
              display: flex;
              gap: 8px;
              .custom-addon {
                width: 20px;
              }
            `}
          >
            {memoizedAngle}
          </div>
        </div>
        <div
          css={css`
            width: 100%;
            ${midAlign};
            color: #333;
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              width: auto;
            `}
          >
            <span>{"Offset"}</span>
          </div>
          <div
            css={css`
              display: flex;
              gap: 8px;
              .custom-addon {
                width: 20px;
              }
            `}
          >
            {memoizedOffsetX}
            {memoizedOffsetY}
          </div>
        </div>
        <div
          css={css`
            width: 100%;
            ${midAlign};
            color: #333;
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              width: auto;
            `}
          >
            <span>{"Morph"}</span>
          </div>
          <div
            css={css`
              display: flex;
              gap: 8px;
              .custom-addon {
                width: 20px;
              }
            `}
          >
            {memoizedMorphX}
            {memoizedMorphY}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gradient;
