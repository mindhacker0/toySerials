/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";
import { CollectIcon } from "../../Icons/Icons.tsx";
import { midAlign } from "../../../common/globalStyle.ts";
import { shallowEqual } from "react-redux";
import { useAppSelector, useAppDispatch } from "../../../common/store/configureStore.tsx";
import {
  getUserColor,
  saveUserColor,
  delUserColor,
  topUserColor,
  setRecentColor,
  addRecentColor,
  RgbaString,
} from "../../../common/reducers/userConfig.tsx";
import { eventBus } from "../../../common/eventBus/index.tsx";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover } from "antd";

const CollectTitle = (props: { title?: string }) => {
  return (
    <div className="color-collect-title">
      <span>{props.title}</span>
    </div>
  );
};
const FlexContainer: React.FC<{
  children: ReactElement | ReactElement[];
  childWid: number;
  childHig: number;
  total: number;
  maxRow: number;
  gapX: number;
  gapY: number;
  warpStyle?: SerializedStyles;
  suffix?: ReactElement;
}> = ({ children, total, childWid, childHig, maxRow, warpStyle, gapX, gapY, suffix }) => {
  const [showExpand, setShowExpand] = useState(false);
  const [isShrink, setIsShrink] = useState(true);
  const [rowNum, setRowNum] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (wrapRef.current) {
      const rowNum = Math.floor((wrapRef.current.clientWidth + gapX) / (childWid + gapX));
      const totalRow = Math.ceil((total + (suffix ? 1 : 0)) / rowNum); //一共需要几行
      setShowExpand(totalRow > maxRow);
      setRowNum(rowNum);
      wrapRef.current.style.height = `${
        isShrink
          ? childHig * Math.min(maxRow, totalRow) + gapY * (Math.min(maxRow, totalRow) - 1)
          : childHig * totalRow + gapY * (totalRow - 1)
      }px`;
    }
  }, [wrapRef, childWid, total, isShrink, wrapRef, gapX, gapY, childHig, maxRow]);
  const handleShrink = () => {
    setIsShrink((v) => !v);
  };
  return (
    <div
      css={css`
        ${showExpand ? "padding-bottom:12px;" : ""}position: relative;
      `}
    >
      <div
        ref={wrapRef}
        css={css`
          ${warpStyle};
          position: relative;
        `}
      >
        {children}
        {suffix && (
          <div
            css={css`
              ${isShrink
                ? `position:absolute;bottom:0px;left:${
                    (total < rowNum * maxRow ? total % rowNum : rowNum - 1) * (childWid + gapX)
                  }px;background:#fff;`
                : ""}
            `}
          >
            {suffix}
          </div>
        )}
      </div>
      {showExpand && (
        <div
          css={css`
            width: 100%;
            position: absolute;
            left: 0px;
            right: 0px;
            bottom: -20px;
            padding-top: 16px;
            ${midAlign};
            justify-content: center;
            background: #fff;
          `}
        >
          <div
            css={css`
              ${midAlign};
              justify-content: center;
              width: 64px;
              height: 16px;
              border-radius: 4px 4px 0px 0px;
              background: #f0f0f0;
              cursor: pointer;
            `}
            onClick={handleShrink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              css={css`
                rotate: ${isShrink ? "0deg" : "180deg"};
              `}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.99753 9.07691C7.92571 9.07691 7.85614 9.04997 7.80452 9.0006H7.80564L2.61001 4.02491C2.38109 3.80721 2.39568 3.44251 2.62348 3.22481C2.85016 3.00711 3.21823 3.00486 3.44715 3.22368L7.99866 7.57769L12.5502 3.22368C12.778 3.00598 13.146 3.00711 13.3738 3.22481C13.6016 3.44251 13.6162 3.80609 13.3873 4.02491L8.19167 9.0006H8.19055C8.13893 9.04885 8.06935 9.07691 7.99753 9.07691ZM8.00131 12.9384C7.92949 12.9384 7.85992 12.9103 7.8083 12.8609H8.19432C8.1427 12.9103 8.07313 12.9384 8.00131 12.9384ZM13.3911 7.88526L8.19545 12.8609V12.8598H7.80942L2.61379 7.88414C2.38487 7.66644 2.39946 7.30174 2.62838 7.08516C2.85506 6.86746 3.22313 6.86521 3.45205 7.08404L8.00243 11.438L12.5539 7.08404C12.7817 6.86634 13.1498 6.86746 13.3776 7.08516C13.6054 7.30286 13.62 7.66644 13.3911 7.88526Z"
                fill="#999999"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
const ColorItem: React.FC<{
  setColor?: Function;
  color: RgbaString;
  id: number;
  active?: boolean;
  setActive?: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setColor, color, id, active, setActive }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const applyColor = () => {
    //使用颜色
    setColor && setColor(color);
    setActive && setActive(`collect-${id}`);
    dispatch(addRecentColor(color));
  };
  const menuOptions = [
    {
      label: t("shortcutBar.p81"),
      value: "top",
      onClick: async () => {
        setOpen(false);
        await dispatch(topUserColor(id));
        await dispatch(getUserColor());
      },
    },
    {
      label: t("shortcutBar.p80"),
      value: "delete",
      onClick: async () => {
        setOpen(false);
        await dispatch(delUserColor(id));
        await dispatch(getUserColor());
      },
    },
  ];

  return (
    <Popover
      arrow={false}
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
      overlayInnerStyle={{
        padding: "0px",
        boxShadow: "none",
      }}
      placement="bottom"
      trigger={"contextMenu"}
      content={
        <div
          css={css`
            background-color: #333333;
            width: 88px;
            padding: 4px;
            border-radius: 4px;
          `}
        >
          {menuOptions.map((value) => {
            return (
              <div
                css={css`
                  padding: 0 8px;
                  height: 24px;
                  cursor: pointer;
                  ${midAlign};
                  border-radius: 4px;
                  &:hover {
                    background-color: #9737ff;
                  }
                `}
                key={value.value}
                onClick={() => {
                  value.onClick();
                }}
              >
                {value.label}
              </div>
            );
          })}
        </div>
      }
    >
      <div
        onClick={applyColor}
        style={{
          boxSizing: "border-box",
          width: "18px",
          height: "18px",
          background: color,
          borderRadius: "2px",
          border: "1px rgba(102, 102, 102, 0.10) solid",
          borderColor: `${active ? "rgba(151, 55, 255, 1)" : "rgba(102, 102, 102, 0.10)"}`,
        }}
        css={css`
          &:hover {
            border-color: rgba(151, 55, 255, 1) !important;
          }
        `}
      ></div>
    </Popover>
  );
};
const ColorCollect: React.FC<{
  setColor?: Function;
  color: string;
}> = ({ setColor, color }) => {
  const { t } = useTranslation();
  const userColor = useAppSelector((state) => state.userConfig.userColor, shallowEqual);
  const recentColor = useAppSelector((state) => state.userConfig.recentColor);
  const [colorActive, setColorActive] = useState<string>("");
  const dispatch = useAppDispatch();
  const handleAddColor = async () => {
    //颜色收藏
    await dispatch(saveUserColor(color));
    await dispatch(getUserColor());
  };
  useEffect(() => {
    const cacheColor = localStorage.getItem("recentColor");
    if (cacheColor) dispatch(setRecentColor(JSON.parse(cacheColor)));
  }, []);
  return (
    <>
      <div>
        <CollectTitle title={t("attrSetting.p62")} />
      </div>

      <div>
        <div className="color-collect">
          {recentColor.map((cor, index) => (
            <div
              key={index}
              style={{
                boxSizing: "border-box",
                width: "18px",
                height: "18px",
                background: cor,
                borderRadius: "2px",
                border: "1px rgba(102, 102, 102, 0.10) solid",
                borderColor: `${
                  colorActive === `recent-${index}`
                    ? "rgba(151, 55, 255, 1)"
                    : "rgba(102, 102, 102, 0.10)"
                }`,
              }}
              css={css`
                &:hover {
                  border-color: rgba(151, 55, 255, 1) !important;
                }
              `}
              onClick={() => {
                setColorActive(`recent-${index}`);
                setColor && setColor(cor);
              }}
            ></div>
          ))}
        </div>
      </div>
      <div>
        <CollectTitle title={t("attrSetting.p63")} />
      </div>
      <div>
        <div>
          <FlexContainer
            childWid={18}
            childHig={18}
            maxRow={2}
            total={userColor.length}
            gapX={8}
            gapY={8}
            warpStyle={css`
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
              overflow: hidden;
            `}
            suffix={
              <div
                onClick={handleAddColor}
                css={css`
                  width: 18px;
                  height: 18px;
                  border-radius: 2px;
                  ${midAlign};
                  justify-content: center;
                  border: 1px solid #999999;
                  color: #999999;
                  cursor: pointer;
                `}
              >
                <CollectIcon style={{ fontSize: "18px" }} />
              </div>
            }
          >
            {userColor.map((cor, index) => (
              <ColorItem
                color={cor.color}
                id={cor.uid}
                key={cor.uid}
                setColor={setColor}
                active={colorActive === `collect-${cor.uid}`}
                setActive={setColorActive}
              />
            ))}
          </FlexContainer>
        </div>
      </div>
    </>
  );
};
export default ColorCollect;
