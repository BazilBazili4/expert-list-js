function addInputsForLevels() {
    let count = document.getElementById('levels-count').value;
    let featureName = document.getElementById('feature-name').value
    let featureWeight = document.getElementById('feature-weight').value

    let container = document.getElementById('level-inputs');
    let feature = document.createElement("div");

    let featureNameElement = document.createElement("h3");
    featureNameElement.appendChild(document.createTextNode(featureName));
    let featureWeightElement = document.createElement("h4");
    featureWeightElement.appendChild(document.createTextNode("Вес: " + featureWeight));
    feature.appendChild(featureNameElement);
    feature.appendChild(featureWeightElement);
    // console.log(featureNameElement);

    for (i = 0; i < count; i++) {
        let levelInput = document.createElement("input");
        levelInput.setAttribute("id", "featureName" + i);
        levelInput.setAttribute("class", "levelInput");

        feature.appendChild(levelInput);     
    }
    console.log(document.querySelectorAll( ".levelInput" ));
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