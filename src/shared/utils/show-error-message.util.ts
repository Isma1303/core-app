import Toast from 'devextreme/ui/toast'

const showErrorMessage = (message: string) => {
    const el = document.createElement('div')
    const toast = new Toast(el, {
        type: 'error',
        message,
        closeOnClick: true,
        displayTime: 60 * 1000 * 5,
    })
    document.querySelector('body')?.appendChild(el)
    toast.show()
}

export { showErrorMessage }
