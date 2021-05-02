
const hub = require('@textile/hub');
const fs = require('fs');
require('dotenv').config()



async function pushImages() {
    const buckets = await hub.Buckets.withKeyInfo({
        key: 'bqbeg4w4u6ewltnejxwmvu6ngwu',
        secret: 'bh24lv4dxie5dabwnl75y3onzphkvlqhyf56dlba'
    })
    const { root, threadID } = await buckets.getOrCreate('QuadraticTreasury')
    if (!root) throw new Error('bucket not created')
    // let file = fs.readFileSync('./art.png');
    // let path = `art.png`
    // let links = await buckets.pushPath(root.key, path, file, { root })
    // console.log('art', `https://hub.textile.io${links.path.path}`);

    // let file = fs.readFileSync('./blockchain.png');
    // let path = `blockchain.png`
    // let links = await buckets.pushPath(root.key, path, file, { root })
    // console.log('blockchain', `https://hub.textile.io${links.path.path}`);

    let file = fs.readFileSync('./local.png');
    let path = `local.png`
    let links = await buckets.pushPath(root.key, path, file, { root })
    console.log('local', `https://hub.textile.io${links.path.path}`);
}

pushImages();