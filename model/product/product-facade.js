const Model = require('../../lib/facade');
const productSchema = require('./product-schema');
const trilateration = require('../../util/trilateration');
const beaconFacade = require('../beacon/beacon-facade');
const productFacade = require('./product-facade');
const math = require('mathjs');

class ProductModel extends Model {

    removeByEan(eanQuery) {
        return productSchema
            .find({
                ean: eanQuery
            })
            .remove()
            .exec();
    }

    resetBeacons(eanProduct, newBeacons) {
        return productSchema.findOne({
            ean: eanProduct
        }).then((product) => {
            if(product != null){
                product.beacons = newBeacons;
                productSchema.update({
                    ean: product.ean
                }, product, {
		    upsert: true
                }).exec();
            }
            return productSchema.findOne({
                ean: eanProduct
            });
        });
    }

    resetAssociations(eanProduct, newAssociations) {
        return productSchema.findOne({
            ean: eanProduct
        }).then((product) => {
            if(product != null){
                product.associatedProducts = newAssociations;

                productSchema.update({
                    ean: product.ean
                }, product, {
                    upsert: true
                }).exec();
            }

            return productSchema.findOne({
                ean: eanProduct
            });
        });
    }

    addPosition(eanQuery, positions) {

        let position = null;
        const validBeacons = [];

        return beaconFacade.find({})
            .then((proximyBeacons) => {

                // Getting beacons and validate
                positions.forEach((position) => {
                    proximyBeacons.forEach((beaconProximy) => {

                        if (beaconProximy.data.uuid && position.uuid &&
                            position.uuid.toLowerCase() === beaconProximy.data.uuid.toLowerCase()) {
                            beaconProximy.dist = position.dist;
                            if (!validBeacons.includes(beaconProximy)) {
                                validBeacons.push(beaconProximy);
                            }
                        }
                    });
                });

                // Trilate the 3 valid nearests beacons
                if (validBeacons.length >= 3) {
                    const beacons = [];
                    for (let i = 0; i < 3; i++) {
                        beacons.push(new trilateration.Beacon(validBeacons[i].data.marker.lat,
                            validBeacons[i].data.marker.lng, validBeacons[i].dist));
                    }
                    try {
                        position = trilateration.trilaterate(beacons);
                    } catch (e) {
                        // The trilateration have not worked but it's k
                    }
                }


            })
            .then(() => productSchema.findOne({
                    ean: eanQuery
                })
                .exec((err, product) => {

                    if (!err) {
                        // Compute average position
                        if (position) {
                            product.positions.push(position);

                            const arrayLat = [];
                            const arrayLng = [];
                            product.positions.forEach((positionProduct) => {
                                arrayLat.push(positionProduct.lat);
                                arrayLng.push(positionProduct.lng);
                            });

                            product.averagePosition = {
                                lat: math.median(arrayLat),
                                lng: math.median(arrayLng)
                            };
                        }
                        
                        //fingerprinting
                        var sizeReachedBeacons = 20;

                        const fingerPrint = [];
                        product.reachedBeacons.push(fingerPrint);

                        positions.forEach((position) => {
                            product.reachedBeacons[product.reachedBeacons.length-1].fingerPrint.push({
                                uuid: position.uuid,
                                close: position.close,
                                far: position.far
                            });

                            if(product.reachedBeacons.length > sizeReachedBeacons)
                                product.reachedBeacons.shift();
                        });

                        product.beaconsPattern = [];
                        for(let i = 0; i < product.reachedBeacons.length; i++){
                            for(let j = 0; j < product.reachedBeacons[i].fingerPrint.length; j++){

                                let beacon = product.reachedBeacons[i].fingerPrint[j];

                                if (product.beaconsPattern === null) {
		                const beaconsPattern = [];
		                beaconsPattern.push({
		                    uuid: beacon.uuid,
                                    close: beacon.close,
                                    far: beacon.far,
                                    count: 1
		                });
		                product.beaconsPattern = beaconsPattern;
		                } else {
		                    let found = false;
		                    for (let i = 0; i < product.beaconsPattern.length; i++) {
		                        if (product.beaconsPattern[i].uuid === beacon.uuid) {
		                            product.beaconsPattern[i].count += 1;
                                            product.beaconsPattern[i].close += beacon.close;
                                            product.beaconsPattern[i].far += beacon.far;
		                            found = true;
		                            break;
		                        }
		                    }
		                    if (!found) {
		                        product.beaconsPattern.push({
		                            uuid: beacon.uuid,
                                            close: beacon.close,
                                            far: beacon.far,
                                            count: 1
		                        });
		                    }
		                }
                            }
                        }

                        for (let i = 0; i < product.beaconsPattern.length; i++) {
		            product.beaconsPattern[i].close = product.beaconsPattern[i].close / product.beaconsPattern[i].count;
                            product.beaconsPattern[i].far = product.beaconsPattern[i].far / product.beaconsPattern[i].count;
		        }
                        
                        product.beaconsPattern.sort(function (a,b){
                            if(a.count == b.count) return 0;
                            if(a.count < b.count) return 1;
                            if(a.count > b.count) return -1;
                        });
                        

                        // Save beacons uuid and count in product
                        validBeacons.forEach((beacon) => {
                            if (!product.beacons) {
                                const beacons = [];
                                beacons.push({
                                    uuid: beacon.data.uuid,
                                    count: 1
                                });
                                product.beacons = beacons;
                            } else {
                                let found = false;
                                for (let i = 0; i < product.beacons.length; i++) {
                                    if (product.beacons[i].uuid === beacon.data.uuid) {
                                        product.beacons[i].count += 1;
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    product.beacons.push({
                                        uuid: beacon.data.uuid,
                                        count: 1
                                    });
                                }
                            }
                        });


                        productSchema.update({
                            ean: eanQuery
                        }, product, {
                            upsert: true
                        }).exec();
                    }


                    return productSchema.findOne({
                        ean: eanQuery
                    });
                }));
    }

    findProductsByBeacons(uuidsBeacons) {

        uuidsBeacons.forEach((beacon, index, array) => {
            array[index] = array[index].toUpperCase();
        });

        console.log(uuidsBeacons);


        return productSchema
            .find({
                'beacons.uuid': {
                    $in: uuidsBeacons
                }
            })
            .exec();

    }

    findProductsByAssociation(eansProducts) {

        eansProducts.forEach((product, index, array) => {
            array[index] = array[index].toUpperCase();
        });

        console.log(eansProducts);


        return productSchema
            .find({
                'associatedProducts.ean': {
                    $in: eansProducts
                }
            })
            .exec();

    }

    addAssociation(eanQuery, associations) {
        return productSchema.findOne({
                ean: eanQuery
            })
            .exec((err, product) => {
                if (!err) {
                    associations.forEach((eanProduct) => {
                        if (product.ean != eanProduct) {
		                if (product.associatedProducts === null) {
		                    const associatedProducts = [];
		                    associatedProducts.push({
		                        ean: eanProduct,
		                        count: 1
		                    });
		                    product.associatedProducts = associatedProducts;
		                } else {
		                    let found = false;
		                    for (let i = 0; i < product.associatedProducts.length; i++) {
		                        if (product.associatedProducts[i].ean === eanProduct) {
		                            product.associatedProducts[i].count += 1;
		                            found = true;
		                            break;
		                        }
		                    }
		                    if (!found) {
		                        product.associatedProducts.push({
		                            ean: eanProduct,
		                            count: 1
		                        });
		                    }
		                }
                        }
                    });

                    product.associatedProducts.sort(function (a,b){
                        if(a.count == b.count) return 0;
                        if(a.count < b.count) return 1;
                        if(a.count > b.count) return -1;
                    });

                    productSchema.update({
                        ean: eanQuery
                    }, product, {
                        upsert: true
                    }).exec();
                }
                return productSchema.findOne({
                    ean: eanQuery
                });
            });
    }

}


module.exports = new ProductModel(productSchema);
