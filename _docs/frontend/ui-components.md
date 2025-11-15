---
title: "UI Components"
permalink: /docs/frontend/ui-components/
excerpt: "Reusable UI components documentation"
last_modified_at: 2025-11-15
toc: true
---

# UI Components

## Component Library

OVS uses a custom component library built with React.

## Core Components

### Button
```jsx
<Button 
  variant="primary" 
  size="large"
  onClick={handleClick}
>
  Cast Vote
</Button>
```

### Card
```jsx
<Card>
  <CardHeader>
    <h3>Election Title</h3>
  </CardHeader>
  <CardBody>
    <p>Election description...</p>
  </CardBody>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### Modal
```jsx
<Modal isOpen={isOpen} onClose={handleClose}>
  <ModalHeader>Confirm Vote</ModalHeader>
  <ModalBody>
    Are you sure you want to vote for this candidate?
  </ModalBody>
  <ModalFooter>
    <Button onClick={handleConfirm}>Confirm</Button>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
  </ModalFooter>
</Modal>
```

## Form Components

- Input
- Select
- Checkbox
- Radio
- TextArea

## Layout Components

- Container
- Grid
- Flex
- Spacer

## Styling

Components use CSS modules for styling:
```css
/* Button.module.css */
.button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-primary {
  background-color: #007bff;
  color: white;
}

.button-primary:hover {
  background-color: #0056b3;
}
```
