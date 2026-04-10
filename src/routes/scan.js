//exporting all necessary modules
const express= require("express")
const router= express.Router()
const {analyzeIP}= require('../services/threatAnalyser')
const { getCacheStats } = require('../services/cache');
const { scanURL } = require('../services/urlscanner')
const {saveScan,getRecentScans,getScansByTarget}= require('../database/scanRepository')

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
  if(!cleanTarget) {
    return res.status(400).json({error:'Please provide a valid Target'})
  }

  const type= detectInputType(cleanTarget)

  try {
    const report= type==='ip'?await analyzeIP(target): await scanURL(target)

    if(!report.fromCache)
    {
      saveScan(cleanTarget,type,report)
      console.log(`Saved scan for ${cleanTarget} to Database`)
    }

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

//route to get history of recent 20 scans
router.get('/history', (req,res) => {
  const scans= getRecentScans()
  res.json(scans)
}
)

//route to get history of a particular target
router.get('/history/:target',(req,res) => {
  const scans= getScansByTarget(req.params.target.trim())
  if(scans.length===0)
  {
    return res.status(404).json({message:'No scans found for this target'})
  }
  res.json(scans)
}
)

//making a route for bulk scan and allowing the summary report

router.post('/bulk', async (req,res) => {
  
  const {targets}= req.body

  //some error handling
  if(!targets || !Array.isArray(targets) || targets.length===0)
  {
    return res.status(400).json({error:"Please provide a array of targets"})
  }

  if(targets.length>10)
  {
    return res.status(400).json({error:"Maximum 10 targets per bulk scan"})
  }

  //cleaning targets before fetching and calling the apis
  const cleanTargets= targets.map(t=> t.trim()).filter(t=>t.length>0)



  const scanPromises= cleanTargets.map(target=>{
    const type= detectInputType(target)
    return type=== 'ip'? analyzeIP(target).then(report=>({target,type,...report}))
    : scanURL(target).then(report=>({target,type,...report}))
  }
  )

  const results= await Promise.allSettled(scanPromises)

  const processed=[]

  //limiting rate of sending api calls
  for(let i=0;i<cleanTargets.length;i++)
  {
    const target= cleanTargets[i]
    const type= detectInputType(target)

    try {
      const report= type=== 'ip'? await analyzeIP(target):
                                  await scanURL(target)
      
      if(!report.fromCache)
      {
        saveScan(target,type,report)
        //only delay it if it was a fresh scan and not cached
        if(i<cleanTargets.length-1)
        {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

       processed.push({ success: true, data: { target, type, ...report } });
    } catch (error) {
      processed.push({
            success: false,
            target,
            error: error.response?.data?.error?.message || error.message
        });
    }
  }

  const summary = {
        total: cleanTargets.length,
        successful: processed.filter(r => r.success).length,
        failed: processed.filter(r => !r.success).length,
        critical: processed.filter(r => r.success && r.data.threatLevel === 'CRITICAL').length,
        dangerous: processed.filter(r => r.success && r.data.threatLevel === 'DANGEROUS').length,
        suspicious: processed.filter(r => r.success && r.data.threatLevel === 'SUSPICIOUS').length,
        safe: processed.filter(r => r.success && r.data.threatLevel === 'SAFE').length,
    };

    res.json({ summary, results: processed });
})



module.exports= router