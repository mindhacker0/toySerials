import { Input } from "antd";
import "./styles.module.less";
import { useEffect, useState } from "react";

const CSSInput = (props: { setColor?: Function; color: string }) => {
  const [value, setValue] = useState("rgba(255, 255, 255, 1)");

  const isRgbaFormat = (str: string) => {
    const rgbaRegex = /^rgba?\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d(?:\.\d+)?)\s*\)$/i;
    return rgbaRegex.test(str);
  };

  const onBlur = () => {
    if (isRgbaFormat(value)) {
      if (props.setColor) {
        props.setColor(value);
      }
    } else {
      console.log(233);
    }
  };

  useEffect(() => {
    setValue(props.color);
  }, [props.color]);
  return (
    <>
      <Input
        className="picker-css-input"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
    </>
  );
};
export default CSSInput;
