import React, { useState } from 'react';
import { Form, Button, Table, Row, Col, Alert, Card } from 'react-bootstrap';
import { searchUsers } from '../services/api';
import EditUserModal from '../components/EditUserModal';

const ManageUsers = () => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const data = await searchUsers(query);
            setUsers(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch users');
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleUpdateComplete = () => {
        // Refresh list
        handleSearch({ preventDefault: () => {} });
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body>
                <h4 className="mb-4">User Directory</h4>
                <Form onSubmit={handleSearch} className="mb-4">
                    <Row>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                placeholder="Search by Name, ID, Aadhar, Voter ID, PAN, Passport"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Button type="submit" className="btn-brand w-100">Search</Button>
                        </Col>
                    </Row>
                </Form>

                {error && <Alert variant="danger">{error}</Alert>}

                <Table striped hover responsive className="mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Aadhar</th>
                            <th>Voter ID</th>
                            <th>PAN</th>
                            <th>Passport</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.aadharNumber}</td>
                                <td>{user.voterIdNumber}</td>
                                <td>{user.panCardNumber || '-'}</td>
                                <td>{user.passportNumber || '-'}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(user)}>Edit</Button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && <tr><td colSpan="9" className="text-center py-4 text-muted">No users found</td></tr>}
                    </tbody>
                </Table>
            </Card.Body>

            <EditUserModal
                show={showModal}
                onHide={() => setShowModal(false)}
                user={selectedUser}
                onUpdate={handleUpdateComplete}
            />
        </Card>
    );
};

export default ManageUsers;
