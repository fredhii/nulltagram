import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import Drowpdown from './common/Dropwdown';
/**
 * Name: NavBar
 * Description: User navigation bar
 */
const NavBar = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);

    const sessionOff = () => {
        localStorage.clear();
        dispatch({ type: 'CLEAR' });
        history.push('/signin');
    };
    /* =================================================================== */
    /* Displays login or home view */
    /* =================================================================== */
    const renderList = () => {
        if (state) {
            return [
                <li key='menu-dropDown'>
                    <Drowpdown sessionOff={sessionOff} />
                </li>,
            ];
        } else {
            return [
                <li key='signin'>
                    <Link style={{ color: 'black' }} to='/signin'>
                        Signin
                    </Link>
                </li>,
                <li key='signup'>
                    <Link style={{ color: 'black' }} to='/signup'>
                        Signup
                    </Link>
                </li>,
            ];
        }
    };

    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    return (
        <nav>
            <div className='nav-wrapper white'>
                <div className='container'>
                    <Link
                        style={{ color: 'black' }}
                        to={state ? '/' : '/signin'}
                        className='brand-logo left'
                    >
                        Nulltagram
                    </Link>
                    <ul id='nav-mobile' className='right'>
                        {renderList()}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
