import { useEffect, useState, useRef, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap';
import Webcam from 'react-webcam';
import { getActiveElections, getCompletedElections, getCandidates, castVote, checkHasVoted, getUserElectionResults } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
    const [elections, setElections] = useState([]);
    const [completedElections, setCompletedElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [hasVotedMap, setHasVotedMap] = useState({});
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    
    const webcamRef = useRef(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        loadElections();
    }, []);

    const loadElections = async () => {
        const data = await getActiveElections();
        setElections(data);

        const completedData = await getCompletedElections();
        setCompletedElections(completedData);

        // Check voting status for each election
        const votedStatus = {};
        for (const election of data) {
            const hasVoted = await checkHasVoted(election.electionId);
            votedStatus[election.electionId] = hasVoted;
        }
        setHasVotedMap(votedStatus);
    };

    const handleSelectElection = async (election) => {
        setSelectedElection(election);
        const cands = await getCandidates(election.electionId);
        setCandidates(cands);
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        return imageSrc;
    }, [webcamRef]);

    // Convert base64 to blob
    const dataURItoBlob = (dataURI) => {
        if (!dataURI) return null;
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    const handleVote = async (candidateId) => {
        if (window.confirm('Are you sure? This will capture your image for verification.')) {
            try {
                setIsVerifying(true);
                const imageSrc = capture();
                if (!imageSrc) {
                    alert('Could not capture image from webcam. Please ensure camera permissions are allowed.');
                    setIsVerifying(false);
                    return;
                }
                const blob = dataURItoBlob(imageSrc);

                await castVote(selectedElection.electionId, candidateId, blob);
                alert('Vote cast successfully!');
                loadElections(); // Refresh status
                setSelectedElection(null);
            } catch (e) {
                alert('Voting failed: ' + (e.response?.data || e.message));
            } finally {
                setIsVerifying(false);
            }
        }
    };

    const handleViewResults = async (election) => {
        // Allow viewing results (maybe for completed or active if allowed)
        // For now assumes we can view it.
        const res = await getUserElectionResults(election.electionId);
        setResults(res);
        setSelectedElection(election);
        setShowResults(true);
    };

    return (
        <>
            <div className="bg-brand-gradient text-white py-5 mb-4 shadow-sm">
                <Container>
                    <h2 className="mb-0 fw-bold">Welcome, {user?.fullName || 'Voter'}</h2>
                    <p className="mb-0 text-white-50">User ID: {user?.id} • Exercise your right to vote.</p>
                </Container>
            </div>

            <Container className="mb-5">
                <h4 className="mb-3 fw-bold text-dark border-bottom pb-2">Active Elections</h4>
                {elections.length === 0 && (
                    <div className="alert alert-light text-center border shadow-sm">
                        No active elections at the moment.
                    </div>
                )}

                <Row className="mb-5">
                    {elections.map(e => (
                        <Col md={4} key={e.electionId} className="mb-4">
                            <Card className="border-0 shadow-sm h-100 hover-card">
                                <Card.Body className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <Card.Title className="fw-bold mb-0">{e.electionName}</Card.Title>
                                        <Badge bg="success" className="rounded-pill">{e.status}</Badge>
                                    </div>
                                    <Card.Subtitle className="mb-3 text-muted small">{e.electionType} Election</Card.Subtitle>
                                    
                                    <div className="mt-auto">
                                        {hasVotedMap[e.electionId] ? (
                                            <Button variant="secondary" className="w-100 disabled" disabled>
                                                <i className="bi bi-check-circle-fill me-2"></i>You Voted
                                            </Button>
                                        ) : (
                                            <Button className="btn-brand w-100" onClick={() => handleSelectElection(e)}>
                                                Vote Now
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <h4 className="mb-3 fw-bold text-dark border-bottom pb-2">Past Election Results</h4>
                {completedElections.length === 0 && (
                    <div className="text-muted">No completed elections found.</div>
                )}

                <Row>
                    {completedElections.map(e => (
                        <Col md={4} key={e.electionId} className="mb-3">
                            <Card className="border-0 shadow-sm h-100 hover-card">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Card.Title className="fw-bold mb-0 text-truncate">{e.electionName}</Card.Title>
                                        <Badge bg="secondary" className="rounded-pill">{e.status}</Badge>
                                    </div>
                                    <Card.Subtitle className="mb-3 text-muted small">{e.electionType} Election</Card.Subtitle>
                                    <Button variant="outline-primary" size="sm" className="w-100" onClick={() => handleViewResults(e)}>
                                        View Results
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Voting Modal */}
                <Modal show={!!selectedElection && !showResults} onHide={() => setSelectedElection(null)} size="lg" centered>
                    <Modal.Header closeButton closeVariant="white" className="bg-brand-gradient text-white">
                        <Modal.Title>Vote: {selectedElection?.electionName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-light">
                        <div className="mb-4 text-center bg-white p-3 rounded shadow-sm">
                             <h5 className="fw-bold text-dark">Face Verification Required</h5>
                             <p className="text-muted small mb-3">Please ensure your face is clearly visible in the camera frame.</p>
                             <div className="d-flex justify-content-center">
                                 <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width={320}
                                    height={240}
                                    videoConstraints={{ facingMode: "user" }}
                                    style={{ borderRadius: '10px', border: '2px solid #e9ecef' }}
                                 />
                             </div>
                        </div>
                        
                        <h5 className="mb-3 ps-2 border-start border-4 border-primary">Candidates</h5>
                        <Row>
                            {candidates.map(c => (
                                <Col md={6} key={c.candidateId} className="mb-3">
                                    <Card className="h-100 border-0 shadow-sm candidate-card">
                                        <Card.Body className="text-center p-4">
                                            <div className="mb-3 position-relative d-inline-block">
                                                {c.candidatePhoto ? (
                                                    <img
                                                        src={`data:image/jpeg;base64,${c.candidatePhoto}`}
                                                        alt="Candidate"
                                                        className="rounded-circle shadow-sm"
                                                        style={{width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #f8f9fa'}}
                                                    />
                                                ) : (
                                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm" style={{width: '100px', height: '100px', margin: '0 auto', border: '3px solid #f8f9fa'}}>
                                                        <span style={{fontSize: '2.5rem'}}>👤</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Card.Title className="fw-bold mb-1">{c.user?.fullName}</Card.Title>
                                            <Card.Subtitle className="text-primary mb-2 fw-bold">{c.partyName}</Card.Subtitle>
                                            <Badge bg="light" text="dark" className="border mb-3">{c.partySymbol}</Badge>
                                            <Card.Text className="text-muted small fst-italic mb-3">
                                                "{c.manifesto}"
                                            </Card.Text>
                                            <Button 
                                                variant="success" 
                                                className="w-100 rounded-pill fw-bold" 
                                                onClick={() => handleVote(c.candidateId)} 
                                                disabled={isVerifying}
                                            >
                                                {isVerifying ? 'Verifying...' : `Vote for ${c.partySymbol}`}
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Modal.Body>
                </Modal>

                 {/* Results Modal Reuse */}
                <Modal show={showResults} onHide={() => {setShowResults(false); setSelectedElection(null);}} size="lg" centered>
                    <Modal.Header closeButton closeVariant="white" className="bg-brand-gradient text-white">
                        <Modal.Title>Results: {selectedElection?.electionName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Rank</th>
                                    <th>Candidate</th>
                                    <th>Party</th>
                                    <th>Votes</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(r => (
                                    <tr key={r.resultId} className={r.rankPosition === 1 ? "table-success fw-bold" : ""}>
                                        <td>
                                            {r.rankPosition === 1 && <span className="me-1">🏆</span>}
                                            {r.rankPosition}
                                        </td>
                                        <td>{r.candidate?.user?.fullName}</td>
                                        <td>{r.candidate?.partyName} ({r.candidate?.partySymbol})</td>
                                        <td>{r.voteCount}</td>
                                        <td>{r.votePercentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    );
};

export default UserDashboard;
