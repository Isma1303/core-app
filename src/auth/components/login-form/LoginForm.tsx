import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Form, { Item, Label, ButtonItem, ButtonOptions, RequiredRule } from 'devextreme-react/form'
import LoadIndicator from 'devextreme-react/load-indicator'

import './LoginForm.scss'
import { useAuthStore } from '../..'

const userEditorOptions = { stylingMode: 'filled', placeholder: 'Usuario', mode: 'text' }
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Contraseña', mode: 'password' }

export const LoginForm = (): JSX.Element => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const formData = useRef({ user: '', password: '' })

    const authenticate = useAuthStore((state) => state.authenticate)

    const onSubmit = async (e: any) => {
        e.preventDefault()
        const { user, password } = formData.current
        setLoading(true)

        const responseAuth = await authenticate(user, password)
        if (responseAuth) {
            navigate('/home')
        }

        setLoading(false)
    }

    return (
        <form className={'login-form'} onSubmit={onSubmit}>
            <h2 className="">Bienvenido </h2>
            <Form formData={formData.current} disabled={loading}>
                <Item dataField={'user'} editorType={'dxTextBox'} editorOptions={userEditorOptions}>
                    <RequiredRule message="El usuario es requerido" />
                    <Label visible={false} />
                </Item>
                <Item dataField={'password'} editorType={'dxTextBox'} editorOptions={passwordEditorOptions}>
                    <RequiredRule message="La contraseña es requerida" />
                    <Label visible={false} />
                </Item>
                <ButtonItem>
                    <ButtonOptions width={'100%'} type={'default'} useSubmitBehavior={true}>
                        <span className="dx-button-text">
                            {loading ? <LoadIndicator width={'24px'} height={'24px'} visible={true} /> : 'Ingresar'}
                        </span>
                    </ButtonOptions>
                </ButtonItem>
                <Item>
                    <div className={'link'}>
                        <Link to={'/reset-password'}>Olvidé mi contraseña</Link>
                    </div>
                </Item>
            </Form>
        </form>
    )
}
