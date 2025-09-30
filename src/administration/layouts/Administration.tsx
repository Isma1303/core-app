import { Route, Routes } from 'react-router'
import { Actions, Assignments, Configurations, MenuOptions, Roles, SystemActions, Tables, Users } from '../pages'

export const Administration = (): JSX.Element => {
    return (
        <Routes>
            <Route path="roles" element={<Roles />} />
            <Route path="tables" element={<Tables />} />
            <Route path="actions" element={<Actions />} />
            <Route path="menu-options" element={<MenuOptions />} />
            <Route path="configurations" element={<Configurations />} />
            <Route path="users" element={<Users />} />
            <Route path="assigments" element={<Assignments />} />
            <Route path="system-actions" element={<SystemActions />} />
        </Routes>
    )
}

export default Administration
