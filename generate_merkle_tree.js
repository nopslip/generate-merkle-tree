const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const csv = require('csv-parser');
const fs = require('fs');
var utils = require('ethers').utils;

// import distribution from this file 
const filename = 'initial_dist.csv'

// create our token distribution
const user_dist_list = []
const token_dist = []

// open csv 
fs.createReadStream(filename)
  .pipe(csv())
  .on('data', (row) => {
    // import each record line by line
    const user_dist = [row['user_id'], row['total']] // create record to track user_id of leaves 
    user_hash = utils.solidityKeccak256([ 'uint32', 'uint256'], [row['user_id'], row['total']]); // hash up the user_id and amount Solidity style    
    user_dist_list.push(user_dist); // used for tracking user_id of each leaf so we can write to proofs file accordingly 
    token_dist.push(user_hash) // used for crafting the actual tree 
  })
  .on('end', () => {
    // create merkle tree from token distribution 
    const merkle_tree = new MerkleTree(token_dist, keccak256, { hashLeaves: true, sortPairs: true });
    // get root of our tree 
    const root = merkle_tree.getHexRoot();
    // create proof file 
    write_leaves(merkle_tree, user_dist_list, token_dist, root)
  });

  // write leaves & proofs proofs to json file 
  function write_leaves(merkle_tree, user_dist_list, token_dist, root) {
    console.log('Begin writing leaves to file...')
    full_dist = {}
    for (line = 0; line < user_dist_list.length; line++) {
        // generate leaf hash from raw data
        const leaf = keccak256(token_dist[line]);
        // create dist object
        const user_dist = {
            leaf: '0x' + leaf.toString('hex'),
            proof: merkle_tree.getHexProof(leaf)
        }
        // add record to our distribution 
        full_dist[user_dist_list[line][0]] = user_dist;
    } 
    fs.writeFile("./distribution_proofs.json", JSON.stringify(full_dist, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("dist_proofs.json has been written with a root hash of:\n", root);
    });
  }