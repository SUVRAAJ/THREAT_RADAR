import jsPDF from 'jspdf'

export function generateThreatReport(report)
{
    const doc= new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    //helper functions

    const centerText = (text, y) => {
    doc.text(text, pageWidth / 2, y, { align: 'center' })
    }
    
    const addSection = (title, y) => {
    doc.setFillColor(20, 20, 20)
    doc.rect(14, y - 5, pageWidth - 28, 8, 'F')
    doc.setTextColor(255, 60, 60)
    doc.setFontSize(9)
    doc.setFont('courier', 'bold')
    doc.text(`// ${title.toUpperCase()}`, 16, y)
    return y + 10
  }

  const addRow = (key, value, y, danger = false) => {
    doc.setFontSize(9)
    doc.setFont('courier', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(key, 16, y)
    doc.setTextColor(danger ? 220 : 200, danger ? 60 : 200, danger ? 60 : 200)
    doc.text(String(value ?? 'N/A'), 80, y)
    return y + 7
  }

  // ── Header ──
  doc.setFillColor(10, 10, 10)
  doc.rect(0, 0, pageWidth, 35, 'F')

  doc.setTextColor(255, 60, 60)
  doc.setFontSize(22)
  doc.setFont('courier', 'bold')
  centerText('THREATRADAR', 16)

  doc.setTextColor(80, 80, 80)
  doc.setFontSize(9)
  doc.setFont('courier', 'normal')
  centerText('THREAT INTELLIGENCE REPORT', 24)
  centerText(`Generated: ${new Date().toLocaleString()}`, 30)

  // ── Threat Summary ──
  let y = 50
  y = addSection('Threat Summary', y)

  y = addRow('Target', report.ip || report.url, y)
  y = addRow('Type', report.type?.toUpperCase(), y)
  y = addRow('Final Score', `${report.finalScore} / 100`, y, report.finalScore > 40)
  y = addRow('Threat Level', report.threatLevel, y, report.threatLevel !== 'SAFE')
  y = addRow('Scanned At', new Date(report.scannedAt).toLocaleString(), y)
  y = addRow('Source', report.fromCache ? 'Cache' : 'Live Scan', y)

  // ── VirusTotal ──
  y += 4
  y = addSection('VirusTotal Analysis', y)
  y = addRow('Score', `${report.virustotal?.threatScore} / 100`, y, report.virustotal?.threatScore > 40)
  y = addRow('Owner', report.virustotal?.owner, y)
  y = addRow('Country', report.virustotal?.country, y)
  y = addRow('Network', report.virustotal?.network, y)
  y = addRow('Reputation', report.virustotal?.reputation, y)

  const stats = report.virustotal?.stats
  if (stats) {
    y += 2
    y = addRow('Malicious Engines', stats.malicious, y, stats.malicious > 0)
    y = addRow('Suspicious Engines', stats.suspicious, y, stats.suspicious > 0)
    y = addRow('Clean Engines', stats.harmless, y)
    y = addRow('Undetected', stats.undetected, y)
  }

  // ── AbuseIPDB ──
  y += 4
  y = addSection('AbuseIPDB Analysis', y)
  y = addRow('Abuse Score', `${report.abuseipdb?.abuseScore} / 100`, y, report.abuseipdb?.abuseScore > 20)
  y = addRow('Total Reports', report.abuseipdb?.totalReports, y, report.abuseipdb?.totalReports > 10)
  y = addRow('Tor Node', report.abuseipdb?.isTor ? 'YES - HIGH RISK' : 'No', y, report.abuseipdb?.isTor)
  y = addRow('Usage Type', report.abuseipdb?.usageType, y)
  y = addRow('Domain', report.abuseipdb?.domain, y)
  y = addRow('Last Reported', report.abuseipdb?.lastReported
    ? new Date(report.abuseipdb.lastReported).toLocaleDateString()
    : 'Never', y)

  // ── Engine Breakdown ──
  if (report.virustotal?.engines) {
    y += 4
    y = addSection('Engine Breakdown — Malicious & Suspicious Only', y)

    const engines = Object.entries(report.virustotal.engines)
      .filter(([, data]) => data.category === 'malicious' || data.category === 'suspicious')

    if (engines.length === 0) {
      doc.setFontSize(9)
      doc.setFont('courier', 'normal')
      doc.setTextColor(60, 180, 100)
      doc.text('No malicious or suspicious detections.', 16, y)
      y += 7
    } else {
      engines.forEach(([name, data]) => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        y = addRow(name, `${data.category.toUpperCase()} — ${data.result}`, y, true)
      })
    }
  }

  // ── Footer ──
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(40, 40, 40)
    doc.setFont('courier', 'normal')
    doc.text(`ThreatRadar — Confidential Threat Report — Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' })
  }

  // ── Save ──
  const filename = `threatradar-${(report.ip || report.url || 'report').replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.pdf`
  doc.save(filename)
}
