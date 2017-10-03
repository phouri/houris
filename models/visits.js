'use strict';
module.exports = (sequelize, DataTypes) => {
  var visits = sequelize.define('visits', {
    userIp: DataTypes.STRING,
    timestamp: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    timestamps: false
  });
  return visits;
};