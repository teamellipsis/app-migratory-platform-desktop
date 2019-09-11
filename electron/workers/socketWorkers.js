let workers = {};

module.exports.get = (appName) => {
    return workers[appName];
};

module.exports.getAll = () => {
    return workers;
};

module.exports.add = (appName, worker) => {
    workers[appName] = worker;
};

module.exports.delete = (appName) => {
    workers[appName] = undefined;
};

module.exports.exists = (appName) => {
    if (workers[appName] === undefined) {
        return true;
    }
    return false;
};
