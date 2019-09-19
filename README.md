# Firebase Project

* Configure Firebase
* Firebase Authentication
* Firebase Database (Firestore)
* Firebase Functions

#### Configure Firebase
1. Access [Firebase Console](https://console.firebase.google.com "Firebase Console") and go to General Settings.
2. Create a new app.
3. In **Firebase SDK snippet** select **CDN** and copy the value from ```firebaseConfig``` variable.
4. Go to ```index.html``` on project and replace the variable ```firebaseConfig```


#### Firebase Database (Firestore)
Define rules bellow
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  	// match logged in user doc in user collections
    match /users/{userId} {
      allow create: if request.auth.uid != null;
      allow read: if request.auth.uid == userId
    }

    // match documents in the guides collections
    match /guides/{guideId} {
    	allow read: if request.auth.uid != null;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```


#### Firebase Functions
Adjust GCP Project ID in ```.firebaserc``` and deploy.
```
firebase deploy --only functions
```
