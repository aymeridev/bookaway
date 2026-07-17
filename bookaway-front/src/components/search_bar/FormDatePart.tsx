import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { useEffect, useRef, useState } from "react";
import { fr as dpFr, enUS as dpEnUS } from "react-day-picker/locale";
import { format } from "date-fns";
import { fr as fnsFr, enUS as fnsEnUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

export function FormDatePart({
    selected,
    onSelect,
}: {
    selected: DateRange | undefined;
    onSelect: (d: DateRange | undefined) => void;
}) {
    const [openCalendar, setOpenCalendar] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { t, i18n } = useTranslation();

    const isFrench = i18n.language.startsWith("fr");
    const fnsLocale = isFrench ? fnsFr : fnsEnUS;
    const dpLocale = isFrench ? dpFr : dpEnUS;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpenCalendar(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full md:w-auto" ref={containerRef}>
            <button
                type="button"
                onClick={() => {
                    setOpenCalendar(!openCalendar);
                }}
                className="flex items-start flex-col bg-base-100 px-4 py-2.5 md:py-2 rounded-xl w-full text-left"
            >
                <span className="font-bold text-sm">
                    {t("search-bar.dates-label")}
                </span>

                {selected?.from && selected.to ? (
                    <span className="text-sm">
                        {format(selected.from, "d MMM", {
                            locale: fnsLocale,
                        })}{" "}
                        -{" "}
                        {format(selected.to, "d MMM", {
                            locale: fnsLocale,
                        })}
                    </span>
                ) : (
                    <span className="text-sm text-base-content/60">{t("search-bar.dates-placeholder")}</span>
                )}
            </button>

            {openCalendar && (
                <div className="absolute bg-base-100 shadow-xl rounded-xl top-16 z-50 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 max-w-[95vw] sm:max-w-md overflow-x-auto">
                    <DayPicker
                        animate
                        captionLayout="dropdown"
                        mode="range"
                        navLayout="around"
                        resetOnSelect
                        className="react-day-picker"
                        timeZone="Europe/Paris"
                        selected={selected}
                        onSelect={onSelect}
                        locale={dpLocale}
                        disabled={{ before: new Date() }}
                    />
                </div>
            )}
        </div>
    );
}
