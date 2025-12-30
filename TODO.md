# Migration Plan: Convert Network to Firebase App

## Tasks
- [x] Create Firestore service functions for CRUD operations on queue data
- [x] Update useQueue hook to use Firestore for tokens, dish of the day, and menu items
- [x] Update LiveStatus component to fetch current token from Firebase Functions
- [x] Complete the useQueue hook functions (addToken, updateTokenStatus, etc.)
- [x] Test the migration to ensure data persists across sessions
- [x] Remove localStorage dependencies from useQueue hook
