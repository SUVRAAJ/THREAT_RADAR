const NodeCache= require('node-cache')

//caching with one hour TTL
const cache= new NodeCache({stdTTL:3600})

//checks and returns if there is a cache hit, returns null on a cache miss
function getCachedResult(ip){
    const cached= cache.get(ip);
    if(cached)
    {
        console.log(`CACHE HIT FOR ${ip}`)
        return cached
    }
    console.log(`CACHE MISS FOR ${ip}`)
    return null
}

//setting a cache result in case there is a cache miss
function cacheResult(ip,data)
{
    cache.set(ip,data)
}

//returns stats
function getCacheStats()
{
    return cache.getStats()
}

module.exports={getCachedResult,cacheResult,getCacheStats}