import { Route, Routes } from 'react-router'
import { Menu } from '../pages/Menu/Menu'
import { Sales } from '../pages/Sales/Sales'
import { Products } from '../pages/Products/Products'

export const Coffee = (): JSX.Element => {
    return (
        <Routes>
            <Route path="products" element={<Products />} />
            <Route path="menu" element={<Menu />} />
            <Route path="sales" element={<Sales />} />
        </Routes>
    )
}
