# Saraha Application Backend

## 📌 Introduction

Saraha Application Backend is a RESTful API that powers an anonymous messaging platform.
Users can send messages to others whether they know them or not, with optional image attachments.

---

## ✨ Features

- Send anonymous messages
- Support image attachments
- User authentication & authorization
- REST APIs

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Cloudinary (image storage)
- JWT Authentication

---

## 📂 Project Structure

```plaintext
src/
├── DB/
│   ├── models/
│   │   ├── message.model.js
│   │   ├── token.model.js
│   │   └── user.model.js
│   └── connects.js
│
├── middleware/
│   ├── authentication-middleware.js
│   ├── file_validation_middleware.js
│   └── validation.js
│
├── modules/
│   ├── auth/
│   ├── message/
│   ├── user/
│   └── index.js
│
├── utils/
│   ├── cloud/
│   ├── email/
│   ├── error/
│   ├── multer/
│   ├── otp/
│   ├── security/
│   └── token/
│
├── app.controller.js
└── index.js
```

---

## 🧱 Architecture Layers

- Database Layer
- Service Layer

---

## 🗄 Database Layer

### 1️⃣ User Model

```json
{
  "firstName": "Mohammed",
  "lastName": "Abdelfatah",
  "email": "mohammed@example.com",
  "password": "hashed_password",
  "phoneNumber": "+201234567890",
  "dob": "2000-01-01T00:00:00.000Z",
  "isVerified": false,
  "otp": "123456",
  "otpExpiration": "2025-01-01T12:00:00.000Z",
  "failedAttempts": 0,
  "isBanned": false,
  "banExpiration": null,
  "profilePicture": {
    "secure_url": "https://cloudinary.com/example.jpg",
    "public_id": "users/name_image"
  },
  "credentialUpdatedAt": "2025-01-01T10:00:00.000Z",
  "deletedAt": null,
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T10:00:00.000Z"
}
```

#### Notes

- User can register using **email or phone number**.
- Either `email` or `phoneNumber` is required (not both).
- Passwords are stored as **hashed values**.
- Profile pictures are stored using **Cloudinary**.

---

### 2️⃣ Message Model

```json
{
  "sender": "64f1c9e8b3a1c2a9f1234567",
  "receiver": "64f1c9e8b3a1c2a9f7654321",
  "content": "Message content",
  "attachment": [
    {
      "secure_url": "https://cloudinary.com/example.jpg",
      "public_id": "messages/img_123"
    }
  ],
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

#### Notes

- `sender` can be **null** (anonymous message).
- `receiver` is always required.
- Attachments are optional.

---

### 3️⃣ Token Model

```json
{
  "userId": "64f1c9e8b3a1c2a9f1234567",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "refresh",
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

#### Notes

- Default token type is **refresh**.

---

## ⚙️ Service Layer

This layer contains the core business logic of the application. It handles authentication, user management, and messaging operations.

---

### 1️⃣ Authentication Service

#### Register

Used when the user does not already have an account.

```json
{
  "email": "email@gmail.com",
  "password": "******",
  "confirmPassword": "******",
  "fullName": "FirstName LastName",
  "phoneNumber": "0123456789",
  "dob": "2000-05-15T00:00:00.000Z"
}
```

- After registration, an **OTP** is sent to the user’s email.

---

#### Confirm Account

```json
{
  "email": "email@gmail.com",
  "otp": "otp_number"
}
```

- Confirms the user’s email address.
- If the OTP expires or confirmation is missed, a new OTP can be requested.

---

#### Resend OTP

```json
{
  "email": "email@gmail.com"
}
```

- Used when the OTP expires or was not received.
- Email confirmation is required **before** password recovery.

---

#### Forget Password

```json
{
  "email": "email@gmail.com",
  "otp": "otp_number",
  "newPassword": "******",
  "confirmPassword": "******"
}
```

- User must confirm their email before resetting the password.

---

#### Login

```json
{
  "email": "email@gmail.com",
  "password": "123456"
}
```

- On success, the response includes an **token** used to access protected services.

---

#### Logout

- Requires sending the authentication token in the request headers.

---

### 2️⃣ User Service

#### Get Profile

- Retrieves user information using the authentication token.
- Also returns related user messages.

---

#### Update Password

```json
{
  "oldPassword": "******",
  "newPassword": "******",
  "confirmPassword": "******"
}
```

---

#### Upload Profile Image

- Uses `form-data` in the request body.
- Allows the user to upload or update their profile image.

---

#### Delete Account

- Deletes the authenticated user account using the provided token.

---

### 3️⃣ Message Service

#### Send Anonymous Message

- Sends a message to a user without revealing the sender’s identity.
- The receiver ID is passed as a URL parameter.
- Message content or attachments are sent using `form-data`.

---

#### Send Known Message

- Sends a message with the sender’s identity.
- Receiver ID is passed as a URL parameter.
- Sender authentication token is required in the request headers.
- Message content or attachments are sent using `form-data`.

---

#### Get Message

- Retrieves a specific message by its ID.
- Requires authentication to ensure proper access control.

---

## 🔭View

- Postman: [https://doc.com/saraha](https://documenter.getpostman.com/view/38725097/2sB3BGH9kk)
---
## 👤 Author

**Mohammed Abd Elfatah**

- GitHub: [https://github.com/MohammedAbdElfatah0](https://github.com/MohammedAbdElfatah0)
- LinkedIn: [https://www.linkedin.com/in/mohamed-mohamed-abd-elfatah-a276ab264/](https://www.linkedin.com/in/mohamed-mohamed-abd-elfatah-a276ab264/)
