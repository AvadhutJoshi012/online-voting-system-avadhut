import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap';
import { getActiveElections, getCompletedElections, getCandidates, castVote, checkHasVoted, getElectionResults } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
    const [elections, setElections] = useState([]);
    const [completedElections, setCompletedElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [hasVotedMap, setHasVotedMap] = useState({});
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

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
            const hasVoted = await checkHasVoted(election.electionId, user.id);
            votedStatus[election.electionId] = hasVoted;
        }
        setHasVotedMap(votedStatus);
    };

    const handleSelectElection = async (election) => {
        setSelectedElection(election);
        const cands = await getCandidates(election.electionId);
        setCandidates(cands);
    };

    const handleVote = async (candidateId) => {
        if (window.confirm('Are you sure? You cannot change your vote later.')) {
            try {
                await castVote(selectedElection.electionId, candidateId);
                alert('Vote cast successfully!');
                loadElections(); // Refresh status
                setSelectedElection(null);
            } catch (e) {
                alert('Voting failed: ' + (e.response?.data || e.message));
            }
        }
    };

    const handleViewResults = async (election) => {
        // Allow viewing results (maybe for completed or active if allowed)
        // For now assumes we can view it.
        const res = await getElectionResults(election.electionId);
        setResults(res);
        setSelectedElection(election);
        setShowResults(true);
    };

    return (
        <Container className="mt-4">
            <h2>Welcome, Voter</h2>
            <p className="text-muted">Your ID: {user?.id}</p>

            <h4 className="mt-4">Active Elections</h4>
            {elections.length === 0 && <p>No active elections at the moment.</p>}

            <Row>
                {elections.map(e => (
                    <Col md={4} key={e.electionId} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{e.electionName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{e.electionType}</Card.Subtitle>
                                <Card.Text>
                                    Status: <Badge bg="success">{e.status}</Badge>
                                </Card.Text>
                                {hasVotedMap[e.electionId] ? (
                                    <Button variant="secondary" disabled>You Voted</Button>
                                ) : (
                                    <Button variant="primary" onClick={() => handleSelectElection(e)}>Vote Now</Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <h4 className="mt-4">Past Election Results</h4>
            {completedElections.length === 0 && <p>No completed elections found.</p>}

            <Row>
                {completedElections.map(e => (
                    <Col md={4} key={e.electionId} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{e.electionName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{e.electionType}</Card.Subtitle>
                                <Card.Text>
                                    Status: <Badge bg="secondary">{e.status}</Badge>
                                </Card.Text>
                                <Button variant="link" onClick={() => handleViewResults(e)}>View Results</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Voting Modal */}
            <Modal show={!!selectedElection && !showResults} onHide={() => setSelectedElection(null)} size="lg">
                <Modal.Header closeButton><Modal.Title>Vote: {selectedElection?.electionName}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <h5>Candidates</h5>
                    <Row>
                        {candidates.map(c => (
                            <Col md={6} key={c.candidateId} className="mb-3">
                                <Card className="h-100">
                                    <Card.Body className="text-center">
                                        <div style={{fontSize: '2rem', marginBottom: '10px'}}>
                                            {/* Placeholder for photo */}
                                            👤
                                        </div>
                                        <Card.Title>{c.user?.fullName}</Card.Title>
                                        <Card.Subtitle>{c.partyName} ({c.partySymbol})</Card.Subtitle>
                                        <Card.Text className="mt-2 text-muted small">
                                            "{c.manifesto}"
                                        </Card.Text>
                                        <Button variant="success" onClick={() => handleVote(c.candidateId)}>Vote for {c.partySymbol}</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Modal.Body>
            </Modal>

             {/* Results Modal Reuse */}
            <Modal show={showResults} onHide={() => setShowResults(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Results: {selectedElection?.electionName}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <table className="table">
                        <thead>
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
                                <tr key={r.resultId}>
                                    <td>{r.rankPosition}</td>
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
    );
};

export default UserDashboard;
