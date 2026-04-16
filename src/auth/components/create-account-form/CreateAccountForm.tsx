import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createAccount } from '../../services'
import './CreateAccountForm.scss'

export const CreateAccountForm = (): JSX.Element => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (password !== confirmPassword) {
                alert('Passwords do not match')
                return
            }
            setLoading(true)

            const result = await createAccount(email, password)
            setLoading(false)

            if (result.isOk) {
                navigate('/login')
            } else {
                alert(result.message)
            }
        },
        [navigate, email, password, confirmPassword]
    )

    return (
        <form className={'create-account-form'} onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '0.5rem' }}
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '0.5rem' }}
                required 
            />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ padding: '0.5rem' }}
                required 
            />
            <div className="policy-info">
                By creating an account, you agree to the <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '0.5rem' }}>
                {loading ? 'Cargando...' : 'Create a new account'}
            </button>
            <div className={'login-link'}>
                Have an account? <Link to={'/login'}>Sign In</Link>
            </div>
        </form>
    )
}
