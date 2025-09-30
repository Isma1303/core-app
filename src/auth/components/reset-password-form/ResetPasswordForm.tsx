import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Form, { Item, Label, ButtonItem, ButtonOptions, RequiredRule, EmailRule } from 'devextreme-react/form'
import LoadIndicator from 'devextreme-react/load-indicator'
import notify from 'devextreme/ui/notify'
import { resetPassword } from '../../services'
import './ResetPasswordForm.scss'

const notificationText = "We've sent a link to reset your password. Check your inbox."

export const ResetPasswordForm = (): JSX.Element => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const formData = useRef({ email: '', password: '' })

    const onSubmit = useCallback(
        async (e: any) => {
            e.preventDefault()
            const { email } = formData.current
            setLoading(true)

            const result = await resetPassword(email)
            setLoading(false)

            if (result.isOk) {
                navigate('/login')
                notify(notificationText, 'success', 2500)
            } else {
                notify(result.message, 'error', 2000)
            }
        },
        [navigate]
    )

    return (
        <form className={'reset-password-form'} onSubmit={onSubmit}>
            <Form formData={formData.current} disabled={loading}>
                <Item dataField={'email'} editorType={'dxTextBox'} editorOptions={emailEditorOptions}>
                    <RequiredRule message="Correo Electrónico es requerido" />
                    <EmailRule message="Correo Electrónico Invalido" />
                    <Label visible={false} />
                </Item>
                <ButtonItem>
                    <ButtonOptions elementAttr={submitButtonAttributes} width={'100%'} type={'default'} useSubmitBehavior={true}>
                        <span className="dx-button-text">
                            {loading ? <LoadIndicator width={'24px'} height={'24px'} visible={true} /> : 'Recuperar mi contraseña'}
                        </span>
                    </ButtonOptions>
                </ButtonItem>
                <Item>
                    <div className={'login-link'}>
                        Volver a <Link to={'/login'}>Iniciar Sesión</Link>
                    </div>
                </Item>
            </Form>
        </form>
    )
}

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Correo Electrónico', mode: 'email' }
const submitButtonAttributes = { class: 'submit-button' }
