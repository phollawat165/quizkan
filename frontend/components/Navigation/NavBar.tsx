import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import styles from './NavBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuth } from 'hooks/auth';
import { firebase as firebaseClient } from 'services/firebase/client';

// Default navigation bar title
const DEFAULT_NAVBAR_TITLE = 'QuizKan';

// Navigation bar title mapping
const navBarTitleMapping: Record<string, string> = {
    '/test': 'Test',
    '/': 'Home',
    '/create': 'Create',
    '/auth/login': 'Login',
    '/auth/register': 'Register',
};

export const NavBar = observer((props) => {
    const router = useRouter();
    const { user } = useAuth();
    // Navigation bar title for mobile screen
    const [navBarTitle, setNavBarTitle] = useState(DEFAULT_NAVBAR_TITLE);
    const [modalShow, setModalShow] = useState(false);
    // Hook on route change
    useEffect(() => {
        if (router.pathname in navBarTitleMapping)
            setNavBarTitle(navBarTitleMapping[router.pathname]);
        else setNavBarTitle(DEFAULT_NAVBAR_TITLE);
    }, [router.pathname]);
    // Render navigation bar
    return (
        <Navbar
            bg="primary"
            variant="dark"
            expand="md"
            sticky="top"
            className={styles.navbar}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Brand
                href="/"
                className={`d-none d-md-block ${styles['navbar-brand']}`}>
                QuizKan
            </Navbar.Brand>
            <Navbar.Brand
                className={`d-md-none ${styles['navbar-brand-mobile']}`}>
                {navBarTitle}
            </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link href="/">
                        <Nav.Link active={router.pathname === '/'} href="/">
                            Home
                        </Nav.Link>
                    </Link>
                    {user && (
                        <Link href="/host">
                            <Nav.Link
                                active={router.pathname === '/host'}
                                href="/host">
                                Host
                            </Nav.Link>
                        </Link>
                    )}
                    {user && (
                        <Link href="/create">
                            <Nav.Link
                                active={router.pathname === '/create'}
                                href="/create">
                                Create
                            </Nav.Link>
                        </Link>
                    )}
                </Nav>
                <Nav>
                    <NavDropdown
                        title={
                            user && (
                                <>
                                    <FontAwesomeIcon icon={faBars} size="lg" />
                                    {'  '}
                                    {user.displayName}
                                </>
                            )
                        }
                        id="basic-nav-dropdown"
                        active={router.pathname.match(/\/auth\/.+/) !== null}
                        className={styles['user-menu']}>
                        {!user && (
                            <Link href="/auth/register">
                                <NavDropdown.Item href="/auth/register">
                                    Register
                                </NavDropdown.Item>
                            </Link>
                        )}
                        {!user && (
                            <Link href="/auth/login">
                                <NavDropdown.Item href="/auth/login">
                                    Login
                                </NavDropdown.Item>
                            </Link>
                        )}
                        {user && (
                            <NavDropdown.Item
                                onClick={async () => {
                                    await firebaseClient
                                        .auth()
                                        .signOut()
                                        .then(() => {
                                            router.push('/');
                                        });
                                }}>
                                Logout
                            </NavDropdown.Item>
                        )}
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
});

export default NavBar;
