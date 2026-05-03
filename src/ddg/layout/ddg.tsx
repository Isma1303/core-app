import { Route, Routes } from 'react-router'
import { CalendarComponent } from '../components/Calendar/Calendar'
import { Services } from '../components/Service/Service'
import { ServiceDetails } from '../components/ServiceDetails/ServiceDetails'
import { Attendance } from '../pages/Attendance/Attendance'
import { UserCards } from '../pages/UserCards/UserCards'

export const Events = (): JSX.Element => {
    return (
        <Routes>
            <Route path="calendar" element={<CalendarComponent />} />
            <Route path="events" element={<Services />} />
            <Route path="service-details/:id" element={<ServiceDetails />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="user-cards" element={<UserCards />} />
        </Routes>
    )
}

export default Events
