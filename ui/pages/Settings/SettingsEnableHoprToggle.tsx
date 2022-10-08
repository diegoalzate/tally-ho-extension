import React, { ReactElement } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  selectEnableHoprRPCh,
  setNewEnableHoprValue,
} from "@tallyho/tally-background/redux-slices/ui"
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

export default function SettingsEnableHoprToggle(): ReactElement {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const toggleEnableHopr = (enableHoprValue: boolean) => {
    dispatch(setNewEnableHoprValue(enableHoprValue))
  }

  const enableHoprRPCh = useSelector(selectEnableHoprRPCh)

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
    <ul>
      {settings.general.map((setting) => (
        <SettingRow
          key={setting.title}
          title={setting.title}
          component={setting.component}
        />
      ))}
    </ul>
  )
}
