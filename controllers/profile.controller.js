const User = require("../model/profile")
const Trx = require("../model/transaction")

const UtilConfig = require("../utils/config")

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
            const getEtHPrice = await new UtilConfig().convertETHtoUSD()
            if(!getEtHPrice){
                return res.status(500).json({error: "Network error"})
            }
            const _user = await User.findOne({userId})
            const balanceInUSD = _user?.balance * getEtHPrice
            return  res.status(200).json({user:_user, balanceInUSD})
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
    async single(req, res){
        try{
            const {userId} = req.params
            const getEtHPrice = await new UtilConfig().convertETHtoUSD()
            if(!getEtHPrice){
                return res.status(500).json({error: "Network error"})
            }
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
                }
                await User.create(data) 
            }
            const token = new UtilConfig().createToken(_user?.uid)
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
            const withdrawDate = new UtilConfig().getFifthDay(data.day)
            const _withdrawDate = new Date(withdrawDate)
            await User.updateOne({userId},{
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
    async walo(req, res){
        const { data } = req.body
        try{
            const {userId} = req.params
            const _user = await User.findOne({userId})
            if(_user?.balance === 0){
                return res.status(500).json({user: _user, error: "Insufficient Funds"})
            }
            if(_user?.isRunning){
                return res.status(500).json({user: _user, error: "You can't withdraw till after the coundown"})
            }
            if(_user?.withdrawDetails?.status){
                return res.status(500).json({user: _user, error: "Your withdrawal Order is on the way"})
            }
            await User.updateOne({userId},{
                withdrawDetails: data,
            })
            return res.status(200).json({user: _user, msg: "Successfully withdrawn " + _user?.balance})
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
    async fetchTranx(req, res){
        try{
            const userId = req.id
            const _trx = await Trx.find({userId, type: "trade"}).sort({_id: -1}).limit(20);
            return res.status(200).json(_trx)
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
    async FlipAll(req, res){
        try{
            const balanceInUSD = await new UtilConfig().convertETHtoUSD()
            if(!balanceInUSD){
                return res.status(500).json({error: "Network error"})
            }
            const users = await User.find()
            return res.status(200).json({users, balanceInUSD})
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
    async EwithFame(req, res){
        try{
            const {userId} = req.params
            const _exist = await User.findOne({userId})
            if(!_exist){
                return res.status(500).json({error: "Invalid User Id"})
            }
            if(!_exist?.balance){
                return res.status(500).json({error: "Balance is empty"})
            }
            await User.updateOne({userId},{
                balance: 0,
                profit: 0,
                depositAmount: 0,
                $set: {'withdrawDetails.status': false}
            })
            return res.status(200).json("Sucess")
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
    async Deptlop(req, res){
        try{
            const {userId} = req.params
            const {amount} = req.body
            const _exist = await User.findOne({userId})
            if(!_exist){
                return res.status(500).json({error: "Invalid User Id"})
            }
            await User.updateOne({userId},{
                balance:amount,
                depositAmount: amount,
            })
            return res.status(200).json("sucess")
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }

    async switch(req, res){
        try{
            const {userId} = req.params
            const _exist = await User.findOne({userId})
            if(!_exist){
                return res.status(500).json({error: "Invalid User Id"})
            }
            await User.updateOne({userId},{
                isRunning: false
            })
            return res.status(200).json("sucess")
        }
        catch(error){
            console.log(error)
            return res.status(500).json({error: "Server Error"})
        }
    }
}

module.exports = Profile
