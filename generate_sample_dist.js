const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/***
 * This script can be used to generate random data into a CSV 
 * It was created to populate token distribution lists for testing 
 * */ 

// how many lines in the file? How many users in the airdrop? 
const line_count = 50000;

const random_handle = (length = 8) => {
  // Declare all characters
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Pick characers randomly
  let str = '';
  for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;

};

// create template for CSV 
const csvWriter = createCsvWriter({
  path: 'new_sample_dist_list.csv',
  header: [
    {id: 'handle', title: 'handle'},
    {id: 'user_id', title: 'user_id'},
    {id: 'total_claim', title: 'total_claim'},
    {id: 'active_user', title: 'active_user'}, 
    {id: 'kernel', title: 'kernel'}, 
    {id: 'GMV', title: 'GMV'}
  ]
});

// create full distribution 
const full_dist = []

// populate distribution 
var i;
for (i = 0; i < line_count; i++) {
    const claim_ceiling = 1000;
    const random_total_claim = Math.floor((Math.random() * claim_ceiling) + 12) // total claim between 12 and claim_ceiling 
    const random_active_user = Math.floor((Math.random() * (random_total_claim - 2)) + 2) // active user = random between total claim - 2 and 2 
    const random_kernel = Math.floor((Math.random() * (random_total_claim - random_active_user)) + 1) // 
    const random_GMV = random_total_claim - (random_active_user + random_kernel)

    if ((random_GMV + random_active_user + random_kernel) != random_total_claim) {
      console.error('TOTAL MISMATCH!')
    }
    
    const toWei = 1000000000000000000; // lazy move to wei

    // create single record 
    const user_dist = {
        handle: random_handle(8),
        user_id: i,
        total_claim: random_total_claim * toWei,
        active_user: random_active_user * toWei, 
        kernel: random_kernel * toWei, 
        GMV: random_GMV * toWei
    }
    // add record to dictionary
    full_dist.push(user_dist);
} 

// write the CSV 
csvWriter
  .writeRecords(full_dist)
  .then(()=> console.log('sample_distribution_list.csv has been written!'));


