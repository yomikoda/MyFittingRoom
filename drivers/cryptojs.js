var CryptoJs = require('crypto-js')

var supersecret = 'sup3rs3cr3t'

module.exports = function (app) {
    return {
        encrypt: function (content) {
            // ENCRYPT

            var ciphertext = CryptoJs.AES.encrypt(JSON.stringify(content), supersecret);
            var token = ciphertext.toString()

            return token
        },
        decrypt: function (token) {
            //DECRYPT 
            console.log(token)
            var bytes = CryptoJs.AES.decrypt(token, supersecret);
            var plaintext = bytes.toString(CryptoJs.enc.Utf8);
            
            if(plaintext.charAt(0) == '{') // When token invalid, it tries to decrypt something that's not a Json and it Fucks up
                return JSON.parse(plaintext)
            else 
                return {}
        }
    }
}