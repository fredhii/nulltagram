import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import M from 'materialize-css';

const Dropdown = (props) => {
    useEffect(() => {
        let dropdowns = document.querySelectorAll('.dropdown-trigger');
        let options = {
            inDuration: 300,
            outDuration: 225,
            coverTrigger: false,
        };
        M.Dropdown.init(dropdowns, options);
    }, []);

    return (
        <div>
            <ul>
                <li>
                    <a
                        className='dropdown-trigger'
                        href='#!'
                        data-target='dropdown1'
                        style={{ color: 'black' }}
                    >
                        <img
                            className='profile-img'
                            alt='profile pic'
                            src='https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
                        />
                        <i class='material-icons right'>arrow_drop_down</i>
                    </a>
                    <ul id='dropdown1' className='dropdown-content'>
                        <li>
                            <Link style={{ color: 'black' }} to='/profile'>
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link style={{ color: 'black' }} to='/create'>
                                New post
                            </Link>
                        </li>
                        <li className='divider'></li>
                        <li
                            style={{ color: 'black' }}
                            onClick={props.sessionOff}
                        >
                            <a style={{ color: 'black' }} href='#!'>
                                Logout
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default Dropdown;
