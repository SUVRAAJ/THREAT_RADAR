const axios = require("axios");
console.log('API Key loaded:', process.env.VIRUSTOTAL_API_KEY ? 'YES' : 'NO');

const VIRUS_TOTAL_BASE_URL= 'https://www.virustotal.com/api/v3'; //making base URL for axios

function calculateThreatScore(stats)
{
    //assigning weight to each category according to their importance in security
    const weights={
        malicious: 10,
        suspicious: 5,
        undetected: 0.5,
        harmless: 0,
        timeout: 0.5
    }

    //calculating raw score here with assigned weights and the report generated
    const rawScore=(stats.malicious * weights.malicious) +
    (stats.suspicious * weights.suspicious) +
    (stats.undetected * weights.undetected) +
    (stats.timeout * weights.timeout)

    const total_engines= stats.malicious+stats.suspicious+stats.undetected+stats.harmless+stats.timeout

    //normalising the score

    const normalized=(rawScore/(total_engines*10))*100

    return Math.min(100,Math.round(normalized)) //no value goes above 100
    
} 

async function scanIP(ip) {
    const response= await axios.get(`${VIRUS_TOTAL_BASE_URL}/ip_addresses/${ip}`,{
        headers:{
            'x-apikey': process.env.VIRUSTOTAL_API_KEY
        }
    });

    //calling api and checkigng the API to see the result
    const raw_data=response.data.data.attributes



    const result={ip, network: raw_data.network,
    country: raw_data.country,
    owner: raw_data.as_owner,
    reputation: raw_data.reputation,
    stats: raw_data.last_analysis_stats,
    threatScore: calculateThreatScore(raw_data.last_analysis_stats),
    engines: raw_data.last_analysis_results
    
}

    return result
}

module.exports={scanIP} //exporting this function