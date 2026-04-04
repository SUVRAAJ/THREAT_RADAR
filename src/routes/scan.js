const express= require("express")
const router= express.Router()
const {scanIP} = require("../services/virustotal")
const {checkIP}= require("../services/abuseipdb")

//passing an ip address to scan it using the two APIS
router.get('/ip/:address', async (req,res) => {
  try {
    const vtData= await scanIP(req.params.address)
    const abuseData= await checkIP(req.params.address)
    res.json({
      virusTotal: vtData,
      abuseipdb: abuseData
    })
  } catch (error) {
    console.log('Full error:', error.response?.data || error.message);
    res.status(500).json({error: error.message})
  }
}
)

module.exports= router