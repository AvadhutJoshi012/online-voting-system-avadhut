import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Online Voting System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && user.role === 'ADMIN' && (
                            <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
                        )}
                        {user && user.role === 'USER' && (
                            <>
                                <Nav.Link as={Link} to="/user">User Dashboard</Nav.Link>
                                <Nav.Link as={Link} to="/user/profile">Profile</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {!user ? (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        ) : (
                            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
