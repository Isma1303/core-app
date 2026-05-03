import { useNavigate } from 'react-router'

export const CatalogsCards = () => {
    const navigate = useNavigate()

    const catalogs = [
        {
            title: 'Estado de ventas',
            description: 'Administra los diferentes estados de las ventas en el sistema.',
            icon: 'bi-bar-chart-line',
            url: '/catalogs/sale-states',
            color: 'from-blue-500/20 to-teal-500/20',
        },
        {
            title: 'Ministerios',
            description: 'Gestiona los departamentos y ministerios de la organización.',
            icon: 'bi-people',
            url: '/catalogs/departments',
            color: 'from-purple-500/20 to-indigo-500/20',
        },
        {
            title: 'Categoría de productos',
            description: 'Organiza tus productos por categorías para un mejor control.',
            icon: 'bi-box-seam',
            url: '/catalogs/product-categories',
            color: 'from-orange-500/20 to-red-500/20',
        },
    ]

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Catálogos del Sistema</h1>
                <p className="text-muted-foreground text-lg">Administra la configuración base de tu aplicación de forma centralizada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalogs.map((catalog) => (
                    <div
                        key={catalog.url}
                        onClick={() => navigate(catalog.url)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 cursor-pointer backdrop-blur-sm"
                    >
                        {/* Background Gradient Effect */}
                        {/* <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${catalog.color} blur-3xl transition-all group-hover:scale-150`} /> */}

                        <div className="relative z-10 flex flex-col h-full space-y-4">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl text-teal-400 group-hover:bg-teal-400 group-hover:text-white transition-colors shadow-inner">
                                <i className={`bi ${catalog.icon}`}></i>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground group-hover:text-teal-400 transition-colors">{catalog.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{catalog.description}</p>
                            </div>

                            <div className="pt-4 flex items-center text-teal-400 font-medium text-sm mt-auto">
                                <span>Configurar</span>
                                <i className="bi bi-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
