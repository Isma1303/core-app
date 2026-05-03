import { Route, Routes } from 'react-router'
import { ProductCategory } from '../components/Catalogs/ProductCategory/ProductCategory'
import { Departments } from '../components/Catalogs/Departments/Departments'
import { SaleStatus } from '../components/Catalogs/SaleStatus/SaleStatus'
import { CatalogsCards } from '@/ddg/pages/Catalogs/Catalogs'

export const Catalogs = (): JSX.Element => {
    return (
        <Routes>
            <Route index element={<CatalogsCards />} />
            <Route path="product-categories" element={<ProductCategory />} />
            <Route path="departments" element={<Departments />} />
            <Route path="sale-states" element={<SaleStatus />} />
        </Routes>
    )
}
