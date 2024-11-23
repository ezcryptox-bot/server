const crypto = require("crypto");
const { default: axios } = require("axios");
const ApiError = require('./utils/ApiError');
const httpStatus = require('http-status');
require("dotenv").config();
const appId = "azyQUQOdRWuYBl84";
const appSecret = "97f5208e5dbc07e3ba13ac0b42d4410f";


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

const getOrCreateAppDepositAddress = async (reqData = {}) => {
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

const getDepositRecord = async (reqData = {}) => {
  const path = "https://ccpayment.com/ccpayment/v2/getAppDepositRecord";
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

function verifySignature(content, signature, app_id, app_secret, timestamp) {
  let signText = app_id + timestamp;
  if (content.length) {
    signText += content;
  }
  let server_sign = crypto.createHmac('sha256', app_secret).update(signText).digest('hex');
  return signature === server_sign
}

const handleWebHook = (async(req, res)=>{
  const app_id = appId
  const app_secret = appSecret
  const timestamp = req.header('Timestamp');
  const sign = req.header('Sign');
  const sign_text = req.body;
  console.log(res)
  console.log(sign_text)
  if (verifySignature(sign_text, sign, app_id, app_secret, timestamp)) {
      res.send('success');
  } else {
      res.status(401).send('Invalid signature');
  }
})

module.exports = {
  getOrCreateAppDepositAddress, getDepositRecord, handleWebHook
}