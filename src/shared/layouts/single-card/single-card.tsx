import ScrollView from 'devextreme-react/scroll-view'
import './single-card.scss'

interface Props {
    title: string
    description?: string
    children?: JSX.Element | JSX.Element[]
}

export const SingleCard = ({ title, description, children }: Props): JSX.Element => {
    return (
        <ScrollView height={'100%'} width={'100%'} className={'with-footer single-card'}>
            <div className={'dx-card content'}>
                <div className={'header'}>
                    <div className={'title'}>{title}</div>
                    <div className={'description'}>{description}</div>
                </div>
                {children}
            </div>
        </ScrollView>
    )
}
