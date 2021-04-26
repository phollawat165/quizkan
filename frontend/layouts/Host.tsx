import Footer from '../components/Footer';
import NavBar from '../components/Navigation/NavBar';
import NavBarBottom from '../components/Navigation/NavBottom';
export const HostLayout = ({ children, ...props }) => {
    return (
        <>
            <NavBar />
            <NavBarBottom />
            <main role="main">{children}</main>

            <Footer />
        </>
    );
};

export default HostLayout;
