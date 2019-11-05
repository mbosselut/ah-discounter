var request = require('request'),
    express = require('express'),
    app = express(),
    urlTools = require('url'),
    date = require('date-and-time');

const { productList } = require('./productList');

//tells express to look for ejs files
app.set('view engine', 'ejs');
//connects to our main css file
app.use(express.static(__dirname + '/public'));

// printing out specific JSON, occasionnally useful for debugging
// console.log(
//     getJSONUrl(
//         'https://www.ah.nl/producten/product/wi187593/ah-greenfields-jalapeno-burger'
//     )
// );

//Translating AH urls to JSON data
const getJSONUrl = url => {
    const { pathname } = urlTools.parse(url);
    return `https://www.ah.nl/service/rest/delegate?url=${encodeURIComponent(
        pathname
    )}`;
};

// Going through the product list and adding the AH JSON url property
function extractAHJsons(productList) {
    let productListIncludingJsons = productList.slice();
    productListIncludingJsons.forEach(
        product => (product.ah.ahJson = getJSONUrl(product.ah.ahLink))
    );
    return productListIncludingJsons;
}
const productListIncludingJsons = extractAHJsons(productList);

// Fetching AH discounts
function checkDiscounts(productListIncludingJsons) {
    let promises = productListIncludingJsons.map(product => {
        return new Promise((resolve, reject) => {
            request(product.ah.ahJson, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    let obj = JSON.parse(html);
                    if (
                        obj._embedded.lanes[4]._embedded.items[0]._embedded
                            .product.discount == undefined
                    ) {
                        product.ah.discount = 'No discount';
                        product.ah.price =
                            obj._embedded.lanes[4]._embedded.items[0]._embedded.product.priceLabel.now;
                    } else {
                        product.ah.discount =
                            obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.label;
                        product.ah.period =
                            obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.period;
                    }
                }
                resolve(product);
            });
        });
    });

    return Promise.all(promises);
}

let now = new Date();
let formattedDate = date.format(now, 'dddd, MMMM DD YYYY'); // => 'Fri Jan 02 2015'

//Calling the checkDisounts function within the app.get and sending the results to the render method
app.get('/', (req, res) => {
    checkDiscounts(productListIncludingJsons).then(finalList =>
        res.render('landing', { productArray: finalList, date: formattedDate })
    );
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The AH discounter server has started');
});
