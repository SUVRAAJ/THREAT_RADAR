const targetInput = document.getElementById('targetInput')
const scanBtn = document.getElementById('scanBtn')
const statusEl = document.getElementById('statusEl')
const resultEl = document.getElementById('resultEl')

const BACKEND = 'http://localhost:8080'

// Color based on threat level
function getThreatColor(level) {
    if (level === 'SAFE') return '#00d084'
    if (level === 'SUSPICIOUS') return '#ffaa00'
    if (level === 'DANGEROUS') return '#ff7700'
    return '#ff3c3c'
}

// Score bar color
function getScoreColor(score) {
    if (score <= 15) return '#00d084'
    if (score <= 40) return '#ffaa00'
    if (score <= 70) return '#ff7700'
    return '#ff3c3c'
}

// Render result
function renderResult(data) {
    const color = getThreatColor(data.threatLevel)
    const vt = data.virustotal || {}
    const abuse = data.abuseipdb || {}

    resultEl.innerHTML = `
        <div class="result">
            <div class="result-header">
                <div class="target">${data.ip || data.url || data.target || ''}</div>
                <div class="badge" style="color:${color};border:1px solid ${color}33;background:${color}15">
                    ${data.threatLevel}
                </div>
            </div>

            <div class="score-row">
                <span class="score-label">Final Score</span>
                <span class="score-val" style="color:${getScoreColor(data.finalScore)}">${data.finalScore} / 100</span>
            </div>
            <div class="bar-wrap">
                <div class="bar-track">
                    <div class="bar-fill" id="finalBar" style="width:0%;background:${getScoreColor(data.finalScore)}"></div>
                </div>
            </div>

            <div class="score-row">
                <span class="score-label">VirusTotal</span>
                <span class="score-val">${vt.threatScore || 0} / 100</span>
            </div>
            <div class="bar-wrap">
                <div class="bar-track">
                    <div class="bar-fill" id="vtBar" style="width:0%;background:${getScoreColor(vt.threatScore || 0)}"></div>
                </div>
            </div>

            <div class="score-row">
                <span class="score-label">AbuseIPDB</span>
                <span class="score-val">${abuse.abuseScore || 0} / 100</span>
            </div>
            <div class="bar-wrap" style="margin-bottom:16px">
                <div class="bar-track">
                    <div class="bar-fill" id="abuseBar" style="width:0%;background:${getScoreColor(abuse.abuseScore || 0)}"></div>
                </div>
            </div>

            ${vt.owner ? `
            <div class="info-row"><span class="info-key">Owner</span><span class="info-val">${vt.owner}</span></div>` : ''}
            ${vt.country ? `
            <div class="info-row"><span class="info-key">Country</span><span class="info-val">${vt.country}</span></div>` : ''}
            ${abuse.totalReports !== undefined ? `
            <div class="info-row"><span class="info-key">Abuse Reports</span><span class="info-val" style="color:${abuse.totalReports > 10 ? '#ff3c3c' : '#888'}">${abuse.totalReports}</span></div>` : ''}
            ${abuse.isTor ? `
            <div class="info-row"><span class="info-key">Tor Node</span><span class="info-val" style="color:#ff3c3c">YES ⚠</span></div>` : ''}

            ${data.scanId ? `
            <button class="open-btn" id="openReportBtn">
                Open Full Report →
            </button>` : ''}
        </div>
    `

    resultEl.style.display = 'block'
    statusEl.style.display = 'none'

    // Animate bars after render
    setTimeout(() => {
        const finalBar = document.getElementById('finalBar')
        const vtBar = document.getElementById('vtBar')
        const abuseBar = document.getElementById('abuseBar')
        if (finalBar) finalBar.style.width = `${data.finalScore}%`
        if (vtBar) vtBar.style.width = `${vt.threatScore || 0}%`
        if (abuseBar) abuseBar.style.width = `${abuse.abuseScore || 0}%`
    }, 100)

    
    const openBtn = document.getElementById('openReportBtn')
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            chrome.tabs.create({ url: `http://localhost:5173/report/${data.scanId}` })
        })
    }
}

// Scan function
async function scan(target) {
    if (!target.trim()) return

    statusEl.style.display = 'block'
    resultEl.style.display = 'none'
    statusEl.textContent = 'Scanning...'
    scanBtn.disabled = true

    try {
        const res = await fetch(`${BACKEND}/scan/analyze?target=${encodeURIComponent(target.trim())}`)
        const data = await res.json()

        if (data.error) throw new Error(data.error)
        renderResult(data)
    } catch (err) {
        statusEl.style.display = 'none'
        resultEl.style.display = 'block'
        resultEl.innerHTML = `<div class="error">⚠ ${err.message}</div>`
    } finally {
        scanBtn.disabled = false
    }
}

// Check for pending target from right-click
chrome.storage.local.get('pendingTarget', (result) => {
    if (result.pendingTarget) {
        targetInput.value = result.pendingTarget
        chrome.storage.local.remove('pendingTarget')
        scan(result.pendingTarget)
    }
})

// Button click
scanBtn.addEventListener('click', () => scan(targetInput.value))

// Enter key
targetInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') scan(targetInput.value)
})