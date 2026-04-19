import { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { changePassword } from '../../services'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
        [navigate, recoveryCode, password, confirmPassword],
    )

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10" required />
            <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10"
                required
            />
            <Button type="submit" disabled={loading} className="h-10 w-full">
                {loading ? 'Cargando...' : 'Continue'}
            </Button>
        </form>
    )
}
