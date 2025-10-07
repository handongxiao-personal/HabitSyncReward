# Password Reset Feature Guide

## 📧 How Password Reset Works

### User Flow:

1. **Forgot Password**
   - User clicks "Forgot password?" on login page
   - Modal opens asking for email address

2. **Enter Email**
   - User enters their registered email
   - System checks if email exists in database

3. **Receive Email**
   - Firebase sends password reset email
   - Email contains a secure reset link

4. **Reset Password**
   - User clicks link in email
   - Opens Firebase-hosted reset page
   - User enters new password
   - Returns to app and can login with new password

---

## 🎯 Features Implemented

### 1. **"Forgot Password" Link**
- ✅ Only appears in **Login mode** (not Sign Up)
- ✅ Located below the login button
- ✅ Opens a modal for email input

### 2. **Password Reset Modal**
- ✅ Clean, user-friendly interface
- ✅ Email input field (pre-filled with current input)
- ✅ "Cancel" and "Send Reset Link" buttons
- ✅ Loading states during processing

### 3. **Email Validation**
- ✅ Checks if email exists in Firestore before sending
- ✅ Shows error if email not found: "Email not found. Please check your email or sign up first."
- ✅ Only sends reset email to registered users

### 4. **Error Handling**
- ✅ Invalid email format
- ✅ Email not found
- ✅ Too many requests
- ✅ Network errors

---

## 📋 Error Messages

| Situation | Message |
|-----------|---------|
| Email not found | "Email not found. Please check your email or sign up first." |
| Invalid email format | "Invalid email format" |
| Too many requests | "Too many requests. Please try again later." |
| Success | "Password reset email sent! Please check your inbox." |

---

## 🔧 Technical Implementation

### Files Modified:

1. **`/src/services/auth.js`**
   - Added `sendPasswordResetEmail` import
   - Added `resetPassword()` function

2. **`/src/components/auth/EmailLogin.jsx`**
   - Added "Forgot password?" link
   - Added password reset modal
   - Added `handleResetPassword()` function
   - Added email existence check before sending

3. **`/firestore.rules`**
   - Updated to allow unauthenticated users to query userprofiles
   - Required for checking email existence

---

## 🎨 UI Components

### Login Page:
```
┌─────────────────────────┐
│       Login             │
│                         │
│  Email: [input]         │
│  Password: [input] 👁   │
│                         │
│  [Login Button]         │
│                         │
│  Forgot password? ←---- NEW!
│                         │
│  Don't have account?    │
└─────────────────────────┘
```

### Reset Modal:
```
┌─────────────────────────┐
│  🔒 Reset Password      │
│  Enter your email...    │
│                         │
│  Email: [input]         │
│  We'll send you...      │
│                         │
│  [Cancel] [Send Link]   │
└─────────────────────────┘
```

---

## 🚀 How to Use

### As a User:

1. Go to login page
2. Click **"Forgot password?"**
3. Enter your email address
4. Click **"Send Reset Link"**
5. Check your email inbox
6. Click the link in the email
7. Enter your new password
8. Return to app and login

### As a Developer:

No additional setup needed! The feature is ready to use after:
1. ✅ Updating Firestore rules (see `UPDATE_FIRESTORE_RULES.md`)
2. ✅ Code changes are already deployed

---

## 📧 Email Template Configuration

You can customize the password reset email in Firebase Console:

1. Go to **Firebase Console**
2. Navigate to **Authentication** → **Templates**
3. Select **Password reset**
4. Customize the email template (subject, body, sender name)

### Default Email Template:

```
Subject: Reset your password for HabitSync Rewards

Hi,

We received a request to reset your password. 
Click the link below to set a new password:

[Reset Password Button]

If you didn't request this, you can safely ignore this email.

Thanks,
HabitSync Rewards Team
```

---

## 🔒 Security Features

1. ✅ Reset links expire after 1 hour
2. ✅ Links can only be used once
3. ✅ Rate limiting prevents spam
4. ✅ Email verification required
5. ✅ Checks email exists before sending

---

## 🧪 Testing

### Test Scenario 1: Valid Email
```
Input: registered@example.com
Expected: "Password reset email sent! Please check your inbox."
Result: Email sent ✅
```

### Test Scenario 2: Email Not Found
```
Input: notregistered@example.com
Expected: "Email not found. Please check your email or sign up first."
Result: No email sent ❌
```

### Test Scenario 3: Invalid Format
```
Input: invalid-email
Expected: "Invalid email format"
Result: No email sent ❌
```

---

## ⚠️ Important Notes

1. **Firestore Rules Required**: Make sure to update Firestore rules to allow email checking
2. **Email Delivery**: Gmail may mark emails as spam - check spam folder
3. **Link Expiration**: Reset links expire in 1 hour
4. **Rate Limiting**: Too many requests will temporarily block the user

---

## 🐛 Troubleshooting

### Issue: Reset email not received
- Check spam/junk folder
- Verify email address is correct
- Check Firebase Console logs
- Ensure email/password auth is enabled

### Issue: "Missing or insufficient permissions"
- Update Firestore rules (see UPDATE_FIRESTORE_RULES.md)
- Deploy new rules to Firebase Console

### Issue: Link expired
- Request a new reset link
- Links are valid for 1 hour only

---

## 📱 User Experience Summary

✅ **Simple**: One-click access to password reset
✅ **Clear**: Helpful messages guide users
✅ **Secure**: Links expire and can only be used once
✅ **Reliable**: Checks email exists before sending

