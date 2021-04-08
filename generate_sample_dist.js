const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/***
 * This script can be used to generate random data into a CSV 
 * It was created to populate token distribution lists for testing 
 * */ 

// how many lines in the file? How many users in the airdrop? 
const line_count = 10;

// create template for CSV 
const csvWriter = createCsvWriter({
  path: 'sample_dist_list.csv',
  header: [
    {id: 'user_id', title: 'user_id'},
    {id: 'amount', title: 'amount'},
  ]
});

// create full distribution 
const full_dist = []

// populate distribution 
var i;
for (i = 0; i < line_count; i++) {
    const random_claim = Math.floor((Math.random() * 1000) + 1)
    
    // create single record 
    const user_dist = {
        user_id: i,
        amount: random_claim
    }
    // add record to dictionary
    full_dist.push(user_dist);
} 

// write the CSV 
csvWriter
  .writeRecords(full_dist)
  .then(()=> console.log('sample_distribution_list.csv has been written!'));
