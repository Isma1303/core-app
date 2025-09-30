import './SuspenseFallback.css'

export const SuspenseFallback = (): JSX.Element => {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner">
            <div className="spinner-block"></div>
            <div className="spinner-block"></div>
            <div className="spinner-block"></div>
        </div>
    </div>
}
