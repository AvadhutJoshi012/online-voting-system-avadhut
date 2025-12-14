import React, { useState } from 'react';
import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
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
        <Container className="mt-4">
            <h3>Manage Users</h3>
            <Form onSubmit={handleSearch} className="mb-4">
                <Row>
                    <Col md={8}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Name, ID, Aadhar, Voter ID, PAN, Passport"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <Button type="submit" variant="primary">Search</Button>
                    </Col>
                </Row>
            </Form>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
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
                                <Button variant="warning" size="sm" onClick={() => handleEdit(user)}>Edit</Button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && <tr><td colSpan="9" className="text-center">No users found</td></tr>}
                </tbody>
            </Table>

            <EditUserModal
                show={showModal}
                onHide={() => setShowModal(false)}
                user={selectedUser}
                onUpdate={handleUpdateComplete}
            />
        </Container>
    );
};

export default ManageUsers;
