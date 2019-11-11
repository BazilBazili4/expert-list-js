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
    features.push(createFeature(featureCount, featureName, featureWeight, featureType, count));
    featureCount += 1;

    console.log(features);
    // features.map(
    //     function(feature) {
    //         feature.
    //     }
    // );
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


function createList() {
    hideListCreation();
    showListUsing();
    console.log(setFeaturesParams(features));
    console.log(getNormalizingCoef(features));

}
function findLevelInputValueForFeature(featureNuber, levelNumber) {
    let inputId = featureNuber + "featureName" + levelNumber;
    return document.getElementById(inputId).value
}


function setFeaturesParams(features) {
    featuresCount = features.length;
    normalizingCoef = 1;
    updatedFeatures = features.map(
        function (feature) {
            return feature.setFeatureRank(normalizingCoef).setLevelUnit().setLevels(findLevelInputValueForFeature);
        }
    );
    return updatedFeatures;
}

function createFeature(featureId, featureName, featureWeight, featureType, levelCount) {
    let feature = {
        id: featureId,
        name: featureName,
        weight: Number(featureWeight),
        type: featureType,
        featureRank: 0,
        levelUnit: 0,
        levelValue: 0,
        levelsCount: Number(levelCount),
        levels: [],
        value: 0,
        setFeatureRank(normalizingCoef) {
            this.featureRank = normalizingCoef * this.weight;
            return this;
        },
        setLevelUnit() {
            this.levelUnit = this.featureRank / (this.levelsCount);
            return this;
        },
        setFeatureLevel(levelName) {
            this.levels.push(levelName);
            return this;
        },
        setLevels(findLevelName) {
            for (i = 0; i < this.levelsCount; i++) {
                levelName = findLevelName(featureId, i);
                this.setFeatureLevel(levelName);
            }
            return this;
        },
        getLevelValue(levelNumber) {
            return levelNumber * this.levelUnit;
        }
    };
    return feature;
}

function calcNormalizingCoef(weightSum) {
    return 100 / weightSum;
}

function getNormalizingCoef(features) {
    weightSum = features.reduce(
        function (accumulator, currentValue) {
            return accumulator + currentValue.weight;
        },
        0
    );
    return calcNormalizingCoef(weightSum);
}