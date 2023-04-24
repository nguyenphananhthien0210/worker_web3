
const axios = require('axios')
const { CronJob } = require('cron')
const express = require('express')
const router = express.Router()

let isRunning = false;
router.get('/start', (req, res) => {
    res.send("Worker is running");

    let flag_block = 27420168
    const job = new CronJob('*/2 * * * * *', async function () {

        if (isRunning) {
            //console.log("Worker hasn't finished yet, do nothing!")
            return;
        }

        isRunning = true
        console.log('Worker is running')

        try {
            const blockData = await axios.post("https://bsc-dataseed1.binance.org/", {
                "jsonrpc": "2.0",
                "method": "eth_blockNumber",
                "params": [],
                "id": "1"
            })

            const endBlock = parseInt(blockData.data.result)
            //console.log("Update current block: ", endBlock)

            for (let i = flag_block; i < endBlock; i++) {
                const hexBlock = i.toString(16);
                //console.log("Block is running: ", i)
                const block = await axios.post("https://bsc-dataseed1.binance.org/", {
                    "jsonrpc": "2.0",
                    "method": "eth_getBlockByNumber",
                    "params": [
                        "0x" + hexBlock,
                        true,
                    ],
                    "id": "1"
                })

                flag_block = endBlock;

                //console.log("Current block: ", endBlock)

                for (let j = 0; j < block.data.result.transactions.length; j++) {
                    const tx = block.data.result.transactions[j]
                    //console.log(tx + (j + 1))

                    if (
                        tx.from == "0x20D39a5130F799b95B55a930E5b7eBC589eA9Ed8" ||
                        tx.to == "0x20D39a5130F799b95B55a930E5b7eBC589eA9Ed8"
                    ) {
                        console.log(tx)
                        //console.log("Tranfer from " + tx.from + " to " + tx.to + " with value " + tx.value)
                    }
                }
            }
        } catch (err) {
            console.log(err)
        } finally {
            isRunning = false;
        }
        return;
    })

    job.start()
})

module.exports = router;