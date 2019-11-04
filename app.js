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

checkDiscounts(productListIncludingJsons).then(finalList => console.log(finalList));

// What this function does is go through the whole product list, and fetch the AH discount information for each item.
function checkDiscounts(productListIncludingJsons) {
        let promises = productListIncludingJsons.map((product) =>{
            return new Promise( (resolve, reject)=> {
                request(product.ah.ahJson, (error, response, html) =>{
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


// What's happening here : 

// You have a list of stuff. 
// You go through each of them, and for each you do a HTTP request.
// HTTP request is by nature asynchronous. To handle this 'when it returns' you want to use a mechanism. In this case a Promise.
// WHAT YOU HAD : A single promise. But you need one asynchronous handling per request. Your code was working FOR THE FIRST http request
// What I have done : Created a promise per product. Created a bunch of HTTP requests
// Tell Javascript to wait for ALL OF THEM to be done (See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
// The promise.all call returns a promise. I can either handle it in checkDiscounts or outside. I choose to do it outside. At that point I have all discounts.

// Promise.all is nice when you do a lot of stuff. Another fun one is Promise.race. It wait for the first one to be resolved. Cool for example if you want a result in one of many databases. The fastest result is enough

//Other things I saw : 
// obj is not a very obvious variable name. 
// Code is much easier to work with if you do as much as possible of 'pure' programming. That means that you create new objects instead of modifying new ones. 
// In that case for example, I don't change the list of products any more, I just create a new one. That way I am sure that for example if I run the function several times with the same input I get the same output.
// You can create a few extra functions that make it easier to test later. For example a 'getdiscount' that takes a link and returns a discount object to replace the lines 187 -> 203 could be useful

// Good work! Promises are not easy but you were almost there! Good work! 
// Des bisous!


// Promise not working, still showing the old array
// promise.then(result => {
    // console.log('Promise completed, final list :', result);
    // Not working either :
    // console.log('Promise completed, final list :', result);
// });

//When manually checking the productListIncludingJsons AFTER some time, the correct result is printed out. Just a hacky way of
// checking that the job is done and that the checkDisounts function works properly
// setTimeout(function() {
//     console.log('Timeout, final list :', productListIncludingJsons);
// }, 2000);

//---------------Boring stuff below-----------------//
let now = new Date();
let formattedDate = date.format(now, 'dddd, MMMM DD YYYY'); // => 'Fri Jan 02 2015'

app.get('/', function(req, res) {
    res.render('landing', {
        //replace productArray with productListIncludingJsons when everything works
        productArray: [],
        date: formattedDate
    });
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The AH discounter server has started');
});
