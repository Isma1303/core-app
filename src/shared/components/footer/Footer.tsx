import './Footer.scss'

export const Footer = ({ ...rest }) => {
    return (
        <footer className={'footer'} {...rest}>
            <span>CoreReact {new Date().getFullYear()}</span>
        </footer>
    )
}
