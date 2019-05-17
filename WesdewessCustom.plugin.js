//META{"name":"McStatus"}*//
var lastRefresh = 1
var currentServer = "DankPrison.com" //some random ip for testing purposes
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

    
    load(){
        console.log("loaded")
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

        let refreshButton = document.createElement('button')
        refreshButton.innerText = "refresh"
        refreshButton.addEventListener('click', this.serverStatusCheck)
        mcDiv.appendChild(refreshButton)

        let infoBox = document.createElement('span')
        infoBox.setAttribute('id', "infoBox")
        infoBox.innerText = ""
        mcDiv.appendChild(infoBox)

        let channelList = document.getElementsByClassName("channels-Ie2l6A vertical-V37hAW flex-1O1GKY directionColumn-35P_nr da-channels da-vertical da-flex da-directionColumn")[0]
        channelList.appendChild(mcDiv)
    }

     
    serverStatusCheck(){
        let d = new Date()
        let cooldown = 6000
        if(d.getTime() > (lastRefresh + cooldown)){ //check if the set cooldown before another refresh is allowed, has passed

            fetch("https://api.mcsrvstat.us/2/" + currentServer)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                try{
                document.getElementById("infoBox").innerHTML = "ip: "+ data.ip + 
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

}
