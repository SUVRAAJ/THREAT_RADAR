const axios= require('axios')
const {getCachedResult,cacheResult} = require('./cache')
const VIRUSTOTAL_BASE_URL = 'https://www.virustotal.com/api/v3';

//function to scan url
async function scanURL(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    //check cache first
    const cached= getCachedResult(url)
    if(cached)
    {
        return { ...cached, fromCache: true };
    }

    const submitResponse= axios.post(`${VIRUSTOTAL_BASE_URL}/urls`,
        new URLSearchParams({url}),
        {
            headers:{
                'x-apikey':process.env.VIRUSTOTAL_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )

    //get analysis id from submission
    const analysisID= (await submitResponse).data.data.id

    //wrapping timout in a promise so that it works
    await new Promise(resolve => setTimeout(resolve, 3000));

    //fetch the analysis results
    const response= axios.get(`${VIRUSTOTAL_BASE_URL}/analyses/${analysisID}`,{
        headers:{
            'x-apikey': process.env.VIRUSTOTAL_API_KEY
        }
    })

    const raw_data= (await response).data.data.attributes

    const result={
        url,
        finalScore: calculateURLThreatScore(raw_data.stats),
        threatLevel: getThreatLevel(raw_data.stats),
        stats: raw_data.stats,
        engines: raw_data.stats,
        scannedAt: new Date().toISOString()
    }

    cacheResult(url, result);
    return { ...result, fromCache: false };
}

//function to calculate score with weights assigned
function calculateURLThreatScore(stats) {
    const weights = {
        malicious: 10,
        suspicious: 5,
        undetected: 0.5,
        harmless: 0,
        timeout: 0.5
    };

    const rawScore = (stats.malicious * weights.malicious) +
        (stats.suspicious * weights.suspicious) +
        (stats.undetected * weights.undetected) +
        (stats.timeout * weights.timeout);

    const total_engines = stats.malicious + stats.suspicious +
        stats.undetected + stats.harmless + stats.timeout;

    if (total_engines==0) return 0;

    const normalized = (rawScore / (total_engines * 10)) * 100;
    return Math.min(100, Math.round(normalized));
}

//returning the status based upon the current score calculated
function getThreatLevel(stats) {
    const score = calculateURLThreatScore(stats);
    if (score <= 15) return 'SAFE';
    if (score <= 40) return 'SUSPICIOUS';
    if (score <= 70) return 'DANGEROUS';
    return 'CRITICAL';
}

module.exports = { scanURL };
