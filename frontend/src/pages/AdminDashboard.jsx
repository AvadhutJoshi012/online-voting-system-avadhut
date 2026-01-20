import { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Badge, Tabs, Tab, Row, Col } from 'react-bootstrap';
import { getAllElections, createElection, updateElectionStatus, calculateResults, getElectionResults, addCandidate, updateCandidateImage, adminGetCandidates, togglePublishResult } from '../services/api';
import ManageUsers from './ManageUsers';

const AdminDashboard = () => {
    const [elections, setElections] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [selectedElection, setSelectedElection] = useState(null);
    const [results, setResults] = useState([]);

    // Create Election State
    const [newElection, setNewElection] = useState({
        electionName: '',
        electionType: 'GENERAL',
        startDate: '',
        endDate: '',
        city: '',
        state: ''
    });

    // Candidates list for the new election
    const [newCandidatesList, setNewCandidatesList] = useState([]);

    // Form state for adding a single candidate to the list
    const [tempCandidate, setTempCandidate] = useState({
        userId: '',
        partyName: '',
        partySymbol: '',
        manifesto: ''
    });
    const [tempCandidateImage, setTempCandidateImage] = useState(null);

    useEffect(() => {
        loadElections();
    }, []);

    const loadElections = async () => {
        const data = await getAllElections();
        setElections(data);
    };

    const handleAddTempCandidate = () => {
        if (!tempCandidate.userId || !tempCandidate.partyName) {
            alert('User ID and Party Name are required');
            return;
        }
        // Add to list
        setNewCandidatesList([...newCandidatesList, { ...tempCandidate, imageFile: tempCandidateImage }]);
        // Reset temp form
        setTempCandidate({ userId: '', partyName: '', partySymbol: '', manifesto: '' });
        setTempCandidateImage(null);
    };

    const handleCreateElection = async () => {
        try {
            // 1. Create Election + Candidates (Metadata)
            const payload = {
                ...newElection,
                candidates: newCandidatesList.map(({ imageFile, ...rest }) => ({
                    ...rest,
                    userId: parseInt(rest.userId)
                }))
            };

            const createdElection = await createElection(payload);
            const electionId = createdElection.electionId;

            // 2. Upload images for candidates using the returned candidate IDs
            if (createdElection.candidates && createdElection.candidates.length > 0) {
                for (const localCand of newCandidatesList) {
                    if (localCand.imageFile) {
                        // Find the corresponding candidate from the backend response
                        const match = createdElection.candidates.find(c => c.user.userId === parseInt(localCand.userId));
                        if (match) {
                            await updateCandidateImage(electionId, match.candidateId, localCand.imageFile);
                        }
                    }
                }
            }

            alert('Election created successfully!');
            setShowCreateModal(false);
            setNewElection({ electionName: '', electionType: 'GENERAL', startDate: '', endDate: '', city: '', state: '' });
            setNewCandidatesList([]);
            loadElections();

        } catch (e) {
            alert('Failed to create election: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleStatusChange = async (id, status) => {
        await updateElectionStatus(id, status);
        loadElections();
    };

    const handleCalculateResults = async (id) => {
        await calculateResults(id);
        alert('Results calculated!');
    };

    const handleTogglePublish = async (id) => {
        try {
            await togglePublishResult(id);
            loadElections();
        } catch (error) {
            alert("Error toggling publish status");
        }
    };

    const handleViewResults = async (election) => {
        const data = await getElectionResults(election.electionId);
        setResults(data);
        setSelectedElection(election);
        setShowResultsModal(true);
    };

    return (
        <Container className="mt-4">
            <h2>Admin Dashboard</h2>

            <Tabs defaultActiveKey="elections" id="admin-tabs" className="mb-3">
                <Tab eventKey="elections" title="Manage Elections">
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

                                        <Button size="sm" variant="dark" className="ms-2" onClick={() => handleCalculateResults(e.electionId)}>Calc Results</Button>
                                        <Button size="sm" variant="outline-primary" className="ms-2" onClick={() => handleViewResults(e)}>View Results</Button>
                                        
                                        {e.status === 'COMPLETED' && (
                                            <Button 
                                                size="sm" 
                                                variant={e.resultPublished ? "danger" : "info"} 
                                                className="ms-2"
                                                onClick={() => handleTogglePublish(e.electionId)}
                                            >
                                                {e.resultPublished ? "Unpublish" : "Publish"}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="users" title="Manage Users">
                    <ManageUsers />
                </Tab>
            </Tabs>

            {/* Create Election Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Create Election</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Election Name</Form.Label>
                                    <Form.Control type="text" value={newElection.electionName} onChange={(e) => setNewElection({...newElection, electionName: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select value={newElection.electionType} onChange={(e) => setNewElection({...newElection, electionType: e.target.value})}>
                                        <option value="GENERAL">General</option>
                                        <option value="STATE">State</option>
                                        <option value="LOCAL">Local</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        {(newElection.electionType === 'STATE' || newElection.electionType === 'LOCAL') && (
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control type="text" value={newElection.state} onChange={(e) => setNewElection({...newElection, state: e.target.value})} placeholder="e.g. Maharashtra" />
                                    </Form.Group>
                                </Col>
                                {newElection.electionType === 'LOCAL' && (
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control type="text" value={newElection.city} onChange={(e) => setNewElection({...newElection, city: e.target.value})} placeholder="e.g. Pune" />
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>
                        )}

                        <Row>
                             <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="datetime-local" value={newElection.startDate} onChange={(e) => setNewElection({...newElection, startDate: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="datetime-local" value={newElection.endDate} onChange={(e) => setNewElection({...newElection, endDate: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <hr />
                        <h5>Add Candidates</h5>
                        <p className="text-muted small">Add candidates now. You cannot add them later.</p>

                        <div className="p-3 border rounded mb-3 bg-light">
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>User ID</Form.Label>
                                        <Form.Control type="number" placeholder="User ID" value={tempCandidate.userId} onChange={(e) => setTempCandidate({...tempCandidate, userId: e.target.value})} />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Party Name</Form.Label>
                                        <Form.Control type="text" placeholder="Party" value={tempCandidate.partyName} onChange={(e) => setTempCandidate({...tempCandidate, partyName: e.target.value})} />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Symbol</Form.Label>
                                        <Form.Control type="text" placeholder="Symbol" value={tempCandidate.partySymbol} onChange={(e) => setTempCandidate({...tempCandidate, partySymbol: e.target.value})} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Manifesto</Form.Label>
                                        <Form.Control type="text" placeholder="Short manifesto" value={tempCandidate.manifesto} onChange={(e) => setTempCandidate({...tempCandidate, manifesto: e.target.value})} />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Photo</Form.Label>
                                        <Form.Control type="file" onChange={(e) => setTempCandidateImage(e.target.files[0])} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="outline-success" size="sm" onClick={handleAddTempCandidate}>Add to List</Button>
                        </div>

                        <h6>Candidates List ({newCandidatesList.length})</h6>
                        <Table size="sm" bordered>
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Party</th>
                                    <th>Symbol</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newCandidatesList.map((c, idx) => (
                                    <tr key={idx}>
                                        <td>{c.userId}</td>
                                        <td>{c.partyName}</td>
                                        <td>{c.partySymbol}</td>
                                        <td>{c.imageFile ? c.imageFile.name : 'No Image'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleCreateElection}>Create Election</Button>
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
