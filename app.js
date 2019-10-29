var request = require('request'),
    express = require('express'),
    app = express(),
    urlTools = require('url'),
    date = require('date-and-time');

//tells express to look for ejs files
app.set('view engine', 'ejs');
//connects to our main css file
app.use(express.static(__dirname + '/public'));

//Full product list
productList = [
    {
        productName: 'Greenfields Jalapeno Burger',
        image:
            'https://static.ah.nl/static/product/AHI_434d50303736303837_10_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi187593/ah-greenfields-jalapeno-burger'
        },
        dirk: {}
    },
    {
        productName: 'Doritos Cool american tortillas',
        image:
            'https://static.ah.nl/static/product/AHI_43545237303432353632_1_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi442669/doritos-cool-american-tortilla-chips'
        },
        dirk: {}
    },
    {
        productName: 'Douwe Egberts Lungo original',
        image:
            'https://static.ah.nl/static/product/AHI_434d5034363633313132_4_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi414808/douwe-egberts-lungo-original-koffiecups'
        },
        dirk: {}
    },
    {
        productName: 'Robijn color wasmiddel',
        image:
            'https://static.ah.nl/static/product/AHI_43545239353539303537_1_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi211029/robijn-klein-and-krachtig-color-wasmiddel'
        },
        dirk: {}
    },
    {
        productName: 'Robijn wasverzachter morgenfris',
        image:
            'https://static.ah.nl/static/product/AHI_43545236393839333237_2_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi196835/robijn-wasverzachter-morgenfris'
        },
        dirk: {}
    },
    {
        productName: 'Dodoni Halloumi',
        image:
            'https://static.ah.nl/static/product/AHI_43545237323135343938_1_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi223416/dodoni-halloumi-43'
        },
        dirk: {}
    },
    {
        productName: 'AH Maaltijdsalade italiaanse kip',
        image:
            'https://static.ah.nl/static/product/AHI_434d50323130303839_3_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi142440/ah-maaltijdsalade-italiaanse-kip'
        },
        dirk: {}
    },
    {
        productName: 'Pringles original',
        image:
            'https://static.ah.nl/static/product/AHI_43545239353832333933_1_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi233276/pringles-original'
        },
        dirk: {}
    },
    {
        productName: 'AH dipsalade couscous falafel met hummus',
        image:
            'https://static.ah.nl/static/product/AHI_434d50323038373434_4_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi365407/ah-dipsalade-couscous-falafel-met-hummus'
        },
        dirk: {}
    },
    {
        productName: 'Dr Oetker Big American pizza - Texas',
        image:
            'https://static.ah.nl/static/product/AHI_43545239353533363031_2_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi62761/dr-oetker-big-americans-pizza-texas'
        },
        dirk: {}
    },
    {
        productName: 'Granditalia Piccante met rode peper',
        image:
            'https://static.ah.nl/static/product/AHI_43545237303336363634_1_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi191448/granditalia-piccante-met-rode-peper'
        },
        dirk: {}
    },
    {
        productName: 'Pepsi Cola max 4-pack',
        image:
            'https://static.ah.nl/static/product/AHI_43545237303538323339_1_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi112744/pepsi-cola-max-4-pack'
        },
        dirk: {}
    },
    {
        productName: 'Beyond meat burger',
        image:
            'https://static.ah.nl/static/product/AHI_43545237333234353739_1_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi457669/beyond-meat-the-beyond-burger'
        },
        dirk: {}
    },
    {
        productName: 'Granditalia fusilli integrali',
        image:
            'https://static.ah.nl/static/product/AHI_43545239353635313137_1_LowRes_JPG.JPG',
        ah: {
            ahLink:
                'https://www.ah.nl/producten/product/wi196825/granditalia-fusilli-integrali'
        },
        dirk: {}
    }
];

//Old product list
// var productArray = [
//     "https://www.ah.nl/producten/product/wi187593/ah-greenfields-jalapeno-burger",
//     "https://www.ah.nl/producten/product/wi442669/doritos-cool-american-tortilla-chips",
//     "https://www.ah.nl/producten/product/wi414808/douwe-egberts-lungo-original-koffiecups",
//     "https://www.ah.nl/producten/product/wi185801/ah-duurzame-vangst-sockeye-zalm",
//     "https://www.ah.nl/producten/product/wi211029/robijn-klein-and-krachtig-color-wasmiddel",
//     "https://www.ah.nl/producten/product/wi196835/robijn-wasverzachter-morgenfris",
//     "https://www.ah.nl/producten/product/wi420319/kwekkeboom-oven-black-angus-bitterballen",
//     "https://www.ah.nl/producten/product/wi169797/ah-avocado",
//     "https://www.ah.nl/producten/product/wi223416/dodoni-halloumi-43",
//     "https://www.ah.nl/producten/product/wi142440/ah-maaltijdsalade-italiaanse-kip",
//     "https://www.ah.nl/producten/product/wi233276/pringles-original",
//     "https://www.ah.nl/producten/product/wi365407/ah-dipsalade-couscous-falafel-met-hummus",
//     "https://www.ah.nl/producten/product/wi62761/dr-oetker-big-americans-pizza-texas",
//     "https://www.ah.nl/producten/product/wi191448/granditalia-piccante-met-rode-peper",
//     "https://www.ah.nl/producten/product/wi112744/pepsi-cola-max-4-pack",
//     "https://www.ah.nl/producten/product/wi457669/beyond-meat-the-beyond-burger",
//     "https://www.ah.nl/producten/product/wi196825/granditalia-fusilli-integrali"
// ];

//Translating AH urls to JSON data
const getJSONUrl = url => {
    const { pathname } = urlTools.parse(url);
    return `https://www.ah.nl/service/rest/delegate?url=${encodeURIComponent(
        pathname
    )}`;
};

//Previous version :
// const getJSONUrl = url => {
//     let obj = {};
//     const { pathname } = urlTools.parse(url);
//     obj[0] = url;
//     obj[1] = `https://www.ah.nl/service/rest/delegate?url=${encodeURIComponent(
//         pathname
//     )}`;
//     return obj;
// };

function extractAHJsons(productList) {
    let productListIncludingJsons = productList.slice();
    productListIncludingJsons.forEach(
        product => (product.ah.ahJson = getJSONUrl(product.ah.ahLink))
    );
    return productListIncludingJsons;
}

//Previous version:
// function extractAHJsons(productList) {
// productList.forEach(element => {
//     element.JSON = getJSONUrl(element.ahLink);
// });
// console.log(productList);
// return productList;
//     return productList.map(product => getJSONUrl(product.ahLink));
// }

// printing out specific JSON
// console.log(getJSONUrl("https://www.ah.nl/producten/product/wi187593/ah-greenfields-jalapeno-burger"));

// function checkAHdiscounts(productListIncludingJsons) {
//     let productListAhChecked = [];
//     productListIncludingJsons.forEach(product => {
//         // console.log("Element :", product);
//         request(product.ah.ahJson, function(error, response, html) {
//             // console.log("reached the request");
//             if (!error && response.statusCode == 200) {
//                 var obj = JSON.parse(html);
//                 if (
//                     obj._embedded.lanes[4]._embedded.items[0]._embedded.product
//                         .discount == undefined
//                 ) {
//                     // console.log("reached the if");
//                     product.ah.discount = "No discount";
//                     product.ah.price =
//                         obj._embedded.lanes[4]._embedded.items[0]._embedded.product.priceLabel.now;
//                     productListAhChecked.push(product);
//                 } else {
//                     // console.log("reached the else");
//                     product.ah.discount =
//                         obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.label;
//                     product.ah.period =
//                         obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.period;
//                     productListAhChecked.push(product);

//                     // console.log(productListAhChecked);
//                 }
//             }
//         });
//     });
//     return productListAhChecked;
// }

//-----------------ORIGINAL -----------------------//
// productLinks.forEach(function (element) {
//     request(element[1], function (error, response, html) {
//         if (!error && response.statusCode == 200) {
//             var obj = JSON.parse(html);
//             if(obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount == undefined){
//                 product = {
//                     name: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.description,
//                     image: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.images[0].link.href,
//                     discount: "No discount",
//                     price: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.priceLabel.now,
//                     url: element[0]
//                 };
//                 finalProductList.push(product);
//             } else {
//                 product = {
//                     name: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.description,
//                     image: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.images[0].link.href,
//                     discount: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.label,
//                     period: obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.period,
//                     url: element[0]
//                 }
//                 finalProductList.push(product);
//             }
//         }
//     });
// });

function checkAHdiscounts(productListIncludingJsons) {}

function checkAHdiscounts(productListIncludingJsons) {
    let checkedForAHDiscounts = [];
    productListIncludingJsons.forEach(function(element) {
        let newObj = Object.assign({}, element);
        request(newObj.ah.ahJson, function(error, response, html) {
            if (!error && response.statusCode == 200) {
                var obj = JSON.parse(html);
                if (
                    obj._embedded.lanes[4]._embedded.items[0]._embedded.product
                        .discount == undefined
                ) {
                    newObj.ah.discount = 'No discount';
                    newObj.ah.price =
                        obj._embedded.lanes[4]._embedded.items[0]._embedded.product.priceLabel.now;
                    checkedForAHDiscounts.push(newObj);
                    // console.log(checkedForAHDiscounts);
                } else {
                    newObj.ah.discount =
                        obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.label;
                    newObj.ah.period =
                        obj._embedded.lanes[4]._embedded.items[0]._embedded.product.discount.period;
                    checkedForAHDiscounts.push(newObj);
                }
                // console.log("from 1: ", checkedForAHDiscounts);
                // return checkedForAHDiscounts;
            }
            // console.log("from 2: ", checkedForAHDiscounts);
        });
        console.log('from 3: ', checkedForAHDiscounts);
        return checkedForAHDiscounts;
    });
    console.log('from 4: ', checkedForAHDiscounts);
    return checkedForAHDiscounts;
}

const productListIncludingJsons = extractAHJsons(productList);
const finalProductList = checkAHdiscounts(productListIncludingJsons);
console.log('Final list :', finalProductList);

let now = new Date();
let formattedDate = date.format(now, 'dddd, MMMM DD YYYY'); // => 'Fri Jan 02 2015'

// console.log(finalProductList);

// app.get("/", function(req, res) {
//     res.render("landing", {
//         productArray: finalProductList,
//         date: formattedDate
//     });
// });

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The AH discounter server has started');
});
