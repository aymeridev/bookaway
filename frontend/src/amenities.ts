import { AlarmIcon, BathtubIcon, BedIcon, BookIcon, BowlFoodIcon, CameraIcon, CheckerboardIcon, ChefHatIcon, CoffeeIcon, CookingPotIcon, DropIcon, FanIcon, HandSoapIcon, LetterCirclePIcon, OvenIcon, SwimmingPoolIcon, TableIcon, TelevisionIcon, ThermometerColdIcon, ThermometerHotIcon, ThermometerIcon, ToiletIcon, WashingMachineIcon, WifiHighIcon } from "@phosphor-icons/react";
import { t } from "i18next";

export const amenitiesIcon = {
    "bathub": BathtubIcon,
    "cleaning-products": DropIcon,
    "hot-water": ThermometerHotIcon,
    "washer": WashingMachineIcon,
    "essentials": HandSoapIcon,
    "bed-linens": BedIcon,
    "books": BookIcon,
    "board-games": CheckerboardIcon,
    "central-heating": ThermometerIcon,
    "smoke-alarm": AlarmIcon,
    "wifi": WifiHighIcon,
    "paid-wifi": WifiHighIcon,
    "kitchen": ChefHatIcon,
    "refrigerator": ThermometerColdIcon,
    "microwave": OvenIcon,
    "cooking-basics": CookingPotIcon,
    "coffee": CoffeeIcon,
    "dining-table": TableIcon,
    "climatisation": FanIcon,
    "television": TelevisionIcon,
    "camera": CameraIcon,
    "parking": LetterCirclePIcon,
    "pool": SwimmingPoolIcon,
    "public-toilets": ToiletIcon,
    "restaurant": BowlFoodIcon,
} as Record<string, any>

export const amenitiesOptions = Object.keys(amenitiesIcon).map((a: string) => {
    return {
        icon: amenitiesIcon[a],
        value: a,
        label: t(`amenities.${a}` as any),
    }
});