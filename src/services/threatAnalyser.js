const { scanIP }= require('./virustotal')
const {checkIP}= require('./abuseipdb')

//combining scores by giving weight to each kind
function combineScore(vtScore, abuseScore)
{
    return Math.round((vtScore*0.7)+(abuseScore*0.3))
}

//returning security on basis of score range
function getThreatLevel(finalScore)
{
    if(finalScore<= 15) return 'SAFE'
    if(finalScore<= 40) return 'SUSPICIOUS'
    if(finalScore<= 70) return 'DANGEROUS'
    return 'CRITICAL'
}

async function analyzeIP(ip) {
    const [vtData, abuseData] = await Promise.all([
        scanIP(ip),
        checkIP(ip)
    ])

    const finalScore= combineScore(vtData.threatScore, abuseData.abuseScore)
    return{
        ip,
        finalScore,
        threatLevel:getThreatLevel(finalScore),
        virustotal: vtData,
        abuseipdb: abuseData,
        scannedAt: new Date().toISOString()
    }
}

module.exports = {analyzeIP}