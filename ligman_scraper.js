var fs = require("fs");
const cheerio = require("cheerio");
const fetch = require('node-fetch');
const { Parser } = require('json2csv');
var moment = require('moment');
const { Headers } = fetch;
var FormData = require('form-data');
var axios = require('axios');


// GET Main URLS
const getMainUrls = async () => {
    var urls = []
    try {
        const rawHTML = await (await fetch(`https://www.ligman.com/products/`)).text()
        const $ = cheerio.load(rawHTML);
        $("div.category-list>div>div>div>a").each(function (i, element) {
            let url = $(this).prop('href')
            urls.push(url);
        })
    } catch { }
    return urls;
}

// GET Subcategory URLS
const getSubUrls = async (url) => {
    let urls = []
    try {
        const rawHTML = await (await fetch(`${url}`)).text()
        const $ = cheerio.load(rawHTML);
        $("div.subcategory-list>div>div>div>a").each(function (i, element) {
            let url = $(this).prop('href')
            urls.push(url);
        })
    } catch { }
    return urls;
}


// GET Product IDs
const getProductUrls = async (url) => {
    let urls = []
    try {
        const rawHTML = await (await fetch(`${url}`)).text()
        const $ = cheerio.load(rawHTML);
        let description = $('div.technical-specifications-left>p').html()
        $("div.products-family>div>div>div>a").each(function (i, element) {
            let url = $(this).prop('href')
            urls.push(url + '_desc_' + description);
        })
    } catch { }
    return urls;
}


const getParseResult = async (html, desc, slug) => {
    const $ = cheerio.load(html);
    let title = ''
    let model_id = ''
    let imageURL = ''
    let description = desc
    let material = ''
    let lightsource = ''
    let power = ''
    let lumen = ''
    let driverOption = ''
    let driver = ''
    let inputVoltage = ''
    let optic = ''
    let opticeValue = ''
    let lumineffecacy = ''
    let cct = ''
    let bug = ''
    let ulr = ''
    let ulor = ''
    let dimmingMethod = ''
    let productColors = ''
    let weight = ''
    let operatingTemprature = ''
    let macadamEllipse = ''
    let lifetime_l90b10 = ''
    let lifetime_l80b10 = ''
    let lifetime_l80b50 = ''
    let variants = ''

    let ies_url = ''
    let installation_manual = ''
    let family_spec_sheet = ''
    let product_spec_sheet = ''
    let technical_drawing = ''


    model_id = $('h1>span.product_ref').text()
    title = $('h1').text().replace(model_id, '').trim()
    if (title === "") {

    }
    console.log(title)
    imageURL = $('div.product-image>img').attr('src')

    $('div#technical-information>div').each(function (i, element) {
        let key = $(element).find('div:nth-child(1)').text()
        let value = $(element).find('div:nth-child(2)').text()
        if (key === "Material") {
            material = value;
        } else if (key === "Light source") {
            lightsource = value;
        } else if (key === "Power (Luminaire)") {
            power = value;
        } else if (key === "Lumen (Luminaire)") {
            lumen = value;
        } else if (key === "Luminaire luminous efficacy") {
            lumineffecacy = value;
        } else if (key === "Driver option") {
            driverOption = value;
        } else if (key === "Driver") {
            driver = value;
        } else if (key === "Input voltage") {
            inputVoltage = value;
        } else if (key === "Optic") {
            optic = value;
        } else if (key === "Optic value") {
            opticeValue = value;
        } else if (key === "CCT / CRI") {
            cct = value;
        } else if (key === "Bug") {
            bug = value;
        } else if (key === "ULR") {
            ulr = value;
        } else if (key === "ULOR") {
            ulor = value;
        } else if (key === "Dimming type") {
            dimmingMethod = value;
        } else if (key === "Product colours") {
            productColors = value;
        } else if (key === "Weight") {
            weight = value;
        } else if (key === "Operating temperature") {
            operatingTemprature = value;
        } else if (key === "MacAdam Ellipse") {
            macadamEllipse = value;
        } else if (key === "Lifetime L90B10 (hours)") {
            lifetime_l90b10 = value;
        } else if (key === "Lifetime L80B10 (hours)") {
            lifetime_l80b10 = value;
        } else if (key === "Lifetime L80B50 (hours)") {
            lifetime_l80b50 = value;
        } else if (key.includes('Variants')) {
            variants = value;
        }
    });

    $('div#downloads>div a').each(function (i, element) {
        let key = $(this).text()
        if (key.includes('Family spec sheet')) {
            family_spec_sheet = $(element).prop('href')
        } else if (key.includes('Product spec sheet')) {
            product_spec_sheet = $(element).prop('href')
        } else if (key.includes('Installation manual')) {
            installation_manual = $(element).prop('href')
        } else if (key.includes('Technical drawing')) {
            technical_drawing = $(element).prop('href')
        } else if (key.includes('IES')) {
            ies_url = $(element).prop('href')
        }
    });
    let parent_product_code = ''
    try {
        parent_product_code = $('h1>span:nth-child(2)').text()
    } catch { }

    let result = {
        "id": slug,
        "Parent Product Title": title,
        "Parent Product Code": model_id,
        "Parent Product Tag": parent_product_code,
        "Image URL": imageURL,
        "Description": description,
        'custom_field:"Material"': material,
        'custom_field:"Light source"': lightsource,
        'custom_field:"Power (Luminaire)"': power,
        'custom_field:"Lumen (Luminaire)"': lumen,
        'custom_field:"Luminaire luminous efficacy"': lumineffecacy,
        'custom_field:"Driver option"': driverOption,
        'custom_field:"Driver"': driver,
        'custom_field:"Input voltage"': inputVoltage,
        'custom_field:"Optic"': optic,
        'custom_field:"Optic value"': opticeValue,
        'custom_field:"CCT / CRI"': cct,
        'custom_field:"Bug"': bug,
        'custom_field:"ULR"': ulr,
        'custom_field:"ULOR"': ulor,
        'custom_field:"Dimming type"': dimmingMethod,
        'custom_field:"Product colours"': productColors,
        'custom_field:"Weight"': weight,
        'custom_field:"Operating temperature"': operatingTemprature,
        'custom_field:"MacAdam Ellipse"': macadamEllipse,
        'custom_field:"Lifetime L90B10 (hours)"': lifetime_l90b10,
        'custom_field:"Lifetime L80B10 (hours)"': lifetime_l80b10,
        'custom_field:"Lifetime L80B50 (hours)"': lifetime_l80b50,
        'custom_field:"Variants (On/Off, DALI, 1-10V)"': variants,
        "Family spec sheet": family_spec_sheet,
        "Product spec sheet": product_spec_sheet,
        "Installation Manual": installation_manual,
        "Technical Drawing": technical_drawing,
        "IES": ies_url
    }
    return result
}


const getVariantResult = async (html, slug) => {
    const $ = cheerio.load(html);
    let model_id = ''
    let imageURL = ''
    let material = ''
    let lightsource = ''
    let power = ''
    let lumen = ''
    let driverOption = ''
    let driver = ''
    let inputVoltage = ''
    let optic = ''
    let opticeValue = ''
    let lumineffecacy = ''
    let cct = ''
    let bug = ''
    let ulr = ''
    let ulor = ''
    let dimmingMethod = ''
    let productColors = ''
    let weight = ''
    let operatingTemprature = ''
    let macadamEllipse = ''
    let lifetime_l90b10 = ''
    let lifetime_l80b10 = ''
    let lifetime_l80b50 = ''
    let variants = ''

    let ies_url = ''
    let installation_manual = ''
    let family_spec_sheet = ''
    let product_spec_sheet = ''
    let technical_drawing = ''


    model_id = $('div.title-popup h3').text()
    console.log(model_id)
    imageURL = $('div.product-image>img').attr('src')
    if (imageURL === undefined) {
        imageURL = $('.product-image img.slick-active').attr('src')
    }
    $('div#popup-content div.technical-specifications>div').each(function (i, element) {
        let key = $(element).text()
        let value = $(element).find('div:nth-child(1)').text()
        if (key.includes("Material")) {
            material = value;
        } else if (key.includes("Light source")) {
            lightsource = value;
        } else if (key.includes("Power (Luminaire)")) {
            power = value;
        } else if (key.includes("Lumen (Luminaire)")) {
            lumen = value;
        } else if (key.includes("Luminaire luminous efficacy")) {
            lumineffecacy = value;
        } else if (key.includes("Driver option")) {
            driverOption = value;
        } else if (key.includes("Driver")) {
            driver = value;
        } else if (key.includes("Input voltage")) {
            inputVoltage = value;
        } else if (key.includes("Optic")) {
            optic = value;
        } else if (key.includes("Optic value")) {
            opticeValue = value;
        } else if (key.includes("CCT / CRI")) {
            cct = value;
        } else if (key.includes("Bug")) {
            bug = value;
        } else if (key.includes("ULR")) {
            ulr = value;
        } else if (key.includes("ULOR")) {
            ulor = value;
        } else if (key.includes("Dimming type")) {
            dimmingMethod = value;
        } else if (key.includes("Product colours")) {
            productColors = value;
        } else if (key.includes("Weight")) {
            weight = value;
        } else if (key.includes("Operating temperature")) {
            operatingTemprature = value;
        } else if (key.includes("MacAdam Ellipse")) {
            macadamEllipse = value;
        } else if (key.includes("Lifetime L90B10 (hours)")) {
            lifetime_l90b10 = value;
        } else if (key.includes("Lifetime L80B10 (hours)")) {
            lifetime_l80b10 = value;
        } else if (key.includes("Lifetime L80B50 (hours)")) {
            lifetime_l80b50 = value;
        } else if (key.includes('Variants') && !key.includes('Variant code')) {
            variants = value;
        }
    });

    $('div.downloads>div>a').each(function (i, element) {
        let key = $(this).text()
        if (key.includes('Family spec sheet')) {
            family_spec_sheet = $(element).prop('href')
        } else if (key.includes('Product spec sheet')) {
            product_spec_sheet = $(element).prop('href')
        } else if (key.includes('Installation manual')) {
            installation_manual = $(element).prop('href')
        } else if (key.includes('Technical drawing')) {
            technical_drawing = $(element).prop('href')
        } else if (key.includes('IES')) {
            ies_url = $(element).prop('href')
        }
    });

    let result = {
        "id": slug,
        "Variant Code": model_id,
        "Image URL": imageURL,
        'custom_field:"Material"': material,
        'custom_field:"Light source"': lightsource,
        'custom_field:"Power (Luminaire)"': power,
        'custom_field:"Lumen (Luminaire)"': lumen,
        'custom_field:"Luminaire luminous efficacy"': lumineffecacy,
        'custom_field:"Driver option"': driverOption,
        'custom_field:"Driver"': driver,
        'custom_field:"Input voltage"': inputVoltage,
        'custom_field:"Optic"': optic,
        'custom_field:"Optic value"': opticeValue,
        'custom_field:"CCT / CRI"': cct,
        'custom_field:"Bug"': bug,
        'custom_field:"ULR"': ulr,
        'custom_field:"ULOR"': ulor,
        'custom_field:"Dimming type"': dimmingMethod,
        'custom_field:"Product colours"': productColors,
        'custom_field:"Weight"': weight,
        'custom_field:"Operating temperature"': operatingTemprature,
        'custom_field:"MacAdam Ellipse"': macadamEllipse,
        'custom_field:"Lifetime L90B10 (hours)"': lifetime_l90b10,
        'custom_field:"Lifetime L80B10 (hours)"': lifetime_l80b10,
        'custom_field:"Lifetime L80B50 (hours)"': lifetime_l80b50,
        'custom_field:"Variants (On/Off, DALI, 1-10V)"': variants,
        "Family spec sheet": family_spec_sheet,
        "Product spec sheet": product_spec_sheet,
        "Installation Manual": installation_manual,
        "Technical Drawing": technical_drawing,
        "IES": ies_url
    }
    return result
}



const bot=async () =>{
    var results = []
    var model_results = []
    var mainUrls = await getMainUrls();
    console.log(mainUrls);
    for (let i = 0; i < 4/*mainUrls.length*/; i++) {
        var url = mainUrls[i];
        var subUrls = await getSubUrls(url);
        for (let j = 0; j < subUrls.length; j++) {
            var subUrl = subUrls[j]
            var productUrls = await getProductUrls(subUrl)
            for (let k = 0; k < productUrls.length; k++) {
                let productUrl = productUrls[k].split('_desc_')[0]
                let slug = productUrls[k].split('_desc_')[0].replace('https://www.ligman.com/', '').replace('/', '')
                let description = '';
                description = productUrls[k].split('_desc_')[1]
                var rawHTML = ''
                while (true) {
                    try {
                        var config = {
                            method: 'get',
                            url: `${productUrl}`,
                        };

                        await axios(config)
                            .then(function (response) {
                                rawHTML = response.data;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        break
                    } catch { }
                }
                if (rawHTML === '') {
                    continue;
                }
                let result = await getParseResult(rawHTML, description, slug)
                results.push(result)
                const $ = cheerio.load(rawHTML);
                let variants_id = []
                $('div.code-finder-results div.popup-link').each(function (i, e) {
                    let id = $(e).prop('onclick').split('(')[1].split(',')[0].trim()
                    variants_id.push(id)
                })

                for (let l = 0; l < variants_id.length; l++) {
                    try {
                        rawHTML = ''
                        let variant_id = variants_id[l]
                        console.log(variant_id)

                        var data = new FormData();
                        data.append('action', 'show_format');
                        data.append('idformat', `${variant_id}`);

                        var config = {
                            method: 'post',
                            url: 'https://www.ligman.com/wp-admin/admin-ajax.php',
                            headers: {
                                ...data.getHeaders()
                            },
                            data: data
                        };

                        await axios(config)
                            .then(function (response) {
                                rawHTML = response.data;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });

                        rawHTML = `<html><head></head><body>${rawHTML}</body></html>`

                        let model_result = await getVariantResult(rawHTML, slug)
                        model_results.push(model_result)
                    } catch {

                    }
                }
            }

        }
    }

    let datetime = moment().format('YYYY-MM-DD hh-mm-ss');
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(results);
    await fs.writeFile(`Ligman_Products_DataExported_On_${datetime}.csv`, csv, { encoding: 'utf16le' }, function (err) {
        if (err) throw err;
        console.log('file saved');
    });
    const json2csvParser2 = new Parser();
    const csv2 = json2csvParser2.parse(model_results);
    await fs.writeFile(`Ligman_Models_DataExported_On_${datetime}.csv`, csv2, { encoding: 'utf16le' }, function (err) {
        if (err) throw err;
        console.log('file saved');
    });
    return "Scraper Has finised."
}
