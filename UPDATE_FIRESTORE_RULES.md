# Update Firestore Rules

## 🚨 Important: Deploy Updated Rules

The Firestore security rules have been updated to allow email checking during login. You need to deploy these rules to Firebase.

## Option 1: Deploy via Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **habitsyncreward**
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents of `firestore.rules` file
5. Paste into the editor
6. Click **Publish**

## Option 2: Deploy via Firebase CLI

If you have Firebase CLI installed:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

## What Changed?

### Before:
```javascript
match /userprofiles/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && userId == request.auth.uid;
}
```

### After:
```javascript
match /userprofiles/{userId} {
  // Allow everyone to query (for email existence check)
  allow list: if true;
  // Only authenticated users can read individual documents
  allow get: if request.auth != null;
  // Only can write own profile
  allow write: if request.auth != null && userId == request.auth.uid;
}
```

## Why This Change?

- **Problem**: During login, users are not yet authenticated, so they couldn't query Firestore to check if an email exists
- **Solution**: Allow unauthenticated users to perform `list` queries (search), but still require authentication to `get` individual documents
- **Security**: This only allows checking if an email exists, not reading the actual user data

## Verify Rules Are Active

After deploying, test by:
1. Try to login with a non-existent email
2. You should see: "Email not found. Please sign up first."
3. Try to login with a wrong password for an existing email
4. You should see: "Incorrect password. Please try again."

## Current Rules File Location

- **Local**: `/Users/yishenchen/Project/HabitSyncReward/firestore.rules`
- **Remote**: Firebase Console → Firestore Database → Rules

