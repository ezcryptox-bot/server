const crypto = require("crypto");
const { default: axios } = require("axios");
const ApiError = require('../utils/ApiError');

let id = "97f5208e5dbc07e3ba13ac0b42d4410f"
let addId = "azyQUQOdRWuYBl84"


const getSignedText = (reqData, timestamp) => {
    try {
      const args = JSON.stringify(reqData);
      let signText = appId + timestamp;
      if (args.length !== 0) {
        signText += args;
      }
  
      const sign = crypto
        .createHmac("sha256", appSecret)
        .update(signText)
        .digest("hex");
      return sign
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Can not sign');
    }
  }

  const getToken = async (reqData = {}) => {
    const path = "https://ccpayment.com/ccpayment/v2/getOrCreateAppDepositAddress";
    const timestamp = Math.floor(Date.now() / 1000);
    const sign = getSignedText(reqData, timestamp)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Appid": appId,
        "Sign": sign,
        "Timestamp": timestamp.toString(),
      },
    };
    try {
      const res = await axios.post(path, reqData, options).then(res => res.data)
      return res
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Can not get ccpayment data');
    }
  }

  module.exports = {
    getOrCreateAppDepositAddress
  }