import './homePage.scss'

export const HomePage = (): JSX.Element => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 animate-in fade-in duration-500">
            <div className="w-full max-w-md p-8 text-center bg-card rounded-xl shadow-lg border border-border">
                <img src="/assets/logo.png" alt="Logo" className="w-full h-auto mb-6 drop-shadow-md" />
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Welcome to CoreReact</h2>
                <p className="mt-2 text-muted-foreground">This is your new elegant dashboard experience.</p>
            </div>
        </div>
    )
}
