# Firebase Authentication Error Messages

This document lists all the authentication error codes handled in the application and their corresponding user-friendly messages.

## Error Code Reference

### 1. Registration Errors

| Error Code | User Message | When It Occurs |
|------------|-------------|----------------|
| `auth/email-already-in-use` | "Email already registered" | User tries to sign up with an email that already exists |
| `auth/invalid-email` | "Invalid email format" | Email address format is incorrect |
| `auth/weak-password` | "Password too weak (minimum 6 characters)" | Password is less than 6 characters |
| `auth/operation-not-allowed` | "Email/password login is not enabled" | Email/password authentication is disabled in Firebase Console |

### 2. Login Errors

| Error Code | User Message | When It Occurs |
|------------|-------------|----------------|
| `auth/user-not-found` | "User not found. Please check your email or sign up." | Email is not registered |
| `auth/wrong-password` | "Incorrect password. Please try again." | Password is incorrect |
| `auth/invalid-credential` | "Invalid email or password. Please check and try again." | Email or password is wrong (newer Firebase versions) |
| `auth/user-disabled` | "This account has been disabled." | Account has been disabled by admin |
| `auth/too-many-requests` | "Too many failed attempts. Please try again later." | Account temporarily locked after multiple failed login attempts |

### 3. Network & System Errors

| Error Code | User Message | When It Occurs |
|------------|-------------|----------------|
| `auth/network-request-failed` | "Network error. Please check your connection." | No internet connection or network timeout |

### 4. Generic Error

| Error Code | User Message | When It Occurs |
|------------|-------------|----------------|
| Any other error | "Login failed: {error.message}" | Any unhandled error (with actual error message) |

## Implementation Location

All error handling is implemented in:
- **File**: `/src/components/auth/EmailLogin.jsx`
- **Function**: `handleSubmit` (lines 30-97)

## Console Logging

When an error occurs, the following information is logged to the browser console:
1. `console.error('Authentication failed:', error)` - Full error object
2. `console.error('Error code:', error.code)` - Specific error code
3. `console.error('Error message:', error.message)` - Original error message

This helps developers debug issues while showing user-friendly messages to users.

## How to Test

### Test Wrong Password
1. Create an account with email: `test@example.com`
2. Try to login with wrong password
3. Should see: "Incorrect password. Please try again."

### Test User Not Found
1. Try to login with: `nonexistent@example.com`
2. Should see: "User not found. Please check your email or sign up."

### Test Email Already In Use
1. Try to sign up with an existing email
2. Should see: "Email already registered"

### Test Weak Password
1. Try to sign up with password: `123`
2. Should see: "Password too weak (minimum 6 characters)"

### Test Too Many Requests
1. Try to login with wrong password 5+ times quickly
2. Should see: "Too many failed attempts. Please try again later."

## Firebase Console Settings

To enable/disable email authentication:
1. Go to Firebase Console
2. Navigate to: **Authentication** → **Sign-in method**
3. Find **Email/Password** provider
4. Toggle enabled/disabled

## Notes

- All error messages are in **English** for consistency
- Error messages are displayed using **react-hot-toast** for better UX
- The error code `auth/invalid-credential` is more common in newer Firebase SDK versions
- Some error codes may vary depending on Firebase SDK version

