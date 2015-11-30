#DEEP CLONE
Deep clones arbitary javascript variable, taking care of circular dependencies and object proto chain.
##Usage example
var clone = require("deepclone");
var date = new Date();
var clonedDate = clone(date);
