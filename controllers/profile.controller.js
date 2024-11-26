const User = require("../model/profile")
const jwt = require("jsonwebtoken");
const axios = require("axios")
const Trx = require("../model/transaction")
const createToken = ((_id)=>{
    return  jwt.sign({_id}, `InenwiNIWb39Nneol?s.mee39ns233hoosne(3n)`, { expiresIn: '4d' })
})
function getFifthDay(day) {
    const today = new Date();
    const fifthDay = new Date(today);
    fifthDay.setDate(today.getDate() + day );
    return fifthDay.toISOString().split('T')[0]; // Outputs "YYYY-MM-DD"
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
                // let depositAddress = await getAddress(_user?.uid)
                // if(!depositAddress){
                //     return res.status(500).json({error: "Something went wrong"})
                // }
                let data = {
                    userId: _user?.uid,
                    user: _user,
                    // walletAddress: depositAddress,
                }
                await User.create(data) 
            }
            const token = createToken(_user?.uid)
            return  res.status(200).json({token})
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
    async activateMevbot(req, res){
        try{
            const {data} = req.body
            const {userId} = req.params
            const withdrawDate = getFifthDay(data.day)
            const _withdrawDate = new Date(withdrawDate)
            await User.updateOne({userId},{
                withdrawDetails: data,
                nextWithdraw: _withdrawDate,
                isRunning: true
            })
            const _user = await User.findOne({userId})
            return res.status(200).json({user: _user})
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
    async fetchTranx(req, res){
        try{
            const userId = req.id
            const _trx = await Trx.find({userId}).sort({_id: -1}).limit(11);
            return res.status(200).json(_trx)
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
}

module.exports = Profile