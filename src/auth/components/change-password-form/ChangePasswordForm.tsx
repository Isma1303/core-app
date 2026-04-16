import { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { changePassword } from '../../services'

export const ChangePasswordForm = (): JSX.Element => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { recoveryCode } = useParams()

    const onSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (password !== confirmPassword) {
                alert('Passwords do not match')
                return
            }
            setLoading(true)

            const result = await changePassword(password, recoveryCode!)
            setLoading(false)

            if (result.isOk) {
                navigate('/login')
            } else {
                alert(result.message)
            }
        },
        [navigate, recoveryCode, password, confirmPassword]
    )

    return (
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <button type="submit" disabled={loading} style={{ padding: '0.5rem' }}>
                {loading ? 'Cargando...' : 'Continue'}
            </button>
        </form>
    )
}
