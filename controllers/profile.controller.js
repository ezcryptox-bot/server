const User = require("../model/profile")
const axios = require("axios")
const uniqueId = (length=15)=>{
    return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
}


const convertETHtoUSD = async()=> {
    let price = 0
    await axios.get(`https://api.poloniex.com/markets/ETH_USDT/price`)
    .then((res)=>{
        price = res.data?.price
    })
    .catch((err)=>{
        price = 0
    })
    return price
}

class Profile{
    constructor(){
        this.user = 0
        this.balance = 0
        this.profit = 0
        this.isRunning = false
        this.nextWithdraw = 0
        this.walletAddress = ""
        this.is_2fa = false
        this.activities = []
        this.settings = {
            privateKey : "",
            network: ""
        }
        this.balanceInUSD = 0
    }
    async getProfie(req, res){
        try{
            const {detail} = req.body
            const getEtHPrice = await convertETHtoUSD()
            const _user = await User.findOne({email:detail.user?.email})
            if(!_user){
                let data = {
                    email: detail.user?.email,
                    userId: uniqueId(),
                    user: detail.user,
                    walletAddress: "",
                }

               const _userEl = await User.create(data)
                const balanceInUSD = _userEl?.balance * getEtHPrice
               return res.status(200).json({user:_userEl, balanceInUSD})
            }else{
                let sjh = 290 / getEtHPrice
                const balanceInUSD = _user?.balance * getEtHPrice
                return  res.status(200).json({user:_user, balanceInUSD})
            }
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
    async activateMevbot(req, res){
        
    }
}

module.exports = Profile