const DataLoader = require('dataloader');
const User = require('../../models/user');

const dateToString = date => new Date(date).toISOString();