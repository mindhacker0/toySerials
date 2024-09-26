/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ColorGridIcon, ColorPlaneIcon } from "../../Icons/Icons";
import { h20, hoverColor, midAlign, midJustify, w20 } from "../../../common/globalStyle";
import PickerPlane from "./PickerPlane";
import PickerGrid from "./PickerGrid";

const iconActive = css`
  background: white;
  box-shadow: 0px 0px 4px rgba(106, 106, 106, 0.5);
  border-radius: 2px;
  color: ${hoverColor};
`;
const iconStyle = css`
  ${w20};
  ${h20};
  ${midAlign};
  color: #7d7d7d;
  ${midJustify};
`;
export enum PaletteType {
  "grid" = "grid",
  "plane" = "plane",
}
interface PaletteSwitchProps {
  type: PaletteType;
  onChange: (value: PaletteType) => void;
}
export const PaletteSwitch: React.FC<PaletteSwitchProps> = ({ type, onChange }) => {
  return (
    <div className="custom-picker-option">
      <div
        css={css`
          ${iconStyle};
          ${type === PaletteType.plane ? iconActive : ""};
        `}
      >
        <ColorPlaneIcon
          onClick={() => {
            onChange(PaletteType.plane);
          }}
          className="custom-picker-option-plane-icon"
        />
      </div>
      <div
        css={css`
          ${iconStyle};
          ${type === PaletteType.grid ? iconActive : ""};
        `}
      >
        <ColorGridIcon
          onClick={() => {
            onChange(PaletteType.grid);
          }}
          className="custom-picker-option-grid-icon"
        />
      </div>
    </div>
  );
};
interface PaletteProps {
  type: PaletteType;
  color: string;
  transparent?: number;
  setColor: (value: string) => void;
}
export const Palette: React.FC<PaletteProps> = ({ type, color, transparent, setColor }) => {
  return (
    <div>
      {type === PaletteType.grid ? (
        <PickerGrid setColor={setColor} transparent={transparent} color={color} />
      ) : (
        <PickerPlane setColor={setColor} transparent={transparent} color={color} />
      )}
    </div>
  );
};
