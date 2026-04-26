//Creating context menu when it is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id:"scanWithThreatRadar",
    title:"scan With ThreatRadar",
    context:['link','page','selection']
  })
})

//handle context menu click
chrome.contextMenus.onClicked.addListener((info,tab) => {
  let target = ''

    if (info.menuItemId === 'scanWithThreatRadar') {
        // Priority: selected text → link URL → page URL
        if (info.selectionText) {
            target = info.selectionText.trim()
        } else if (info.linkUrl) {
            target = info.linkUrl
        } else {
            target = info.pageUrl
        }

        // Store the target and open popup
        chrome.storage.local.set({ pendingTarget: target }, () => {
            chrome.windows.create({
                url: chrome.runtime.getURL('popup.html'),
                type: 'popup',
                width: 480,
                height: 600
            })
        })
    }
}
)