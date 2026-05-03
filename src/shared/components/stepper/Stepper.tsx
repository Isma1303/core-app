import { Fragment } from 'react'

interface Props {
    activeStep: number
    totalSteps: number
    className?: string
}

export const Stepper = ({ activeStep, totalSteps, className = '' }: Props) => {
    return (
        <div
            className={`flex items-center justify-center gap-2 ${className}`}
            role="progressbar"
            aria-valuenow={activeStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
        >
            {Array.from({ length: totalSteps }, (_, index) => {
                const step = index + 1
                const isActive = step <= activeStep

                return (
                    <Fragment key={step}>
                        <div
                            className={`flex size-8 items-center justify-center rounded-full font-medium transition-all duration-300 ${
                                isActive ? 'bg-primary text-white ring-2 ring-primary' : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            {step}
                        </div>
                        {index < totalSteps - 1 && (
                            <div className={`h-0.5 flex-1 transition-all duration-300 ${isActive ? 'bg-primary' : 'bg-gray-300'}`} />
                        )}
                    </Fragment>
                )
            })}
        </div>
    )
}

