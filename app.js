var request = require('request'),
    express = require("express"),
    app = express(),
    urlTools = require('url');

//tells express to look for ejs files
app.set("view engine", "ejs");
//connects to our main css file
app.use(express.static(__dirname + "/public"));

var productArray = ["https://www.ah.nl/producten/product/wi421139/ah-snoepfruit-peer", "https://www.ah.nl/producten/product/wi421139/ah-snoepfruit-peer", "https://www.ah.nl/producten/product/wi421139/ah-snoepfruit-peer"];
var productLinks = [];
var finalProductList = [];
var product = {};

const getJSONUrl = (url) => {
    const { pathname } = urlTools.parse(url);

    return `https://www.ah.nl/service/rest/delegate?url=${encodeURIComponent(pathname)}`;
}

function createProductList(productArray) {
    productArray.forEach(function (element, index) {
        var json_url = getJSONUrl(productArray[index]);
        productLinks.push(json_url);
    });
};

//if using an object instead of an array for product links :
// function createProductList(productArray){
//     productArray.forEach(function(element, index){
//         var obj = {
//             product_url: productArray[index],
//             json_url: getJSONUrl(productArray[index])
//         };
//         productLinksTest.push(obj);
//     });
// };

createProductList(productArray);

productLinks.forEach(function (element) {
    request(element, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(html);
            product = {
                name: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.description,
                image: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.images[0].link.href,
                discount: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.label
            };
            finalProductList.push(product);
        }
        console.log(finalProductList);
    });
});

// productLinks.forEach(function(element){
//     request(element, function (error, response, html) {
//       if (!error && response.statusCode == 200) {
//          var obj = JSON.parse(html);
//          product = {
//              name: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.description,
//              image: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.images[0].link.href,
//              discount: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.label
//          };
//          productArray.push(product);
//       }
//     });
// });

app.get("/", function (req, res) {
    res.render("landing", { productArray: finalProductList });
});

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log("The AHdiscounter server has started");
});
