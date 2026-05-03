import { IUserCard } from '@/ddg/interfaces/user_cards.interface'
import { UserCardsService } from '@/ddg/services/user_cards.service'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'

export const UserCards = () => {
    const userCardsService = new UserCardsService()
    const [userCard, setUserCard] = useState<IUserCard[]>([])

    useEffect(() => {
        userCards()
    }, [])

    const userCards = async () => {
        try {
            const response = await userCardsService.getRecords(-1, -1)
            setUserCard(response)
        } catch (error) {}
    }
    return (
        <div>
            <h1>Tarjetas de usuario</h1>
            {userCard.map((card) => (
                <div key={card.card_id}>
                    <QRCode
                        size={256}
                        style={{ height: 'auto', maxWidth: '100px', width: '100px', margin: '10px' }}
                        value={card.qr_value.toString()}
                    />
                </div>
            ))}
        </div>
    )
}
