//META{"name":"McStatus"}*//
var lastRefresh = 1
var currentServer = "mc.hypixel.net" //some random ip for testing purposes
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
        console.log("started")

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
        this.saveSetting()
    }

    stop(){
        if(document.getElementsByClassName("minecraftServers").length != 0){
            document.getElementsByClassName("minecraftServers")[0].innerHTML = ' '
            document.getElementsByClassName("minecraftServers")[0].remove()
        }
        console.log("stopped")
    }

    
    changeCheckSetup(){
        let channelList = document.getElementsByClassName("channels-Ie2l6A vertical-V37hAW flex-1O1GKY directionColumn-35P_nr da-channels da-vertical da-flex da-directionColumn")[0]
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              console.log(mutation); // check if your son is the one removed
            });
          });
          
          // configuration of the observer:
          let config = {
            childList: true
          };   
    }

    createMainElement(){
        //parent div
        let mcDiv = document.createElement('div')
        mcDiv.style.fontFamily = 'Century Gothic,monospace'
        mcDiv.style.fontSize = '20px'
        mcDiv.classList.add('minecraftServers')
        mcDiv.style.width = 'inherit'
        mcDiv.style.height = 'auto'
        mcDiv.style.backgroundColor = '#36393E'

        //title
        let pTitle = document.createElement('span')
        pTitle.innerHTML = 'Server Status: '
        pTitle.style.fontSize = '30px'
        pTitle.style.fontWeight = 'bold'
        mcDiv.appendChild(pTitle)

        //refresh button
        let refreshButton = document.createElement('button')
        refreshButton.innerText = "refresh"
        refreshButton.addEventListener('click', this.serverStatusCheck)
        mcDiv.appendChild(refreshButton)

        //add server button
        let addButton = document.createElement('button')
        addButton.innerText = "+"
        addButton.addEventListener('click', this.addServerAlert)
        mcDiv.appendChild(addButton)

        //info box, where server info is shown after fetch
        let infoBox = document.createElement('span')
        infoBox.setAttribute('id', "infoBox")
        infoBox.innerText = ""
        mcDiv.appendChild(infoBox)

        let channelList = document.getElementsByClassName("channels-Ie2l6A vertical-V37hAW flex-1O1GKY directionColumn-35P_nr da-channels da-vertical da-flex da-directionColumn")[0]
        channelList.appendChild(mcDiv)
    }

     
    serverStatusCheck(){
        let d = new Date()
        let cooldown = 3000
        if(d.getTime() > (lastRefresh + cooldown)){ //check if the set cooldown before another refresh is allowed, has passed

            fetch("https://api.mcsrvstat.us/2/" + currentServer)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                try{
                    let online = data.online
                    let status;
                    if(online === true){
                        status = '<div style="color: light-green; font-weight: bold;">online</div>'
                    } else{
                        status = '<div style="color: red; font-weight: bold;">offline</div>'
                    }
                    document.getElementById("infoBox").innerHTML = "Status: " + status +"ip: "+ data.ip + 
                                                                    "\n players: " + data.players.online + "/"+ data.players.max +
                                                                    "\n MOTD: " + data.motd.html
                } catch(e){

                }
            })
            .catch(error => console.error('Error fetching minecraft server info:', error));

            
            lastRefresh = d.getTime()
        } else {
            console.log("not enough time has passed")
        }
    }

    addServerAlert(){
        alert("add a minecraft server", "<div class='bd-modal-inner inner-1JeGVc'><div class='header header-1R_AjF'><div class='title'>Content Errors</div><div class='bd-modal-body'><div class='tab-bar-container'></div></div></div><div class='footer footer-2yfCgX'><button type='button'>Okay</button></div></div>")
    }

    saveSetting(k, d){
        if(k !== null && d !== null){
            BdApi.saveData("McStatus", k, d)
        }
    }
    loadSetting(k){
        let d;
        if(k !== null){
            d = BdApi.loadData("McStatus", k)
            return d
        }else{
            console.log("no key was provided, unable to load setting")
        }
        
    }

}
