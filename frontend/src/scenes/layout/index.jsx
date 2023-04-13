import { Outlet } from 'react-router-dom'
import Sidebar from 'scenes/global/Sidebar'
import Topbar from 'scenes/global/Topbar'
import { useMediaQuery } from '@mui/material'
import { useAuthContext } from 'hooks/useAuthContext'

import { IntlProvider } from "react-intl";

import { LOCALES } from "../../i18n/locales"
import { messages } from "../../i18n/messages"
import { useState } from 'react'




const Layout = () => {
    const [currentLocale, setCurrentLocale] = useState(getInitialLocal())

    const handleChange = (e) => {
        setCurrentLocale(e.target.value)
        localStorage.setItem("locale", e.target.value)
    }

    const { user } = useAuthContext()

    const isNonMobile = useMediaQuery("(min-width: 600px)")

    // console.log({ IntlProvider });

    function getInitialLocal() {
        // getting stored items
        const savedLocale = localStorage.getItem('locale')
        return savedLocale || LOCALES.ENGLISH
    }

    return (
        <IntlProvider
            messages={messages[currentLocale]}
            locale={currentLocale}
            defaultLocale={LOCALES.ENGLISH}
        >
            <div className='app'>

                {user && (<Sidebar isNonMobile={isNonMobile} />)}
                <main className='content'>
                    {user && (<Topbar currentLocale={currentLocale} handleChange={handleChange} />)}
                    <Outlet />
                </main>
            </div>
        </IntlProvider>
    )
}

export default Layout