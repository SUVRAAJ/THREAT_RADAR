const express= require("express")
const router= express.Router()
const {analyzeIP}= require('../services/threatAnalyser')
const { getCacheStats } = require('../services/cache');
const { scanURL } = require('../services/urlscanner')

//route to get cache stats
router.get('/cache/stats', (req, res) => {
    res.json(getCacheStats());
});

//function to check the the type of data
function detectInputType(input) {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(input)) return 'ip';
    return 'url';
}

//combined analysis for ip or url
router.get('/analyze',async (req,res) => {
  const {target}= req.query
  const cleanTarget= target.trim()
  if(!target) {
    return res.status(400).json({error:'Please provide a valid Target'})
  }

  const type= detectInputType(cleanTarget)

  try {
    const report= type==='ip'?await analyzeIP(target): await scanURL(target)
    res.json({type,...report})
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error?.message || error.message;
    res.status(status).json({ error: message });
  }
}
)


//individual url scan route
router.get('/url', async (req,res) => {
  const {target}= req.query
  
  if(!target)
  {
    return res.status(400).json({message:'Please provide a valid url or domain'})
  }

  try {
    const report= await scanURL(target)
    res.json(report)
  } catch (error) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.error?.message || error.message;
      res.status(status).json({ error: message }); 
  }
}
)

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