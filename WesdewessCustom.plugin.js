//META{"name":"McStatus"}*//

class McStatus {

    getName() {
        return "Better Discord Minecraft server status checker"
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
        this.loadSetting()
        console.log(this.currentServer)

        if(BdApi.loadData("McStatus", "test") === undefined){ //if the setting does not yet exist, create the setting
            this.saveSetting("test", "mc.hypixel.net")
        }
        
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
        console.log("started")
    }

    stop(){
        if(document.getElementsByClassName("minecraftServers").length != 0){
            document.getElementsByClassName("minecraftServers")[0].innerHTML = ' '
            document.getElementsByClassName("minecraftServers")[0].remove()
        }
        clearInterval(this.refreshInterval)
        console.log("stopped")
    }

    onSwitch(){
        console.log("switched")
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
        let addButton = document.createElement('button')
        addButton.classList.add('add-button')
        addButton.style.cssFloat = 'right'
        addButton.innerText = "details"
        addButton.style.marginRight = '10px'
        addButton.style.color = '#fff'
        addButton.style.backgroundColor = '#7289da'
        addButton.style.fontSize = '17px'
        addButton.style.borderRadius = '3px'
        addButton.addEventListener('click', ()=> this.details())
        mcDiv.appendChild(addButton)

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
            //console.log(this.loadSetting())
            this.loadSetting()
            fetch("https://api.mcsrvstat.us/2/" + BdApi.loadData("McStatus", "test"))
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
                        document.getElementById("infoBox").innerHTML = `<div>IP: ${data.ip} Status: ${status} <span title="${playersOnline}" >Players: ${data.players.online}/${data.players.max}</span> MOTD: ${data.motd.html} </div>`
                        
                        this.lastKnowState.ip = data.ip
                        this.lastKnowState.maxPlayers = data.players.max
                        this.lastKnowState.onlinePlayers = data.players.online
                        this.lastKnowState.motd = data.motd.clean
                        this.lastKnowState.version = data.version
                        this.lastKnowState.port = data.port
                        this.lastKnowState.status = "online"
                        this.lastKnowState.time = d.getDate() + "/"+ (d.getMonth()+1)+"/"+d.getFullYear() + " " + d.getHours() + ":" +d.getMinutes() + ":" + d.getSeconds()
                    } else{
                        status = '<span style="color: red; font-weight: bold;">offline</span>'
                        document.getElementById("infoBox").innerHTML = "<div>IP: "+ this.currentServer +" Status: " + status +" Last seen online at: "+ this.lastKnowState.time + "</div>"
                        
                    }
                     
                } catch(e){

                }
                console.log(data)
 
            })
            .catch(error => console.error('Error fetching minecraft server info:', error));

            
            this.lastRefresh = d.getTime()
        } else {
            console.log("not enough time has passed")
        }
        
    }

    lastKnowStateAlert(){
       BdApi.alert("Last known state", "<div class='bd-modal-inner inner-1JeGVc'><div class='header header-1R_AjF'><div class='title'>Content Errors</div><div class='bd-modal-body'><div class='tab-bar-container'></div></div></div><div class='footer footer-2yfCgX'><button type='button'>Okay</button></div></div>")
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
        //BdApi.alert(`Details for: `, `Minecraft version:  \n Returned ip:  \n Port:  \n Max players:  \n Online players:  \n Message of the day: \n `)
     }

    //interactions with the config file
    saveSetting(k, d){
        BdApi.saveData("McStatus", k, d)
    }

    loadSetting(){
        let d;
        d = BdApi.loadData("McStatus", "test")
        this.currentServer = d
    }

    deleteSetting(k){
        BdApi.deleteData("McStatus",k)
    }

}

