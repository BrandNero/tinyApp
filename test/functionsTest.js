const { assert } = require('chai');

const { findUserByEmail } = require('../functions.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID);
  });
  it('should return undefined if email not in database', function() {
    const user = findUserByEmail("michaelMyers@yahoomail.com", testUsers);
    const expectedUserID = undefined;
    assert.isUndefined(user, expectedUserID);
  });
  it('should return undefined if email is empty string', function() {
    const user = findUserByEmail("", testUsers);
    const expectedUserID = undefined;
    assert.isUndefined(user, expectedUserID);
  });
});