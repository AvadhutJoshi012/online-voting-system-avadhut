import { Container, Row, Col, Card, Button, Badge, Table, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPublishedResults } from '../services/api';
import './Home.css';

const Home = () => {
    const [publishedResults, setPublishedResults] = useState([]);

    useEffect(() => {
        getPublishedResults().then(data => setPublishedResults(data)).catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <header className="hero-section text-center mb-5 animate-fade-in-up">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <h1 className="hero-title">
                                Secure. Transparent. Reliable.
                            </h1>
                            <p className="hero-subtitle">
                                The next generation of online voting. A secure platform designed for 
                                seamless election management and real-time results.
                            </p>
                            <div className="d-flex gap-3 justify-content-center flex-wrap">
                                <Button as={Link} to="/login" variant="primary" size="lg" className="px-5 py-3 fw-bold rounded-pill shadow-sm">
                                    Get Started
                                </Button>
                                <Button as={Link} to="/register" variant="outline-dark" size="lg" className="px-5 py-3 fw-bold rounded-pill">
                                    Register Now
                                </Button>
                            </div>
                            <div className="mt-5 pt-3 d-flex justify-content-center gap-4 text-muted small">
                                <div><i className="bi bi-shield-check me-2 text-primary"></i>Secure & Encrypted</div>
                                <div><i className="bi bi-clock-history me-2 text-primary"></i>Real-time Results</div>
                                <div><i className="bi bi-people me-2 text-primary"></i>Easy Management</div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </header>

            <Container className="mb-5">
                {/* Published Results Section */}
                {publishedResults.length > 0 && (
                    <section className="mb-5 animate-fade-in-up delay-100">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <h2 className="fw-bold m-0 text-dark">
                                <i className="bi bi-trophy-fill text-warning me-2"></i>Election Results
                            </h2>
                            <Badge bg="success" className="badge-modern">Live Updates</Badge>
                        </div>
                        
                        <Row>
                            {publishedResults.map(election => (
                                <Col xs={12} className="mb-4" key={election.electionId}>
                                    <Card className="feature-card border-0 shadow-sm overflow-hidden">
                                        <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                            <div>
                                                <h4 className="mb-1 fw-bold">{election.electionName}</h4>
                                                <small className="text-muted">
                                                    Ended: {new Date(election.endDate).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <Badge bg="light" text="dark" className="border">
                                                {election.electionType}
                                            </Badge>
                                        </Card.Header>
                                        <Card.Body className="p-0">
                                            <Table responsive className="table-modern mb-0">
                                                <thead className="bg-light text-muted small text-uppercase">
                                                    <tr>
                                                        <th className="ps-4">Rank</th>
                                                        <th>Candidate</th>
                                                        <th>Party / Symbol</th>
                                                        <th>Votes</th>
                                                        <th>Share</th>
                                                        <th className="pe-4" style={{width: '35%'}}>Performance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {election.results.map((res, idx) => (
                                                        <tr key={idx}>
                                                            <td className="ps-4 fw-bold text-secondary">
                                                                #{res.rankPosition}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="fw-bold text-dark">{res.candidateName}</div>
                                                                    {idx === 0 && (
                                                                        <Badge bg="warning" text="dark" className="ms-2 badge-modern shadow-sm">
                                                                            <i className="bi bi-star-fill me-1"></i>Winner
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="text-secondary">
                                                                {res.partyName} <small className="text-muted">({res.partySymbol})</small>
                                                            </td>
                                                            <td className="fw-bold">{res.voteCount.toLocaleString()}</td>
                                                            <td>{res.votePercentage}%</td>
                                                            <td className="pe-4">
                                                                <ProgressBar 
                                                                    now={res.votePercentage} 
                                                                    variant={idx === 0 ? "success" : "info"} 
                                                                    style={{height: '8px', borderRadius: '4px'}}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </section>
                )}

                {/* Features Grid */}
                <section className="mb-5 pt-5 animate-fade-in-up delay-200">
                    <div className="text-center mb-5">
                        <Badge bg="primary" className="mb-3 badge-modern bg-opacity-10 text-primary">Features</Badge>
                        <h2 className="display-6 fw-bold">Why Choose Our Platform?</h2>
                        <p className="text-muted lead">Built for reliability, speed, and trust.</p>
                    </div>

                    <Row className="g-4">
                        <Col md={4}>
                            <div className="feature-card p-4 h-100">
                                <div className="feature-icon-wrapper bg-primary bg-opacity-10 text-primary mb-3 rounded-circle">
                                    <i className="bi bi-shield-lock fs-3"></i>
                                </div>
                                <h3 className="h5 fw-bold mb-3">Enterprise Security</h3>
                                <p className="text-muted mb-0">
                                    Advanced encryption protocols and secure authentication (JWT) ensure that every vote is protected and verifiable.
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="feature-card p-4 h-100">
                                <div className="feature-icon-wrapper bg-success bg-opacity-10 text-success mb-3 rounded-circle">
                                    <i className="bi bi-lightning-charge fs-3"></i>
                                </div>
                                <h3 className="h5 fw-bold mb-3">Real-time Analytics</h3>
                                <p className="text-muted mb-0">
                                    Watch election results unfold in real-time with comprehensive dashboards and data visualization tools.
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="feature-card p-4 h-100">
                                <div className="feature-icon-wrapper bg-info bg-opacity-10 text-info mb-3 rounded-circle">
                                    <i className="bi bi-phone fs-3"></i>
                                </div>
                                <h3 className="h5 fw-bold mb-3">Mobile Optimized</h3>
                                <p className="text-muted mb-0">
                                    Vote from anywhere, on any device. Our responsive design ensures a seamless experience on mobile and desktop.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </section>

                {/* Tech Stack */}
                <section className="py-5 mb-5 animate-fade-in-up delay-300">
                     <div className="text-center mb-5">
                        <h2 className="fw-bold">Powered by Modern Tech</h2>
                        <p className="text-muted">Leveraging industry-standard technologies for performance.</p>
                    </div>
                    <Row className="g-4 text-center justify-content-center">
                        {[
                            { name: 'React.js', bg: 'info', icon: 'bi-filetype-jsx' },
                            { name: 'Spring Boot', bg: 'success', icon: 'bi-gear-wide-connected' },
                            { name: 'MySQL', bg: 'warning', icon: 'bi-database' },
                            { name: 'Bootstrap', bg: 'primary', icon: 'bi-grid-1x2' },
                            { name: 'JWT Auth', bg: 'dark', icon: 'bi-key' },
                            { name: 'Git & CI/CD', bg: 'danger', icon: 'bi-git' }
                        ].map((tech, idx) => (
                            <Col key={idx} xs={6} md={2}>
                                <div className="p-3 bg-white border rounded shadow-sm h-100 feature-card">
                                    <i className={`bi ${tech.icon} fs-2 text-${tech.bg} mb-2 d-block`}></i>
                                    <span className="fw-bold small">{tech.name}</span>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* Architecture & About Grid */}
                <Row className="mb-5 g-4 animate-fade-in-up delay-300">
                    <Col lg={6}>
                        <Card className="h-100 border-0 shadow-sm feature-card">
                            <Card.Body className="p-4">
                                <h3 className="h5 fw-bold mb-4">🏗️ System Architecture</h3>
                                <div className="architecture-box">
{`┌──────────┐      ┌──────────────┐      ┌──────────┐
│  React   │ <--> │ Spring Boot  │ <--> │  MySQL   │
│ Frontend │ REST │   Backend    │ JPA  │ Database │
└──────────┘      └──────────────┘      └──────────┘
     │                    │                   │
    UI/UX           Business Logic       Persistence`}
                                </div>
                                <p className="text-muted mt-3 small">
                                    A decoupled architecture ensuring scalability and maintainability. 
                                    The frontend communicates via stateless REST APIs secure by JWT.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card className="h-100 border-0 shadow-sm feature-card">
                            <Card.Body className="p-4">
                                <h3 className="h5 fw-bold mb-4">👥 Development Team</h3>
                                <Table hover responsive className="table-modern mb-0 small">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Developer</th>
                                            <th>GitHub</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { name: "Aaman Javaed Sayyad", gh: "Aamanjs" },
                                            { name: "Avadhut Ravindra Joshi", gh: "AvadhutJoshi012" },
                                            { name: "Deepak Sanjay Revgade", gh: "deepakrevgade" },
                                            { name: "Rishikesh Sukhadev More", gh: "rushimore17" },
                                            { name: "Yadnyesh Rajesh Kolte", gh: "yadnyeshkolte" }
                                        ].map((dev, idx) => (
                                            <tr key={idx}>
                                                <td className="fw-medium">{dev.name}</td>
                                                <td>
                                                    <a href={`https://github.com/${dev.gh}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary">
                                                        <i className="bi bi-github me-1"></i> @{dev.gh}
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <footer className="bg-white border-top py-5 text-center text-muted">
                <Container>
                    <div className="mb-3">
                        <a href="https://github.com/yadnyeshkolte/online-voting-system" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary me-3">
                            <i className="bi bi-github fs-4"></i>
                        </a>
                        <a href="https://yadnyeshkolte.github.io/online-voting-system" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">
                            <i className="bi bi-book fs-4"></i>
                        </a>
                    </div>
                    <p className="small mb-0">
                        &copy; {new Date().getFullYear()} Online Voting System. Built with <i className="bi bi-heart-fill text-danger px-1"></i> by Group 06.
                    </p>
                    <p className="small text-muted mt-1">PG-DAC Batch August 2025</p>
                </Container>
            </footer>
        </div>
    );
};

export default Home;