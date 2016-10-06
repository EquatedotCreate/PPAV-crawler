'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findThreeVideos = undefined;

var _schema = require('./models/schema');

var inArray = function inArray(arr, el) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == el) return true;
  }return false;
};

var getRandomIntNoDuplicates = function getRandomIntNoDuplicates(min, max, DuplicateArr) {
  var RandomInt = Math.floor(Math.random() * (max - min + 1)) + min;
  if (DuplicateArr.length > max - min) return false; // break endless recursion
  if (!inArray(DuplicateArr, RandomInt)) {
    DuplicateArr.push(RandomInt);
    return RandomInt;
  }
  return getRandomIntNoDuplicates(min, max, DuplicateArr);
};

var findVideoById = function findVideoById(id, retrunArr, callback) {
  _schema.VideoCollection.find({ id: id }, function (err, found) {
    var foundObj = found[0];

    if (foundObj != undefined) {
      retrunArr.push(foundObj);
      if (retrunArr.length == 3) callback(retrunArr);
    } else {
      findVideoById(id + 10, retrunArr, callback);
    }
  });
};

var findThreeVideos = exports.findThreeVideos = function findThreeVideos(callback) {
  var duplicates = [],
      retrunArr = [];

  _schema.VideoCollection.count({}, function (error, num) {
    for (var i = 0; i < 3; i++) {
      getRandomIntNoDuplicates(1, num, duplicates);
    }

    for (var _i = 0; _i < 3; _i++) {
      findVideoById(duplicates[_i], retrunArr, function (retrunArr) {
        callback(retrunArr);
      });
    }
  });
};