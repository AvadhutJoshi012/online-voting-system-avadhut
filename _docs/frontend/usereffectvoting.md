---
title: "User Effect Voting"
permalink: /docs/frontend/usereffectvoting/
excerpt: "User voting experience and effects"
last_modified_at: 2025-11-15
toc: true
---

# User Effect Voting

## Overview

The voting interface provides an intuitive and secure way for users to cast their votes.

## Voting Flow

1. User logs in to the system
2. Views available elections
3. Selects an election
4. Reviews candidates
5. Casts vote
6. Receives confirmation

## UI Components

### Election List
```jsx
import React, { useEffect, useState } from 'react';
import { getElections } from '../api/elections';

function ElectionList() {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    async function fetchElections() {
      const data = await getElections();
      setElections(data);
    }
    fetchElections();
  }, []);

  return (
    <div className="election-list">
      {elections.map(election => (
        <ElectionCard key={election.id} election={election} />
      ))}
    </div>
  );
}
```

### Voting Interface

The voting interface includes:

- **Candidate Cards**: Display candidate information
- **Vote Button**: Allows user to cast vote
- **Confirmation Dialog**: Confirms vote before submission
- **Success Message**: Shows confirmation after voting

## Visual Effects

### Vote Animation

When a user casts a vote, the system displays:

1. Loading spinner during submission
2. Success checkmark animation
3. Confetti effect (optional)
4. Confirmation message

### Real-time Updates

- Vote count updates in real-time (for admin view)
- Election status changes are reflected immediately
- Candidate rankings update dynamically

## Accessibility

- Keyboard navigation support
- Screen reader compatible
- High contrast mode
- Large touch targets for mobile

## Security Features

- One vote per user per election
- Vote cannot be changed once cast
- Encrypted vote transmission
- Anonymous vote storage
