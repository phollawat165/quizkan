import {
  Button,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const NavBarBottom = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const router = useRouter();
  return (
    <Navbar
      bg="light"
      variant="light"
      expand="md"
      fixed="bottom"
      className="d-md-none"
      style={{ height: '2.5rem' }}>
      <Nav.Link
        className="justify-content-center mx-auto position-relative"
        style={{ bottom: '2.75rem' }}>
        <img
          role="button"
          src="/images/search.svg"
          width="100px"
          height="100px"
          className="stretched-link mb-10"
          onClick ={() => {router.push("/host/wait")}}
        />
      </Nav.Link>
    </Navbar>
  );
};

export default NavBarBottom;
