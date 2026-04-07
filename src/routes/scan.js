const express= require("express")
const router= express.Router()
const {analyzeIP}= require('../services/threatAnalyser')
const { getCacheStats } = require('../services/cache');

//route to get cache stats
router.get('/cache/stats', (req, res) => {
    res.json(getCacheStats());
});

//passing an ip address to scan it using the two APIS
router.get('/ip/:address', async (req,res) => {
  //acquiring the ip from url
  const ip= req.params.address
  
  //to check for valid ips
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
        return res.status(400).json({ 
            error: 'Invalid IP address format' 
        });
    }
  
  try {
    const report= await analyzeIP(ip)
    res.json(report)
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error?.message || error.message;
    res.status(status).json({ error: message });
  }
}
)

module.exports= router