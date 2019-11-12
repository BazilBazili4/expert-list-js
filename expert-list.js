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

    container.appendChild(feature);     
}

function removeList() {
    let listUsingDiv = document.getElementById('list-using');
    console.log(listUsingDiv);
    listUsingDiv.removeAttribute("style");
    listUsingDiv.setAttribute("style", "display: none");
    listUsingDiv.innerHTML = '';
}

function hideListCreation() {
    let listCreationDiv = document.getElementById('list-creation');
    listCreationDiv.setAttribute("style", "display: none");
}

function hideListControlls() {
    let listCreationDiv = document.getElementById('list-controlls');
    listCreationDiv.setAttribute("style", "display: none");
}

function showListCreation() {
    let listUsingDiv = document.getElementById('list-creation');
    listUsingDiv.setAttribute("style", "display: block");
}

function showListUsing() {
    let listUsingDiv = document.getElementById('list-using');
    listUsingDiv.setAttribute("style", "display: block");
}

function showListControls() {
    let listUsingDiv = document.getElementById('list-controlls');
    listUsingDiv.setAttribute("style", "display: block");
}
function goEdit() {
    showListCreation();
    hideListControlls();
    removeList();
}

function createFeatureValueSelect(feature) {
    let levelSelect = document.createElement("select");
    levelSelect.setAttribute("id", feature.id + "featureValue");

    feature.levels.forEach((element, index) => {
        let option = document.createElement("option");
        option.value = feature.getLevelValue(index);
        option.text = element;
        levelSelect.appendChild(option);
    });

    return levelSelect;
}

function createFeatureValueBlock(features) {
    let listBlock = document.getElementById('list-using');

    features.forEach((element) => {
        let selectDiv = document.createElement("div");
        let featureName = document.createElement("h3");
        featureName.appendChild(document.createTextNode(element.name));
        selectDiv.appendChild(featureName);
        selectDiv.appendChild(createFeatureValueSelect(element));
        listBlock.appendChild(selectDiv);
    });
}
function createList() {
    hideListCreation();
    showListUsing();
    setFeaturesParams(features);
    createFeatureValueBlock(features);
    showListControls();
}
function createListFromFile(features) {
    hideListCreation();
    showListUsing();
    showListControls();
    // setFeaturesParams(features);
    createFeatureValueBlock(features);
}

function setFeaturesValues(features) {
    features.forEach((feature) => {
        feature.value = findValueForFeature(feature.id);
    });
}

function calculateFeaturesSum(features) {
    result = features.reduce(
        function (sum, feature) {
            if (feature.isPositive()) {
                return sum + feature.value;
            } else {
                return sum - feature.value;  
            }
        },
        0
    );
    return result;
}

function calculateTotal(featuresSum) {
    return featuresSum;
}

function showResult(result) {
    let listBlock = document.getElementById('list-using');
    let totalValue = document.createElement("h4");
    totalValue.appendChild(document.createTextNode("Общая оценка: " + result + "%"));
    listBlock.appendChild(totalValue);
}
function calculateResult() {
    setFeaturesValues(features);
    showResult(
        calculateTotal(
            calculateFeaturesSum(features)
        )
    );
}

function download() {
    var file = new Blob([JSON.stringify(features)], {type: 'application/json'});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = 'features.json';
    a.click();
}

function openFile() {
        var file_to_read = document.getElementById("get_the_file").files[0];
        var fileread = new FileReader();

        result = fileread.onload = function(e) {
            var content = e.target.result;
            var intern = JSON.parse(content);
            
            createListFromFile(setFeatureFromJson(intern));
        };

        fileread.readAsText(file_to_read);
}

function findValueForFeature(featureNuber) {
    let selectId = featureNuber + "featureValue";
    return Number(document.getElementById(selectId).value);
}

function findLevelInputValueForFeature(featureNuber, levelNumber) {
    let inputId = featureNuber + "featureName" + levelNumber;
    return document.getElementById(inputId).value
}


function setFeaturesParams(features) {
    featuresCount = features.length;
    normalizingCoefPositive = getPositiveNormalizingCoef(features);
    console.log(normalizingCoefPositive);

    normalizingCoefNegative = getNegativeNormalizingCoef(features);
    console.log(normalizingCoefNegative);

    updatedFeatures = features.map(
        function (feature) {
            if (feature.isPositive()) {
                return feature.setFeatureRank(normalizingCoefPositive).setLevelUnit().setLevels(findLevelInputValueForFeature);
            } else {
                return feature.setFeatureRank(normalizingCoefNegative).setLevelUnit().setLevels(findLevelInputValueForFeature);
            }
        }
    );
    return updatedFeatures;
}

function setFeatureFromJson(featuresJson) {
    let newFeatures = [];
    featuresJson.forEach((feature, index) => {
        let newFeature = Object.assign(
            defaultFeature(),
            feature
        );
        newFeatures.push(newFeature);
    });
    return newFeatures;
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
            this.levelUnit = this.featureRank / (this.levelsCount - 1);
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
        isPositive() {
            return this.type === "true";
        },
        getLevelValue(levelNumber) {
            return levelNumber * this.levelUnit;
        }
    };
    return feature;
}

function defaultFeature() {
    let feature = {
        id: 0,
        name: '',
        weight: 0,
        type: false,
        featureRank: 0,
        levelUnit: 0,
        levelValue: 0,
        levelsCount: 0,
        levels: [],
        value: 0,
        setFeatureRank(normalizingCoef) {
            this.featureRank = normalizingCoef * this.weight;
            return this;
        },
        setLevelUnit() {
            this.levelUnit = this.featureRank / (this.levelsCount - 1);
            return this;
        },
        setFeatureLevel(levelName) {
            this.levels.push(levelName);
            return this;
        },
        setLevels(findLevelName) {
            for (i = 0; i < this.levelsCount; i++) {
                levelName = findLevelName(this.id, i);
                this.setFeatureLevel(levelName);
            }
            return this;
        },
        isPositive() {
            return this.type === "true";
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

function getPositiveNormalizingCoef(features) {
    weightSum = features.reduce(
        function (accumulator, feature) {
            if (feature.isPositive()) {
                return accumulator + feature.weight;   
            } else {
                return accumulator + 0;
            }
        },
        0
    );
    return calcNormalizingCoef(weightSum);
}

function getNegativeNormalizingCoef(features) {
    weightSum = features.reduce(
        function (accumulator, feature) {
            if (!feature.isPositive()) {
                return accumulator + feature.weight;   
            } else {
                return accumulator + 0;
            }
        },
        0
    );
    return calcNormalizingCoef(weightSum);
}

