import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createAccount } from '../../services'
import './CreateAccountForm.scss'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
        [navigate, email, password, confirmPassword],
    )

    return (
        <form className={'create-account-form space-y-4'} onSubmit={onSubmit}>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10" required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10" required />
            <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10"
                required
            />
            <div className="policy-info">
                By creating an account, you agree to the <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>
            </div>
            <Button type="submit" disabled={loading} className="h-10 w-full">
                {loading ? 'Cargando...' : 'Create a new account'}
            </Button>
            <div className={'login-link'}>
                Have an account? <Link to={'/login'}>Sign In</Link>
            </div>
        </form>
    )
}
