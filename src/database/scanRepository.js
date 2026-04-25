const db= require('./db')

//writing a query for saving an entry into the database
function saveScan(target,type,report)
{
    const stmt= db.prepare(`INSERT INTO scans(target,type,finalScore,threatLevel,fullReport,scannedAt) VALUES (?,?,?,?,?,?)`)

   const result= stmt.run(
        target,
        type,
        report.finalScore,
        report.threatLevel,
        JSON.stringify(report),
        report.scannedAt
    )

    return result.lastInsertRowid;
}

//writing a query for getting N amount of last scanshere by default it is 20
function getRecentScans(limit=20)
{
    const stmt= db.prepare(`SELECT id,target,type,finalScore,threatLevel,scannedAt FROM scans ORDER BY scannedAt DESC LIMIT ?`)
    return stmt.all(limit)
}

//writing a query for getting scans by hitting a particular target
function getScansByTarget(target)
{
    const stmt= db.prepare(`SELECT id,target,type,finalScore,threatLevel,scannedAt FROM scans WHERE target=? ORDER BY scannedAt DESC`)
    return stmt.all(target).map(row=>({
        ...row,
        fullReport: row.fullReport?JSON.parse(row.fullReport):null
    }))
}

function getReportById(id)
{
    const stmt= db.prepare(`SELECT * FROM scans WHERE id=?`)
    const row= stmt.get(id);

    if(!row) return null
    return {
        ...row,
        fullReport: row.fullReport ? JSON.parse(row.fullReport) : null
    };
}

//function to get stats for the recharts
function getScanStats()
{
    const dailyScans= db.prepare(`SELECT DATE(scannedAt) as date,COUNT(*) as total, AVG(finalScore) as avgScore FROM scans WHERE scannedAt >= DATE('now', '-7 days')
        GROUP BY DATE(scannedAt) ORDER BY date ASC`).all()
    
    const threatDistribution= db.prepare(`SELECT threatLevel, COUNT(*) as count FROM scans GROUP BY threatLevel`).all()

    const overall=db.prepare(`
        SELECT 
            COUNT(*) as totalScans,
            AVG(finalScore) as avgScore,
            MAX(finalScore) as highestThreat,
            SUM(CASE WHEN threatLevel = 'CRITICAL' THEN 1 ELSE 0 END) as critical,
            SUM(CASE WHEN threatLevel = 'DANGEROUS' THEN 1 ELSE 0 END) as dangerous,
            SUM(CASE WHEN threatLevel = 'SUSPICIOUS' THEN 1 ELSE 0 END) as suspicious,
            SUM(CASE WHEN threatLevel = 'SAFE' THEN 1 ELSE 0 END) as safe
        FROM scans
    `).get()

    return{dailyScans,threatDistribution,overall}
}


module.exports={saveScan,getRecentScans,getScansByTarget,getReportById,getScanStats}