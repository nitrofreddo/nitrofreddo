import Firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

Firebase.initializeApp({
  apiKey: "AIzaSyDMB7mTOSZ173K3wy7nfRZ7hU4FA-blc00",
  authDomain: "wsos-base.firebaseapp.com",
  databaseURL: "https://wsos-base.firebaseio.com",
  projectId: "wsos-base",
  storageBucket: "wsos-base.appspot.com",
  messagingSenderId: "205127396536"
});

Firebase.firestore().settings({
  timestampsInSnapshots: true
});

const industries = ["Agriculture", "Architecture", "Biological and biomedical sciences", "Business", "Computer and information sciences", "Education", "Engineering", "Health care", "Math and statistics", "Natural resources and conservation", "Physical sciences"];
const skills = ["Problem solving", "Career navigation", "Time management", "Project management", "People skills", "Negotiating an offer", "Networking", "Entrepreneurship", "Conflict resolution"];
const stories = ["Attending college as a first generation student", "Attending college with a disability", "Immigrating to the United States", "Relocating for school or work", "Financial hardships or management", "Attending college as a nontraditional student (e.g. older, married, have children)", "Being an underrepresented person in STEM or health care", "Work-school life balance", "Serving as a leader in my culture or faith", "English being my second language"];
const causes = ["Economic development", "Diversity and inclusion", "Poverty", "Education", "Environment and sustainability", "Human rights", "Animal rights"];
const profileImages = ["bird_edited", "cat_edited", "dog_edited", "fox_edited", "frog_edited", "horse_edited"];

const firestore = Firebase.firestore();
const db = Firebase.firestore();

export default {
  userType() { return localStorage.getItem('userType'); },
  userId() { return Firebase.auth().currentUser.uid; },
  getCurrentUser() {
    var queryUser = Firebase.functions().httpsCallable('me');
    return queryUser().then(result => {
      return result.data;
    });
  },
  registerLoginListener(callback) {
    return Firebase.auth().onAuthStateChanged(callback);
  },
  loggedIn() { return Firebase.auth().currentUser != null },
  login(username, password, completion) {
    var auth = Firebase.auth();

    auth.setPersistence(Firebase.auth.Auth.Persistence.LOCAL).then(function() {
      auth.signInWithEmailAndPassword(username, password)
        .then(result => {
          if (result) { completion(result.user, null); }
        })
        .catch(error => {
          error.message = error.code == 'auth/user-not-found' ? "Incorrect Email Address" : error.message;
          error.message = error.code == 'auth/wrong-password' ? "Incorrect Password" : error.message;
          error.message = error.code == 'auth/invalid-email' ? "Invalid Email Address" : error.message;
          error.message = error.code == 'auth/network-request-failed' ? "Please check your Internet connection." : error.message;
          completion(null, error);
        });
    });
  },
  logout(completion) {
    Firebase.auth().signOut()
      .then(function() { completion(null); })
      .catch(function(error) { completion(error); });
  },
  signUp(email, password, accessCode, data) {
    return Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        var request = Firebase.functions().httpsCallable('createUserObject');
        return request({accessCode: accessCode, email: email, userFields: data})
          .then(result => {
            return result.data;
          })
          .catch(error => { throw error; });
      })
      .catch(error => { throw error; });
  },
  updateProfile(data) {
    return firestore.collection('users').doc(Firebase.auth().currentUser.uid).update(data);
  },
  getMentors() {
    var request = Firebase.functions().httpsCallable('mentors');
    return request().then(result => {
      return result.data;
    });
  },
  getMatches() {
    // var request = Firebase.functions().httpsCallable('matches');
    // return request().then(result => {
    //   return result.data;
    // });

    var matchQuery = db.collection('matches').doc(Firebase.auth().currentUser.uid);

    return matchQuery.get()
      .then(result => {
        var match = result.data();
        var mentees = [];
        if (result.exists) {
          match.mentees.forEach(userId => {
            mentees.push(db.collection('users').doc(userId).get());
          });
          return Promise.all(mentees)
            .then(result => {
              var mentees = [];
              result.forEach(data => {
                mentees.push(data.data());
              });
              return mentees;
            });
        } else {
          return mentees;
        }
      });
  },
  getAllMatches() {
    var request = Firebase.functions().httpsCallable('getAllMatches');
    return request().then(result => {
      return result.data;
    });
  },
  getMentor() {
    var request = Firebase.functions().httpsCallable('mentor');
    return request().then(result => {
      return result.data;
    });

    // var matchQuery = db.collection('matches').where("mentees", "array-contains", Firebase.auth().currentUser.uid);
    //
    // return matchQuery.get()
    //   .then(result => {
    //     if (result.size > 0) {
    //       var mentor = {};
    //       result.forEach(match => {
    //         mentor = db.collection('users').doc(match.id).get();
    //       });
    //       return Promise.resolve(mentor)
    //         .then(
    //         data => {
    //           return data.data();
    //         }
    //       );
    //     }
    //   });
  },
  download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  },
  getAvailableMentors() {
    var request = Firebase.functions().httpsCallable('availableMentors');
    return request().then(result => {
      return result.data;
    });
  },
  generateAccessCodes(role, models, completion) {
    var request = Firebase.functions().httpsCallable('generateAccessCodes');
    request({role: role, models: models}).then(result => {
      completion(result);
    });
  },
  requestMatch(user) {
    var request = Firebase.functions().httpsCallable('requestMatch');
    return request({userId: user})
      .then(result => {
        return result.data;
      })
      .catch(error => {
        throw error;
      });
  },
  getAccessCodes() {
    var collectionRef = firestore.collection('accessCodes');

    return collectionRef.get().then(snapshot => {
      var accessCodes = [];
      snapshot.forEach(doc => {
        var accessCode = doc.data();
        accessCode.id = doc.id;
        accessCodes.push(accessCode);
      });
      return Promise.all(accessCodes);
    });
  },
  getAccessCode(code) {
    var request = Firebase.functions().httpsCallable('accessCode');
    return request({code: code})
      .then(result => {
        return result.data;
      })
      .catch(error => {
        throw error;
      });
  },
  getAdmins() {
    var request = Firebase.functions().httpsCallable('admins');
    return request().then(result => {
      return result.data;
    });
  },
  getStudents() {
    var request = Firebase.functions().httpsCallable('students');
    return request().then(result => {
      return result.data;
    });
  },
  deleteAccessCode(id, completion) {
    var codeRef = firestore.collection("accessCodes").doc(id);
    codeRef.delete().then(result => {
      completion(result);
    });
  },
  deleteMatch(matchId) {
    var request = Firebase.functions().httpsCallable('deleteMatch');
    return request({matchId: matchId})
      .then(result => {
        return result.data;
      })
      .catch(error => {
        throw error;
      })
  },
  deleteUser(userId) {
    var request = Firebase.functions().httpsCallable('deleteUserObject');
    return request({userId: userId})
      .then(result => {
        return result.data;
      })
      .catch(error => {
        throw error;
      });
  },
  sendPasswordResetEmail(email) {
    return Firebase.auth().sendPasswordResetEmail(email);
  },
  industryString(index) { return industries[index]; },
  skillsString(index) { return skills[index]; },
  storiesString(index) { return stories[index]; },
  causesString(index) { return causes[index]; },
  industries() { return industries },
  skills() { return skills },
  stories() { return stories },
  causes() { return causes },
  profileImages() { return profileImages },
  profileImageURLPrefix() { return "/static/profile_icons/" }
};
