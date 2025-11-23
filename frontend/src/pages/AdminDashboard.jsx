import { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { getAllElections, createElection, updateElectionStatus, calculateResults, getElectionResults, addCandidate } from '../services/api';

const AdminDashboard = () => {
    const [elections, setElections] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCandidateModal, setShowCandidateModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [selectedElection, setSelectedElection] = useState(null);
    const [results, setResults] = useState([]);

    const [newElection, setNewElection] = useState({
        electionName: '',
        electionType: 'GENERAL',
        startDate: '',
        endDate: ''
    });

    const [newCandidate, setNewCandidate] = useState({
        user: { userId: '' }, // Assuming we link by userId manually or select from list (simplified)
        partyName: '',
        partySymbol: '',
        manifesto: ''
    });

    // To simplify candidate addition, usually we'd search for a user.
    // Here I'll just ask for User ID for simplicity as per requirement "Candidate will be user".
    const [userIdForCandidate, setUserIdForCandidate] = useState('');

    useEffect(() => {
        loadElections();
    }, []);

    const loadElections = async () => {
        const data = await getAllElections();
        setElections(data);
    };

    const handleCreateElection = async () => {
        await createElection(newElection);
        setShowCreateModal(false);
        loadElections();
    };

    const handleStatusChange = async (id, status) => {
        await updateElectionStatus(id, status);
        loadElections();
    };

    const handleCalculateResults = async (id) => {
        await calculateResults(id);
        alert('Results calculated!');
    };

    const handleViewResults = async (election) => {
        const data = await getElectionResults(election.electionId);
        setResults(data);
        setSelectedElection(election);
        setShowResultsModal(true);
    };

    const handleAddCandidate = async () => {
        const candidatePayload = {
            ...newCandidate,
            user: { userId: userIdForCandidate }
        };
        try {
            await addCandidate(selectedElection.electionId, candidatePayload);
            alert('Candidate added');
            setShowCandidateModal(false);
        } catch (e) {
            alert('Failed to add candidate. Ensure User ID is valid and not already a candidate.');
        }
    };

    return (
        <Container className="mt-4">
            <h2>Admin Dashboard</h2>
            <Button className="mb-3" onClick={() => setShowCreateModal(true)}>Create New Election</Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {elections.map(e => (
                        <tr key={e.electionId}>
                            <td>{e.electionId}</td>
                            <td>{e.electionName}</td>
                            <td>{e.electionType}</td>
                            <td><Badge bg={e.status === 'ACTIVE' ? 'success' : 'secondary'}>{e.status}</Badge></td>
                            <td>
                                {e.status === 'DRAFT' && (
                                    <Button size="sm" variant="primary" onClick={() => handleStatusChange(e.electionId, 'SCHEDULED')}>Schedule</Button>
                                )}
                                {e.status === 'SCHEDULED' && (
                                    <Button size="sm" variant="success" className="ms-2" onClick={() => handleStatusChange(e.electionId, 'ACTIVE')}>Start</Button>
                                )}
                                {e.status === 'ACTIVE' && (
                                    <Button size="sm" variant="warning" className="ms-2" onClick={() => handleStatusChange(e.electionId, 'COMPLETED')}>End</Button>
                                )}
                                <Button size="sm" variant="info" className="ms-2" onClick={() => {
                                    setSelectedElection(e);
                                    setShowCandidateModal(true);
                                }}>Add Candidate</Button>

                                <Button size="sm" variant="dark" className="ms-2" onClick={() => handleCalculateResults(e.electionId)}>Calc Results</Button>
                                <Button size="sm" variant="outline-primary" className="ms-2" onClick={() => handleViewResults(e)}>View Results</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Create Election Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton><Modal.Title>Create Election</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => setNewElection({...newElection, electionName: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select onChange={(e) => setNewElection({...newElection, electionType: e.target.value})}>
                                <option value="GENERAL">General</option>
                                <option value="STATE">State</option>
                                <option value="LOCAL">Local</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleCreateElection}>Create</Button>
                </Modal.Footer>
            </Modal>

            {/* Add Candidate Modal */}
            <Modal show={showCandidateModal} onHide={() => setShowCandidateModal(false)}>
                <Modal.Header closeButton><Modal.Title>Add Candidate to {selectedElection?.electionName}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>User ID (Candidate must be a registered user)</Form.Label>
                            <Form.Control type="number" value={userIdForCandidate} onChange={(e) => setUserIdForCandidate(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Party Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => setNewCandidate({...newCandidate, partyName: e.target.value})} />
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Party Symbol</Form.Label>
                            <Form.Control type="text" onChange={(e) => setNewCandidate({...newCandidate, partySymbol: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCandidateModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddCandidate}>Add Candidate</Button>
                </Modal.Footer>
            </Modal>

            {/* View Results Modal */}
            <Modal show={showResultsModal} onHide={() => setShowResultsModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Results: {selectedElection?.electionName}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Table>
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
                    </Table>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
