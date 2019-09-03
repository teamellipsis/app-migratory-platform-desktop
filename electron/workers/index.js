module.exports.register = () => {
    require('./extractZip');
    console.log(`Main worker ${process.pid} registered`);
}
