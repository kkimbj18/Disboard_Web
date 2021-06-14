function count(docs) {
    return docs.reduce((acc, doc) => {
        if (doc.response) {
            acc.O = (acc.O) ? [...acc.O, doc] : [doc];
        }
        else {
            acc.X = (acc.X) ? [...acc.X, doc] : [doc];
        }

        return acc;
    }, {});
}

const docs = [{
    response: true,
    id: 0
}, {
    response: false,
    id: 1
    }, {
    response: false,
        id: 2
}]

console.log(count(docs));