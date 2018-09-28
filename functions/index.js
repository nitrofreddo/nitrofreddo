const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sendgrid = require('@sendgrid/mail');

admin.initializeApp();
admin.firestore().settings({
  timestampsInSnapshots: true
});
sendgrid.setApiKey('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');
sendgrid.setSubstitutionWrappers('{{', '}}');

const industries = ["Agriculture", "Architecture", "Biological and biomedical sciences", "Business", "Computer and information sciences", "Education", "Engineering", "Health care", "Math and statistics", "Natural resources and conservation", "Physical sciences"];
const skills = ["Problem solving", "Career navigation", "Time management", "Project management", "People skills", "Negotiating an offer", "Networking", "Entrepreneurship", "Conflict resolution", "Life Coaching"];
const stories = ["Attending college as a first generation student", "Attending college with a disability", "Immigrating to the United States", "Relocating for school or work", "Financial management or hardships", "Attending college as a nontraditional student (e.g. older, married, have children)", "Being an underrepresented person in STEM or health care", "Work-school life balance", "Serving as a leader in my culture or faith", "English being my second language"];
const causes = ["Economic development", "Diversity and inclusion", "Poverty", "Education", "Environment and sustainability", "Human rights", "Animal rights", "World Peace", "Family"];

const db = admin.firestore();

exports.me = functions.https.onCall((data, context) => {
  var userId = context.auth.uid;
  var userQuery = db.collection('users').doc(userId);

  return userQuery.get()
    .then(document => {
      return document.data();
    });
});

exports.user = functions.https.onCall((data, context) => {
  var userId = data.userId;
  var userQuery = db.collection('users').doc(userId);

  return userQuery.get()
    .then(document => {
      var userObject = document.data();
      return admin.auth().getUser(userId)
        .then(user => {
          userObject.email = user.email;
          return userObject;
        })
        .catch(error => {
          throw error;
        });
    });
});

exports.generateAccessCodes = functions.https.onCall((data, context) => {
  var role = data.role;
  var models = data.models;
  var batch = db.batch();

  models.forEach(model => {
    var ref = db.collection('accessCodes').doc();

    const emailAddress = model.email;
    const accessCode = model.code;

    model.claimed = false;
    model.role = role;

    if (emailAddress != null && emailAddress != '') {
      const email = {
        to: emailAddress,
        from: 'no-reply@waopportunityscholarship.org',
        templateId: 'd-9ce853e96b044b9ca010bb424cbc1617',
        dynamicTemplateData: {
          access_code: accessCode,
        },
      };

      sendgrid.send(email)
        .then(() => console.log('Access code ' + accessCode + ' successfully sent to ' + emailAddress))
        .catch(error => console.error(error.toString()));
    }

    batch.set(ref, model);
  });

  return batch.commit();
});

exports.admins = functions.https.onCall((data, context) => {
  var adminQuery = db.collection('users').where("role", "==", "admin");

  return adminQuery.get().then(snapshot => {
    var users = [];
    snapshot.forEach(doc => {
      users.push(admin.auth().getUser(doc.id));
    });
    return Promise.all(users);
  });
});

exports.matches = functions.https.onCall((data, context) => {
  var matchQuery = db.collection('matches').doc(context.auth.uid);

  return matchQuery.get()
    .then(result => {
      var match = result.data();
      var mentees = [];
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
    });
});

exports.mentors = functions.https.onCall((data, context) => {
  var mentorQuery = db.collection('users').where("role", "==", "mentor");

  return mentorQuery.get().then(snapshot => {
    var users = [];
    snapshot.forEach(doc => {
      users.push(admin.auth().getUser(doc.id)
        .then(user => {
          return Object.assign({}, user, doc.data());
        }));
    });
    return Promise.all(users);
  });
});

exports.availableMentors = functions.https.onCall((data, context) => {
  var mentorQuery = db.collection('users').where("role", "==", "mentor");

  return mentorQuery.get().then(snapshot => {
    var mentors = [];

    snapshot.forEach(doc => {
      var mentor = doc.data();
      mentor.id = doc.id;
      if ((mentor.hasMentee && mentor.canMentorCount > 1) || (!mentor.hasMentee && mentor.canMentorCount > 0)) {
        mentors.push(mentor);
      }
    });

    return Promise.all(mentors);
  });
});

exports.students = functions.https.onCall((data, context) => {
  var studentQuery = db.collection("users").where("role", "==", "student");

  return studentQuery.get().then(snapshot => {
    var users = [];
    snapshot.forEach(doc => {
      users.push(admin.auth().getUser(doc.id)
        .then(user => {
          return Object.assign({}, user, doc.data());
        }));
    });
    return Promise.all(users);
  });
});

exports.accessCode = functions.https.onCall((data, context) => {
  var code = data.code;
  var query = db.collection("accessCodes").where("code", "==", code);

  return query.get()
    .then(snapshot => {
      var codes = [];
      snapshot.forEach(doc => { codes.push(doc); });

      return codes.length > 0 ? codes[0].data() : null;
    })
    .catch(error => {
      throw error;
    });
});

exports.createUserObject = functions.https.onCall((data, context) => {
  var userId = context.auth.uid;
  var code = data.accessCode;
  var fields = data.userFields;
  var email = data.email;
  var codeQuery = db.collection('accessCodes').where("code", "==", code);

  return codeQuery.get()
    .then(codeSnap => {
      var codes = [];
      codeSnap.forEach(doc => { codes.push(doc); });

      if (codes.length == 0) { throw "code not found"; return; }

      var accessCode = codes[0].data();

      if (accessCode.claimed) { throw "code already claimed"; return; }
      if (accessCode.email != null && accessCode.email != "" && accessCode.email != email) { throw "wrong email"; return; }

      if (accessCode.role === 'mentor') {
        const confirmation = {
          to: email,
          from: 'no-reply@waopportunityscholarship.org',
          templateId: 'd-ad02d78d95db4dd59de974b4798bb42e',
          dynamicTemplateData: {
            name: data.userFields.firstName,
          },
        };

        sendgrid.send(confirmation)
          .then(() => console.log('Confirmation successfully sent to ' + email))
          .catch(error => console.error(error.toString()));
      }

      accessCode.claimed = true;
      fields.role = accessCode.role;

      var userObjRef = db.collection('users').doc(userId);
      var accessCodeRef = db.collection('accessCodes').doc(codes[0].id);
      var batch = db.batch();

      batch.set(userObjRef, fields)
      batch.update(accessCodeRef, accessCode);

      return batch.commit();
    });
});

exports.deleteUserObject = functions.https.onCall((data, context) => {
  var userId = data.userId;
  var userQuery = db.collection('users').doc(userId);

  return userQuery.delete()
    .then(() => {
      return admin.auth().deleteUser(userId)
        .then(result => {
          return result;
        })
        .catch(error => {
          throw error;
        });
    })
    .catch(error => {
      throw error;
    });
});

exports.deleteMatch = functions.https.onCall((data, context) => {
  var matchId = data.matchId;
  var matchQuery = db.collection('matches').doc(matchId);
  var userQuery = db.collection('users').doc(matchId);

  return db.runTransaction(transaction => {
    return transaction.get(userQuery)
      .then(doc => {
        var user = doc.data();

        return transaction.get(matchQuery)
          .then(matchDoc => {
            var match = matchDoc.data();

            transaction.update(userQuery, { "canMentorCount": user.canMentorCount + match.mentees.length });

            return transaction.delete(matchQuery);
          });
      });
  });
});

exports.matches = functions.https.onRequest((request, response) => {

});

exports.mentor = functions.https.onCall((data, context) => {
  var matchQuery = db.collection('matches').where("mentees", "array-contains", context.auth.uid);

  return matchQuery.get()
    .then(result => {
      if (result.size > 0) {
        var mentor = {};
        var mentorId = "";
        result.forEach(match => {
          mentorId = match.id;
          mentor = db.collection('users').doc(mentorId).get();
        });
        return Promise.resolve(mentor)
          .then(
            data => {
              var mentorObj = data.data();
              return admin.auth().getUser(mentorId)
                .then(user => {
                  mentorObj.email = user.email;
                  return mentorObj;
                });
            }
          );
      }
    });
});

exports.getAllMatches = functions.https.onCall((data, context) => {
  var matchQuery = db.collection('matches');

  return matchQuery.get()
    .then(result => {
      var matches = [];

      result.forEach(doc => {
        var match = doc.data();
        match.mentor = doc.id;

        matches.push(admin.auth().getUser(match.mentor)
          .then(mentorObj => {
            var matchObj = {
              mentor: {},
              mentees: []
            };

            matchObj.mentor = mentorObj;

            match.mentees.forEach(menteeId => {
              matchObj.mentees.push(admin.auth().getUser(menteeId)
                .then(user => {
                  return user;
                })
                .catch(error => {
                  console.log(error);
                  return null;
                })
              );
            });

            return Promise.all(matchObj.mentees)
              .then(mentees => {
                matchObj.mentees = mentees;
                return matchObj;
              });
          })
          .catch(error => {
            console.log(error);
            return null;
          })
        );
      });

      return Promise.all(matches);
    });
});

exports.requestMatch = functions.https.onCall((data, context) => {
  var user = data.userId;
  var mentorQuery = db.collection('users').doc(user);
  var menteeQuery = db.collection('users').doc(context.auth.uid);
  var matchQuery = db.collection('matches').doc(user);

  return db.runTransaction(transaction => {
    return transaction.get(mentorQuery)
      .then(doc => {
        var mentor = doc.data();
        if (mentor.role == "mentor") {
          if ((mentor.hasMentee && mentor.canMentorCount > 1) || (!mentor.hasMentee && mentor.canMentorCount > 0)) {
            return transaction.get(matchQuery)
              .then(doc1 => {
                return transaction.get(menteeQuery)
                  .then(doc2 => {
                    if (!doc1.exists) {
                      transaction.set(matchQuery, {mentees: [context.auth.uid]});
                    } else {
                      var match = doc1.data();
                      transaction.update(matchQuery, {mentees: match.mentees.concat(context.auth.uid)});
                    }
                    transaction.update(mentorQuery,
                      { "canMentorCount": mentor.canMentorCount-1 });

                    return admin.auth().getUser(user)
                      .then(mentorObj => {
                        var mentorEmail = mentorObj.email;
                        var menteeObj = doc2.data();
                        const confirmationMentor = {
                          to: mentorEmail,
                          from: 'no-reply@waopportunityscholarship.org',
                          templateId: 'd-136e216f27ce47e582844a86ea40e672',
                          dynamicTemplateData: {
                            name: mentor.firstName,
                            menteeName: menteeObj.firstName + ' ' + menteeObj.lastName
                          },
                        };

                        return sendgrid.send(confirmationMentor)
                          .then(() => {
                            console.log('Confirmation successfully sent to ' + mentorEmail);

                            return admin.auth().getUser(context.auth.uid)
                              .then(mentee => {
                                var menteeEmail = mentee.email;
                                const confirmationMentee = {
                                  to: menteeEmail,
                                  from: 'no-reply@waopportunityscholarship.org',
                                  templateId: 'd-0bea6166480c4b1a8ebcdabef2f1cbdd',
                                  dynamicTemplateData: {
                                    name: menteeObj.firstName,
                                    mentorName: mentor.firstName
                                  },
                                };

                                return sendgrid.send(confirmationMentee)
                                  .then(() => {
                                    console.log('Confirmation successfully sent to ' + menteeEmail);
                                  })
                                  .catch(error => console.error(error.toString()));
                              });
                          })
                          .catch(error => console.error(error.toString()));
                      });
                  });
              });
          } else {
            throw 'count-invalid';
          }
        } else {
          throw 'not-mentor';
        }
      });
  });
});

exports.updateUser = functions.https.onRequest((request, response) => {

});
