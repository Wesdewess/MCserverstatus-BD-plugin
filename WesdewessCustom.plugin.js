//META{"name":"McStatus", "website":"https://github.com/Wesdewess/MCserverstatus-BD-plugin", "source":"https://raw.githubusercontent.com/Wesdewess/MCserverstatus-BD-plugin/master/WesdewessCustom.plugin.js"}*//

class McStatus {

    getName() {
        return "Minecraft server status checker"
    }

    getDescription() {
        return "Show status information of you favorite minecraft servers"
    }

    getVersion() {
        return "V1.0"
    }

    getAuthor() {
        return "wesdewess"
    }

    start(){
        //variables
        this.lastKnowState = {"ip":"","version":"","port":"","status":"","motd":"","maxPlayers":"","onlinePlayers":"","names":[],"time":"unknown"}
        this.cooldown = 3000
        this.lastRefresh = 1
        this.currentServer

        if(BdApi.loadData("McStatus", "ip") === undefined){ 
            BdApi.saveData("McStatus", "ip", "mc.hypixel.net")
            BdApi.saveData("McStatus","lastOnline", "")
            BdApi.alert("Minecraft server status checker","Thank you for using this plugin! To keep tabs on your favorite minecraft server, go to the 'plugins' tab in your discord settings and click on 'settings' for this plugin. For more information go to: https://github.com/Wesdewess/MCserverstatus-BD-plugin")
        }
        this.lastKnowState.time = BdApi.loadData("McStatus","lastOnline")
        this.loadSetting()
        
        if(document.getElementsByClassName("minecraftServers")[0] == null){
            this.createMainElement()
        } else{
            try{
            document.getElementsByClassName("minecraftServers")[0].remove()
            } catch(e){
                console.log("no element to remove")
            }
            this.createMainElement()
        }
        this.serverStatusCheck()
        this.refreshInterval = setInterval(()=> {this.serverStatusCheck()},30000) 
    }
    getSettingsPanel(){
        let text = document.createElement('span')
        text.innerText = 'Change the server ip: '
        let textbox = document.createElement('input')
        textbox.type = 'textbox'
        textbox.value = this.currentServer
        textbox.id = "serverIpSettingBox"
        let settingsElement = document.createElement('div')
        settingsElement.id = 'settingsElement'
        let save = document.createElement('input')
        save.type = 'button'
        save.value = 'save'
        save.style.color = '#fff'
        save.style.backgroundColor = '#7289da'
        save.style.borderRadius = '3px'
        save.style.fontWeight = 'bold'
        save.addEventListener('click', () => {let ip = document.getElementById('serverIpSettingBox').value
        this.currentServer = ip
        BdApi.saveData("McStatus","ip", ip)
        BdApi.saveData("McStatus","lastOnline", "")
        this.lastKnowState.time = ""
        BdApi.showToast(`Ip changed to: ${this.currentServer}`, {})
        this.serverStatusCheck()})
        settingsElement.appendChild(text)
        settingsElement.appendChild(textbox)
        settingsElement.appendChild(save)
        
        let settingspanel = settingsElement
		return settingspanel;
    }

    stop(){
        if(document.getElementsByClassName("minecraftServers").length != 0){
            document.getElementsByClassName("minecraftServers")[0].innerHTML = ' '
            document.getElementsByClassName("minecraftServers")[0].remove()
        }
        clearInterval(this.refreshInterval)
        console.log("stopped")
    }

    createMainElement(){
        //parent div
        let mcDiv = document.createElement('div')
        mcDiv.classList.add('minecraftServers')
        mcDiv.style.fontFamily = 'Century Gothic,monospace'
        mcDiv.style.fontSize = '20px'
        mcDiv.style.color = '#839496'
        mcDiv.style.backgroundColor = '#36393f'
        mcDiv.style.marginLeft = '312px'
        mcDiv.style.paddingTop = '2px'
        mcDiv.style.borderRadius = '30px 0 0 0'
        mcDiv.style.height = 'auto'

        //more info button
        let details = document.createElement('button')
        details.classList.add('add-button')
        details.style.cssFloat = 'right'
        details.innerText = "details"
        details.style.marginRight = '10px'
        details.style.color = '#fff'
        details.style.backgroundColor = '#7289da'
        details.style.fontSize = '17px'
        details.style.borderRadius = '3px'
        details.addEventListener('click', ()=> this.details())
        mcDiv.appendChild(details)

        //refresh button
        let refreshButton = document.createElement('button')
        refreshButton.setAttribute('id', "refresh")
        refreshButton.innerText = "↻"
        refreshButton.style.fontSize = '17px'
        refreshButton.style.cssFloat = 'right'
        refreshButton.style.color = '#fff'
        refreshButton.style.backgroundColor = '#7289da'
        refreshButton.style.borderRadius = '3px'
        refreshButton.style.minHeight = '20px'
        refreshButton.style.marginLeft = '10px'
        refreshButton.style.marginRight = '5px'
        refreshButton.addEventListener('click', () => this.serverStatusCheck())
        mcDiv.appendChild(refreshButton)

        //info box, where server info is shown after fetch
        let infoBox = document.createElement('span')
        infoBox.setAttribute('id', "infoBox")
        infoBox.style.cssFloat = 'right'
        infoBox.style.marginLeft = '20px'
        infoBox.style.marginRight = '10px'
        infoBox.innerText = ""
        mcDiv.appendChild(infoBox)

        let mainWindow = document.getElementsByClassName("appMount-3lHmkl bda-dark da-appMount")[0]
        mainWindow.appendChild(mcDiv)
        mainWindow.insertBefore(mcDiv, mainWindow.childNodes[3]);

        
    }

     
    serverStatusCheck(e){
        let d = new Date()
        if(d.getTime() > (this.lastRefresh + this.cooldown)){ //check if the set cooldown before another refresh is allowed, has passed
            this.loadSetting()
            fetch("https://api.mcsrvstat.us/2/" + this.currentServer)
            .then(response => response.json())
            .then(data => {
                try{
                    let online = data.online
                    let status;
                    if(online == true){
                        let playersOnline = "Online players:"
                        if(data.players.list){
                            this.lastKnowState.names = []
                            for(let i=0; i<data.players.list.length; i++){
                                playersOnline = playersOnline+ "\n" + data.players.list[i]
                                this.lastKnowState.names[i] = data.players.list[i]
                            }
                        } else{
                            playersOnline = playersOnline+ "\n" + "-"
                            this.lastKnowState.names[0] = "-"
                        }
                        status = '<span style="color: green; font-weight: bold;">online</span>'
                        document.getElementById("infoBox").innerHTML = `<div><span style="font-weight: bold">${this.currentServer}:</span> Status: ${status} <span title="${playersOnline}" >Players: ${data.players.online}/${data.players.max}</span> MOTD: ${data.motd.html} </div>`
                        
                        this.lastKnowState.ip = data.ip
                        this.lastKnowState.maxPlayers = data.players.max
                        this.lastKnowState.onlinePlayers = data.players.online
                        this.lastKnowState.motd = data.motd.clean
                        this.lastKnowState.version = data.version
                        this.lastKnowState.port = data.port
                        this.lastKnowState.status = "online"
                        this.lastKnowState.time = d.getDate() + "/"+ (d.getMonth()+1)+"/"+d.getFullYear() + " " + d.getHours() + ":" +d.getMinutes() + ":" + d.getSeconds()
                        BdApi.saveData("McStatus","lastOnline", this.lastKnowState.time)
                    } else{
                        status = '<span style="color: red; font-weight: bold;">offline</span>'
                        document.getElementById("infoBox").innerHTML = "<div><span style='font-weight: bold'>"+ this.currentServer +":</span> Status: " + status +" Last seen online at: "+ this.lastKnowState.time + "</div>"
                        
                    }
                } catch(e){

                }
            })
            .catch(error => console.error('Error fetching minecraft server info:', error));
            this.lastRefresh = d.getTime()
        } else {
            console.log("not enough time has passed")
        } 
    }

    details(){
        let playerNames = "Online players:"
        for(let i=0; i<this.lastKnowState.names.length; i++){
            playerNames = playerNames + "\n" + this.lastKnowState.names[i]
        }
        BdApi.alert(`${this.currentServer}`, 
        [
            BdApi.React.createElement("div", {target: "blank"}, `Last seen online: ${this.lastKnowState.time}`),
            BdApi.React.createElement("div", {target: "blank"}, `Minecraft version: ${this.lastKnowState.version}`), 
            BdApi.React.createElement("div", {target: "blank"}, `Ip: ${this.lastKnowState.ip}`), 
            BdApi.React.createElement("div", {target: "blank"}, `Port: ${this.lastKnowState.port}`), 
            BdApi.React.createElement("div", {target: "blank"}, `Max players: ${this.lastKnowState.maxPlayers}`), 
            BdApi.React.createElement("div", {title: playerNames, target: "_blank"},` Online players: ${this.lastKnowState.onlinePlayers} `), 
            BdApi.React.createElement("div", {target: "blank"}, `Message of the day:`),
            BdApi.React.createElement("div", {target: "blank"}, `${this.lastKnowState.motd}`)
        ])
     }

    loadSetting(){
        let d;
        d = BdApi.loadData("McStatus", "ip")
        this.currentServer = d
    }
}

