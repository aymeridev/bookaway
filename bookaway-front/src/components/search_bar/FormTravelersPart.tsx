import { MinusIcon, PlusIcon, UsersIcon } from "@phosphor-icons/react";


export function FormTravelersPart({
    travelers,
    setTravelers
}: {
    travelers: number;
    setTravelers: (travelers: number) => void;
}) {
    return (
        <div className="flex items-center justify-center bg-base-100 px-4 py-2 md:py-2 rounded-xl gap-1">
            <UsersIcon />
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <span className="font-bold text-sm whitespace-nowrap">
                            Combien de voyageurs ?
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 items-center justify-center">
                    {travelers > 0 && <button
                        onClick={() => {
                            setTravelers(
                                Math.max(travelers - 1, 0)
                            );
                        }}
                        className="btn btn-circle btn-sm btn-ghost"
                        type="button"
                    >
                        <MinusIcon className="size-4" />
                    </button>}

                    <span className="font-medium text-sm">
                        {travelers === 0 ? <>Ajouter des voyageurs</> : <>
                            <span className="font-semibold">{travelers}</span> voyageur(s)</>}
                    </span>

                    <button
                        onClick={() => {
                            setTravelers(travelers + 1);
                        }}
                        disabled={travelers >= 8}
                        className="btn btn-circle btn-sm btn-ghost"
                        type="button"
                    >
                        <PlusIcon className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}