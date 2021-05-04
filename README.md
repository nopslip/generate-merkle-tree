# Generate Merkle Tree from CSV & write proofs to JSON file
This script can be used to iterate though lines of a CSV file (like a token distribution list) and generate a merkle tree from the lines in the file.  

#### Setup   
Install packages 
`npm install`

#### 1) run generate_sample_dist.js & write random data to csv (optional)

1) Set the number of nodes you want in your distribution by adjusting the `line_count` in generate_sample_dist.js:  

`const line_count = 4200;`

2) Run the script:

`node generate_sample_dist.js`

Sample distribution is output to `sample_distribution_list.csv` by default. For example:

```
user_id,amount
0,516
1,664
2,967
3,578
4,815
5,687
6,292
7,317
8,310
9,753
```

#### 2) Generate Merkle Tree from csv & write to JSON

1) set filename - `generate_merkle_tree.js` file look for a csv to import. You can adjust the filename in the script:

```javascript 
// import distribution from this file 
const filename = 'sample_dist_list.csv'
```

like `sample_distribution_list.csv`. Make sure your csv is present and the format matches. Default looks like this:

```javascript
const user_dist = ['user_id', 'amount']
```
2) run the script: 

`node generate_merkle_tree.js`

File will contain a record for each `user_id` that contains the `leaf` node hash and `proof`: 

```
    "0": {
        "claim": "0x07877750657db99eba06a78b082e62610583b72996d6dcd31a7682975a28d942",
        "proof": [
            "0xb1724f0a9bad645b7835ce248c6344cc816a080833b6e04591aa43af7af4528d",
            "0xbe63a8e782530e2fdf6f45828c0339efcac899ecf0dc26ee22b098f73878ea62",
            "0xe90380a15bd7841314106ae76a9a44ff617365c856280e628762fd0f1c00febd",
            "0xa2efbafd018990f1d3f1135840f07b1015b9c407619464e599b6567c064d3d90"
        ]
    },
```

The `claim` field is keccak256 hash:

`const leaf = keccak256(['user_id', 'amount']);`

The script will output to the terminal:

```
dist_proofs.json has been written with a root hash of:
```  
`
0xb44199a04d1742dd4223505f6edbaba0fcb037c9262866fb51dac38086d8a63e
`
 
