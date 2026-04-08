import { AirVent, AlarmSmoke, Bath, BedDouble, Book, Bubbles, Camera, ChefHat, ChessQueen, Coffee, CookingPot, Heater, Microwave, Refrigerator, SoapDispenserDroplet, Table, ThermometerSun, Tv, WashingMachine, Wifi } from "lucide-react";

export const amenities = [
    [Bath, "bathub"],
    [Bubbles, "cleaning-products"],
    [ThermometerSun, "hot-water"],
    [WashingMachine, "washer"],
    [SoapDispenserDroplet, "essentials"],
    [BedDouble, "bed-linens"],
    [Book, "books"],
    [ChessQueen, "board-games"],
    [Heater, "central-heating"],
    [AlarmSmoke, "smoke-alarm"],
    [Wifi, "wifi"],
    [ChefHat, "kitchen"],
    [Refrigerator, "refrigerator"],
    [Microwave, "microwave"],
    [CookingPot, "cooking-basics"],
    [Coffee, "coffee"],
    [Table, "dining-table"],
    [AirVent, "climatisation"],
    [Tv, "television"],
    [Camera, "camera"]
] as const