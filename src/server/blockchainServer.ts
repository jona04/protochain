import dotenv from 'dotenv';
dotenv.config();

import express, { json, type NextFunction, type Request, type Response } from 'express';
import morgan from 'morgan';
import Blockchain from '../lib/blockchain.js';
import Block from '../lib/block.js';

/* c8 ignore next */
const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`);
/* c8 ignore stop */

const app = express();

/* c8 ignore start */
if(process.argv.includes("--run"))
    app.use(morgan('tiny'));
/* c8 ignore stop */

app.use(express.json());

const blockchain = new Blockchain();

app.get('/status', (req, res, next) => {
    res.json({
        numberOfBlocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    })
})

app.get('/blocks/next', (req: Request, res: Response, next: NextFunction) => {
    res.json(blockchain.getNextBlock());
})

app.get('/blocks/:indexOrHash', (req, res, next) => {
    let block: any;
    if (/^[0-9]+$/.test(req.params.indexOrHash)){
        block = blockchain.blocks[Number(req.params.indexOrHash)]
    } else {
        block =  blockchain.getBlock(req.params.indexOrHash)
    }

    if (!block){
        return res.sendStatus(404);
    } else {
        return res.json(block);
    }
})

app.post('/blocks', (req, res, next) => {
    if(req.body.hash === undefined) return res.sendStatus(422);

    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);

    if(validation.success){
        res.status(201).json(block);
    }else {
        res.status(400).json(validation);
    }
})

/* c8 ignore start */
if(process.argv.includes("--run"))
    app.listen(PORT, ()=> {console.log(`Blockchain is running at port ${PORT}`)})
/* c8 ignore stop */

export {
    app
};