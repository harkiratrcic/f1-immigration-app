# Running the Application

## Prerequisites
- Node.js (v16 or higher)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Generate Prisma Client and Setup Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Start the Backend Server
In one terminal window:
```bash
npm run server
```
The backend will run on http://localhost:3001

### 4. Start the Frontend Development Server
In another terminal window:
```bash
npm run dev
```
The frontend will run on http://localhost:8080

### Alternative: Run Both Together
```bash
npm run dev:all
```

## Features Implemented

### 1. Clients Tab
- **Client Management**: View and manage all clients with their information
- **Client Details**: See client email, phone, country, and UCI information
- **Search**: Search clients by name, email, or UCI
- **Add Client**: Create new client profiles

### 2. Invites Section
- Located in the Clients tab as a separate tab
- Shows all form invitations sent to clients
- **Copy Link**: Only shows copy link button (form link removed as requested)
- Track invite status (sent, opened, submitted)
- Resend invitations

### 3. Forms Management
- Moved to Settings page under Forms tab
- View all form templates (Work Permit, Super Visa, PR)
- Configure form templates
- Initialize form templates if not present

### 4. Backend Functionality
- Full Express.js API server
- Client management endpoints
- Form template management
- Invite system with token generation
- Form submission tracking

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/:id/responses` - Get client form responses

### Forms
- `GET /api/forms/templates` - Get form templates
- `POST /api/forms/instances` - Create form instance
- `POST /api/forms/instances/:id/submit` - Submit form

### Invites
- `GET /api/invites` - Get all invites
- `POST /api/invites/send` - Send form invite to client
- `GET /api/invites/token/:token` - Get invite by token
- `POST /api/invites/:id/resend` - Resend invite
- `GET /api/invites/client/:clientId` - Get client's invites

## Testing the Features

1. **Add a Client**: Click "Add Client" button in Clients tab
2. **Send Form**: Click "Send Form" button, select client and form type
3. **View Invites**: Switch to "Invites" tab to see all sent forms
4. **Copy Link**: Click "Copy Link" to get the form URL
5. **Manage Forms**: Go to Settings > Forms tab to see form templates

## Notes
- Database must be running for the backend to work
- Form templates will be auto-initialized on first run
- All backend functionality is fully operational
- Invites are tracked with sent, opened, and submitted timestamps