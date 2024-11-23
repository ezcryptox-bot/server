const User = require("../model/profile")
const jwt = require("jsonwebtoken");
const axios = require("axios")

const createToken = ((_id)=>{
    return  jwt.sign({_id}, `InenwiNIWb39Nneol?s.mee39ns233hoosne(3n)`, { expiresIn: '4d' })
})

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
            const userId = req.id
            const getEtHPrice = await convertETHtoUSD()
            const _user = await User.findOne({userId})
            const balanceInUSD = _user?.balance * getEtHPrice
            return  res.status(200).json({user:_user, balanceInUSD})
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
    async authUser(req, res){
        try{
            const _user = req.body
            const _exist = await User.findOne({userId: _user?.uid})
            if(!_exist){
                let data = {
                    userId: _user?.uid,
                    user: _user,
                    walletAddress: "",
                }
             await User.create(data) 
            }
            console.log(_user?.uid)
            const token = createToken(_user?.uid)
            return  res.status(200).json({token})
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