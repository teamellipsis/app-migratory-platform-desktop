let mainWorker = null;

module.exports.get = () => {
    return mainWorker;
};

module.exports.set = (worker) => {
    mainWorker = worker;
};
