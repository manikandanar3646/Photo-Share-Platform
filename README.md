# Photo Share Platform

A full-stack photo sharing and event management platform built for photography and event teams.

The platform allows administrators to create events, manage team members, collect event photos, and publish customer-facing galleries protected by a PIN.

## 🌐 Live Website

**Website:** https://photo-share-platform-m1u3nqpu3-manikandanar3646s-projects.vercel.app

**API Documentation:** https://photo-share-platform-clah.onrender.com/swagger

## 📌 Project Overview

Photo Share Platform is designed for photography and event management teams.

The system provides three main workflows:

* **Admin** creates and manages events.
* **Team members** are assigned to events and upload event photos.
* **Customers** access published galleries through a shareable link and PIN without creating an account.

## ✨ Features

### Admin

* Admin authentication
* Create and manage events
* Add team members to events
* Assign event roles

  * Photographer
  * Editor
* View event information
* View uploaded photos
* Upload photos
* Manage customer galleries
* Publish galleries
* Generate gallery access through a shareable link and PIN

### Team Members

* Team authentication
* View assigned events
* View event details
* Upload multiple photos
* JPG, PNG and WEBP image support
* Photo upload validation
* View uploaded event photos

### Customer

* No account required
* Access gallery using a shareable URL
* PIN-protected gallery access
* View published event photos

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* Tailwind CSS
* Axios
* React Router
* Vite

### Backend

* C#
* ASP.NET Core Web API
* .NET 8
* Entity Framework Core
* REST API
* JWT Authentication
* BCrypt Password Hashing
* Role-Based Authorization

### Database

* PostgreSQL
* Entity Framework Core
* Npgsql

### Object Storage

* Supabase Storage

Photos are stored in object storage rather than directly in the database.

The PostgreSQL database stores photo metadata such as:

* Photo ID
* Event ID
* Uploaded By
* File Name
* Storage Key
* File Size
* Created At

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Supabase PostgreSQL
* Image Storage: Supabase Storage

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      Customer       │
                         │   Gallery + PIN     │
                         └──────────┬──────────┘
                                    │
                                    ▼
┌─────────────────┐        ┌─────────────────────┐
│      Admin      │───────▶│                    │
│ Event Management│        │                    │
└─────────────────┘        │   React Frontend   │
                           │       Vercel        │
┌─────────────────┐        │                    │
│  Team Members   │───────▶│                    │
│ Photo Upload    │        └──────────┬──────────┘
└─────────────────┘                   │
                                      │ REST API
                                      ▼
                           ┌─────────────────────┐
                           │   ASP.NET Core API  │
                           │       .NET 8        │
                           │      Render         │
                           └──────────┬──────────┘
                                      │
                       ┌──────────────┴──────────────┐
                       │                             │
                       ▼                             ▼
              ┌─────────────────┐          ┌─────────────────┐
              │   PostgreSQL    │          │ Supabase Storage│
              │    Database     │          │     Photos      │
              └─────────────────┘          └─────────────────┘
```

## 🔐 Authentication & Authorization

The application uses JWT-based authentication.

Users have roles:

* `Admin`
* `Team`

Admin-only operations are protected using role-based authorization.

Team members can only access events to which they have been assigned.

Customers do not require an account and access published galleries using a gallery PIN.

Passwords are hashed using BCrypt before being stored.

## 👤 Demo Admin Access

### Admin Registration Code

```tex
```
