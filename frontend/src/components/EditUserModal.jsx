import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { adminUpdateUser } from '../services/api';

const EditUserModal = ({ show, onHide, user, onUpdate }) => {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData(user);
            setMessage('');
            setError('');
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminUpdateUser(user.userId, formData);
            setMessage('User updated successfully');
            onUpdate();
            setTimeout(onHide, 1500);
        } catch (err) {
            setError('Failed to update user');
        }
    };

    if (!user) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit User: {user.fullName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" name="fullName" value={formData.fullName || ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control as="textarea" name="address" value={formData.address || ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{user.idProofType} Number</Form.Label>
                        <Form.Control type="text" value={user.idProofNumber || ''} readOnly />
                        <Form.Text className="text-muted">Cannot be changed.</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>PAN Card Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="panCardNumber"
                            value={formData.panCardNumber || ''}
                            onChange={handleChange}
                            readOnly={!!user.panCardNumber}
                            placeholder={!user.panCardNumber ? "Add PAN Card Number" : ""}
                        />
                        {user.panCardNumber && <Form.Text className="text-muted">Already added.</Form.Text>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Passport Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="passportNumber"
                            value={formData.passportNumber || ''}
                            onChange={handleChange}
                            readOnly={!!user.passportNumber}
                            placeholder={!user.passportNumber ? "Add Passport Number" : ""}
                        />
                        {user.passportNumber && <Form.Text className="text-muted">Already added.</Form.Text>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Profile Image URL</Form.Label>
                        <Form.Control type="text" name="profileImageUrl" value={formData.profileImageUrl || ''} onChange={handleChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit">Update User</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditUserModal;
