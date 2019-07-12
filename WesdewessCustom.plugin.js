//META{"name":"McStatus"}*//

class McStatus {

    getName() {
        return "Better Discord Minecraft server status checker"
    }

    getDescription() {
        return "Show minecraft server information per discord server."
    }

    getVersion() {
        return "V1.0"
    }

    getAuthor() {
        return "wesdewess"
    }
    
    start(){
        //variables
        
        this.cooldown = 3000
        this.lastRefresh = 1
        this.currentServer = this.loadSetting()
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
        console.log("started")
    }

    stop(){
        if(document.getElementsByClassName("minecraftServers").length != 0){
            document.getElementsByClassName("minecraftServers")[0].innerHTML = ' '
            document.getElementsByClassName("minecraftServers")[0].remove()
        }
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

        //refresh button
        let refreshButton = document.createElement('button')
        refreshButton.setAttribute('id', "refresh")
        refreshButton.innerText = "Refresh"
        refreshButton.style.cssFloat = 'right'
        refreshButton.style.color = '#fff'
        refreshButton.style.backgroundColor = '#7289da'
        refreshButton.style.borderRadius = '3px'
        refreshButton.style.minHeight = '20px'
        refreshButton.style.marginLeft = '10px'
        refreshButton.style.marginRight = '10px'
        refreshButton.addEventListener('click', () => this.serverStatusCheck())
        mcDiv.appendChild(refreshButton)

        //add server button
        let addButton = document.createElement('button')
        addButton.classList.add('add-button')
        addButton.style.cssFloat = 'right'
        addButton.innerText = "+"
        //addButton.addEventListener('click', this.addServerAlert)
        mcDiv.appendChild(addButton)

        //info box, where server info is shown after fetch
        let infoBox = document.createElement('span')
        infoBox.setAttribute('id', "infoBox")
        infoBox.style.cssFloat = 'right'
        infoBox.style.marginLeft = '20px'
        infoBox.style.marginRight = '20px'
        infoBox.innerText = ""
        mcDiv.appendChild(infoBox)

        let channelList = document.getElementsByClassName("appMount-3lHmkl bda-dark da-appMount")[0]
        channelList.appendChild(mcDiv)
        channelList.insertBefore(mcDiv, channelList.childNodes[3]);

        //BdApi.onRemoved(document.getElementsByClassName("minecraftServers")[0], this.createMainElement)
    }

     
    serverStatusCheck(e){
        let d = new Date()
        if(d.getTime() > (this.lastRefresh + this.cooldown)){ //check if the set cooldown before another refresh is allowed, has passed
            console.log(this.loadSetting())
            fetch("https://api.mcsrvstat.us/2/" + this.loadSetting())
            .then(response => response.json())
            .then(data => {
                console.log(data)
                try{
                    let online = data.online
                    let status;
                    if(online === true){
                        status = '<span style="color: green; font-weight: bold;">online</span>'
                    } else{
                        status = '<span style="color: red; font-weight: bold;">offline</span>'
                    }
                    document.getElementById("infoBox").innerHTML = "Status: " + status +"IP: "+ data.ip + " Players: " + data.players.online + "/"+ data.players.max + " MOTD: " + data.motd.html
                } catch(e){

                }
            })
            .catch(error => console.error('Error fetching minecraft server info:', error));

            
            this.lastRefresh = d.getTime()
        } else {
            console.log("not enough time has passed")
        }
        
    }

    addServerAlert(){
        alert("add a minecraft server", "<div class='bd-modal-inner inner-1JeGVc'><div class='header header-1R_AjF'><div class='title'>Content Errors</div><div class='bd-modal-body'><div class='tab-bar-container'></div></div></div><div class='footer footer-2yfCgX'><button type='button'>Okay</button></div></div>")
    }

    //interactions with the config file
    saveSetting(k, d){
        BdApi.saveData("McStatus", k, d)
    }
    loadSetting(){
        let d;
        d =  BdApi.loadData("McStatus", "test")
        return d
        
    }
    deleteSetting(k){
        BdApi.deleteData("McStatus",k)
    }

}

