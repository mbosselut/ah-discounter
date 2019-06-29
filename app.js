var request = require('request'),
    express = require("express"),
    app = express(),
    urlTools = require('url');

//tells express to look for ejs files
app.set("view engine", "ejs");
//connects to our main css file
app.use(express.static(__dirname + "/public"));

var productArray = ["https://www.ah.nl/producten/product/wi187593/ah-greenfields-jalapeno-burger", "https://www.ah.nl/producten/product/wi142440/ah-maaltijdsalade-italiaanse-kip", "https://www.ah.nl/producten/product/wi233276/pringles-original", "https://www.ah.nl/producten/product/wi365407/ah-dipsalade-couscous-falafel-met-hummus", "https://www.ah.nl/producten/product/wi62761/dr-oetker-big-americans-pizza-texas", "https://www.ah.nl/producten/product/wi191448/granditalia-piccante-met-rode-peper", "https://www.ah.nl/producten/product/wi112744/pepsi-cola-max-4-pack", "https://www.ah.nl/producten/product/wi457669/beyond-meat-the-beyond-burger", "https://www.ah.nl/producten/product/wi196825/granditalia-fusilli-integrali"];
var productLinks = [];
var finalProductList = [];

const getJSONUrl = (url) => {
    let obj = {}
    const { pathname } = urlTools.parse(url);
    obj[0] = url;
    obj[1] = `https://www.ah.nl/service/rest/delegate?url=${encodeURIComponent(pathname)}`;
    return obj;
}

function createProductList(productArray) {
    productArray.forEach(function (element, index) {
        var json_url = getJSONUrl(productArray[index]);
        productLinks.push(json_url);
        // isOnDiscount();
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
    request(element[1], function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(html);
            if(obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount == undefined){
                product = {
                    name: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.description,
                    image: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.images[0].link.href,
                    discount: "No discount",
                    url: element[0]
                };
                finalProductList.push(product);
            } else {
                product = {
                    name: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.description,
                    image: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.images[0].link.href,
                    discount: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.label,
                    url: element[0]
                }
                finalProductList.push(product);
            }
        }
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
    console.log("The AH discounter server has started");
});
