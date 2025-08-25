import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import type BlockInfo from '../lib/blockInfo.js';
import Block from '../lib/block.js';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;
const minerWalltet = {
    privateKey: "123",
    publicKey: `${process.env.MINER_WALLET}`
}

console.log("Logged as: ", process.env.MINER_WALLET);

let totalMined = 0;

async function mine(){
    console.log("Getting next block info...");
    const {data} = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`);
    if(!data) {
        console.log("No tx found. Waiting....");
        return setTimeout(()=>{
            mine();
        }, 5000)
    }
    const blockinfo = data as BlockInfo;
    
    const newBLock = Block.fromBlockInfo(blockinfo)

    //TODO: adicionar tx de recompensa

    console.log("Start mining block "+ blockinfo.index);
    newBLock.mine(blockinfo.difficulty, minerWalltet.publicKey);

    console.log("Block mined! Sending to blockchain...");

    try {
        await axios.post(`${BLOCKCHAIN_SERVER}blocks/`, newBLock)
        console.log("Block sent accepted!");
        totalMined++;
        console.log("Total mined: "+ totalMined);
    }catch (err: any){
        console.error(err.response ? err.response.data : err.message);
    }

    setTimeout(()=>{
        mine();
    }, 1000)
}


mine();