function executerCode() {
    let code = document.getElementById("editor").value;
    let output = document.getElementById("output");

    try {
        let jsCode = traduireAlgorithme(code);
        console.log("Code traduit:", jsCode);
        let result = eval(jsCode);
        output.innerText = result !== undefined ? result : "Code exécuté sans erreur.";
    } catch (e) {
        output.innerText = "Erreur: " + e.message;
    }
}

function traduireAlgorithme(algorithme) {
    return algorithme
        .replace(/Début/gi, "{")  
        .replace(/Fin/gi, "}")   
        .replace(/écrire\((.*?)\)/gi, "console.log($1)") 
        .replace(/Si\s*\((.*?)\)\s*Alors/gi, "if ($1) {") 
        .replace(/Sinon/gi, "} else {") 
        .replace(/Tant que\s*\((.*?)\)\s*Faire/gi, "while ($1) {") 
        .replace(/←/g, "="); 
}
