/** @jsxImportSource @emotion/react */
import "./styles.module.less";
import {
  DeleteImgIcon,
  CloseOutIcon,
  FlipVerticalIcon,
  PickerResettingIcon,
  ToolTipIcon,
} from "../../Icons/Icons.tsx";
import React, { useEffect, useRef, useState, useContext } from "react";
import { Divider, Tooltip } from "antd";
import ColorCollect from "./ColorCollect";
import { css } from "@emotion/react";
import {
  fontFormatStyle,
  fontStyle,
  h24,
  midAlign,
  midJustify,
  tooltipStyle,
  w24,
} from "../../../common/globalStyle.ts";
import mosaic from "../../../assets/mosaic.svg";
import Upload from "../../Upload";
import RangeSlider from "../../RangeSlider/index.tsx";
import { spiralApp } from "../../../services/spiralApp.ts";
import { ParaData } from "@wzyc/spiral/out/communication/eventType";
import {
  imageToImageData,
  urlToImage,
  flipImageDataHorizontally,
  imageDataToBlob,
  rotateImageData90,
} from "../../../utils/api/index.tsx";
import { useTranslation } from "react-i18next";
import { PropSelect } from "../../PropSelect/PropSelect.tsx";
import { AlphaModeType } from "@wzyc/spiral";
import { SpiralShapeDataContext } from "../../../common/context/spiralShapeContext.tsx";
import PropCheckBox from "../../PropCheckBox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import Gradient, { BlendType, ColorType, FormateColorStop, GradientTable } from "./Gradient.tsx";
import { SelectType } from "../../../utils/type/index.tsx";
import { Palette, PaletteSwitch, PaletteType } from "./Palette.tsx";
import { AddIcon } from "../../Icons/homeIcons.tsx";
import { cloneDeep } from "lodash";

const imageIconStyle = css`
  ${w24};
  ${h24};
  ${midAlign};
  ${midJustify};
  cursor: pointer;

  &:hover {
    color: #9737ff;
    background: #f0f0f0;
    border-radius: 4px;
  }
`;

const ColorPicker = (props: {
  unlit?: boolean;
  setColor: (color: string) => void;
  color: string;
  transparent?: number;
  setDefault?: Function;
  gradients?: GradientTable[];
}) => {
  const { t } = useTranslation();
  const colorTypeOptions: SelectType[] = [
    { value: ColorType.Color, label: "纯色" },
    { value: ColorType.Linear, label: t("colorPicker.linear") },
    { value: ColorType.Radial, label: t("colorPicker.radial") },
    { value: ColorType.Polar, label: t("colorPicker.angle") },
  ];
  const [colorType, setColorType] = useState<ColorType>(ColorType.Color);
  const [paletteType, setPaletteType] = useState<PaletteType>(PaletteType.grid);
  const onChangeTabs = (value: PaletteType) => {
    setPaletteType(value);
  };
  const [gradientList, setGradientList] = useState<GradientTable[]>([]);
  const gradientListAdd = () => {
    const colors: FormateColorStop[] = [
      [{ Srgba: { red: 1, green: 1, blue: 1, alpha: 1 } }, 0],
      [{ Srgba: { red: 0, green: 0, blue: 0, alpha: 1 } }, 1],
    ]; //default gradient.
    const defaultGradient: GradientTable = {
      gradient_type: colorType,
      colors,
      angle: 0,
      morph: [0, 0],
      offset: [0, 0],
      is_mask: false,
      mask: 1.0,
      alpha: 1.0,
      blend_type: BlendType.Normal,
      smoothed: false,
    };
    gradientList.push(defaultGradient);
    onGradientChange(gradientList);
  };
  const gradientListRemove = (index: number) => {
    if (gradientList.length < 1) return;
    gradientList.splice(index, 1);
    onGradientChange(gradientList);
  };
  useEffect(() => {
    if (
      (!props.gradients || props.gradients.length === 0) &&
      gradientList.length === 0 &&
      colorType !== ColorType.Color
    )
      gradientListAdd();
    else setGradientList(props.gradients);
    console.log("init", props.gradients);
  }, [props.gradients, colorType]);
  const onGradientChange = (gradients: GradientTable[]) => {
    console.log("set", gradients);
    setGradientList(cloneDeep(gradientList));
    spiralApp.setProperty({
      material_para: {
        gradients: gradientList,
      },
    });
  };
  return (
    <div
      css={css`
        padding-top: 12px;
      `}
    >
      <div
        css={css`
          color: #333;
          ${midAlign};
          justify-content: space-between;
        `}
      >
        <div>
          <span>{t("attrSetting.type")}</span>
        </div>
        <PropSelect
          options={colorTypeOptions}
          style={css`
            width: 166px;
          `}
          selectValue={colorType}
          onChange={(v: ColorType) => setColorType(v)}
        />
      </div>
      <div
        css={css`
          ${midAlign};
          justify-content: space-between;
          margin-top: 12px;
        `}
      >
        {props.setDefault && (
          <div
            css={css`
              width: 174px;
              height: 24px;
              border-radius: 4px;
              background: #f0f0f0;
              ${fontStyle};
              ${midAlign};
              cursor: pointer;
              justify-content: center;

              &:hover {
                background: #dcdcdc;
              }
            `}
            onClick={() => {
              if (props.setDefault) props.setDefault();
            }}
          >
            {t("attrSetting.clear")}
          </div>
        )}
        {props.unlit != undefined && (
          <PropCheckBox
            onChange={(value: CheckboxValueType[]) => {
              if (value.length > 0) {
                spiralApp.setProperty({
                  material_para: {
                    unlit: true,
                  },
                });
              } else {
                spiralApp.setProperty({
                  material_para: {
                    unlit: false,
                  },
                });
              }
            }}
            options={[{ label: t("attrSetting.unlit"), value: true }]}
          />
        )}
        {colorType === ColorType.Color ? (
          <PaletteSwitch type={paletteType} onChange={onChangeTabs} />
        ) : (
          <div
            css={css`
              height: 24px;
              ${midAlign};
              gap: 4px;
              padding: 0 12px;
              color: #333;
              border-radius: 4px;
              border: 1px solid #dcdcdc;
              background: #f0f0f0;
              cursor: pointer;
            `}
            onClick={gradientListAdd}
          >
            <AddIcon />
            <span>{t("colorPicker.addGdt")}</span>
          </div>
        )}
      </div>
      <div>
        {colorType === ColorType.Color ? (
          <Palette
            color={props.color}
            setColor={props.setColor}
            transparent={props.transparent}
            type={paletteType}
          />
        ) : (
          <Gradient
            setColorType={setColorType}
            gradientList={gradientList}
            onGradientChange={onGradientChange}
            gradientListRemove={gradientListRemove}
          />
        )}
      </div>
      <Divider style={{ marginTop: "20px", marginBottom: "0px" }} />
      <div>
        <ColorCollect color={props.color} setColor={props.setColor} />
      </div>
    </div>
  );
};

const ImagePicker = (props: {
  setColor: Function;
  color: string;
  cover?: string;
  type?: string;
}) => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);
  const [state, setState] = useState({ normal_scale: 0 });
  const [blend, setBlend] = useState<undefined | AlphaModeType>();
  const contextValue = useContext(SpiralShapeDataContext);

  const options = [
    {
      label: t("attrSetting.opaque"),
      value: AlphaModeType.Opaque,
    },
    {
      label: t("attrSetting.blend"),
      value: AlphaModeType.Blend,
    },
  ];

  const onChangeBlend = (v: AlphaModeType) => {
    spiralApp.setProperty({
      material_para: {
        alpha_mode: v,
      },
    });
  };

  const updateAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    props.setColor(props.color, file, props.type);
  };
  const handleChange = (name: string, value: number) => {
    //法线贴图强度
    state[name as keyof typeof state] = Math.round(value);
    setState({ ...state });
    spiralApp.setProperty({
      material_para: {
        [name]: value / 100,
      },
    });
  };
  const resetImg = () => {
    props.setColor(props.color, null, props.type);
  };
  const flipImage = async () => {
    //翻转
    if (!props.cover) return;
    const image = await urlToImage(props.cover);
    if (!image) return;
    const imageData = imageToImageData(image);
    if (!imageData) return;
    const flipData = flipImageDataHorizontally(imageData);
    const fileBlob = await imageDataToBlob(flipData);
    props.setColor(props.color, fileBlob, props.type);
  };
  const rotateImage = async () => {
    //旋转
    if (!props.cover) return;
    const image = await urlToImage(props.cover);
    if (!image) return;
    const imageData = imageToImageData(image);
    if (!imageData) return;
    const flipData = rotateImageData90(imageData);
    const fileBlob = await imageDataToBlob(flipData);
    props.setColor(props.color, fileBlob, props.type);
  };

  useEffect(() => {
    if (contextValue.spiralState && contextValue.spiralState.material_para) {
      setBlend(contextValue.spiralState.material_para.blend_info.alpha_mode);
      const data = {
        normal_scale:
          Math.round(
            (contextValue.spiralState as ParaData & { material_para: { normal_scale: number } })
              .material_para.normal_scale * 100,
          ) || 0,
      };
      setState(data);
    }
  }, [contextValue.spiralState]);

  return (
    <>
      <div
        css={css`
          margin-top: 12px;
          color: #999999;
          padding: 0 2px;
          ${midAlign};
          justify-content: end;
          gap: 4px;
        `}
      >
        <div
          css={css`
            ${imageIconStyle}
          `}
          onClick={() => {
            resetImg();
          }}
        >
          <DeleteImgIcon />
        </div>
        <div
          css={css`
            ${imageIconStyle}
          `}
          onClick={() => {
            if (props.cover !== mosaic) {
              flipImage();
            }
          }}
        >
          <FlipVerticalIcon />
        </div>
        <div
          css={css`
            ${imageIconStyle}
          `}
          onClick={() => {
            rotateImage();
          }}
        >
          <PickerResettingIcon />
        </div>
      </div>
      <div
        css={css`
          margin-top: 12px;
          position: relative;
          height: 264px;
        `}
      >
        <div
          css={css`
            height: 264px;
            margin-left: -16px;
            margin-right: -16px;
          `}
        >
          <div
            css={css`
              background-image: url(${props.cover ? props.cover : mosaic});
              width: 264px;
              height: 264px;
              background-size: ${props.cover === mosaic || !props.cover ? "53px 53px" : "cover"};
            `}
          ></div>
        </div>
        <div
          css={css`
            position: absolute;
            width: 264px;
            height: 264px;
            top: 0;
            left: -16px;
            ${midAlign};
            justify-content: center;

            &:hover {
              background-color: rgba(0, 0, 0, 0.5);
            }
          `}
          onMouseEnter={() => {
            setIsShow(true);
          }}
          onMouseLeave={() => {
            setIsShow(false);
          }}
        >
          <Upload
            styles={css`
              position: absolute;
              width: 160px;
              height: 32px;
              border: none;
              display: ${isShow ? "block" : "none"};
            `}
            onChange={updateAvatar}
            format={"image/png, image/jpeg"}
            title={
              <div
                css={css`
                  width: 100%;
                  height: 100%;
                  ${fontStyle};
                  ${midAlign};
                  justify-content: center;
                  background: white;
                  border-radius: 4px;
                  font-weight: 500;
                `}
              >
                {t("attrSetting.p69")}
              </div>
            }
          />
        </div>
      </div>
      <div
        css={css`
          color: #333333;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        `}
      >
        {props.type === "normal" && (
          <div
            css={css`
              height: 24px;
              ${midAlign};
              justify-content: space-between;
            `}
          >
            <span>{t("attrSetting.p74")}</span>
            <div
              css={css`
                width: 166px;
              `}
            >
              <RangeSlider
                onChange={(value: number) => {
                  handleChange("normal_scale", Math.round(value * 100));
                }}
                valueFormat={(v) => Math.round(v * 100)}
                value={state.normal_scale / 100}
              />
            </div>
          </div>
        )}
      </div>
      {props.type === "image" && (
        <div
          css={css`
            ${midAlign};
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              ${midAlign};
              gap: 4px;
            `}
          >
            <div
              css={css`
                color: #333333;
              `}
            >
              {t("attrSetting.blend")}
            </div>
            <Tooltip
              title={t("attrSetting.blendTip")}
              placement="bottom"
              zIndex={3000}
              overlayInnerStyle={{
                marginTop: "-1px",
                ...tooltipStyle,
                ...fontFormatStyle,
                width: 168,
              }}
            >
              <div
                css={css`
                  color: #999;
                  margin-left: 4px;

                  &:hover {
                    color: #9737ff;
                  }
                `}
              >
                <ToolTipIcon />
              </div>
            </Tooltip>
          </div>
          <PropSelect
            options={options}
            style={css`
              width: 166px;
            `}
            onChange={onChangeBlend}
            selectValue={blend}
          />
        </div>
      )}
    </>
  );
};

export const Picker = (props: {
  unlit?: boolean;
  setDefault?: Function;
  tab: number;
  normalCover?: string;
  cover?: string;
  setIsOpen: Function;
  setColor: (color: string) => void;
  color: string;
  transparent?: number;
  isImage: boolean;
  isColor: boolean;
  isNormal: boolean;
  gradients?: GradientTable[];
}) => {
  const { t } = useTranslation();
  const [seniorTab, setSeniorTab] = useState(1);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!props.isColor) setSeniorTab(1);
  }, []);

  useEffect(() => {
    setSeniorTab(props.tab);
  }, [props.tab]);

  return (
    <div
      className="custom-picker"
      ref={pickerRef}
      css={css`
        height: auto;
        overflow: auto;
        max-height: calc(100vh - 42px - 26px);
      `}
    >
      <div>
        <div className="custom-picker-title">
          <span>{t("attrSetting.p58")}</span>
          <div
            onClick={() => {
              props.setIsOpen(false);
            }}
            css={css`
              cursor: pointer;
              height: 20px;
            `}
          >
            <CloseOutIcon />
          </div>
        </div>
        <Divider className="divider-style" />
        <div
          css={css`
            color: #999999;
            font-weight: 600;
            margin-top: 12px;
            ${midAlign};
            gap: 20px;
          `}
        >
          {props.isColor && (
            <div
              css={css`
                color: ${seniorTab == 1 ? "#333333" : ""};
                cursor: pointer;
              `}
              onClick={() => {
                setSeniorTab(1);
              }}
            >
              {t("attrSetting.p61")}
            </div>
          )}
          {props.isImage && (
            <div
              css={css`
                color: ${seniorTab == 2 ? "#333333" : ""};
                cursor: pointer;
              `}
              onClick={() => {
                setSeniorTab(2);
              }}
            >
              {t("attrSetting.image")}
            </div>
          )}
          {props.isNormal && (
            <div
              css={css`
                color: ${seniorTab == 3 ? "#333333" : ""};
                cursor: pointer;
              `}
              onClick={() => {
                setSeniorTab(3);
              }}
            >
              {t("attrSetting.normalMap")}
            </div>
          )}
        </div>
        {seniorTab === 1 && (
          <ColorPicker
            unlit={props.unlit}
            setDefault={props.setDefault}
            setColor={props.setColor}
            color={props.color}
            transparent={props.transparent}
            gradients={props.gradients}
          />
        )}
        {seniorTab === 2 && (
          <ImagePicker
            setColor={props.setColor}
            color={props.color}
            cover={props.cover}
            type={"image"}
          />
        )}
        {seniorTab === 3 && (
          <ImagePicker
            setColor={props.setColor}
            color={props.color}
            cover={props.normalCover}
            type={"normal"}
          />
        )}
      </div>
    </div>
  );
};
