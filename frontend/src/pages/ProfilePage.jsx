import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import { Container, Row, Col, Card, Form, Button, Alert, Image } from 'react-bootstrap';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getUserProfile();
            setUser(data);
            setFormData(data);
        } catch (err) {
            setError('Failed to load profile');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(formData);
            setMessage('Profile updated successfully');
            setEditMode(false);
            fetchProfile();
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header as="h3">My Profile</Card.Header>
                        <Card.Body>
                            {message && <Alert variant="success">{message}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}

                            <div className="text-center mb-4">
                                <Image
                                    src={user.profileImageUrl || 'http://localhost:5173/profiles/1.jpg'}
                                    roundedCircle
                                    width="150"
                                    height="150"
                                />
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" value={user.fullName} readOnly />
                                    <Form.Text className="text-muted">Name cannot be changed directly.</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={editMode ? formData.email : user.email}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={editMode ? formData.phoneNumber : user.phoneNumber}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="address"
                                        value={editMode ? formData.address : user.address}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                value={editMode ? formData.city : user.city}
                                                onChange={handleChange}
                                                readOnly={!editMode}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="state"
                                                value={editMode ? formData.state : user.state}
                                                onChange={handleChange}
                                                readOnly={!editMode}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Pincode</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="pincode"
                                                value={editMode ? formData.pincode : user.pincode}
                                                onChange={handleChange}
                                                readOnly={!editMode}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Aadhar Number</Form.Label>
                                    <Form.Control type="text" value={user.aadharNumber} readOnly />
                                    <Form.Text className="text-muted">Primary ID cannot be changed.</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Voter ID Number</Form.Label>
                                    <Form.Control type="text" value={user.voterIdNumber} readOnly />
                                    <Form.Text className="text-muted">Primary ID cannot be changed.</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>PAN Card Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="panCardNumber"
                                        value={editMode ? (formData.panCardNumber || '') : (user.panCardNumber || 'Not Added')}
                                        onChange={handleChange}
                                        readOnly={!editMode || user.panCardNumber}
                                        placeholder={!user.panCardNumber && editMode ? "Enter PAN Card Number" : ""}
                                    />
                                    {user.panCardNumber && editMode && <Form.Text className="text-muted">Already added, cannot be changed.</Form.Text>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Passport Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="passportNumber"
                                        value={editMode ? (formData.passportNumber || '') : (user.passportNumber || 'Not Added')}
                                        onChange={handleChange}
                                        readOnly={!editMode || user.passportNumber}
                                        placeholder={!user.passportNumber && editMode ? "Enter Passport Number" : ""}
                                    />
                                    {user.passportNumber && editMode && <Form.Text className="text-muted">Already added, cannot be changed.</Form.Text>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Profile Image URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="profileImageUrl"
                                        value={editMode ? formData.profileImageUrl : user.profileImageUrl}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </Form.Group>

                                {editMode ? (
                                    <div className="d-flex gap-2">
                                        <Button variant="success" type="submit">Save Changes</Button>
                                        <Button variant="secondary" onClick={() => { setEditMode(false); setFormData(user); }}>Cancel</Button>
                                    </div>
                                ) : (
                                    <Button variant="primary" onClick={() => setEditMode(true)}>Edit Profile</Button>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
