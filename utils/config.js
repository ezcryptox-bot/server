class UtilConfig{
    constructor(){
        this.config = ""
    }
     calculatePercentage(percentage, total) {
        return (percentage / 100) * total;
      }
       transactionId(length=15){
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
      }
       generateEthereumTransactionHash(id) {
        return '0x' + Array(32).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      }
      
       hoursToMilliseconds(hours) {
        if (typeof hours !== 'number' || hours < 0) {
            throw new Error('Please provide a valid number of hours (non-negative).');
        }
        return hours * 3600 * 1000; // 1 hour = 3600 seconds, 1 second = 1000 milliseconds
      }
       getNextHours(hours) {
        const now = new Date(); // Get the current date and time
        now.setHours(now.getHours() + hours); // Add the specified hours to the current time
        return now; // Return the updated date object
      }
      
}

module.exports = UtilConfig