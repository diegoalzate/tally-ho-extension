import React, { ReactElement, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import SharedButton from "../../components/Shared/SharedButton"
import SharedPageHeader from "../../components/Shared/SharedPageHeader"
import SettingsEnableHoprToggle from "./SettingsEnableHoprToggle"

export default function SettingsEnableHoprRPCh(): ReactElement {
  const { t } = useTranslation()
  const [, setSearchUri] = useState("")
  const uriInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    uriInput.current?.focus()
  }, [uriInput])

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
        <SharedButton
          type="secondary"
          size="medium"
          onClick={() => {
            window.open(`https://chat.tally.cash/`, "_blank")?.focus()
          }}
        >
          {t("settings.enableHoprRPCh.uriBtn")}
        </SharedButton>
      </section>
      <section>
        <h2>{t("settings.enableHoprRPCh.toggleTitle")}</h2>
        <p className="simple_text remove_bottom_margin">
          {t("settings.enableHoprRPCh.toggleDesc")}
        </p>
        <SettingsEnableHoprToggle />
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
          margin-bottom: 20px;
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
