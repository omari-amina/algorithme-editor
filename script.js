// متغيرات عامة لتنفيذ الخوارزمية
let variables = {};
let constants = {};
let inputQueue = [];
let waitingForInput = false;
let currentInputVar = null;
let algoritlmeLines = [];
let currentLineIndex = 0;

// دالة لإدراج قالب خوارزمية فارغ
function insertTemplate() {
    const template = `Algorithme: NomAlgorithme
// Déclaration des constantes
Const
    // Définir les constantes ici

// Déclaration des variables
Var
    // Définir les variables ici

Debut
    // Corps de l'algorithme ici

Fin`;
    document.getElementById("code-editor").value = template;
}

// دالة لمسح المحرر
function clearEditor() {
    document.getElementById("code-editor").value = "";
}

// دالة لإدراج كلمة مفتاحية في موضع المؤشر
function insertKeyword(keyword) {
    const editor = document.getElementById("code-editor");
    const cursorPos = editor.selectionStart;
    const textBefore = editor.value.substring(0, cursorPos);
    const textAfter = editor.value.substring(editor.selectionEnd);
    
    // التحقق مما إذا كنا بحاجة إلى إضافة سطر جديد قبل إدراج الكلمة المفتاحية
    const needNewLine = cursorPos > 0 && editor.value.charAt(cursorPos - 1) !== '\n';
    const textToInsert = needNewLine ? '\n' + keyword : keyword;
    
    editor.value = textBefore + textToInsert + textAfter;
    editor.focus();
    editor.selectionStart = editor.selectionEnd = cursorPos + textToInsert.length;
}

// دالة لتحميل أمثلة مختلفة
function loadExample(exampleNumber) {
    const codeEditor = document.getElementById("code-editor");
    
    switch(exampleNumber) {
        case 1:
            codeEditor.value = `Algorithme: SommeDeuxNombres
// Calcule la somme de deux nombres
Var
    a, b : Entier
    somme : Entier
Debut
    Ecrire("Entrez le premier nombre: ")
    Lire(a)
    Ecrire("Entrez le deuxième nombre: ")
    Lire(b)
    somme ← a + b
    Ecrire("La somme est: ", somme)
Fin`;
            break;
        case 2:
            codeEditor.value = `Algorithme: VerificationPariteNombre
// Vérifie si un nombre est pair ou impair
Var
    nombre : Entier
Debut
    Ecrire("Entrez un nombre entier: ")
    Lire(nombre)
    
    Si nombre mod 2 = 0 Alors
        Ecrire(nombre, " est un nombre pair")
    Sinon
        Ecrire(nombre, " est un nombre impair")
    FinSi
Fin`;
            break;
        case 3:
            codeEditor.value = `Algorithme: MoyenneDeSerie
// Calcule la moyenne d'une série de nombres
Var
    n, i : Entier
    nombre, somme, moyenne : Réel
Debut
    somme ← 0
    
    Ecrire("Combien de nombres voulez-vous entrer? ")
    Lire(n)
    
    Pour i de 1 à n Faire
        Ecrire("Entrez le nombre ", i, ": ")
        Lire(nombre)
        somme ← somme + nombre
    FinPour
    
    moyenne ← somme / n
    Ecrire("La moyenne des ", n, " nombres est: ", moyenne)
Fin`;
            break;
        case 4:
            codeEditor.value = `Algorithme: CalculGCD
// Calcule le plus grand diviseur commun (GCD) de deux nombres
Var
    a, b, temp : Entier
Debut
    Ecrire("Entrez le premier nombre: ")
    Lire(a)
    Ecrire("Entrez le deuxième nombre: ")
    Lire(b)
    
    // Algorithme d'Euclide
    Tant Que b ≠ 0 Faire
        temp ← b
        b ← a mod b
        a ← temp
    FinTantQue
    
    Ecrire("Le GCD est: ", a)
Fin`;
            break;
    }
}

// دالة لفحص الخوارزمية والتحقق من الأخطاء
function checkAlgorithm() {
    const code = document.getElementById("code-editor").value;
    const output = document.getElementById("output");
    output.innerHTML = "";
    
    // فحص الهيكل العام للخوارزمية
    if (!code.includes("Algorithme:")) {
        appendOutput("خطأ: لم يتم العثور على كلمة 'Algorithme:' في بداية الخوارزمية", "error");
        return;
    }
    
    if (!code.includes("Debut")) {
        appendOutput("خطأ: لم يتم العثور على كلمة 'Debut' في الخوارزمية", "error");
        return;
    }
    
    if (!code.includes("Fin")) {
        appendOutput("خطأ: لم يتم العثور على كلمة 'Fin' في نهاية الخوارزمية", "error");
        return;
    }

    // تحليل الكود وتقسيمه إلى أقسام
    try {
        parseAlgorithm(code);
        appendOutput("تم التحقق من الخوارزمية بنجاح!", "success");
    } catch (error) {
        appendOutput("خطأ: " + error.message, "error");
    }
}

// دالة لتحليل الخوارزمية وتقسيمها إلى أقسام
function parseAlgorithm(code) {
    // إعادة تعيين المتغيرات العامة
    variables = {};
    constants = {};
    algoritlmeLines = [];
    currentLineIndex = 0;
    
    // تقسيم الكود إلى أسطر
    const lines = code.split('\n').map(line => line.trim());
    
    // استخراج اسم الخوارزمية
    const algorithmNameLine = lines.find(line => line.startsWith("Algorithme:"));
    if (!algorithmNameLine) {
        throw new Error("لم يتم العثور على اسم الخوارزمية");
    }
    
    // تحليل قسم الثوابت (Constants)
    let constSection = false;
    let varSection = false;
    let mainSection = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.startsWith("Const")) {
            constSection = true;
            varSection = false;
            mainSection = false;
            continue;
        } else if (line.startsWith("Var")) {
            constSection = false;
            varSection = true;
            mainSection = false;
            continue;
        } else if (line.startsWith("Debut")) {
            constSection = false;
            varSection = false;
            mainSection = true;
            continue;
        } else if (line.startsWith("Fin")) {
            mainSection = false;
            continue;
        }
        
        // تجاهل التعليقات والأسطر الفارغة
        if (line.startsWith("//") || line === "") continue;
        
        if (constSection) {
            parseConstantDeclaration(line);
        } else if (varSection) {
            parseVariableDeclaration(line);
        } else if (mainSection) {
            algoritlmeLines.push(line);
        }
    }
    
    // التحقق من توازن بنية التحكم
    checkControlStructures(algoritlmeLines);
}

// دالة لتحليل تعريفات الثوابت
function parseConstantDeclaration(line) {
    if (!line || line.trim() === "") return;
    
    // نمط لتحليل تعريف الثابت: اسم_الثابت = قيمة
    const constMatch = line.match(/^\s*([a-zA-Z][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
    if (constMatch) {
        const constName = constMatch[1];
        const constValue = evaluateExpression(constMatch[2]);
        constants[constName] = constValue;
    } else {
        throw new Error("خطأ في تعريف الثابت: " + line);
    }
}

// دالة لتحليل تعريفات المتغيرات
function parseVariableDeclaration(line) {
    if (!line || line.trim() === "") return;
    
    // التحقق من وجود الفاصلة النقطية
    if (line.includes(":")) {
        const parts = line.split(":");
        const varNames = parts[0].split(",").map(v => v.trim());
        const varType = parts[1].trim();
        
        // تسجيل كل متغير مع نوعه
        for (const varName of varNames) {
            if (varName) {
                variables[varName] = {
                    type: varType,
                    value: null
                };
            }
        }
    } else {
        // هذا ليس تعريف متغير صحيح
        if (line.length > 0 && !line.startsWith("//")) {
            throw new Error("خطأ في تعريف المتغير: " + line);
        }
    }
}

// دالة للتحقق من توازن بنية التحكم
function checkControlStructures(lines) {
    let siCount = 0;
    let finSiCount = 0;
    let pourCount = 0;
    let finPourCount = 0;
    let tantQueCount = 0;
    let finTantQueCount = 0;
    
    for (const line of lines) {
        if (line.startsWith("Si ")) siCount++;
        if (line.startsWith("FinSi")) finSiCount++;
        if (line.startsWith("Pour ")) pourCount++;
        if (line.startsWith("FinPour")) finPourCount++;
        if (line.startsWith("Tant Que ")) tantQueCount++;
        if (line.startsWith("FinTantQue")) finTantQueCount++;
    }
    
    if (siCount !== finSiCount) {
        throw new Error(`عدم توازن في بنية Si/FinSi. عدد فتح: ${siCount}, عدد إغلاق: ${finSiCount}`);
    }
    
    if (pourCount !== finPourCount) {
        throw new Error(`عدم توازن في بنية Pour/FinPour. عدد فتح: ${pourCount}, عدد إغلاق: ${finPourCount}`);
    }
    
    if (tantQueCount !== finTantQueCount) {
        throw new Error(`عدم توازن في بنية Tant Que/FinTantQue. عدد فتح: ${tantQueCount}, عدد إغلاق: ${finTantQueCount}`);
    }
}

// دالة لتنفيذ الخوارزمية
function executeAlgorithm() {
    const code = document.getElementById("code-editor").value;
    const output = document.getElementById("output");
    output.innerHTML = "";
    
    try {
        // تحليل الخوارزمية أولاً
        parseAlgorithm(code);
        
        // إعادة تعيين حالة التنفيذ
        currentLineIndex = 0;
        inputQueue = [];
        waitingForInput = false;
        
        // إظهار زر الإدخال وحقل الإدخال
        document.getElementById("input-container").style.display = "flex";
        
        appendOutput("بدء تنفيذ الخوارزمية...", "info");
        executeNextLine();
    } catch (error) {
        appendOutput("خطأ: " + error.message, "error");
    }
}

// دالة لتنفيذ السطر التالي من الخوارزمية
function executeNextLine() {
    if (currentLineIndex >= algoritlmeLines.length) {
        appendOutput("انتهى تنفيذ الخوارزمية بنجاح.", "success");
        document.getElementById("input-container").style.display = "none";
        return;
    }
    
    if (waitingForInput) {
        return; // في انتظار إدخال المستخدم
    }
    
    const line = algoritlmeLines[currentLineIndex];
    try {
        executeLine(line);
        currentLineIndex++;
        
        // تنفيذ السطر التالي بشكل تلقائي إذا لم نكن في انتظار إدخال
        if (!waitingForInput) {
            setTimeout(executeNextLine, 100);
        }
    } catch (error) {
        appendOutput(`خطأ في السطر ${currentLineIndex + 1}: ${error.message}`, "error");
        document.getElementById("input-container").style.display = "none";
    }
}

// دالة لتنفيذ سطر واحد من الخوارزمية
function executeLine(line) {
    if (!line || line.trim() === "" || line.startsWith("//")) {
        return; // تجاهل السطر الفارغ أو التعليق
    }
    
    // تحليل وتنفيذ الأوامر المختلفة
    if (line.startsWith("Ecrire(")) {
        executeEcrire(line);
    } else if (line.startsWith("Lire(")) {
        executeLire(line);
    } else if (line.match(/^[a-zA-Z][a-zA-Z0-9_]*\s*←/)) {
        executeAssignment(line);
    } else if (line.startsWith("Si ")) {
        executeIfStatement(line);
    } else if (line.startsWith("Pour ")) {
        executeForLoop(line);
    } else if (line.startsWith("Tant Que ")) {
        executeWhileLoop(line);
    } else if (line === "Sinon" || line === "FinSi" || line === "
