export function Banner({ title, description }: { title: string, description: string }) {
    return (
        <div className="relative flex bg-no-repeat bg-hero p-16 bg-center bg-cover">
            <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>

            <div className="z-10 flex flex-col gap-2 text-white">
                <h2 className="text-3xl font-semibold font-display">{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    )
}