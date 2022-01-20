const express = require("express");
const app = express();
const { createClient } = require("redis");
const client = createClient();
const { default: axios } = require("axios");

const connectRedis = async() => {
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
}

connectRedis();

app.get("/", (req, res) =>{
    res.send("Testing Route.");
});



app.get("/data",async (req, res) => {
    
    let data = await client.get('data');
    
    if(data?.length > 0){
        return res.json(JSON.parse(data));
    }
    data = await axios.get(`https://api.sampleapis.com/codingresources/codingResources`).then(response => response.data);
   
    const expiryTime = 5; //seconds

    await client.setEx('data', expiryTime, JSON.stringify(data));
    return res.json(data);
    
});

const PORT = 1000;

app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}`))