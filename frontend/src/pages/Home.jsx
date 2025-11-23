import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <Container className="text-center mt-5">
            <h1>Online Voting System</h1>
            <p className="lead">Secure, Transparent, and Easy.</p>
            <div className="mt-4">
                <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">Login</Button>
                <Button as={Link} to="/register" variant="outline-primary" size="lg">Register</Button>
            </div>
        </Container>
    );
};

export default Home;
