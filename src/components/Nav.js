import React from 'react'
import logo from './logo-dark.svg'

const Nav = () => {
    return (
        <nav>
            <div>
                <img src={logo} alt="SB" className="logo" />
            </div>

            <div className="menuItems">
                <ul>
                    <li>Todo Manager</li>
                    <li>Habit Tracker</li>
                </ul>
            </div>


        </nav>
    )
}

export default Nav
