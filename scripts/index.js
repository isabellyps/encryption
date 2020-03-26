var fileAnswerJson = null;

function downloadJson() {
    var url = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=23e96db837a802b4831ee392b6282e2719af5a48";

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();

    var result = JSON.parse(xhttp.responseText);

    console.log(result);

    var a = document.createElement("a");
    var file = new Blob([xhttp.responseText], { type: "application/json" });
    a.href = URL.createObjectURL(file);
    a.download = "answer.json";
    a.click();
}

function carregarJson() {
    let fileInput = document.getElementById('file-upload-input');
    let files = fileInput.files;

    let filePath = URL.createObjectURL(files[0]);

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", filePath, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                fileAnswerJson = JSON.parse(allText);
            }
        }
    }
    rawFile.send(null);
    return files[0];
}

function encrypt(text, shift) {
    var result = "";
    console.log(text);

    //loop through each caharacter in the text
    for (var i = 0; i < text.length; i++) {

        //get the character code of each letter
        var c = text.charCodeAt(i);

        // handle uppercase letters
        if (c >= 65 && c <= 90) {
            result += String.fromCharCode((c - 65 + shift) % 26 + 65);

            // handle lowercase letters
        } else if (c >= 97 && c <= 122) {
            result += String.fromCharCode((c - 97 + shift) % 26 + 97);

            // its not a letter, let it through
        } else {
            result += text.charAt(i);
        }
    }

    return result;
}

function decrypt() {
    var result = "";
    var phrase = fileAnswerJson.cifrado;
    var move = fileAnswerJson.numero_casas;
    var shift = (26 - move) % 26;

    result = encrypt(phrase, shift);
    fileAnswerJson.decifrado = result;
    fileAnswerJson.resumo_criptografico = SHA1(result);

    console.log(fileAnswerJson);

}

function sendPost() {

    var formData = new FormData();

    var file = carregarJson();

    formData.append(file.name.split(".")[0], file, file.name);

    var url = "https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=" + fileAnswerJson.token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = function (e) { console.log(e) };
    xhr.onerror = function (e) { console.log(e)};
    xhr.send(formData);
}