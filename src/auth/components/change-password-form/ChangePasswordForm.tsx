import { useState, useCallback } from 'react'
import { toast } from 'sonner'
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
                toast.error('Passwords do not match')
                return
            }
            setLoading(true)

            const result = await changePassword(password, recoveryCode!)
            setLoading(false)

            if (result.isOk) {
                navigate('/login')
            } else {
                toast.error(result.message)
            }
        },
        [navigate, recoveryCode, password, confirmPassword],
    )

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all" required />
            <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all"
                required
            />
            <Button type="submit" disabled={loading} className="h-10 w-full bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] transition-all">
                {loading ? 'Cargando...' : 'Continue'}
            </Button>
        </form>
    )
}
