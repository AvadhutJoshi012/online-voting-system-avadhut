import { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const data = await loginUser(email, password);
            login(data.token);
            // Navigation handled by useEffect based on user state change, 
            // but we can also do it here if context updates are async/laggy
            if (data.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (err) {
            setError('Invalid credentials. Please check your email and password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-5 animate-fade-in">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="form-card shadow-lg animate-slide-up">
                            <div className="form-header">
                                <h3 className="mb-0 fw-bold">Welcome Back!</h3>
                                <p className="mb-0 text-white-50">Login to access your dashboard</p>
                            </div>
                            <Card.Body className="p-4 p-md-5">
                                {error && (
                                    <Alert variant="danger" className="d-flex align-items-center">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {error}
                                    </Alert>
                                )}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            size="lg"
                                            className="bg-light border-0"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            size="lg"
                                            className="bg-light border-0"
                                        />
                                    </Form.Group>

                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        className="w-100 mb-3 btn-lg fw-bold" 
                                        disabled={isLoading}
                                        style={{ background: 'linear-gradient(to right, #667eea, #764ba2)', border: 'none' }}
                                    >
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </Button>
                                    
                                    <div className="text-center mt-3">
                                        <span className="text-muted">Don't have an account? </span>
                                        <Link to="/register" className="fw-bold text-decoration-none text-primary">Register Here</Link>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                        <div className="text-center mt-4">
                             <Link to="/" className="text-muted text-decoration-none">
                                <i className="bi bi-arrow-left me-1"></i> Back to Home
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
