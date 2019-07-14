var request = require('request'),
    express = require("express"),
    app = express(),
    urlTools = require('url'),
    date = require('date-and-time');

//tells express to look for ejs files
app.set("view engine", "ejs");
//connects to our main css file
app.use(express.static(__dirname + "/public"));

var productArray = ["https://www.ah.nl/producten/product/wi187593/ah-greenfields-jalapeno-burger", "https://www.ah.nl/producten/product/wi442669/doritos-cool-american-tortilla-chips", "https://www.ah.nl/producten/product/wi414808/douwe-egberts-lungo-original-koffiecups", "https://www.ah.nl/producten/product/wi185801/ah-duurzame-vangst-sockeye-zalm", "https://www.ah.nl/producten/product/wi211029/robijn-klein-and-krachtig-color-wasmiddel", "https://www.ah.nl/producten/product/wi196835/robijn-wasverzachter-morgenfris", "https://www.ah.nl/producten/product/wi420319/kwekkeboom-oven-black-angus-bitterballen", "https://www.ah.nl/producten/product/wi169797/ah-avocado", "https://www.ah.nl/producten/product/wi223416/dodoni-halloumi-43", "https://www.ah.nl/producten/product/wi142440/ah-maaltijdsalade-italiaanse-kip", "https://www.ah.nl/producten/product/wi233276/pringles-original", "https://www.ah.nl/producten/product/wi365407/ah-dipsalade-couscous-falafel-met-hummus", "https://www.ah.nl/producten/product/wi62761/dr-oetker-big-americans-pizza-texas", "https://www.ah.nl/producten/product/wi191448/granditalia-piccante-met-rode-peper", "https://www.ah.nl/producten/product/wi112744/pepsi-cola-max-4-pack", "https://www.ah.nl/producten/product/wi457669/beyond-meat-the-beyond-burger", "https://www.ah.nl/producten/product/wi196825/granditalia-fusilli-integrali"];
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

// printing out specific JSON 
// console.log(getJSONUrl("https://www.ah.nl/producten/product/wi187593/ah-greenfields-jalapeno-burger"));

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
                    price: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.priceLabel.now,
                    url: element[0]
                };
                finalProductList.push(product);
            } else {
                product = {
                    name: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.description,
                    image: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.images[0].link.href,
                    discount: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.label,
                    period: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.period,
                    url: element[0]
                }
                finalProductList.push(product);
            }
        }
    });
});

let now = new Date();
let formattedDate = date.format(now, 'dddd, MMMM DD YYYY');        // => 'Fri Jan 02 2015'

app.get("/", function (req, res) {
    res.render("landing", { productArray: finalProductList, date: formattedDate });
});

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log("The AH discounter server has started");
});
