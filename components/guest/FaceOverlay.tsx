export default function FaceOverlay() {
    return (

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

            <div
                className="
                h-72
                w-72
                rounded-full
                border-[4px]
                border-white
                shadow-[0_0_40px_rgba(255,255,255,.6)]
                "
            />

        </div>

    );
}