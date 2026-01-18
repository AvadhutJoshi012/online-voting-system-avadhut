import { Container, Row, Col, Card, Button, Badge, Table, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPublishedResults } from '../services/api';

const Home = () => {
    const [publishedResults, setPublishedResults] = useState([]);

    useEffect(() => {
        getPublishedResults().then(data => setPublishedResults(data)).catch(err => console.error(err));
    }, []);

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <div className="hero-gradient py-5 mb-5 text-center animate-fade-in">
                <Container>
                    <h1 className="display-3 fw-bold mb-3 animate-slide-up">Online Voting System</h1>
                    <p className="lead mb-4 animate-slide-up delay-100" style={{ opacity: 0.9 }}>
                        Secure, Transparent, and Reliable Election Platform
                    </p>
                    <div className="animate-slide-up delay-200">
                        <Button as={Link} to="/login" variant="light" size="lg" className="me-3 px-4 fw-bold shadow-sm">
                            Login
                        </Button>
                        <Button as={Link} to="/register" variant="outline-light" size="lg" className="px-4 fw-bold shadow-sm">
                            Register
                        </Button>
                    </div>
                    <div className="mt-4 animate-slide-up delay-300">
                        <a href="https://github.com/yadnyeshkolte/online-voting-system" target="_blank" rel="noopener noreferrer" className="text-white me-4 text-decoration-none">
                            <i className="bi bi-github me-1"></i> GitHub Repository
                        </a>
                        <a href="https://yadnyeshkolte.github.io/online-voting-system" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                            <i className="bi bi-book me-1"></i> Documentation
                        </a>
                    </div>
                </Container>
            </div>

            <Container className="mb-5">
                {/* Published Results Section */}
                {publishedResults.length > 0 && (
                    <div className="mb-5 animate-slide-up delay-200">
                        <h2 className="text-center fw-bold text-primary mb-4">🏆 Election Results</h2>
                        <Row>
                            {publishedResults.map(election => (
                                <Col md={12} className="mb-4" key={election.electionId}>
                                    <Card className="shadow border-0">
                                        <Card.Header className="bg-primary text-white">
                                            <h4 className="mb-0">{election.electionName} <Badge bg="light" text="dark" className="ms-2 fs-6">{election.electionType}</Badge></h4>
                                        </Card.Header>
                                        <Card.Body>
                                            <Table hover responsive className="align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Rank</th>
                                                        <th>Candidate</th>
                                                        <th>Party</th>
                                                        <th>Votes</th>
                                                        <th>%</th>
                                                        <th>Bar</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {election.results.map((res, idx) => (
                                                        <tr key={idx} className={idx === 0 ? "table-warning fw-bold" : ""}>
                                                            <td>{res.rankPosition === 1 ? '🥇' : res.rankPosition === 2 ? '🥈' : res.rankPosition === 3 ? '🥉' : res.rankPosition}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    {/* Placeholder for image if needed, or just name */}
                                                                    {res.candidateName}
                                                                    {idx === 0 && <span className="ms-2 badge bg-success">Winner</span>}
                                                                </div>
                                                            </td>
                                                            <td>{res.partyName} ({res.partySymbol})</td>
                                                            <td>{res.voteCount}</td>
                                                            <td>{res.votePercentage}%</td>
                                                            <td style={{ width: '30%' }}>
                                                                <ProgressBar now={res.votePercentage} variant={idx === 0 ? "success" : "info"} label={`${res.votePercentage}%`} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                        <Card.Footer className="text-muted small">
                                            Ended on: {new Date(election.endDate).toLocaleDateString()}
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {/* Introduction & About */}
                <Row className="mb-5 align-items-center animate-slide-up delay-200">
                    <Col lg={12} className="text-center mb-4">
                        <h2 className="fw-bold text-primary">About Online Voting System</h2>
                        <div className="bg-white p-4 rounded shadow-sm">
                            <p className="lead text-muted">
                                The Online Voting System is a secure and reliable platform designed for conducting online elections. 
                                Built with modern web technologies, it ensures transparency, security, and ease of use for both voters and administrators.
                            </p>
                            <Row className="text-start mt-4">
                                <Col md={6}>
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="bg-primary text-white rounded-circle p-2 me-3"><i className="bi bi-shield-lock"></i></div>
                                        <div>
                                            <h5 className="fw-bold">Secure Platform</h5>
                                            <p className="small text-muted">Web-Based Platform for online voting and real-time result display.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="bg-primary text-white rounded-circle p-2 me-3"><i className="bi bi-gear"></i></div>
                                        <div>
                                            <h5 className="fw-bold">Admin Management</h5>
                                            <p className="small text-muted">Efficiently manage elections, candidates, and voters.</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="bg-primary text-white rounded-circle p-2 me-3"><i className="bi bi-code-slash"></i></div>
                                        <div>
                                            <h5 className="fw-bold">Modern Architecture</h5>
                                            <p className="small text-muted">Built using React.js, Spring Boot, and MySQL with secure authentication.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="bg-primary text-white rounded-circle p-2 me-3"><i className="bi bi-eye"></i></div>
                                        <div>
                                            <h5 className="fw-bold">Transparency</h5>
                                            <p className="small text-muted">Ensuring fair elections with audit trails and vote integrity.</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                {/* Project Details */}
                <Row className="mb-5 animate-slide-up delay-300">
                    <Col>
                        <Card className="border-0 shadow-sm bg-light">
                            <Card.Body className="p-4">
                                <h3 className="fw-bold mb-3 text-center">📋 Project Details</h3>
                                <Row className="text-center">
                                    <Col md={3} className="mb-2"><strong>Course:</strong> PG-DAC</Col>
                                    <Col md={3} className="mb-2"><strong>Batch:</strong> August 2025</Col>
                                    <Col md={3} className="mb-2"><strong>Group:</strong> 06</Col>
                                    <Col md={3} className="mb-2"><strong>Title:</strong> Online Voting System</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Key Features */}
                <h2 className="text-center fw-bold mb-4 animate-slide-up delay-300">🎯 Key Features</h2>
                <Row className="g-4 mb-5 animate-slide-up delay-400">
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow hover-card">
                            <Card.Header className="bg-primary text-white fw-bold text-center">For Voters</Card.Header>
                            <Card.Body>
                                <ul className="list-unstyled">
                                    <li className="mb-2">✅ Secure Registration (JWT)</li>
                                    <li className="mb-2">✅ Easy & Intuitive Voting Interface</li>
                                    <li className="mb-2">✅ Real-time Results Display</li>
                                    <li className="mb-2">✅ Vote Verification & History</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow hover-card">
                            <Card.Header className="bg-success text-white fw-bold text-center">For Administrators</Card.Header>
                            <Card.Body>
                                <ul className="list-unstyled">
                                    <li className="mb-2">✅ Election Creation & Management</li>
                                    <li className="mb-2">✅ Candidate & Voter Management</li>
                                    <li className="mb-2">✅ User Verification & Approval</li>
                                    <li className="mb-2">✅ Comprehensive Results Dashboard</li>
                                    <li className="mb-2">✅ Audit Trail & Logs</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow hover-card">
                            <Card.Header className="bg-dark text-white fw-bold text-center">Security Features</Card.Header>
                            <Card.Body>
                                <ul className="list-unstyled">
                                    <li className="mb-2">🔒 BCrypt Password Hashing</li>
                                    <li className="mb-2">🔒 Vote Integrity (Cryptographic Hash)</li>
                                    <li className="mb-2">🔒 One Vote Policy Enforcement</li>
                                    <li className="mb-2">🔒 ID Verification (Aadhar, PAN, etc.)</li>
                                    <li className="mb-2">🔒 Role-Based Access Control</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Tech Stack */}
                <h2 className="text-center fw-bold mb-4 animate-slide-up delay-400">💻 Technology Stack</h2>
                <Row className="g-4 mb-5 text-center animate-slide-up delay-500">
                    <Col md={4}>
                        <div className="p-4 bg-white rounded shadow-sm h-100 hover-card">
                            <h4 className="text-primary mb-3">Frontend</h4>
                            <Badge bg="info" className="me-1 mb-1 text-dark">React.js</Badge>
                            <Badge bg="info" className="me-1 mb-1 text-dark">HTML5 & CSS3</Badge>
                            <Badge bg="info" className="me-1 mb-1 text-dark">JavaScript (ES6+)</Badge>
                            <Badge bg="info" className="me-1 mb-1 text-dark">Bootstrap</Badge>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 bg-white rounded shadow-sm h-100 hover-card">
                            <h4 className="text-success mb-3">Backend</h4>
                            <Badge bg="success" className="me-1 mb-1">Spring Boot</Badge>
                            <Badge bg="success" className="me-1 mb-1">Spring Security</Badge>
                            <Badge bg="success" className="me-1 mb-1">JWT Auth</Badge>
                            <Badge bg="success" className="me-1 mb-1">Spring Data JPA</Badge>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 bg-white rounded shadow-sm h-100 hover-card">
                            <h4 className="text-warning mb-3">Database & Tools</h4>
                            <Badge bg="warning" className="me-1 mb-1 text-dark">MySQL 8.0+</Badge>
                            <Badge bg="secondary" className="me-1 mb-1">Git & GitHub</Badge>
                            <Badge bg="secondary" className="me-1 mb-1">Maven</Badge>
                            <Badge bg="secondary" className="me-1 mb-1">IntelliJ / VS Code</Badge>
                        </div>
                    </Col>
                </Row>

                {/* Architecture */}
                <h2 className="text-center fw-bold mb-4 animate-slide-up delay-500">🏗️ Project Architecture</h2>
                <Row className="mb-5 animate-slide-up delay-500 justify-content-center">
                    <Col lg={10}>
                        <div className="architecture-box text-center">
{`┌─────────────────────────────────────────────────────────┐ 
│                    ONLINE VOTING SYSTEM                 │ 
└─────────────────────────────────────────────────────────┘ 
                            │ 
        ┌───────────────────┼───────────────────┐ 
        ▼                   ▼                   ▼ 
   ┌─────────┐        ┌──────────┐       ┌──────────┐ 
   │ React.js│◄──────►│  Spring  │◄─────►│  MySQL   │ 
   │Frontend │        │   Boot   │       │ Database │ 
   └─────────┘        └──────────┘       └──────────┘ 
        │                   │                   │ 
    UI Layer          Business Logic      Data Storage 
    Components        REST APIs            Relationships 
    State Mgmt        JWT Auth             Transactions `}
                        </div>
                    </Col>
                </Row>

                {/* Team Members */}
                <h2 className="text-center fw-bold mb-4 animate-slide-up delay-500">👥 Team Members</h2>
                <Row className="justify-content-center animate-slide-up delay-500">
                    <Col lg={10}>
                        <Card className="border-0 shadow-sm">
                            <Table responsive hover className="mb-0 text-center align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Name</th>
                                        <th>PRN</th>
                                        <th>GitHub</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>01</td><td>Aaman Javaed Sayyad</td><td>250850120003</td><td><a href="https://github.com/Aamanjs" target="_blank" rel="noopener noreferrer">@Aamanjs</a></td></tr>
                                    <tr><td>02</td><td>Avadhut Ravindra Joshi</td><td>250850120042</td><td><a href="https://github.com/AvadhutJoshi012" target="_blank" rel="noopener noreferrer">@AvadhutJoshi012</a></td></tr>
                                    <tr><td>03</td><td>Deepak Sanjay Revgade</td><td>250850120137</td><td><a href="https://github.com/deepakrevgade" target="_blank" rel="noopener noreferrer">@deepakrevgade</a></td></tr>
                                    <tr><td>04</td><td>Rishikesh Sukhadev More</td><td>250850120143</td><td><a href="https://github.com/rushimore17" target="_blank" rel="noopener noreferrer">@rushimore17</a></td></tr>
                                    <tr><td>05</td><td>Yadnyesh Rajesh Kolte</td><td>250850120192</td><td><a href="https://github.com/yadnyeshkolte" target="_blank" rel="noopener noreferrer">@yadnyeshkolte</a></td></tr>
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>

            </Container>

            {/* Footer Section */}
            <footer className="bg-dark text-white text-center py-4 mt-auto">
                <Container>
                    <p className="mb-0">&copy; {new Date().getFullYear()} Online Voting System. PG-DAC Batch Aug 2025.</p>
                </Container>
            </footer>
        </div>
    );
};

export default Home;
