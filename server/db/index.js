const pgp = require('pg-promise')();
const parse = require('./parse').parse;
let db;

function connect() {
  const connString = 'postgres://localhost/nycparking';

  if (!db) {
    db = pgp(connString);
    return db;
  }
  return db;
}

// GeoJSON Feature Collection
function FeatureCollection() {
  this.type = 'FeatureCollection';
  this.features = new Array();
}

module.exports = {
<<<<<<< HEAD
  getListings: function(bounds) {
    const sql = `SELECT *, ST_ASGeoJSON(geom) as geom from listings WHERE geom && ST_MakeEnvelope(${ bounds._southWest.lng }, ${ bounds._southWest.lat }, ${ bounds._northEast.lng }, ${ bounds._northEast.lat }, 4326);`;
    connect();
    return db.many(sql)
      .then(results => {
        results.forEach((result) => {
          result.geom = JSON.parse(result.geom);
          result.geom.coordinates.reverse();
        });
        console.log(results);
        return results;
      })
      .catch(error => console.log(error));
  },
  getSigns: function(bounds) {
    const sql = `SELECT objectid, sg_order_n, sg_seqno_n AS seqno, signdesc1, ST_AsGeoJSON(geom) as geom FROM parking WHERE geom && ST_MakeEnvelope(${ bounds._southWest.lng }, ${ bounds._southWest.lat }, ${ bounds._northEast.lng }, ${ bounds._northEast.lat }, 4326) ORDER BY CAST(sg_seqno_n AS INTEGER);`;
=======
  findAll: function(bounds) {
    const sql = `SELECT objectid, sg_order_n, sg_seqno_n AS seqno, signdesc1, ST_AsGeoJSON(geom) as geom FROM signs WHERE geom && ST_MakeEnvelope(${ bounds._southWest.lng }, ${ bounds._southWest.lat }, ${ bounds._northEast.lng }, ${ bounds._northEast.lat }, 4326) ORDER BY CAST(sg_seqno_n AS INTEGER);`;
>>>>>>> e04e3bc24c6503c02382b75275be20f8254d2c3c

    connect();
    return db.many(sql)
      .then(results => {

        const featureCollection = new FeatureCollection();

        results.forEach((result) => {
          let feature = {};
          feature.type = 'Feature';
          feature.geometry = JSON.parse(result.geom);
          feature.objectid = result.objectid;
          feature.sg_order_n = result.sg_order_n;
          feature.seqno = result.seqno;
          feature.signdesc = result.signdesc1;
          let p = parse(feature.signdesc);
          feature.regType = p.type;
          feature.schedule = p.schedule;
          featureCollection.features.push(feature);
        });

        return featureCollection;
      })
      .catch(error => console.log(error));

  }
};
