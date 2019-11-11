let featureCount = 1;
let features = [];

function addInputsForLevels() {
    let count = document.getElementById('levels-count').value;
    let featureName = document.getElementById('feature-name').value
    let featureWeight = document.getElementById('feature-weight').value
    let featureType = document.getElementById('feature-type').value
    // let featureType = document.getElementById('feature-type').value

    let container = document.getElementById('level-inputs');
    let feature = document.createElement("div");

    let featureNameElement = document.createElement("h3");
    featureNameElement.appendChild(document.createTextNode(featureName));
    let featureWeightElement = document.createElement("h4");
    featureWeightElement.appendChild(document.createTextNode("Вес: " + featureWeight));

    feature.appendChild(featureNameElement);
    feature.appendChild(featureWeightElement);


    for (i = 0; i < count; i++) {
        let levelInput = document.createElement("input");
        levelInput.setAttribute("id", featureCount + "featureName" + i);
        levelInput.setAttribute("class", "levelInput");
        levelInput.required = true;
        feature.appendChild(levelInput);   
    }
    features.push(createFeature(featureCount, featureName, featureWeight, featureType));
    featureCount += 1;

    console.log(features);
    container.appendChild(feature);     
}

function hideListCreation() {
    let listCreationDiv = document.getElementById('list-creation');
    listCreationDiv.setAttribute("style", "display: none");
}

function showListUsing() {
    let listUsingDiv = document.getElementById('list-using');
    listUsingDiv.setAttribute("style", "display: block");
}

function createFeature(featureId, featureName, featureWeight, featureType) {
    let feature = {
        id: featureId,
        name: featureName,
        weight: featureWeight,
        type: featureType,
        levels: [],
        value: 0
    };
    return feature;
}

function normalizingCoef(weightSum) {
    return 100 / weightSum;
}

function featureRank(normalizingCoef, featureWeight) {
    return normalizingCoef * featureWeight;
}

function levelUnit(featureRank, levelsCount) {
    return featureRank / (featureCount - 1);
}
