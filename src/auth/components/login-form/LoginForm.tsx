import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginForm.scss'
import { useAuthStore } from '../..'

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Usuario"
                    defaultValue={formData.current.user}
                    onChange={(e) => (formData.current.user = e.target.value)}
                    required
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    defaultValue={formData.current.password}
                    onChange={(e) => (formData.current.password = e.target.value)}
                    required
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}
                >
                    {loading ? 'Cargando...' : 'Ingresar'}
                </button>
                <div className={'link'}>
                    <Link to={'/reset-password'}>Olvidé mi contraseña</Link>
                </div>
            </div>
        </form>
    )
}
