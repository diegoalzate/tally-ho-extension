import React, { ReactElement, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  selectEnableHoprRPCh,
  setNewEnableHoprValue,
} from "@tallyho/tally-background/redux-slices/ui"
import SharedPageHeader from "../../components/Shared/SharedPageHeader"
import SharedToggleButton from "../../components/Shared/SharedToggleButton"

function SettingRow(props: {
  title: string
  component: () => ReactElement
}): ReactElement {
  const { title, component } = props

  return (
    <li>
      <div className="left">{title}</div>
      <div className="right">{component()}</div>
      <style jsx>
        {`
          li {
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .left {
            color: var(--green-20);
            font-size: 18px;
            font-weight: 600;
            line-height: 24px;
          }
        `}
      </style>
    </li>
  )
}

export default function SettingsEnableHoprRPCh(): ReactElement {
  const { t } = useTranslation()
  const [, setSearchUri] = useState("")
  const uriInput = useRef<HTMLInputElement | null>(null)
  const dispatch = useDispatch()

  const toggleEnableHopr = (enableHoprValue: boolean) => {
    dispatch(setNewEnableHoprValue(enableHoprValue))
  }

  const enableHoprRPCh = useSelector(selectEnableHoprRPCh)

  useEffect(() => {
    uriInput.current?.focus()
  }, [uriInput])

  const enableHopr = {
    title: t("settings.enableHopr"),
    component: () => (
      <SharedToggleButton
        onChange={(toggleValue) => toggleEnableHopr(toggleValue)}
        value={enableHoprRPCh}
      />
    ),
  }

  const generalList = [enableHopr]

  const settings = {
    general: generalList,
  }

  return (
    <div className="standard_width_padded">
      <SharedPageHeader withoutBackText backPath="/settings">
        {t("settings.enableHoprRPCh.title")}
      </SharedPageHeader>
      <section>
        <h2>{t("settings.enableHoprRPCh.uriTitle")}</h2>
        <p className="simple_text">{t("settings.enableHoprRPCh.uriDesc")}</p>
        <input
          type="text"
          ref={uriInput}
          className="uri_input"
          placeholder={t("settings.enableHoprRPCh.uriTextfield")}
          onChange={(event) => setSearchUri(event.target.value)}
        />
      </section>
      <section>
        <h2>{t("settings.enableHoprRPCh.toggleTitle")}</h2>
        <p className="simple_text remove_bottom_margin">
          {t("settings.enableHoprRPCh.toggleDesc")}
        </p>
        {settings.general.map((setting) => (
          <SettingRow
            key={setting.title}
            title={setting.title}
            component={setting.component}
          />
        ))}
      </section>
      <style jsx>{`
        h2 {
          color: var(--green-20);
          font-size: 18px;
          font-weight: 600;
          line-height: 24px;
          margin-top: 20px;
        }
        section {
          margin-bottom: 35px;
        }
        .uri_input {
          width: 336px;
          height: 48px;
          border-radius: 4px;
          border: 1px solid var(--green-60);
          padding-left: 16px;
          padding-right: 56px;
          box-sizing: border-box;
          color: var(--green-40);
        }
        .uri_input::placeholder {
          color: var(--green-40);
        }
        .remove_bottom_margin {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}
