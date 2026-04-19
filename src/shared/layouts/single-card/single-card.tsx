import './single-card.scss'

interface Props {
    title: string
    description?: string
    children?: JSX.Element | JSX.Element[]
}

export const SingleCard = ({ title, description, children }: Props): JSX.Element => {
    return (
        <div className={'with-footer single-card h-full w-full overflow-y-auto p-4 sm:p-8'}>
            <div className={'dx-card content'}>
                <div className={'header'}>
                    <div className={'title'}>{title}</div>
                    <div className={'description'}>{description}</div>
                </div>
                {children}
            </div>
        </div>
    )
}
