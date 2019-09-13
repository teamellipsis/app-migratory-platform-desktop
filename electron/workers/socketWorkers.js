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
    const worker = workers[appName];
    if (worker !== undefined && !worker.killed) {
        return true;
    }
    return false;
};
