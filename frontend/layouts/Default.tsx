import Footer from '../components/Footer';
import NavBar from '../components/Navigation/NavBar';

export const DefaultLayout = ({ children, ...props }) => {
    return (
        <>
            <NavBar />
            <main role="main" style={{ backgroundColor: 'white' }}>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default DefaultLayout;
