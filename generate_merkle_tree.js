const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const csv = require('csv-parser');
const fs = require('fs');

// import distribution from this file 
const filename = 'sample_dist_list.csv'

// create our token distribution
const token_dist = []

// open csv 
fs.createReadStream(filename)
  .pipe(csv())
  .on('data', (row) => {
    // import each record line by line
    const user_dist = [row['user_id'], row['amount']]
    // add record to our token distribution   
    token_dist.push(user_dist);
  })
  .on('end', () => {
    // create merkle tree from token distribution 
    const merkle_tree = new MerkleTree(token_dist, keccak256, { hashLeaves: true, sortPairs: true });
    // get root of our tree 
    const root = merkle_tree.getHexRoot();
    // create proof file 
    write_leaves(merkle_tree, token_dist, root)
  });

  // write leaves & proofs proofs to json file 
  function write_leaves(merkle_tree, token_dist, root) {
    console.log('Begin writing leaves to file')
    full_dist = {}
    for (user_id = 0; user_id < token_dist.length; user_id++) {
        // generate leaf hash from raw data 
        const leaf = keccak256(token_dist[user_id]);
        // create dist object
        const user_dist = {
            leaf: '0x' + leaf.toString('hex'),
            proof: merkle_tree.getHexProof(leaf)
        }
        // add record to our distribution 
        full_dist[user_id] = user_dist;
    } 
    fs.writeFile("./dist_proofs.json", JSON.stringify(full_dist, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("dist_proofs.json has been written with a root hash of:\n", root);
    });
  }