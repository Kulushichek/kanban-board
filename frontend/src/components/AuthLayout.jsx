export default function AuthLayout({
    title,
    icon,
    children,
    footerText,
    footerButtonText,
    onFooterClick
}) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-[350px] bg-white rounded-2xl shadow-xl overflow-hidden">

                <div className="h-48 flex flex-col items-center justify-center bg-[linear-gradient(243deg,#F574A9_7%,#E76877_38%,#6E58A5_91%)]">
                    <img
                        src={icon}
                        alt="Profile Icon"
                        className="w-16 h-16 mb-2"
                    />
                    <h2 className="text-white text-2xl mt-2">{title}</h2>
                </div>
                <div className="p-6">
                    {children}
                    <div className="mt-6 pt-4 border-t border-dashed border-gray-300 flex justify-between items-center text-sm">
                        <span className="text-gray-600">{footerText}</span>
                        <button
                            type="button"
                            onClick={onFooterClick}
                            className="bg-pink-200 text-pink-800 px-3 py-1 rounded-md hover:bg-pink-300 transition-colors"
                        >
                            {footerButtonText}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}