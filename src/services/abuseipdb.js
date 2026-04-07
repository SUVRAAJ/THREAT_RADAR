const axios= require("axios")

const ABUSEIPDB_BASE_URL= 'https://api.abuseipdb.com/api/v2'

async function checkIP(ip) {
    const response= await axios.get(`${ABUSEIPDB_BASE_URL}/check`,{
        headers:{
            'Key':process.env.ABUSEIPDB_API_KEY,
            'Accept':'application/json' //the data format of acceptance
        },
        params: {
            ipAddress: ip,
            maxAgeInDays: 90
        }
    }     
    )

    const raw_data= response.data.data

    //filtering out the necessary data
    const result= {
        ip,
        abuseScore: raw_data.abuseConfidenceScore,
        totalReports: raw_data.totalReports,
        lastReported: raw_data.lastReportedAt,
        isTor: raw_data.isTor,
        usageType: raw_data.usageType,
        domain: raw_data.domain
    }

    return result
}

module.exports={checkIP}