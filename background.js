const http = require('http');

function getBackground() {
    return new Promise((resolve, reject) => {
        http.get('http://www.splashbase.co/api/v1/images/random', (res) => {
                const {
                    statusCode
                } = res;
                const contentType = res.headers['content-type'];
    
                let error;
                if (statusCode !== 200) {
                    error = new Error('Request failed with Status Code ' +
                        statusCode);
                    console.log(error.message);
                    reject(error);
                    res.resume();
                    return;
                }
    
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', chunk => rawData += chunk);
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        resolve(parsedData);
                    } catch(err) {
                        error = new Error('Unable to parse JSON of background');
                        reject(error);
                    }
                })
            })
    
        }
    )
}

module.exports.getBackground = getBackground;